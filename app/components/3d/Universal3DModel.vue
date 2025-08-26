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

const emit = defineEmits<{
  modelLoaded: [model: THREE.Object3D]
}>()

interface Props {
  model: string
  width?: string
  height?: string
  cameraPosition?: number
  autoRotate?: boolean
  interactive?: boolean
  rotationSpeed?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: '400px',
  height: '400px',
  cameraPosition: 2,
  autoRotate: true,
  interactive: true,
  rotationSpeed: 0.002
})

const containerRef = ref<HTMLElement>()

onMounted(async () => {
  if (!containerRef.value) return

  // 1. Initialiser les composables de base (toujours nécessaires)
  const { scene, initScene, render, resize, cleanup } = use3DScene(containerRef)
  
  // 2. Initialiser conditionnellement les autres composables
  let animationLoop: any = null
  let interactiveControls: any = null
  let isDragging = ref(false)

  // AnimationLoop nécessaire si autoRotate OU interactive (pour le rendu continu)
  if (props.autoRotate || props.interactive) {
    animationLoop = useAnimationLoop()
  }

  if (props.interactive) {
    interactiveControls = useInteractiveControls(containerRef)
    isDragging = interactiveControls.isDragging
  }

  // 3. Cleanup - nettoyer seulement ce qui a été initialisé
  onBeforeUnmount(() => {
    if (animationLoop) {
      animationLoop.clear()
    }
    if (interactiveControls) {
      interactiveControls.removeControls()
    }
    cleanup()
  })

  // 4. Setup de base
  initScene()
  
  // 5. Appliquer la position caméra custom
  if (scene.value && typeof props.cameraPosition === 'number') {
    // TODO: Accéder à la caméra depuis use3DScene
    // camera.value.position.z = props.cameraPosition
  }

  // 6. Dimensions
  const width = parseInt(props.width.replace('px', ''))
  const height = parseInt(props.height.replace('px', ''))
  resize(width, height)

  // 7. Charger le modèle
  const { loadModel } = useModelLoader(scene)
  const model = await loadModel(props.model)

  // 8. Configurer les fonctionnalités selon les props
  if (model) {
    // Contrôles interactifs (si activé)
    if (props.interactive && interactiveControls) {
      interactiveControls.setupControls(model)
    }
    
    // Auto-rotation (si activé)
    if (props.autoRotate && animationLoop) {
      animationLoop.subscribe('planetRotation', () => {
        // Ne tourner que si pas de drag OU si pas d'interactivité
        const shouldRotate = !props.interactive || !isDragging.value
        
        if (shouldRotate) {
          model.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), props.rotationSpeed)
        }
      })
    }

    // Animation de rendu (toujours nécessaire)
    if (animationLoop) {
      animationLoop.subscribe('render', () => {
        render()
      })
    } else {
      // Si pas d'animation loop, faire au moins un rendu initial
      render()
    }

    // ➕ NOUVEAU : Émettre l'événement modelLoaded
    emit('modelLoaded', model)
  }
})
</script>