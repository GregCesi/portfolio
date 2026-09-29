<template>
  <!-- Racine unique : elle reçoit `class="method__timeline"` posé par
       MethodSection.vue. En dessous de 1024px, une frise compacte de 6
       points, seul le nom de l'étape affichée est visible, sous son point.
       À partir de 1024px, chaque étape porte son point sur le trait et son
       nom dessous ; le trait relie le centre des points, jamais les noms.
       Le point de l'étape affichée pulse. Flèches de navigation flanquant
       la rangée à partir de 1024px. -->
  <div class="mt-root">
    <button
      type="button"
      class="mt-arrow"
      :disabled="!canGoPrev"
      aria-label="Étape précédente"
      @click="prevStepAnimated"
    >
      ‹
    </button>

    <div ref="trackRef" class="mt-track">
      <span class="mt-line" aria-hidden="true" :style="lineStyle">
        <span class="mt-line__fill" :style="{ width: `${fillPercent}%` }" />
      </span>

      <ol class="mt-row" aria-label="Étapes de la méthode">
        <li v-for="(step, index) in steps" :key="index" class="mt-item">
          <button
            type="button"
            class="mt-seg"
            :class="segClass(index)"
            :aria-current="stepsStatus[index]?.active ? 'step' : undefined"
            :aria-label="`Étape ${index + 1} : ${step.title}`"
            @click="selectCompact(index + 1)"
          >
            <span :ref="(el) => setDotRef(el, index)" class="mt-dot" aria-hidden="true" />
            <span class="mt-name">{{ step.title }}</span>
          </button>
        </li>
      </ol>
    </div>

    <button
      type="button"
      class="mt-arrow"
      :disabled="!canGoNext"
      aria-label="Étape suivante"
      @click="nextStepAnimated"
    >
      ›
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, type ComponentPublicInstance } from 'vue'
import type { StepStatus } from '~/types/method'
import { useMethodState } from '~/composables/useMethodState'

const {
  currentStep,
  steps,
  selectStep,
  introActive,
  canGoPrev,
  canGoNext,
  nextStepAnimated,
  prevStepAnimated,
} = useMethodState()

// Jalon ou segment : quitte l'introduction mobile, puis va à l'étape avec le
// même fondu (texte, ligne, texture de la planète) que les flèches.
const selectCompact = (stepNumber: number) => selectStep(stepNumber)

const stepsStatus = computed((): StepStatus[] => {
  return steps.value.map((_, index) => {
    const stepNumber = index + 1
    return {
      active: stepNumber === currentStep.value,
      past: stepNumber < currentStep.value,
      future: stepNumber > currentStep.value,
    }
  })
})

// Pendant l'introduction mobile, aucune étape n'est encore « en cours » :
// la frise reste éteinte plutôt que de montrer l'étape 1 en avance.
const segClass = (index: number) => {
  if (introActive.value) return ''
  const status = stepsStatus.value[index]
  if (!status) return ''
  if (status.active) return 'is-active'
  if (status.past) return 'is-past'
  return ''
}

const fillPercent = computed(() => {
  if (introActive.value || steps.value.length <= 1) return 0
  return ((currentStep.value - 1) / (steps.value.length - 1)) * 100
})

// À partir de 1024px, le trait doit relier le centre du premier point à
// celui du dernier (§ critère 5) sans jamais croiser un nom (§ critère 6).
// Les noms n'ont pas la même largeur : l'écart entre deux points n'est pas
// uniforme, donc seule une mesure DOM donne leur position exacte — un calcul
// CSS pur ne peut pas la déduire de la largeur du texte.
const trackRef = ref<HTMLElement | null>(null)
const dotRefs = ref<(HTMLElement | null)[]>([])

const setDotRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  dotRefs.value[index] = el instanceof HTMLElement ? el : null
}

const lineTop = ref(0)
const lineLeft = ref(0)
const lineRight = ref(0)

const lineStyle = computed(() => ({
  top: `${lineTop.value}px`,
  left: `${lineLeft.value}px`,
  right: `${lineRight.value}px`,
}))

const measureLine = () => {
  const track = trackRef.value
  const first = dotRefs.value[0]
  const last = dotRefs.value[dotRefs.value.length - 1]
  if (!track || !first || !last) return
  const trackRect = track.getBoundingClientRect()
  const firstRect = first.getBoundingClientRect()
  const lastRect = last.getBoundingClientRect()
  lineTop.value = firstRect.top + firstRect.height / 2 - trackRect.top
  lineLeft.value = firstRect.left + firstRect.width / 2 - trackRect.left
  lineRight.value = trackRect.right - (lastRect.left + lastRect.width / 2)
}

let resizeObserver: ResizeObserver | null = null

onMounted(async () => {
  await nextTick()
  measureLine()
  if (typeof ResizeObserver !== 'undefined' && trackRef.value) {
    resizeObserver = new ResizeObserver(() => measureLine())
    resizeObserver.observe(trackRef.value)
  }
  window.addEventListener('resize', measureLine)
  void document.fonts.ready.then(() => measureLine())
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', measureLine)
})
</script>

<style scoped>
.mt-root {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
}

.mt-arrow {
  /* < 1024px : la navigation reste dans MethodContent (`.rc__nav`), comme
     avant ce tour — ces flèches-ci ne flanquent la rangée qu'à partir de
     1024px (§ critère 10), où elles remplacent celles de MethodContent. */
  display: none;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: none;
  background: transparent;
  color: var(--color-ink);
  font-family: var(--font-display);
  font-weight: 300;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  transition: color 0.6s var(--ease-slow), opacity 0.6s var(--ease-slow);
}

.mt-arrow:hover:not(:disabled) {
  color: var(--color-accent);
}

.mt-arrow:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.mt-track {
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  justify-content: center;
}

.mt-line {
  display: none;
}

.mt-row {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  max-width: 100%;
  flex-wrap: wrap;
}

.mt-item {
  display: flex;
}

.mt-seg {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.15rem;
  border: none;
  background: transparent;
  color: var(--color-ink-dim);
  cursor: pointer;
}

.mt-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  border: 1px solid var(--color-ink-dim);
  background: transparent;
  transition: background-color 0.6s var(--ease-slow), border-color 0.6s var(--ease-slow);
}

.mt-seg.is-past .mt-dot,
.mt-seg.is-active .mt-dot {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

/* Point de l'étape affichée : seul repère du "en cours", en plus de la
   couleur du nom (§ critère 7). Durée dans [1,5 s ; 3 s], douce (§ critère
   humain 2) ; `prefers-reduced-motion` la raccourcit déjà (main.css). */
@keyframes mt-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.6);
    opacity: 0.65;
  }
}

.mt-seg.is-active .mt-dot {
  animation: mt-pulse 2.4s ease-in-out infinite;
}

.mt-name {
  display: none;
}

/* < 1024px : seul le nom de l'étape affichée est visible, à côté de ses 6 points (§ critère 13). */
.mt-seg.is-active .mt-name {
  display: block;
  font-family: var(--font-display);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-size: 0.8125rem;
  color: var(--color-accent);
  white-space: nowrap;
}

@media (min-width: 1024px) {
  .mt-arrow {
    display: flex;
  }

  .mt-line {
    /* Position exacte (top/left/right) posée en style inline par
       `lineStyle`, mesurée en JS depuis le premier et le dernier point :
       elle va de centre à centre, jamais des bords de la piste
       (§ critères 5, 6). */
    display: block;
    position: absolute;
    height: 1px;
    background: var(--color-line);
  }

  .mt-line__fill {
    position: absolute;
    inset: 0 auto 0 0;
    height: 100%;
    background: var(--color-accent);
    transition: width 0.8s var(--ease-slow);
  }

  .mt-row {
    gap: clamp(1.25rem, 2.5vw, 2.5rem);
    flex-wrap: nowrap;
  }

  .mt-name {
    display: block;
    font-family: var(--font-display);
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    font-size: 1.2rem;
    color: var(--color-ink-dim);
    white-space: nowrap;
    transition: color 0.6s var(--ease-slow);
  }

  .mt-seg.is-active .mt-name {
    font-size: 1.2rem;
    color: var(--color-accent);
  }
}
</style>
