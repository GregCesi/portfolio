<template>
  <div v-if="!opened" ref="gateRef" class="entry-gate" aria-hidden="true">
    <div ref="leftRef" class="entry-gate__panel entry-gate__panel--left">
      <div class="entry-gate__plate entry-gate__plate--upper" />
      <div class="entry-gate__plate entry-gate__plate--lower" />
      <p class="entry-gate__name">{{ firstName }}</p>
    </div>
    <div ref="rightRef" class="entry-gate__panel entry-gate__panel--right">
      <div class="entry-gate__plate entry-gate__plate--upper" />
      <div class="entry-gate__plate entry-gate__plate--lower" />
      <p class="entry-gate__name">{{ lastName }}</p>
    </div>
    <div class="entry-gate__frame" />
    <div ref="slitRef" class="entry-gate__slit" />
    <div class="entry-gate__log">
      <ol class="entry-gate__log-lines">
        <li v-for="(step, index) in visibleSteps" :key="step.label" class="entry-gate__log-line">
          <span>{{ step.label }}</span>
          <span v-if="okSteps[index]" class="entry-gate__log-ok">OK</span>
        </li>
      </ol>
      <p class="entry-gate__log-percent">{{ percent }} %</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { siteContent } from '~/data/content'
import { useEntryGate } from '~/composables/useEntryGate'
import { useSiteLoad, type LoadTask } from '~/composables/useSiteLoad'
import { usePrefersReducedMotion } from '~/composables/usePrefersReducedMotion'

/**
 * Sas d'entrée : une porte de métal en deux battants, un mot du nom par
 * battant, loin de la fente centrale. Un journal de chargement, en bas à
 * droite, affiche ses lignes une à une ; chaque ligne liée à un chargement
 * réel (voir useSiteLoad) ne reçoit « OK » que quand ce chargement est fini,
 * les autres lignes sont décoratives et se cochent seules peu après leur
 * apparition. Le pourcentage ne compte que les chargements réels.
 *
 * Le sas reste fermé au moins `MIN_CLOSED_MS` et au plus `MAX_CLOSED_MS`, comptés
 * depuis l'arrivée sur la page (`performance.now()` part de la navigation).
 * Ouvert de force, il ne passe pas par l'intensification : les lignes restées
 * sans « OK » disent ce qui manquait.
 */
const MIN_CLOSED_MS = 1500
const MAX_CLOSED_MS = 8000
/** Délai avant qu'une ligne fictive reçoive son « OK », une fois apparue. */
const FICTIVE_OK_DELAY_MS = 300
const INTENSIFY_DURATION = 0.45
const INTENSIFY_HOLD = 0.15
const OPEN_DURATION = 1
const FADE_DURATION = 0.5

interface LogStep {
  label: string
  /** null = ligne fictive, cochée seule ; sinon le chargement réel qui la coche. */
  task: LoadTask | null
}

const { opened, markOpened } = useEntryGate()
const { loaded, preloadSiteAssets } = useSiteLoad()
const prefersReducedMotion = usePrefersReducedMotion()

const [firstName, lastName] = siteContent.global.name.split(' ')

const STEPS: LogStep[] = [
  { label: siteContent.entryGate.log[0], task: null },
  { label: siteContent.entryGate.log[1], task: 'font-display' },
  { label: siteContent.entryGate.log[2], task: 'font-sans' },
  { label: siteContent.entryGate.log[3], task: null },
  { label: siteContent.entryGate.log[4], task: 'planet-model' },
  { label: siteContent.entryGate.log[5], task: 'planet-textures' },
  { label: siteContent.entryGate.log[6], task: 'satellite-model' },
  { label: siteContent.entryGate.log[7], task: null },
]
const REAL_TASK_COUNT = STEPS.filter((step) => step.task !== null).length

const gateRef = ref<HTMLElement | null>(null)
const leftRef = ref<HTMLElement | null>(null)
const rightRef = ref<HTMLElement | null>(null)
const slitRef = ref<HTMLElement | null>(null)

const visibleCount = ref(1)
const okSteps = ref<boolean[]>(STEPS.map(() => false))
const minElapsed = ref(false)

const visibleSteps = computed(() => STEPS.slice(0, visibleCount.value))
const percent = computed(() => Math.round((loaded.value.length / REAL_TASK_COUNT) * 100))
const allStepsOk = computed(() => okSteps.value.every(Boolean))

let fictiveTimer: ReturnType<typeof setTimeout> | null = null
let minTimer: ReturnType<typeof setTimeout> | null = null
let maxTimer: ReturnType<typeof setTimeout> | null = null
let timeline: gsap.core.Timeline | null = null
let opening = false

function clearTimers() {
  if (fictiveTimer) clearTimeout(fictiveTimer)
  if (minTimer) clearTimeout(minTimer)
  if (maxTimer) clearTimeout(maxTimer)
  fictiveTimer = minTimer = maxTimer = null
}

function markOk(index: number) {
  if (okSteps.value[index]) return
  const next = [...okSteps.value]
  next[index] = true
  okSteps.value = next
  if (index + 1 < STEPS.length) visibleCount.value = index + 2
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
    .to(slitRef.value, { opacity: 0, duration: OPEN_DURATION * 0.5, ease: 'power1.in' })
    .to(leftRef.value, { xPercent: -100, duration: OPEN_DURATION, ease: 'power2.inOut' }, '<')
    .to(rightRef.value, { xPercent: 100, duration: OPEN_DURATION, ease: 'power2.inOut' }, '<')
}

onMounted(() => {
  preloadSiteAssets()

  minTimer = setTimeout(() => {
    minElapsed.value = true
  }, Math.max(0, MIN_CLOSED_MS - performance.now()))
  maxTimer = setTimeout(() => open(false), Math.max(0, MAX_CLOSED_MS - performance.now()))

  // Fait avancer le journal : la ligne en cours reçoit son « OK » dès que son
  // chargement réel est fini, ou après un court délai si elle est fictive.
  watch(
    [visibleCount, loaded],
    () => {
      const index = visibleCount.value - 1
      const step = STEPS[index]
      if (!step || okSteps.value[index]) return
      if (step.task === null) {
        if (!fictiveTimer) {
          fictiveTimer = setTimeout(() => {
            fictiveTimer = null
            markOk(index)
          }, FICTIVE_OK_DELAY_MS)
        }
      } else if (loaded.value.includes(step.task)) {
        markOk(index)
      }
    },
    { immediate: true },
  )

  watch(
    [allStepsOk, minElapsed],
    ([done, elapsed]) => {
      if (done && elapsed) open(true)
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
/* Porte de métal sombre bleuté : deux battants, chacun deux plaques en
   semi-relief, brossées à l'horizontale, rivetées ; une fente centrale
   encadrée. Aucune image : tout est dessiné en dégradés CSS. */
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
  background-color: color-mix(in srgb, var(--color-ink) 6%, var(--color-bg));
  background-image:
    linear-gradient(
      to bottom,
      color-mix(in srgb, var(--color-ink) 10%, var(--color-bg)),
      color-mix(in srgb, var(--color-ink) 3%, var(--color-bg)) 45%,
      color-mix(in srgb, var(--color-bg) 100%, transparent) 55%,
      color-mix(in srgb, var(--color-ink) 8%, var(--color-bg))
    ),
    repeating-linear-gradient(
      to bottom,
      color-mix(in srgb, var(--color-ink) 22%, transparent) 0,
      color-mix(in srgb, var(--color-ink) 22%, transparent) 1px,
      transparent 1px,
      transparent 3px
    );
}

.entry-gate__panel--left {
  left: 0;
  border-right: 1px solid var(--color-line);
}

.entry-gate__panel--right {
  right: 0;
  border-left: 1px solid var(--color-line);
}

/* Les deux plaques en semi-relief de chaque battant : arête claire en haut
   et à gauche, ombre en bas et à droite, rivets aux quatre coins. */
.entry-gate__plate {
  position: absolute;
  left: 8%;
  right: 8%;
  border-radius: 2px;
  background-color: color-mix(in srgb, var(--color-ink) 5%, var(--color-bg));
  box-shadow:
    inset 3px 3px 0 color-mix(in srgb, var(--color-ink) 28%, transparent),
    inset -3px -3px 0 color-mix(in srgb, black 85%, var(--color-bg)),
    0 2px 10px color-mix(in srgb, black 55%, transparent);
  background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
  background-image:
    radial-gradient(circle, color-mix(in srgb, var(--color-ink) 42%, var(--color-bg)) 58%, transparent 62%),
    radial-gradient(circle, color-mix(in srgb, var(--color-ink) 42%, var(--color-bg)) 58%, transparent 62%),
    radial-gradient(circle, color-mix(in srgb, var(--color-ink) 42%, var(--color-bg)) 58%, transparent 62%),
    radial-gradient(circle, color-mix(in srgb, var(--color-ink) 42%, var(--color-bg)) 58%, transparent 62%);
  background-size: 14px 14px;
  background-position:
    10px 9px,
    10px calc(100% - 9px),
    9px 10px,
    calc(100% - 9px) 10px;
}

.entry-gate__plate--upper {
  top: 8%;
  height: 32%;
}

.entry-gate__plate--lower {
  bottom: 14%;
  height: 26%;
}

/* Le nom est coupé au mot : chaque battant en porte un, centré sur sa propre
   moitié d'écran, loin de la fente. */
.entry-gate__name {
  position: absolute;
  top: 42%;
  left: 0;
  right: 0;
  margin: 0;
  text-align: center;
  white-space: nowrap;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(0.9rem, 0.6rem + 1.2vw, 1.5rem);
  text-transform: uppercase;
  letter-spacing: 0.34em;
  color: var(--color-ink);
}

/* Cadre épais autour de la fente : une bande de métal plus sombre, bordée
   d'un filet clair de chaque côté, qui reste immobile pendant que les
   battants coulissent dessous. */
.entry-gate__frame {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 22px;
  margin-left: -11px;
  background: linear-gradient(
    to right,
    color-mix(in srgb, var(--color-bg) 40%, black),
    color-mix(in srgb, var(--color-ink) 10%, var(--color-bg)) 50%,
    color-mix(in srgb, var(--color-bg) 40%, black)
  );
  box-shadow:
    inset 1px 0 0 color-mix(in srgb, var(--color-ink) 20%, transparent),
    inset -1px 0 0 color-mix(in srgb, var(--color-ink) 20%, transparent),
    0 0 16px color-mix(in srgb, black 60%, transparent);
  z-index: 1;
}

.entry-gate__slit {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 3px;
  margin-left: -1.5px;
  background: linear-gradient(to bottom, transparent, var(--color-accent) 18%, var(--color-accent) 82%, transparent);
  box-shadow: 0 0 14px var(--color-accent);
  opacity: 0.75;
  z-index: 2;
}

.entry-gate__log {
  position: absolute;
  right: 2.5rem;
  bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
  color: var(--color-ink-dim);
  font-family: var(--font-sans);
  font-variant: small-caps;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
}

.entry-gate__log-lines {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: right;
}

.entry-gate__log-line {
  white-space: nowrap;
}

.entry-gate__log-ok {
  margin-left: 0.5em;
  color: var(--color-accent);
}

.entry-gate__log-percent {
  margin: 0.2rem 0 0;
  color: var(--color-accent);
  font-variant: normal;
  letter-spacing: 0.02em;
}
</style>
