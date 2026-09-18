<template>
  <Universal3DModel
    model="/3d/models/Planet-1.glb"
    :width="planetSize"
    :height="planetSize"
    :auto-rotate="!prefersReducedMotion"
    @model-loaded="handleModelLoaded"
  />
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Universal3DModel from '~/components/3d/Universal3DModel.vue'
import { useRoadmapState } from '~/composables/useRoadmapState'
import { useCrossfadeTexture } from '~/composables/3d/useCrossfadeTexture'
import { usePrefersReducedMotion } from '~/composables/usePrefersReducedMotion'

const { registerPlanetMaterial } = useRoadmapState()
const { crossfadeToTexture } = useCrossfadeTexture()
const prefersReducedMotion = usePrefersReducedMotion()

// Taille responsive : la planète ne doit chevaucher ni la timeline ni le
// contenu, de 375 px à 1920 px (§2.2.4 de la spec).
const planetSize = ref('220px')

function updatePlanetSize() {
  const w = window.innerWidth
  if (w < 480) planetSize.value = '190px'
  else if (w < 768) planetSize.value = '240px'
  else if (w < 1024) planetSize.value = '300px'
  else if (w < 1440) planetSize.value = '380px'
  else planetSize.value = '460px'
}

onMounted(() => {
  updatePlanetSize()
  window.addEventListener('resize', updatePlanetSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePlanetSize)
})

let planetMesh: THREE.Mesh | null = null
let textureMap: Record<string, THREE.Texture> = {}
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
    
    // Charger toutes les textures
    textureMap = {
      'planet-bake-1': correctTextureProperties(
        textureLoader.load('/3d/models/textures/planet-1/planet-bake-1.png'), 
        originalTexture
      ),
      'planet-bake-2': correctTextureProperties(
        textureLoader.load('/3d/models/textures/planet-2/planet-bake-2.png'), 
        originalTexture
      ),
      'planet-bake-3': correctTextureProperties(
        textureLoader.load('/3d/models/textures/planet-3/planet-bake-3.png'), 
        originalTexture
      ),
      'planet-bake-4': correctTextureProperties(
        textureLoader.load('/3d/models/textures/planet-4/planet-bake-4.png'), 
        originalTexture
      ),
      'planet-bake-5': originalTexture || textureLoader.load('/3d/models/textures/planet-5/planet-bake-5.png')
    }
    
    // 3. Créer la fonction de changement de texture avec crossfade
    const changePlanetTexture = async (textureName: string) => {
      if (textureName === currentTextureName) return
      
      const fromTexture = textureMap[currentTextureName]
      const toTexture = textureMap[textureName]
      
      if (fromTexture && toTexture && planetMesh) {
        try {
          await crossfadeToTexture(planetMesh, fromTexture, toTexture, 2.0)
          currentTextureName = textureName
        } catch (error) {
          console.error('❌ Erreur crossfade:', error)
        }
      }
    }
    
    // 4. Enregistrer la fonction dans useRoadmapState
    registerPlanetMaterial(changePlanetTexture)
  }
}

// Plus besoin de cleanup spécifique pour le crossfade
</script>