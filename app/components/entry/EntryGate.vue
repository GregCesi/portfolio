<template>
  <div v-if="!opened" ref="gateRef" class="entry-gate" aria-hidden="true">
    <div ref="leftRef" class="entry-gate__panel entry-gate__panel--left">
      <p class="entry-gate__name">{{ siteContent.global.name }}</p>
    </div>
    <div ref="rightRef" class="entry-gate__panel entry-gate__panel--right">
      <p class="entry-gate__name">{{ siteContent.global.name }}</p>
    </div>
    <div ref="slitRef" class="entry-gate__slit" />
    <ul ref="lightsRef" class="entry-gate__lights">
      <li v-for="(task, index) in LOAD_TASKS" :key="task" class="entry-gate__light" :class="{ 'is-lit': index < lit }" />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { siteContent } from '~/data/content'
import { useEntryGate } from '~/composables/useEntryGate'
import { LOAD_TASKS, useSiteLoad } from '~/composables/useSiteLoad'
import { usePrefersReducedMotion } from '~/composables/usePrefersReducedMotion'

/**
 * Sas d'entrée : deux panneaux sombres couvrent l'écran, séparés par une fente
 * de lumière. Une rangée de voyants s'allume, un par élément réellement chargé
 * (voir useSiteLoad). Quand tous sont allumés, la fente s'intensifie, puis les
 * panneaux coulissent vers les côtés et découvrent les étoiles.
 *
 * Le sas reste fermé au moins `MIN_CLOSED_MS` et au plus `MAX_CLOSED_MS`, comptés
 * depuis l'arrivée sur la page (`performance.now()` part de la navigation).
 * Ouvert de force, il ne passe pas par l'intensification : les voyants
 * restés éteints disent ce qui manquait.
 */
const MIN_CLOSED_MS = 1500
const MAX_CLOSED_MS = 8000
/** Délai entre deux voyants : même chargé d'un coup, le cache s'allume un par un. */
const LIGHT_INTERVAL_MS = 140
const INTENSIFY_DURATION = 0.45
const INTENSIFY_HOLD = 0.15
const OPEN_DURATION = 1
const FADE_DURATION = 0.5

const { opened, markOpened } = useEntryGate()
const { loaded, preloadSiteAssets } = useSiteLoad()
const prefersReducedMotion = usePrefersReducedMotion()

const gateRef = ref<HTMLElement | null>(null)
const leftRef = ref<HTMLElement | null>(null)
const rightRef = ref<HTMLElement | null>(null)
const slitRef = ref<HTMLElement | null>(null)
const lightsRef = ref<HTMLElement | null>(null)

const lit = ref(0)
const minElapsed = ref(false)

let lightTimer: ReturnType<typeof setInterval> | null = null
let minTimer: ReturnType<typeof setTimeout> | null = null
let maxTimer: ReturnType<typeof setTimeout> | null = null
let timeline: gsap.core.Timeline | null = null
let opening = false

function clearTimers() {
  if (lightTimer) clearInterval(lightTimer)
  if (minTimer) clearTimeout(minTimer)
  if (maxTimer) clearTimeout(maxTimer)
  lightTimer = minTimer = maxTimer = null
}

function open(intensify: boolean) {
  if (opening) return
  opening = true
  clearTimers()

  timeline = gsap.timeline({ onComplete: markOpened })

  // « Réduire les animations » : le sas s'efface en fondu, rien ne coulisse.
  if (prefersReducedMotion.value) {
    timeline.to(gateRef.value, { opacity: 0, duration: FADE_DURATION, ease: 'power1.out' })
    return
  }

  if (intensify) {
    timeline.to(slitRef.value, { scaleX: 4, opacity: 1, duration: INTENSIFY_DURATION, ease: 'power2.out' })
    timeline.to({}, { duration: INTENSIFY_HOLD })
  }
  timeline
    .to([slitRef.value, lightsRef.value], { opacity: 0, duration: OPEN_DURATION * 0.5, ease: 'power1.in' })
    .to(leftRef.value, { xPercent: -100, duration: OPEN_DURATION, ease: 'power2.inOut' }, '<')
    .to(rightRef.value, { xPercent: 100, duration: OPEN_DURATION, ease: 'power2.inOut' }, '<')
}

onMounted(() => {
  preloadSiteAssets()

  // Un voyant de plus à chaque pas, jusqu'au nombre d'éléments chargés.
  lightTimer = setInterval(() => {
    if (lit.value < loaded.value.length) lit.value += 1
  }, LIGHT_INTERVAL_MS)

  minTimer = setTimeout(() => {
    minElapsed.value = true
  }, Math.max(0, MIN_CLOSED_MS - performance.now()))
  maxTimer = setTimeout(() => open(false), Math.max(0, MAX_CLOSED_MS - performance.now()))

  watch(
    [lit, minElapsed],
    ([count, elapsed]) => {
      if (elapsed && count === LOAD_TASKS.length) open(true)
    },
    { immediate: true },
  )
})

onBeforeUnmount(() => {
  clearTimers()
  timeline?.kill()
})
</script>

<style scoped>
/* Tout est dessiné en traits fins, dans la palette du site : deux aplats du
   noir bleuté, un liseré, une fente, des points. Aucun décor. */
.entry-gate {
  position: fixed;
  inset: 0;
  z-index: 100;
}

.entry-gate__panel {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
  overflow: hidden;
  background-color: color-mix(in srgb, var(--color-ink) 3%, var(--color-bg));
}

.entry-gate__panel--left {
  left: 0;
  border-right: 1px solid var(--color-line);
}

.entry-gate__panel--right {
  right: 0;
  border-left: 1px solid var(--color-line);
}

/* Le nom est écrit sur la porte entière : chaque panneau en porte une copie
   pleine largeur, rognée à sa moitié. Ouverts, ils emportent chacun sa moitié. */
.entry-gate__name {
  position: absolute;
  top: 42%;
  width: 100vw;
  margin: 0;
  padding-left: 0.34em;
  text-align: center;
  white-space: nowrap;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(0.9rem, 0.6rem + 1.2vw, 1.5rem);
  text-transform: uppercase;
  letter-spacing: 0.34em;
  color: var(--color-ink);
}

.entry-gate__panel--left .entry-gate__name {
  left: 0;
}

.entry-gate__panel--right .entry-gate__name {
  right: 0;
}

.entry-gate__slit {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  margin-left: -1px;
  background: linear-gradient(to bottom, transparent, var(--color-accent) 18%, var(--color-accent) 82%, transparent);
  box-shadow: 0 0 14px var(--color-accent);
  opacity: 0.75;
}

.entry-gate__lights {
  position: absolute;
  top: 52%;
  left: 50%;
  display: flex;
  flex-direction: column;
  gap: 0.95rem;
  margin: 0;
  padding: 0;
  list-style: none;
  transform: translateX(-50%);
}

.entry-gate__light {
  width: 0.5rem;
  height: 0.5rem;
  border: 1px solid var(--color-accent);
  border-radius: 50%;
  background-color: var(--color-bg);
  transition:
    background-color 0.25s var(--ease-slow),
    box-shadow 0.25s var(--ease-slow);
}

.entry-gate__light.is-lit {
  background-color: var(--color-accent);
  box-shadow: 0 0 8px var(--color-accent);
}
</style>
