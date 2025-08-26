<template>
  <Universal3DModel 
    model="/3d/models/Planet-1.glb" 
    width="800px" 
    height="800px"
    @modelLoaded="handleModelLoaded"
  />    
</template>

<script setup lang="ts">
import * as THREE from 'three'
import Universal3DModel from '~/components/3d/Universal3DModel.vue'
import { useRoadmapState } from '~/composables/useRoadmapState'
import { useCrossfadeTexture } from '~/composables/3d/useCrossfadeTexture'

const { registerPlanetMaterial } = useRoadmapState()
const { crossfadeToTexture } = useCrossfadeTexture()

let planetMesh: THREE.Mesh | null = null
let textureMap: Record<string, THREE.Texture> = {}
let currentTextureName = 'planet-bake-1'

const handleModelLoaded = async (model: THREE.Object3D) => {
  console.log('🪐 Modèle planète chargé:', model)
  
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
        console.log(`🎨 Crossfade de ${currentTextureName} vers ${textureName}`)
        
        try {
          await crossfadeToTexture(planetMesh, fromTexture, toTexture, 2.0)
          currentTextureName = textureName
          console.log('✨ Crossfade terminé')
        } catch (error) {
          console.error('❌ Erreur crossfade:', error)
        }
      } else {
        console.warn('❌ Textures ou mesh non trouvé pour crossfade')
      }
    }
    
    // 4. Enregistrer la fonction dans useRoadmapState
    registerPlanetMaterial(changePlanetTexture)
    
    console.log('✅ Système de texture planète initialisé')
  }
}

// Plus besoin de cleanup spécifique pour le crossfade
</script>