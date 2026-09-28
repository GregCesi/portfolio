<template>
  <!-- Racine unique : mesurée pour caler la taille de la planète sur la place
       réellement libre à côté de la frise et du texte (aucun chevauchement). -->
  <div ref="wrapRef" class="rp">
    <Universal3DModel
      model="/3d/models/Planet-1.glb"
      :width="planetSize"
      :height="planetSize"
      :auto-rotate="!prefersReducedMotion"
      :active="isMethodActive"
      @model-loaded="handleModelLoaded"
    />
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useNuxtApp } from '#app'
import Universal3DModel from '~/components/models3d/Universal3DModel.vue'
import { useMethodState } from '~/composables/useMethodState'
import { useCrossfadeTexture } from '~/composables/3d/useCrossfadeTexture'
import { useScanSatellite } from '~/composables/3d/useScanSatellite'
import { usePrefersReducedMotion } from '~/composables/usePrefersReducedMotion'
import { useSiteLoad } from '~/composables/useSiteLoad'
import { SECTION_INDEX } from '~/data/content'

const { registerPlanetMaterial, activeStep } = useMethodState()
const { markLoaded } = useSiteLoad()
const { crossfadeToTexture } = useCrossfadeTexture()
const prefersReducedMotion = usePrefersReducedMotion()
const { $emitter } = useNuxtApp()

// La planète ne tourne et ne se redessine que sur Méthode : ailleurs le canvas
// est invisible (autoAlpha) mais son rendu WebGL, lui, ne s'arrêtait jamais
// (voir EXE-48). `section-enter` (émis par pages/index.vue) porte l'index
// 0-based de la diapositive qui arrive.
const isMethodActive = ref(false)
function onSectionEnter(index: number) {
  isMethodActive.value = index === SECTION_INDEX.method
}

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
    // >= 1024px : la planète est un décor de fond, sa taille suit la hauteur
    // de la fenêtre (seuil du critère 2 : au moins 540 px, 60 % de 900).
    const size = Math.round(window.innerHeight * 0.72)
    planetSize.value = `${Math.min(Math.max(size, 540), 820)}px`
  }
}

onMounted(() => {
  updatePlanetSize()
  window.addEventListener('resize', updatePlanetSize)
  if (wrapRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(updatePlanetSize)
    resizeObserver.observe(wrapRef.value)
  }
  $emitter.on('section-enter', onSectionEnter)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePlanetSize)
  resizeObserver?.disconnect()
  scanSatellite?.dispose()
  $emitter.off('section-enter', onSectionEnter)
})

// Le satellite et son cercle n'existent qu'aux étapes qui le demandent
// (`scansPlanet` dans app/data/content.ts).
let scanSatellite: ReturnType<typeof useScanSatellite> | null = null

watch(
  () => activeStep.value?.scansPlanet === true,
  (scanning) => scanSatellite?.setActive(scanning),
)

let planetMesh: THREE.Mesh | null = null
let textureMap: Record<string, THREE.Texture | null> = {}
let currentTextureName = 'planet-bake-1'

const handleModelLoaded = async (model: THREE.Object3D) => {
  markLoaded('planet-model')

  if (model.parent instanceof THREE.Scene) {
    scanSatellite = useScanSatellite(model.parent, prefersReducedMotion)
    scanSatellite.setActive(activeStep.value?.scansPlanet === true)
  }

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
    // ~15 Mo en PNG source — voir spec §4 Performance). Les étapes 2 et 6
    // (Observer, Surveiller) réutilisent la texture de la précédente (voir
    // app/data/content.ts) : il n'y a que quatre textures bakées.
    // Le sas d'entrée attend qu'elles soient toutes là (voir useSiteLoad) : une
    // texture qui échoue reste `null`, le voyant correspondant ne s'allume pas.
    const loadTexture = (path: string) =>
      textureLoader
        .loadAsync(path)
        .then((texture) => correctTextureProperties(texture, originalTexture))
        .catch((error) => {
          console.error('Erreur chargement texture planète :', error)
          return null
        })
    const [bake1, bake2, bake3, bake4] = await Promise.all([
      loadTexture('/3d/models/textures/planet-1/planet-bake-1.webp'),
      loadTexture('/3d/models/textures/planet-2/planet-bake-2.webp'),
      loadTexture('/3d/models/textures/planet-3/planet-bake-3.webp'),
      loadTexture('/3d/models/textures/planet-4/planet-bake-4.webp'),
    ])
    textureMap = {
      'planet-bake-1': bake1,
      'planet-bake-2': bake2,
      'planet-bake-3': bake3,
      'planet-bake-4': bake4,
    }
    if (Object.values(textureMap).every(Boolean)) markLoaded('planet-textures')
    
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

    // 4. Enregistrer la fonction dans useMethodState
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
</style>
