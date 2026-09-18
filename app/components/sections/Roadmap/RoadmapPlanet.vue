<template>
  <!-- Racine unique : mesurée pour caler la taille de la planète sur la place
       réellement libre à côté de la frise et du texte (aucun chevauchement). -->
  <div ref="wrapRef" class="rp">
    <Universal3DModel
      v-if="ready"
      model="/3d/models/Planet-1.glb"
      :width="planetSize"
      :height="planetSize"
      :auto-rotate="!prefersReducedMotion"
      @model-loaded="handleModelLoaded"
    />
    <div v-else :style="{ width: planetSize, height: planetSize }" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Universal3DModel from '~/components/models3d/Universal3DModel.vue'
import { useRoadmapState } from '~/composables/useRoadmapState'
import { useCrossfadeTexture } from '~/composables/3d/useCrossfadeTexture'
import { usePrefersReducedMotion } from '~/composables/usePrefersReducedMotion'

const { registerPlanetMaterial } = useRoadmapState()
const { crossfadeToTexture } = useCrossfadeTexture()
const prefersReducedMotion = usePrefersReducedMotion()

// Taille responsive : la planète ne doit chevaucher ni la frise ni le texte,
// de 375 px à 1920 px (§2.2.4 de la spec).
const planetSize = ref('220px')
const wrapRef = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null

function updatePlanetSize() {
  const w = window.innerWidth
  // En dessous de 1024px, la planète est empilée avec le texte (sous-écrans
  // sur mobile) : tailles fixes, calées sur le budget vertical mesuré.
  if (w < 480) planetSize.value = '140px'
  else if (w < 768) planetSize.value = '200px'
  else if (w < 1024) planetSize.value = '240px'
  else {
    // >= 1024px : la planète occupe la place restante de la rangée
    // (frise | texte | planète), plafonnée par la hauteur de la fenêtre.
    const free = wrapRef.value?.clientWidth ?? 0
    const size = Math.min(free, Math.round(window.innerHeight * 0.6), 480)
    planetSize.value = `${Math.max(size, 220)}px`
  }
}

// Chargement différé après le premier rendu (spec §4 Performance) : le GLB
// et les textures (~6,6 Mo au total) ne commencent à être demandés qu'une
// fois que le navigateur a eu l'occasion de peindre la première frame, pour
// ne jamais retarder l'affichage initial de la page.
const ready = ref(false)
let idleHandle: number | null = null

function scheduleModelLoad(callback: () => void) {
  const win = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
    cancelIdleCallback?: (handle: number) => void
  }
  if (typeof win.requestIdleCallback === 'function') {
    idleHandle = win.requestIdleCallback(callback, { timeout: 1500 })
  } else {
    idleHandle = window.setTimeout(callback, 200)
  }
}

onMounted(() => {
  updatePlanetSize()
  window.addEventListener('resize', updatePlanetSize)
  if (wrapRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(updatePlanetSize)
    resizeObserver.observe(wrapRef.value)
  }
  scheduleModelLoad(() => {
    ready.value = true
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePlanetSize)
  resizeObserver?.disconnect()
  if (idleHandle !== null) {
    const win = window as Window & { cancelIdleCallback?: (handle: number) => void }
    if (typeof win.cancelIdleCallback === 'function') {
      win.cancelIdleCallback(idleHandle)
    } else {
      window.clearTimeout(idleHandle)
    }
  }
})

let planetMesh: THREE.Mesh | null = null
let textureMap: Record<string, THREE.Texture | null> = {}
let currentTextureName = 'planet-bake-1'

const handleModelLoaded = async (model: THREE.Object3D) => {
  
  // 1. Trouver le mesh de la planète (premier enfant)
  planetMesh = model.children[0] as THREE.Mesh
  
  if (planetMesh && planetMesh.material) {
    const material = planetMesh.material as THREE.MeshStandardMaterial
    const originalTexture = material.map // Texture GLB originale
    
    // 2. Charger toutes les textures avec les bonnes propriétés
    const textureLoader = new THREE.TextureLoader()
    
    const correctTextureProperties = (texture: THREE.Texture, reference: THREE.Texture | null) => {
      if (reference) {
        texture.wrapS = reference.wrapS
        texture.wrapT = reference.wrapT  
        texture.flipY = reference.flipY
        texture.colorSpace = reference.colorSpace
        texture.premultiplyAlpha = reference.premultiplyAlpha
      }
      texture.needsUpdate = true
      return texture
    }
    
    // Charger toutes les textures (WebP compressé, ~1 Mo au total contre
    // ~15 Mo en PNG source — voir spec §4 Performance). L'étape 6 (Décision)
    // réutilise explicitement 'planet-bake-4' (voir app/data/content.ts) :
    // il n'y a que quatre textures bakées, pas de cas 'planet-bake-5' à gérer.
    textureMap = {
      'planet-bake-1': correctTextureProperties(
        textureLoader.load('/3d/models/textures/planet-1/planet-bake-1.webp'),
        originalTexture
      ),
      'planet-bake-2': correctTextureProperties(
        textureLoader.load('/3d/models/textures/planet-2/planet-bake-2.webp'),
        originalTexture
      ),
      'planet-bake-3': correctTextureProperties(
        textureLoader.load('/3d/models/textures/planet-3/planet-bake-3.webp'),
        originalTexture
      ),
      'planet-bake-4': correctTextureProperties(
        textureLoader.load('/3d/models/textures/planet-4/planet-bake-4.webp'),
        originalTexture
      ),
    }
    
    // 3. Créer la fonction de changement de texture avec crossfade
    // Une demande reçue pendant un fondu (2 s) est retenue : la dernière cible
    // l'emporte, enchaînée dès la fin du fondu en cours, sans jamais ignorer
    // ni désynchroniser le nom de texture courant.
    let targetTextureName = currentTextureName
    let fading = false
    const changePlanetTexture = async (textureName: string) => {
      if (!textureName) return
      targetTextureName = textureName
      if (fading) return
      fading = true
      try {
        while (currentTextureName !== targetTextureName) {
          const nextName = targetTextureName
          const fromTexture = textureMap[currentTextureName]
          const toTexture = textureMap[nextName]
          if (!fromTexture || !toTexture || !planetMesh) break
          await crossfadeToTexture(planetMesh, fromTexture, toTexture, 2.0)
          currentTextureName = nextName
        }
      } catch (error) {
        console.error('Erreur de fondu de texture planète :', error)
      } finally {
        fading = false
      }
    }

    // 4. Enregistrer la fonction dans useRoadmapState
    registerPlanetMaterial(changePlanetTexture)
  }
}

// Plus besoin de cleanup spécifique pour le crossfade
</script>
<style scoped>
.rp {
  display: flex;
  justify-content: center;
}

@media (min-width: 1024px) {
  .rp {
    flex: 1 1 0;
    min-width: 0;
  }
}
</style>
