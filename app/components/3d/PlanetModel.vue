<template>
  <div 
    ref="planetContainer"
    class="planet-container"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove" 
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
  >
    <primitive :object="planet1Scene" v-if="planet1Scene" />
  </div>
</template>

<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos'
import { Mesh, MeshStandardMaterial } from 'three'
import { useRoadmapState } from '~/composables/useRoadmapState'

// Variables pour la gestion du drag
const planetContainer = ref<HTMLElement>()
let isDragging = ref(false)
let previousMousePosition = { x: 0, y: 0 }

// Charger Planet-5.glb
const { scene: rawScene } = await useGLTF('3d/models/Planet-1.glb')
const planet1Scene = markRaw(rawScene) // Empêcher Vue de rendre réactif l'objet 3D

// Accéder au mesh de la planète
const planet1Mesh = planet1Scene.children[0] as Mesh

if (planet1Mesh && planet1Mesh.material) {
  const material = planet1Mesh.material as MeshStandardMaterial
  const planetBake5Texture = material.map  // Texture de référence du GLB
  
  // Créer le TextureLoader
  const { TextureLoader } = await import('three')
  const textureLoader = new TextureLoader()
  
  // Fonction pour corriger une texture PNG selon la texture GLB de référence
  const correctTextureProperties = (pngTexture: any, referenceTexture: any) => {
    pngTexture.wrapS = referenceTexture?.wrapS || 1000
    pngTexture.wrapT = referenceTexture?.wrapT || 1000  
    pngTexture.flipY = referenceTexture?.flipY || false
    pngTexture.colorSpace = referenceTexture?.colorSpace
    pngTexture.premultiplyAlpha = referenceTexture?.premultiplyAlpha
    pngTexture.needsUpdate = true
    return pngTexture
  }
  
  // Charger toutes les textures avec les bonnes propriétés
  const planetBake1PNG = correctTextureProperties(
    textureLoader.load('/3d/models/textures/planet-1/planet-bake-1.png'), 
    planetBake5Texture
  )
  const planetBake2PNG = correctTextureProperties(
    textureLoader.load('/3d/models/textures/planet-2/planet-bake-2.png'), 
    planetBake5Texture
  )
  const planetBake3PNG = correctTextureProperties(
    textureLoader.load('/3d/models/textures/planet-3/planet-bake-3.png'), 
    planetBake5Texture
  )
  const planetBake4PNG = correctTextureProperties(
    textureLoader.load('/3d/models/textures/planet-4/planet-bake-4.png'), 
    planetBake5Texture
  )
  
  // Créer le mapping des textures par nom
  const textureMap = {
    'planet-bake-1': planetBake1PNG,
    'planet-bake-2': planetBake2PNG, 
    'planet-bake-3': planetBake3PNG,
    'planet-bake-4': planetBake4PNG,
    'planet-bake-5': planetBake5Texture // Texture GLB originale
  }
  
  // Connecter avec useRoadmapState
  const { registerPlanetMaterial } = useRoadmapState()
  
  // Fonction de changement de texture
  const changePlanetTexture = (textureName: string) => {
    const texture = textureMap[textureName as keyof typeof textureMap]
    if (texture && material) {
      material.map = texture
      material.needsUpdate = true
    }
  }
  
  // Enregistrer la fonction dans useRoadmapState
  registerPlanetMaterial(changePlanetTexture)
}

// Gestion des événements souris
const onMouseDown = (event: MouseEvent) => {
  isDragging.value = true
  previousMousePosition = {
    x: event.clientX,
    y: event.clientY
  }
}

const onMouseMove = (event: MouseEvent) => {
  if (!isDragging.value || !planet1Scene) return
  
  const deltaMove = {
    x: event.clientX - previousMousePosition.x,
    y: event.clientY - previousMousePosition.y
  }
  
  // Ajuster la rotation de la planète en fonction du mouvement de la souris
  planet1Scene.rotation.y += deltaMove.x * 0.01
  planet1Scene.rotation.x += deltaMove.y * 0.01
  
  previousMousePosition = {
    x: event.clientX,
    y: event.clientY
  }
}

const onMouseUp = () => {
  isDragging.value = false
}

// Rotation automatique de la planète (s'arrête pendant le drag)
useRenderLoop().onLoop(({ delta }) => {
  if (planet1Scene && !isDragging.value) {
    planet1Scene.rotation.y += delta * 0.2 // Vitesse de rotation (ajustable)
  }
})
</script>