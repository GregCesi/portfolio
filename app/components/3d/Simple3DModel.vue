<template>
  <div 
    ref="containerRef"
    :style="{ height: props.height, width: props.width }"
  >
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { use3DScene } from '~/composables/3d/use3DScene'
import { useModelLoader } from '~/composables/3d/useModelLoader'
import { useAnimationLoop } from '~/composables/3d/useAnimationLoop'
import { useInteractiveControls } from '~/composables/3d/useInteractiveControls'

interface Props {
  pathModel?: string
  height?: string
  width?: string
}

const props = withDefaults(defineProps<Props>(), {
  pathModel: '/3d/models/Planet-1.glb',
  height: '400px',
  width: '400px'
})

const containerRef = ref<HTMLElement>()

onMounted(async () => {
  if (!containerRef.value) return

  // 1. Utiliser les composables
  const { scene, initScene, render, resize, cleanup } = use3DScene(containerRef)
  const animationLoop = useAnimationLoop()
  const { isDragging, setupControls, removeControls } = useInteractiveControls(containerRef)

  // 2. Enregistrer le cleanup AVANT le await (important pour Vue 3)
  onBeforeUnmount(() => {
    animationLoop.clear()
    removeControls()
    cleanup()
  })

  // 3. Initialiser la scène Three.js
  initScene()

  // 4. Définir les dimensions
  const width = parseInt(props.width.replace('px', ''))
  const height = parseInt(props.height.replace('px', ''))
  resize(width, height)

  // 5. Utiliser le composable de chargement de modèle
  const { loadModel } = useModelLoader(scene)

  // 6. Charger le modèle de planète
  const model = await loadModel(props.pathModel)

  // 7. Configurer les animations et contrôles si le modèle s'est chargé
  if (model) {
    // Activer les contrôles interactifs sur la planète
    setupControls(model)
    
    // Animation de rotation de la planète (seulement si pas de drag)
    animationLoop.subscribe('planetRotation', () => {
      if (!isDragging.value) {
        // Rotation autour de l'axe Y global (toujours même sens visuel)
        model.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), 0.002)
      }
    })

    // Animation de rendu (nécessaire pour voir les changements)
    animationLoop.subscribe('render', () => {
      render()
    })
  }
})
</script>