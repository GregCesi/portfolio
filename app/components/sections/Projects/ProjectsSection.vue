<template>
  <BaseSection :index="4">
    <div ref="rootRef" class="projects" :class="{ 'projects--reduced': prefersReducedMotion }">
      <div class="projects__cube-scene rv">
        <!--
          Les projets sur les faces d'un cube CSS 3D : l'intro puis un projet par
          face, dans cet ordre de rotation. La molette, le clavier haut/bas et le
          glissement tactile vertical font tourner le cube en crans (réutilise la
          rétention de molette d'EXE-52, voir useSlideScrollCapture) ; à chaque
          bout, le geste suivant cède à SlideContainer le changement de section.
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
const STEP_THRESHOLD = 100

const rotateIndex = ref(0)
let wheelAcc = 0

function faceStyle(i: number): Record<string, string> {
  if (prefersReducedMotion.value) return {}
  return { transform: `rotateY(${i * 90}deg) translateZ(var(--cube-r))` }
}

function render(animate: boolean) {
  if (!cubeRef.value || prefersReducedMotion.value) return
  const rotationY = -rotateIndex.value * 90
  if (animate) {
    gsap.to(cubeRef.value, { rotationY, duration: 0.7, ease: 'power2.out', overwrite: true })
  } else {
    gsap.set(cubeRef.value, { rotationY })
  }
}

function applyStep(direction: CaptureDirection): boolean {
  const next = Math.min(Math.max(rotateIndex.value + direction, 0), STEPS)
  if (next === rotateIndex.value) return false
  rotateIndex.value = next
  render(true)
  return true
}

function wants(direction: CaptureDirection): boolean {
  return direction === 1 ? rotateIndex.value < STEPS : rotateIndex.value > 0
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

// `from` vient de SlideContainer.goTo (EXE-52) : 1 depuis Méthode (précédente)
// pose l'arrivée sur l'intro, -1 depuis Contact (suivante) la pose sur Cockpit,
// 0 pour un saut direct (menu) revient à l'intro.
function onEnter(from: CaptureDirection | 0) {
  wheelAcc = 0
  rotateIndex.value = from === -1 ? STEPS : 0
  render(false)
}

const scrollCapture = useSlideScrollCapture()

// Rotation à la souris (glisser vertical, même geste que la molette) : le
// tactile est déjà porté par la rétention globale de SlideContainer.
let dragging = false
let dragStartY = 0

function onPointerDown(e: PointerEvent) {
  if (e.pointerType === 'touch') return
  dragging = true
  dragStartY = e.clientY
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!dragging) return
  const delta = dragStartY - e.clientY
  dragStartY = e.clientY
  if (delta !== 0) feed(delta)
}

function onPointerUp() {
  dragging = false
}

onMounted(() => {
  scrollCapture.register('projects', { wants, feed, step, onEnter })
  render(false)
})

onBeforeUnmount(() => {
  scrollCapture.unregister('projects')
  if (cubeRef.value) gsap.killTweensOf(cubeRef.value)
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

.projects__cube-scene {
  flex: 1;
  min-height: 0;
  display: flex;
  justify-content: center;
  perspective: 1800px;
}

.projects__cube {
  position: relative;
  height: 100%;
  width: var(--cube-w);
  --cube-w: min(88vw, 34rem);
  --cube-r: calc(var(--cube-w) / 2);
  transform-style: preserve-3d;
  touch-action: pan-y;
}

.projects__cube-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  display: flex;
  align-items: safe center;
  justify-content: center;
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
