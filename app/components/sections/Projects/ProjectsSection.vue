<template>
  <BaseSection :index="4">
    <div ref="rootRef" class="projects" :class="{ 'projects--reduced': prefersReducedMotion }">
      <div class="projects__cube-scene" :style="sceneStyle">
        <!--
          Les projets sur les faces d'un cube CSS 3D : l'intro puis un projet par
          face, dans cet ordre de rotation. La molette, le clavier haut/bas et le
          glissement tactile vertical font tourner le cube (réutilise la
          rétention de molette d'EXE-52, voir useSlideScrollCapture), le glisser
          horizontal à la souris aussi ; un geste fait tourner d'une face au plus
          et le cube se cale toujours sur une face (EXE-73). À chaque bout, le
          geste suivant cède à SlideContainer le changement de section.
          Sous mouvement réduit : un fondu entre faces plutôt qu'une rotation.
        -->
        <div
          ref="cubeRef"
          class="projects__cube"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
        >
          <div
            v-for="(face, i) in FACES"
            :key="face.id"
            class="projects__cube-face"
            :class="{ 'is-front': i === rotateIndex }"
            :style="faceStyle(i)"
          >
            <div class="projects__cube-face-inner">
              <template v-if="!face.card">
                <h2 class="projects__title t-title rv">{{ projects.title }}</h2>
                <p class="projects__intro t-body rv">{{ projects.intro }}</p>
              </template>
              <template v-else>
                <h3 class="projects__card-title">{{ face.card.title }}</h3>
                <p class="projects__card-tagline t-body">{{ face.card.tagline }}</p>
                <p class="projects__card-text projects__card-text--face t-body">{{ face.card.text }}</p>
                <p class="projects__tags">{{ face.card.tags.join(' · ') }}</p>
                <div class="projects__card-actions">
                  <a
                    v-if="face.card.href"
                    :href="face.card.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="projects__link"
                  >
                    Voir le code
                  </a>
                  <button v-if="face.card.cta" type="button" class="projects__link" @click="goToSection(face.card.cta.section)">
                    {{ face.card.cta.label }}
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile uniquement : le texte long de la face devant, sous le cube (§ce tour). -->
      <div v-if="frontFace?.card" class="projects__mobile-text" @touchstart.stop @touchmove.stop>
        <p class="projects__card-text t-body">{{ frontFace.card.text }}</p>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import BaseSection from '~/components/sections/BaseSection.vue'
import { siteContent } from '~/data/content'
import type { ProjectCard } from '~/types/content'
import { useAppNavigation } from '~/composables/useAppNavigation'
import { usePrefersReducedMotion } from '~/composables/usePrefersReducedMotion'
import { useSlideScrollCapture, type CaptureDirection } from '~/composables/useSlideScrollCapture'
import { useSplitReveal } from '~/composables/useSplitReveal'
import { cube } from '~/composables/useJourney'

const projects = siteContent.projects
const { goToSection } = useAppNavigation()

const rootRef = ref<HTMLElement | null>(null)
const cubeRef = ref<HTMLElement | null>(null)

const prefersReducedMotion = usePrefersReducedMotion()

interface CubeFace {
  id: string
  card?: ProjectCard
}

// 4 faces, dans l'ordre de rotation : intro, puis un projet par face (§ce tour).
const FACES = computed<CubeFace[]>(() => [{ id: 'intro' }, ...projects.cards.map((card) => ({ id: card.id, card }))])
const frontFace = computed(() => FACES.value[rotateIndex.value])

const STEPS = 3
/** Molette : delta brut qui fait tourner le cube d'une face entière (un cran de 100, EXE-54). */
const WHEEL_PER_FACE = 100
/** Glisser à la souris : déplacement (px) en deçà duquel un appui reste un clic. */
const DRAG_START = 4

const rotateIndex = ref(0)

// Angle du cube (degrés), animé par GSAP et posé tel quel dans `transform`.
const turn = { angle: 0 }

// Perspective et dimensions des faces, lues en direct dans les réglages `?tune`.
const sceneStyle = computed(() => ({
  perspective: `${cube.perspective}px`,
  '--cube-width-ratio': String(cube.widthRatio),
  '--cube-height-ratio': String(cube.heightRatio),
}))

function faceStyle(i: number): Record<string, string> {
  if (prefersReducedMotion.value) return {}
  return { transform: `rotateY(${i * 90}deg) translateZ(var(--cube-r))` }
}

// Le cube est reculé de son demi-côté : la face devant est dans le plan de
// l'écran, affichée à sa taille exacte, sans le grossissement de la perspective.
function paint() {
  if (!cubeRef.value) return
  cubeRef.value.style.transform = `translateZ(calc(var(--cube-r) * -1)) rotateY(${turn.angle}deg)`
}

function rotateTo(angle: number, duration: number) {
  if (!cubeRef.value || prefersReducedMotion.value) return
  if (duration <= 0) {
    gsap.killTweensOf(turn)
    turn.angle = angle
    paint()
    return
  }
  gsap.to(turn, { angle, duration, ease: 'power2.out', overwrite: true, onUpdate: paint })
}

function faceAngle(index: number): number {
  return -index * 90
}

function clampIndex(index: number): number {
  return Math.min(Math.max(index, 0), STEPS)
}

/** Pose `index` devant et y tourne le cube (durée de rotation du réglage `?tune`). */
function commit(index: number) {
  rotateIndex.value = clampIndex(index)
  rotateTo(faceAngle(rotateIndex.value), cube.rotationDuration)
}

/**
 * Un geste (molette, glisser) part de la face `base` et tourne d'une face au
 * plus, dans un sens ou dans l'autre : `offset` est la part de face parcourue,
 * de -1 à 1. À la fin du geste, le cube se cale sur la face suivante si
 * `offset` dépasse le seuil de calage, sinon il revient sur `base`.
 */
interface Gesture {
  base: number
  offset: number
}

let gesture: Gesture | null = null
let settleTimer: ReturnType<typeof setTimeout> | null = null

function clearSettle() {
  if (settleTimer) clearTimeout(settleTimer)
  settleTimer = null
}

function beginGesture(): Gesture {
  if (!gesture) gesture = { base: rotateIndex.value, offset: 0 }
  return gesture
}

function moveGesture(offset: number, duration: number) {
  const g = beginGesture()
  // Jamais au-delà de la première ou de la dernière face.
  const min = g.base > 0 ? -1 : 0
  const max = g.base < STEPS ? 1 : 0
  g.offset = Math.min(Math.max(offset, min), max)
  rotateTo(faceAngle(g.base + g.offset), duration)
}

function endGesture() {
  clearSettle()
  if (!gesture) return
  const { base, offset } = gesture
  gesture = null
  const shift = offset >= cube.snapThreshold ? 1 : offset <= -cube.snapThreshold ? -1 : 0
  commit(base + shift)
}

// Pendant un geste, tout lui revient, même au-delà d'une face (inertie du
// pavé tactile) : seul un geste commencé au bout du cube cède la section.
function wants(direction: CaptureDirection): boolean {
  if (gesture) return true
  return direction === 1 ? rotateIndex.value < STEPS : rotateIndex.value > 0
}

// Molette et glissement tactile vertical : le cube suit le geste, puis se cale
// une fois la molette immobile pendant le délai de calage.
function feed(rawDelta: number) {
  const g = beginGesture()
  moveGesture(g.offset + rawDelta / WHEEL_PER_FACE, cube.rotationDuration)
  clearSettle()
  settleTimer = setTimeout(endGesture, cube.settleDelay * 1000)
}

function step(direction: CaptureDirection) {
  clearSettle()
  gesture = null
  commit(rotateIndex.value + direction)
}

// `from` vient de SlideContainer.goTo (EXE-52) : 1 depuis Méthode (précédente)
// pose l'arrivée sur l'intro, -1 depuis Contact (suivante) la pose sur Cockpit,
// 0 pour un saut direct (menu) revient à l'intro.
function onEnter(from: CaptureDirection | 0) {
  clearSettle()
  gesture = null
  rotateIndex.value = from === -1 ? STEPS : 0
  rotateTo(faceAngle(rotateIndex.value), 0)
}

const scrollCapture = useSlideScrollCapture()

// Rotation à la souris (glisser horizontal) : le cube suit la main, une
// largeur de face glissée vaut une face ; au relâcher, il se cale. Le tactile
// est déjà porté par la rétention globale de SlideContainer.
let pointerId: number | null = null
let dragStartX = 0
let dragging = false

function onPointerDown(e: PointerEvent) {
  if (e.pointerType === 'touch' || e.button !== 0 || prefersReducedMotion.value) return
  pointerId = e.pointerId
  dragStartX = e.clientX
  dragging = false
}

function onPointerMove(e: PointerEvent) {
  if (e.pointerId !== pointerId || !cubeRef.value) return
  const dx = e.clientX - dragStartX
  if (!dragging) {
    if (Math.abs(dx) < DRAG_START) return
    // Capture posée seulement quand l'appui devient un glisser : un simple
    // clic garde sa cible (liens et boutons des faces).
    dragging = true
    clearSettle()
    gesture = null
    cubeRef.value.setPointerCapture(e.pointerId)
    window.getSelection()?.removeAllRanges()
  }
  moveGesture(-dx / cubeRef.value.offsetWidth, 0)
}

function onPointerUp(e: PointerEvent) {
  if (e.pointerId !== pointerId) return
  pointerId = null
  if (!dragging) return
  dragging = false
  endGesture()
}

onMounted(() => {
  scrollCapture.register('projects', { wants, feed, step, onEnter })
  rotateTo(faceAngle(rotateIndex.value), 0)
})

onBeforeUnmount(() => {
  scrollCapture.unregister('projects')
  clearSettle()
  gsap.killTweensOf(turn)
})

useSplitReveal(rootRef, {
  index: 3,
  titles: '.projects__title',
  lines: '.projects__intro',
})
</script>

<style scoped>
.projects {
  height: 100%;
  width: 100%;
  max-width: 64rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 0 var(--pad-x);
}

/*
 * La scène est un conteneur de taille : les faces s'y mesurent en proportions
 * de l'espace disponible (`cqw`, `cqh`), ratios réglables dans `?tune`. La
 * perspective est posée en ligne par le script, depuis les mêmes réglages.
 */
.projects__cube-scene {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  container-type: size;
}

.projects__cube {
  position: relative;
  width: var(--cube-w);
  height: var(--cube-h);
  --cube-w: calc(100cqw * var(--cube-width-ratio, 0.62));
  --cube-h: calc(100cqh * var(--cube-height-ratio, 0.86));
  --cube-r: calc(var(--cube-w) / 2);
  transform-style: preserve-3d;
  touch-action: pan-y;
  cursor: grab;
}

.projects__cube:active {
  cursor: grabbing;
}

/* Face opaque, bordée : on voit où elle finit, et le cube reste plein en rotation. */
.projects__cube-face {
  position: absolute;
  inset: 0;
  box-sizing: border-box;
  backface-visibility: hidden;
  display: flex;
  align-items: safe center;
  justify-content: center;
  background-color: var(--color-surface);
  border: 1px solid var(--color-ink-dim);
  padding: 1.5rem 1.25rem;
}

/* Sous mouvement réduit, chaque face occupe la même place : un fondu remplace la rotation 3D. */
.projects--reduced .projects__cube-face {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s var(--ease-slow);
}

.projects--reduced .projects__cube-face.is-front {
  opacity: 1;
  pointer-events: auto;
}

.projects__cube-face-inner {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem;
}

.projects__title {
  font-size: clamp(1.25rem, 1rem + 1vw, 2rem);
  margin-bottom: 1.5rem;
}

.projects__intro {
  max-width: 30rem;
}

.projects__card-title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.05rem, 0.9rem + 0.5vw, 1.4rem);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  line-height: 1.4;
  color: var(--color-ink);
}

/* Un filet de 1 px ouvre le carton d'une face (ornement, aucun texte). */
.projects__card-title::before {
  content: '';
  display: block;
  width: 2.5rem;
  height: 1px;
  margin: 0 auto 1.1rem;
  background: var(--color-accent);
}

.projects__card-tagline {
  margin-top: 1rem;
  max-width: 28rem;
}

.projects__card-text {
  color: var(--color-ink-dim);
  margin-top: 0.7rem;
  max-width: 30rem;
}

.projects__tags {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  line-height: 1.7;
  color: var(--color-ink-dim);
  margin-top: 1.1rem;
  max-width: 28rem;
}

.projects__card-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem 2rem;
  margin-top: 0.9rem;
}

/* Liens : Jost capitales espacées, un filet de 1 px dessous, ni cadre ni fond. */
.projects__link {
  display: inline-block;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-accent);
  background: none;
  border: none;
  border-bottom: 1px solid var(--color-accent);
  padding: 0.5rem 0 0.35rem 0.2em;
  cursor: pointer;
  transition: color 0.8s var(--ease-slow), border-color 0.8s var(--ease-slow);
}

.projects__link:hover {
  color: var(--color-ink);
  border-bottom-color: var(--color-ink);
}

/* Panneau mobile sous le cube : masqué au-delà de 768px, où le texte reste sur la face. */
.projects__mobile-text {
  display: none;
}

@media (max-width: 767.98px) {
  .projects__cube-scene {
    flex: 0 0 auto;
    height: min(46vh, 22rem);
  }

  /* Sur mobile, la face prend toute la largeur : le texte long est déjà sous le cube. */
  .projects__cube {
    --cube-w: 100cqw;
  }

  .projects__cube-face {
    padding: 0.75rem;
  }

  .projects__card-title {
    letter-spacing: 0.16em;
  }

  .projects__card-title::before {
    margin-bottom: 0.75rem;
  }

  .projects__card-tagline {
    margin-top: 0.7rem;
  }

  .projects__tags {
    margin-top: 0.7rem;
  }

  .projects__card-actions {
    margin-top: 0.4rem;
  }

  /* Sur la face, seuls titre, accroche, tags et liens restent : le texte long passe sous le cube. */
  .projects__cube-face .projects__card-text--face {
    display: none;
  }

  .projects__mobile-text {
    display: block;
    flex: 1;
    min-height: 0;
    max-width: 30rem;
    margin: 1rem auto 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .projects__mobile-text .projects__card-text {
    margin-top: 0;
  }
}
</style>
