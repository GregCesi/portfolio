<template>
  <BaseSection :index="2">
    <div ref="rootRef" class="par">
      <div ref="sceneRef" class="par__scene">
        <div ref="trackRef" class="par__track">
          <div class="par__intro">
            <div class="par__intro-inner">
              <h2 class="par__title t-title rv">{{ about.title }}</h2>
              <p class="par__intro-text t-body rv">{{ about.intro }}</p>
            </div>
          </div>

          <div
            v-for="(entry, index) in about.timeline"
            :key="entry.period"
            class="par__stop"
            :class="index % 2 === 0 ? 'par__stop--above' : 'par__stop--below'"
          >
            <svg
              class="par__seg"
              :class="{ 'par__seg--first': index === 0, 'par__seg--reached': isReached(index) }"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path :d="segPath(index)" vector-effect="non-scaling-stroke" />
            </svg>

            <span class="par__marker" :class="{ 'par__marker--reached': isReached(index) }" aria-hidden="true" />

            <div class="par__cartouche">
              <p class="par__period">{{ entry.period }}</p>
              <p class="par__place">{{ entry.place }}</p>
              <p class="par__role">{{ entry.role }}</p>
              <p v-if="entry.detail" class="par__detail">{{ entry.detail }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import BaseSection from '~/components/sections/BaseSection.vue'
import { siteContent } from '~/data/content'
import { usePrefersReducedMotion } from '~/composables/usePrefersReducedMotion'
import { useSplitReveal } from '~/composables/useSplitReveal'
import { useSlideScrollCapture, type CaptureDirection } from '~/composables/useSlideScrollCapture'

const about = siteContent.about

const rootRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)

const prefersReducedMotion = usePrefersReducedMotion()

// Un itinéraire horizontal en pointillés (EXE-52) : la molette verticale, le
// clavier haut/bas et le glissement tactile vertical font défiler la scène en
// crans discrets tant qu'elle a du terrain, avant de céder à SlideContainer
// le changement de section (voir useSlideScrollCapture, réutilisé par EXE-54).
const STEPS = about.timeline.length
const STEP_THRESHOLD = 100

const stepIndex = ref(0)
let scrollable = 0
let wheelAcc = 0

function isReached(index: number): boolean {
  return prefersReducedMotion.value || stepIndex.value >= index + 1
}

// Chaque escale bombe le tracé vers le côté où se pose son cartouche : la
// molette venant à l'avance ne dépend que de la parité, pas d'une mesure DOM.
function segPath(index: number): string {
  const bulge = index % 2 === 0 ? 18 : 82
  return `M0,50 Q50,${bulge} 100,50`
}

function measure() {
  if (!sceneRef.value || !trackRef.value) return
  scrollable = Math.max(trackRef.value.scrollWidth - sceneRef.value.clientWidth, 0)
}

function render(animate: boolean) {
  if (!trackRef.value) return
  const x = -(stepIndex.value / STEPS) * scrollable
  if (animate && !prefersReducedMotion.value) {
    gsap.to(trackRef.value, { x, duration: 0.6, ease: 'power2.out', overwrite: true })
  } else {
    gsap.set(trackRef.value, { x })
  }
}

function applyStep(direction: CaptureDirection): boolean {
  const next = Math.min(Math.max(stepIndex.value + direction, 0), STEPS)
  if (next === stepIndex.value) return false
  stepIndex.value = next
  render(true)
  return true
}

function wants(direction: CaptureDirection): boolean {
  return direction === 1 ? stepIndex.value < STEPS : stepIndex.value > 0
}

function feed(rawDelta: number) {
  wheelAcc += rawDelta
  while (Math.abs(wheelAcc) >= STEP_THRESHOLD) {
    const direction: CaptureDirection = wheelAcc > 0 ? 1 : -1
    if (!applyStep(direction)) {
      wheelAcc = 0
      break
    }
    wheelAcc -= direction * STEP_THRESHOLD
  }
}

function step(direction: CaptureDirection) {
  applyStep(direction)
  wheelAcc = 0
}

// `from` vient de SlideContainer.goTo (EXE-52) : 1 depuis Start (section
// précédente) pose l'arrivée au début de l'itinéraire, -1 depuis Méthode (la
// suivante) la pose à la fin, 0 pour un saut direct (menu) revient au début —
// aucune continuité de défilement à porter pour un saut.
function onEnter(from: CaptureDirection | 0) {
  wheelAcc = 0
  stepIndex.value = from === -1 ? STEPS : 0
  measure()
  render(false)
}

const scrollCapture = useSlideScrollCapture()

function onResize() {
  measure()
  render(false)
}

onMounted(() => {
  measure()
  render(false)
  scrollCapture.register('about', { wants, feed, step, onEnter })
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  scrollCapture.unregister('about')
  window.removeEventListener('resize', onResize)
  if (trackRef.value) gsap.killTweensOf(trackRef.value)
})

useSplitReveal(rootRef, {
  index: 1,
  titles: '.par__title',
  lines: '.par__intro-text',
})
</script>

<style scoped>
.par {
  height: 100%;
  width: 100%;
}

.par__scene {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.par__track {
  height: 100%;
  display: flex;
  align-items: stretch;
  will-change: transform;
}

.par__intro {
  flex: 0 0 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0 var(--pad-x);
}

.par__intro-inner {
  max-width: 26rem;
}

.par__title {
  font-size: clamp(1.5rem, 1rem + 2vw, 2.5rem);
  margin-bottom: 1.25rem;
}

.par__intro-text {
  max-width: 26rem;
}

.par__stop {
  position: relative;
  flex: 0 0 clamp(13rem, 60vw, 19rem);
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  padding: 0 1rem;
}

.par__stop--above .par__marker {
  order: 2;
}
.par__stop--above .par__cartouche {
  order: 1;
}
.par__stop--below .par__marker {
  order: 1;
}
.par__stop--below .par__cartouche {
  order: 2;
}

.par__seg {
  position: absolute;
  left: -50%;
  top: 50%;
  width: 100%;
  height: 6rem;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  transition: opacity 0.6s var(--ease-slow);
}

.par__seg--first {
  left: 0;
  width: 50%;
}

.par__seg--reached {
  opacity: 1;
}

.par__seg path {
  fill: none;
  stroke: var(--color-accent);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 0.5 7;
}

.par__marker {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 50%;
  background: transparent;
  border: 1px solid var(--color-ink-dim);
  transition:
    background-color 0.6s var(--ease-slow),
    border-color 0.6s var(--ease-slow);
}

.par__marker--reached {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.par__cartouche {
  position: relative;
  z-index: 1;
  width: 90%;
  max-width: 19rem;
  text-align: center;
}

.par__period {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  line-height: 1.5;
  color: var(--color-accent);
  margin-bottom: 0.3rem;
}

.par__place {
  font-size: var(--fs-body);
  line-height: 1.4;
  color: var(--color-ink);
}

.par__role {
  font-size: var(--fs-body);
  line-height: 1.4;
  color: var(--color-ink-dim);
  margin-top: 0.15rem;
}

.par__detail {
  font-size: var(--fs-body);
  line-height: 1.45;
  color: var(--color-ink-dim);
  margin-top: 0.3rem;
}
</style>
