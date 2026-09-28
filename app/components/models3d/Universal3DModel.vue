<template>
  <div 
    ref="containerRef"
    :style="{ height: props.height, width: props.width }"
  />
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
  /** Rendu suspendu tant que ce n'est pas true : aucune image dessinée, aucun appel WebGL. */
  active?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: '400px',
  height: '400px',
  cameraPosition: 2,
  autoRotate: true,
  interactive: true,
  rotationSpeed: 0.002,
  active: true
})

const containerRef = ref<HTMLElement>()

function parsePixels(value: string): number {
  return parseInt(value.replace('px', ''), 10)
}

// Le rendu (et donc tout appel WebGL) reste suspendu quand la diapositive n'est
// pas active ou quand l'onglet est caché, même une fois le modèle chargé.
const isTabHidden = ref(typeof document !== 'undefined' ? document.hidden : false)
function handleVisibilityChange() {
  isTabHidden.value = document.hidden
}

onMounted(async () => {
  if (!containerRef.value) return

  document.addEventListener('visibilitychange', handleVisibilityChange)

  // 1. Initialiser les composables de base (toujours nécessaires)
  const { scene, initScene, render, resize, cleanup } = use3DScene(containerRef)

  // 2. Initialiser conditionnellement les autres composables
  let animationLoop: ReturnType<typeof useAnimationLoop> | null = null
  let interactiveControls: ReturnType<typeof useInteractiveControls> | null = null

  // AnimationLoop nécessaire si autoRotate OU interactive (pour le rendu continu)
  if (props.autoRotate || props.interactive) {
    animationLoop = useAnimationLoop()
  }

  if (props.interactive) {
    interactiveControls = useInteractiveControls(containerRef)
  }

  // 3. Cleanup - nettoyer seulement ce qui a été initialisé
  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
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

  // 6. Dimensions, recalculées si les props width/height changent (mise en page responsive)
  resize(parsePixels(props.width), parsePixels(props.height))

  watch(
    () => [props.width, props.height],
    ([width, height]) => {
      resize(parsePixels(width ?? '400px'), parsePixels(height ?? '400px'))
      if (props.active && !isTabHidden.value) render()
    }
  )

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
        const shouldRotate = !props.interactive || !(interactiveControls?.isDragging.value ?? false)

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

      // subscribe() démarre toujours la boucle : on l'arrête aussitôt si la
      // diapositive n'est pas active ou l'onglet caché, puis on la garde
      // synchronisée avec ces deux signaux.
      const loop = animationLoop
      const shouldRun = () => props.active && !isTabHidden.value
      if (!shouldRun()) loop.stop()
      watch(shouldRun, (run) => {
        if (run) loop.start()
        else loop.stop()
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