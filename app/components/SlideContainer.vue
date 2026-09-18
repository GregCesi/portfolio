<template>
  <div ref="container" class="overflow-hidden relative">
    <div ref="wrapper">
      <slot />
    </div>
    <!--
      Accusé de réception d'un appui clavier reçu pendant une transition
      (§Craft, feedback run 2 itération 1) : sans ce signal, un appui rapide
      pendant les ~0,65s de transition GSAP était silencieusement absorbé
      par la file d'attente d'une seule entrée ci-dessous, sans qu'aucun
      retour ne le montre à l'écran.
    -->
    <p v-if="isQueued" class="queued-hint" aria-hidden="true">···</p>
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

// File d'attente d'une seule entrée clavier (§Craft) : si une touche de
// navigation est pressée pendant la transition GSAP en cours, on ne la perd
// pas silencieusement — on retient la dernière intention et on l'exécute dès
// que la transition en cours se termine. `isQueued` pilote le petit accusé
// de réception visuel affiché pendant ce court délai.
const isQueued = ref(false)
let pendingAction: (() => void) | null = null

function requestNavigate(action: () => void) {
  if (state.isAnimating) {
    pendingAction = action
    isQueued.value = true
    return
  }
  action()
}

function runPendingAction() {
  if (!pendingAction) return
  const action = pendingAction
  pendingAction = null
  isQueued.value = false
  action()
}

/* Emits */
const emit = defineEmits<{
  'section-change': [index: number]
  /** Émis une fois la transition GSAP totalement terminée (layout stable). */
  'section-settled': [index: number]
  /** Flèches gauche/droite (§2.3) : change de sous-écran dans la section active. */
  'subscreen-next': []
  'subscreen-prev': []
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

function goTo(index: number) {
  // Guards groupés
  if (!wrapper.value || state.isAnimating || index === current.value) return
  if (!isValidIndex(index)) return

  state.isAnimating = true

  // Les écouteurs (molette, tactile, clavier) restent attachés pendant toute
  // la transition : chaque gestionnaire porte déjà son propre garde-fou
  // (`state.isAnimating`), et le clavier a en plus besoin de rester à
  // l'écoute pour mettre en file d'attente un appui reçu pendant l'anim
  // plutôt que de le perdre (voir `requestNavigate`).
  const tl = gsap.timeline({
    onComplete: () => {
      current.value = index
      state.isAnimating = false
      state.wheelDelta = 0
      updateInertSlides()
      emit('section-settled', index)
      runPendingAction()
    }
  })

  // Fondu de sortie et fondu d'entrée superposés au déplacement du wrapper
  // (plutôt qu'enchaînés en série) : la durée totale perçue passe de
  // ~1,4s à ~`transitionDuration` (0,8s en temps normal), sans raccourcir le
  // déplacement lui-même. Gain notable sur mobile où ce délai s'ajoutait à
  // celui du défilement interne vers une ancre (ex. bouton « Me contacter »).
  const fadeDuration = 0.5
  const fadeInStart = Math.max(props.transitionDuration - fadeDuration, 0)

  tl.to(slides.value[current.value]!, { autoAlpha: 0, duration: fadeDuration }, 0)
    .add(() => emit('section-change', index), 0)
    .to(wrapper.value, { y: -index * fixedSlideHeight.value, duration: props.transitionDuration, ease: 'power2.inOut' }, 0)
    .fromTo(slides.value[index]!, { autoAlpha: 0 }, { autoAlpha: 1, duration: fadeDuration }, fadeInStart)
}

// Gestion du wheel : chaque section tient entièrement dans l'écran, sans
// défilement interne (§2.3 de la spec) — la molette ne fait donc que changer
// de section, dès le premier seuil franchi.
function onWheel(e: WheelEvent) {
  e.preventDefault()
  if (state.isAnimating) return

  state.wheelDelta += e.deltaY

  if (Math.abs(state.wheelDelta) >= props.scrollThreshold) {
    const direction = state.wheelDelta > 0 ? 1 : -1
    goTo(current.value + direction)
  }
}

// Touch handlers : le tactile ne fait que changer de section (§2.3).
function onTouchStart(e: TouchEvent) {
  const touch = e.touches[0]
  if (!touch) return

  state.touchStartY = touch.clientY
}

function onTouchMove(e: TouchEvent) {
  e.preventDefault()
  if (state.isAnimating) return

  const touch = e.touches[0]
  if (!touch) return

  const delta = state.touchStartY - touch.clientY

  if (Math.abs(delta) >= props.scrollThreshold) {
    const direction = delta > 0 ? 1 : -1
    goTo(current.value + direction)
    state.touchStartY = touch.clientY // Reset pour éviter les répétitions
  }
}

// Clavier : flèches haut/bas, PageUp/PageDown, Home/End changent de section ;
// flèches gauche/droite changent de sous-écran dans la section active (§2.3).
const NEXT_KEYS = new Set(['ArrowDown', 'PageDown'])
const PREV_KEYS = new Set(['ArrowUp', 'PageUp'])

function onKeydown(e: KeyboardEvent) {
  // Les quatre touches de changement de section passent par la file
  // d'attente d'une entrée (`requestNavigate`) : un appui pendant la
  // transition GSAP en cours n'est plus perdu silencieusement, il est rejoué
  // dès que la transition se termine (voir plus haut).
  if (NEXT_KEYS.has(e.key)) {
    e.preventDefault()
    requestNavigate(() => goTo(current.value + 1))
  } else if (PREV_KEYS.has(e.key)) {
    e.preventDefault()
    requestNavigate(() => goTo(current.value - 1))
  } else if (e.key === 'Home') {
    e.preventDefault()
    requestNavigate(() => goTo(0))
  } else if (e.key === 'End') {
    e.preventDefault()
    requestNavigate(() => goTo(slides.value.length - 1))
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    emit('subscreen-next')
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    emit('subscreen-prev')
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

<style scoped>
/*
 * Accusé de réception discret pour un appui clavier reçu pendant une
 * transition : trois points Jost, couleur accent, posés sur le noir du bas
 * d'écran, qui apparaissent le temps que la file d'attente d'une entrée se
 * vide (§Craft). Aucun cadre, aucun fond, aucun halo.
 */
.queued-hint {
  position: fixed;
  bottom: 4.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 60;
  margin: 0;
  font-family: var(--font-display);
  font-size: 0.9rem;
  letter-spacing: 0.3em;
  color: var(--color-accent);
  padding: 0.3rem 0.7rem;
  animation: queued-pulse 1.2s ease-in-out infinite;
}

@media (min-width: 768px) {
  .queued-hint {
    bottom: 1.75rem;
  }
}

/* Pulsation lente, jamais sous 0.85 d'opacité (contraste AA du texte accent). */
@keyframes queued-pulse {
  0%,
  100% {
    opacity: 0.85;
  }
  50% {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .queued-hint {
    animation: none;
    opacity: 1;
  }
}
</style>
