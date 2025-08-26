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

const { registerPlanetMaterial } = useRoadmapState()

let planetMesh: THREE.Mesh | null = null
let textureMap: Record<string, THREE.Texture> = {}

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
    
    // 3. Créer la fonction de changement de texture
    const changePlanetTexture = (textureName: string) => {
      const texture = textureMap[textureName]
      if (texture && material) {
        material.map = texture
        material.needsUpdate = true
        console.log('🎨 Texture changée vers:', textureName)
      } else {
        console.warn('❌ Texture non trouvée:', textureName)
      }
    }
    
    // 4. Enregistrer la fonction dans useRoadmapState
    registerPlanetMaterial(changePlanetTexture)
    
    console.log('✅ Système de texture planète initialisé')
  }
}
</script>