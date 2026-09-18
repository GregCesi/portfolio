<template>
  <div ref="container" class="overflow-hidden">
    <div ref="wrapper">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import gsap from 'gsap'

// Props
interface Props {
  scrollThreshold?: number
  transitionDuration?: number
}
const props = withDefaults(defineProps<Props>(), {
  scrollThreshold: 50,
  transitionDuration: 0.8
})

/* Refs */
const container = ref<HTMLElement | null>(null)
const wrapper = ref<HTMLElement | null>(null)
const slides = ref<HTMLElement[]>([])
const current = ref(0)
const fixedSlideHeight = ref(0)

// État centralisé
const state = {
  isAnimating: false,
  wheelDelta: 0,
  touchStartY: 0
}

/* Emits */
const emit = defineEmits<{
  'section-change': [index: number]
}>()

// Validation des limites
const isValidIndex = (index: number): boolean => {
  return index >= 0 && index < slides.value.length
}

function goTo(index: number) {
  // Guards groupés
  if (!wrapper.value || state.isAnimating || index === current.value) return
  if (!isValidIndex(index)) return

  state.isAnimating = true
  removeEventListeners()

  const tl = gsap.timeline({
    onComplete: () => {
      current.value = index
      state.isAnimating = false
      state.wheelDelta = 0
      addEventListeners()
    }
  })

  tl.to(slides.value[current.value]!, { autoAlpha: 0, duration: 0.3 })
    .add(() => emit('section-change', index))
    .to(wrapper.value, { y: -index * fixedSlideHeight.value, duration: props.transitionDuration })
    .fromTo(slides.value[index]!, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 })
}

// Gestion du wheel avec debouncing amélioré
function onWheel(e: WheelEvent) {
  e.preventDefault()
  
  if (state.isAnimating) return
  
  state.wheelDelta += e.deltaY

  if (Math.abs(state.wheelDelta) >= props.scrollThreshold) {
    const direction = state.wheelDelta > 0 ? 1 : -1
    goTo(current.value + direction)
  }
}

// Touch handlers améliorés
function onTouchStart(e: TouchEvent) {
  const touch = e.touches[0]
  if (!touch) return
  
  state.touchStartY = touch.clientY
}

function onTouchMove(e: TouchEvent) {
  if (state.isAnimating) return
  
  e.preventDefault()
  const touch = e.touches[0]
  if (!touch) return

  const delta = state.touchStartY - touch.clientY

  if (Math.abs(delta) >= props.scrollThreshold) {
    const direction = delta > 0 ? 1 : -1
    goTo(current.value + direction)
    state.touchStartY = touch.clientY // Reset pour éviter les répétitions
  }
}

// Event listeners centralisés
function addEventListeners() {
  window.addEventListener('wheel', onWheel, { passive: false })
  container.value?.addEventListener('touchstart', onTouchStart, { passive: false })
  container.value?.addEventListener('touchmove', onTouchMove, { passive: false })
}

function removeEventListeners() {
  window.removeEventListener('wheel', onWheel)
  container.value?.removeEventListener('touchstart', onTouchStart)
  container.value?.removeEventListener('touchmove', onTouchMove)
}

// Fonction pour fixer les hauteurs au chargement initial
function initializeFixedHeights() {
  if (!container.value) return
  
  fixedSlideHeight.value = window.innerHeight
  container.value.style.height = fixedSlideHeight.value + 'px'
}

// Fonction pour mettre à jour seulement la slide active
function resizeActiveSlide() {
  if (!container.value) return
  
  const newHeight = window.innerHeight
  
  // Mettre à jour le container à la nouvelle hauteur
  container.value.style.height = newHeight + 'px'
  
  // Recalculer la position du wrapper pour la slide active
  if (wrapper.value) {
    fixedSlideHeight.value = newHeight
    gsap.set(wrapper.value, { y: -current.value * newHeight })
  }
}

/* Lifecycle */
onMounted(async () => {
  if (!wrapper.value) return

  // Attendre le rendu des slots
  await nextTick()
  
  slides.value = Array.from(wrapper.value.children) as HTMLElement[]
  
  if (slides.value.length === 0) {
    console.warn('ScrollSection: No slides found')
    return
  }

  // Initialiser les hauteurs fixes
  initializeFixedHeights()

  // Configuration GSAP initiale
  gsap.set(slides.value, { autoAlpha: 0 })
  gsap.set(slides.value[0]!, { autoAlpha: 1 })

  // Ajouter le listener de resize
  window.addEventListener('resize', resizeActiveSlide)

  addEventListeners()
})

onBeforeUnmount(() => {
  removeEventListeners()
  window.removeEventListener('resize', resizeActiveSlide)
  // Cleanup GSAP si nécessaire
  gsap.killTweensOf([wrapper.value, ...slides.value])
})

/* Getters utiles */
const totalSlides = computed(() => slides.value.length)
const canGoNext = computed(() => current.value < totalSlides.value - 1)
const canGoPrevious = computed(() => current.value > 0)

/* API publique */
defineExpose({ 
  goTo,
  current: readonly(current),
  totalSlides,
  canGoNext,
  canGoPrevious
});
</script>