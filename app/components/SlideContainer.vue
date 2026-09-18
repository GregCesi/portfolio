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

// La section active reçoit le focus clavier, les autres sont retirées de la
// navigation (tabulation, lecteurs d'écran) via l'attribut `inert`.
function updateInertSlides() {
  slides.value.forEach((slide, index) => {
    if (index === current.value) {
      slide.removeAttribute('inert')
      slide.removeAttribute('aria-hidden')
    } else {
      slide.setAttribute('inert', '')
      slide.setAttribute('aria-hidden', 'true')
    }
  })
}

/** Trouve la zone de défilement interne de la section active (voir BaseSection.vue). */
function getActiveScrollEl(): HTMLElement | null {
  return slides.value[current.value]?.querySelector('.section-scroll-area') ?? null
}

function isScrollable(el: HTMLElement): boolean {
  return el.scrollHeight > el.clientHeight + 1
}

function atTop(el: HTMLElement): boolean {
  return el.scrollTop <= 0
}

function atBottom(el: HTMLElement): boolean {
  return el.scrollTop + el.clientHeight >= el.scrollHeight - 1
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
      updateInertSlides()
      addEventListeners()
    }
  })

  tl.to(slides.value[current.value]!, { autoAlpha: 0, duration: 0.3 })
    .add(() => emit('section-change', index))
    .to(wrapper.value, { y: -index * fixedSlideHeight.value, duration: props.transitionDuration })
    .fromTo(slides.value[index]!, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 })
}

// Gestion du wheel : le contenu interne défile d'abord, la section ne change
// qu'une fois la butée haute ou basse atteinte (§2.3 de la spec).
function onWheel(e: WheelEvent) {
  if (state.isAnimating) {
    e.preventDefault()
    return
  }

  const direction = e.deltaY > 0 ? 1 : -1
  const scrollEl = getActiveScrollEl()

  if (scrollEl && isScrollable(scrollEl)) {
    const blocked = direction > 0 ? atBottom(scrollEl) : atTop(scrollEl)
    if (!blocked) {
      // Laisser le défilement natif de la section se produire.
      state.wheelDelta = 0
      return
    }
  }

  e.preventDefault()
  state.wheelDelta += e.deltaY

  if (Math.abs(state.wheelDelta) >= props.scrollThreshold) {
    goTo(current.value + direction)
  }
}

// Touch handlers, avec la même logique de défilement interne d'abord.
function onTouchStart(e: TouchEvent) {
  const touch = e.touches[0]
  if (!touch) return

  state.touchStartY = touch.clientY
}

function onTouchMove(e: TouchEvent) {
  if (state.isAnimating) {
    e.preventDefault()
    return
  }

  const touch = e.touches[0]
  if (!touch) return

  const delta = state.touchStartY - touch.clientY
  const direction = delta > 0 ? 1 : -1
  const scrollEl = getActiveScrollEl()

  if (scrollEl && isScrollable(scrollEl)) {
    const blocked = direction > 0 ? atBottom(scrollEl) : atTop(scrollEl)
    if (!blocked) {
      // Laisser le défilement tactile natif de la section se produire.
      return
    }
  }

  e.preventDefault()

  if (Math.abs(delta) >= props.scrollThreshold) {
    goTo(current.value + direction)
    state.touchStartY = touch.clientY // Reset pour éviter les répétitions
  }
}

// Clavier : flèches haut/bas, PageUp/PageDown, Home/End changent de section (§2.3).
const NEXT_KEYS = new Set(['ArrowDown', 'PageDown'])
const PREV_KEYS = new Set(['ArrowUp', 'PageUp'])

function onKeydown(e: KeyboardEvent) {
  if (state.isAnimating) return

  if (NEXT_KEYS.has(e.key)) {
    e.preventDefault()
    goTo(current.value + 1)
  } else if (PREV_KEYS.has(e.key)) {
    e.preventDefault()
    goTo(current.value - 1)
  } else if (e.key === 'Home') {
    e.preventDefault()
    goTo(0)
  } else if (e.key === 'End') {
    e.preventDefault()
    goTo(slides.value.length - 1)
  }
}

// Event listeners centralisés
function addEventListeners() {
  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('keydown', onKeydown)
  container.value?.addEventListener('touchstart', onTouchStart, { passive: false })
  container.value?.addEventListener('touchmove', onTouchMove, { passive: false })
}

function removeEventListeners() {
  window.removeEventListener('wheel', onWheel)
  window.removeEventListener('keydown', onKeydown)
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
  updateInertSlides()

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
})
</script>
