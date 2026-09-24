import * as THREE from 'three'
import { gsap } from 'gsap'
import { shallowRef, type Ref } from 'vue'
import { useModelLoader } from '~/composables/3d/useModelLoader'
import { SATELLITE_MODEL } from '~/composables/useSiteLoad'

// La caméra de `use3DScene` est à z = 2 (champ de 75°) et la planète a un rayon
// de 1 : à 1,18 avec une inclinaison de 15° et un satellite de 0,24 de large,
// l'orbite entière reste dans le canevas carré, sans toucher la planète.
const ORBIT_RADIUS = 1.18
const ORBIT_TILT = THREE.MathUtils.degToRad(15)
const ORBIT_PERIOD_SECONDS = 9
const ORBIT_START_ANGLE = 0.6
const SATELLITE_SIZE = 0.24
const FADE_SECONDS = 1

// Le cercle est une calotte de sphère collée à la planète, de 0,32 rad de rayon.
const SCAN_RADIUS = 1.004
const SCAN_ANGLE = 0.32
const SCAN_COLOR = '169, 203, 221' // --color-accent

const UP = new THREE.Vector3(0, 1, 0)

// Dégradé du centre (haut de l'image) vers le bord (bas) : un voile léger, un
// anneau net près du bord, puis rien.
function createScanTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 2
  canvas.height = 256
  const context = canvas.getContext('2d')
  if (context) {
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, `rgba(${SCAN_COLOR}, 0.12)`)
    gradient.addColorStop(0.7, `rgba(${SCAN_COLOR}, 0.2)`)
    gradient.addColorStop(0.9, `rgba(${SCAN_COLOR}, 0.95)`)
    gradient.addColorStop(1, `rgba(${SCAN_COLOR}, 0)`)
    context.fillStyle = gradient
    context.fillRect(0, 0, canvas.width, canvas.height)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/**
 * Un satellite tourne autour de la planète et la balaie d'un cercle lumineux,
 * posé sur la surface du côté où il se trouve. Ni l'un ni l'autre ne bouge la
 * planète, et aucune lumière n'est ajoutée à la scène : le cercle est un aplat
 * additif, pas un éclairage.
 *
 * `setActive` les fait apparaître ou s'effacer en fondu. Sans mouvement (`reduced`),
 * le satellite reste posé sur son orbite et les changements sont immédiats.
 */
export function useScanSatellite(scene: THREE.Scene, reduced: Ref<boolean>) {
  const state = { presence: 0 }
  const materials: THREE.Material[] = []
  const holder = new THREE.Group()
  const orbitPosition = new THREE.Vector3()
  const scanDirection = new THREE.Vector3()

  const scanTexture = createScanTexture()
  const scanGeometry = new THREE.SphereGeometry(SCAN_RADIUS, 64, 8, 0, Math.PI * 2, 0, SCAN_ANGLE)
  const scanMaterial = new THREE.MeshBasicMaterial({
    map: scanTexture,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  })
  const scan = new THREE.Mesh(scanGeometry, scanMaterial)
  // Après la planète, même pendant le fondu de ses textures.
  scan.renderOrder = 1

  holder.visible = false
  scan.visible = false
  scene.add(holder, scan)

  let angle = ORBIT_START_ANGLE
  let wanted = false
  let loaded = false
  let disposed = false
  let tween: gsap.core.Tween | null = null

  const place = () => {
    orbitPosition.set(
      ORBIT_RADIUS * Math.cos(angle),
      ORBIT_RADIUS * Math.sin(angle) * Math.cos(ORBIT_TILT),
      ORBIT_RADIUS * Math.sin(angle) * Math.sin(ORBIT_TILT),
    )
    holder.position.copy(orbitPosition)
    // Le satellite garde le même côté tourné vers la planète.
    holder.lookAt(0, 0, 0)
    scanDirection.copy(orbitPosition).normalize()
    scan.quaternion.setFromUnitVectors(UP, scanDirection)
  }

  const apply = () => {
    const visible = loaded && state.presence > 0.001
    holder.visible = visible
    scan.visible = visible
    for (const material of materials) {
      material.opacity = state.presence
      // Un matériau opaque évite le tri des surfaces du satellite hors fondu.
      material.transparent = state.presence < 1
    }
    scanMaterial.opacity = state.presence
  }

  const tick = (_time: number, deltaMs: number) => {
    if (!holder.visible) return
    if (!reduced.value) angle += (deltaMs / 1000) * ((Math.PI * 2) / ORBIT_PERIOD_SECONDS)
    place()
  }

  const setActive = (active: boolean) => {
    wanted = active
    if (!loaded) return
    tween?.kill()
    const target = active ? 1 : 0
    if (reduced.value) {
      state.presence = target
      apply()
      return
    }
    tween = gsap.to(state, {
      presence: target,
      duration: FADE_SECONDS,
      ease: 'power1.inOut',
      onUpdate: apply,
    })
  }

  const load = async () => {
    const { loadModel, removeModel } = useModelLoader(shallowRef(scene))
    const model = await loadModel(SATELLITE_MODEL)
    if (!model) return
    if (disposed) {
      removeModel(model)
      return
    }

    // Le modèle est pris à son échelle d'origine : on le centre et on le ramène
    // à la taille voulue avant de l'accrocher à son point d'orbite.
    const box = new THREE.Box3().setFromObject(model)
    const center = box.getCenter(new THREE.Vector3())
    const scale = SATELLITE_SIZE / Math.max(...box.getSize(new THREE.Vector3()).toArray())
    model.scale.setScalar(scale)
    model.position.copy(center).multiplyScalar(-scale)
    holder.add(model)

    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
      for (const material of Array.isArray(child.material) ? child.material : [child.material]) {
        // Le modèle est transmissif : sur fond transparent il n'a rien à
        // traverser et disparaît. On le rend opaque.
        if (material instanceof THREE.MeshPhysicalMaterial) material.transmission = 0
        materials.push(material)
      }
    })

    loaded = true
    place()
    gsap.ticker.add(tick)
    // Demandé avant la fin du chargement : le fondu part maintenant.
    setActive(wanted)
  }

  void load()

  const dispose = () => {
    disposed = true
    tween?.kill()
    gsap.ticker.remove(tick)
    scene.remove(holder, scan)
    holder.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return
      child.geometry.dispose()
    })
    for (const material of materials) material.dispose()
    scanGeometry.dispose()
    scanMaterial.dispose()
    scanTexture.dispose()
  }

  return { setActive, dispose }
}
