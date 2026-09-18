<template>
  <!-- >= 1024px : frise verticale complète, comme un compte à rebours de
       mission, les 6 libellés toujours visibles. En dessous, la mise en page
       empile planète + contenu + frise : la liste complète n'a pas la place de
       tenir, elle est remplacée par la frise compacte ci-dessous (numéros
       seuls). Aucun texte n'est perdu : le titre complet de l'étape active
       reste affiché en entier par RoadmapContent. -->
  <!-- Racine unique (Vue n'hérite `class`/`$attrs` automatiquement que sur un
       composant à racine unique) : c'est ce noeud qui reçoit
       `class="roadmap__timeline scrim"` posé par RoadmapSection.vue, donc le
       voile de contraste AA s'applique quelle que soit la frise affichée à
       l'intérieur (liste complète ou compacte). -->
  <div class="rt-root">
    <ol class="rt-list">
      <li v-for="(step, index) in steps" :key="index" class="rt-item">
        <span
          :ref="(el) => setCircleRef(el as HTMLElement, index)"
          class="rt-circle"
          :class="getCircleClass(index)"
        />

        <span class="rt-label" :class="getTitleClass(index)">
          <span class="rt-label__step">Étape {{ index + 1 }}</span>
          <span class="rt-label__title">{{ step.title }}</span>
        </span>

        <span v-if="index < steps.length - 1" class="rt-connector">
          <span class="rt-connector__track" />
          <span :ref="(el) => setLineRef(el as HTMLElement, index)" class="rt-connector__fill" />
        </span>
      </li>
    </ol>

    <!-- < 1024px : frise compacte, 6 segments numérotés, l'étape active en accent.
         Chaque segment reste un vrai bouton de navigation directe (même rôle que
         les flèches ‹ › de RoadmapContent), avec le titre complet de l'étape en
         `aria-label` pour les lecteurs d'écran. -->
    <ol class="rt-compact" aria-label="Étapes du projet phare">
      <li v-for="(step, index) in steps" :key="`compact-${index}`" class="rt-compact__item">
        <button
          type="button"
          class="rt-compact__seg"
          :class="compactClass(index)"
          :aria-label="`Étape ${index + 1} : ${step.title}`"
          :aria-current="stepsStatus[index]?.active ? 'step' : undefined"
          @click="selectCompact(index + 1)"
        >
          {{ index + 1 }}
        </button>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StepStatus } from '~/types/roadmap'
import { useRoadmapState } from '~/composables/useRoadmapState'

const { currentStep, steps, registerCircle, registerLine, goToStep, introVisible, introActive } = useRoadmapState()

// Un segment de la frise compacte quitte l'introduction mobile, puis va à l'étape.
const selectCompact = (stepNumber: number) => {
  introVisible.value = false
  goToStep(stepNumber)
}

const setCircleRef = (el: HTMLElement | null, index: number) => {
  if (el) registerCircle(el, index)
}

const setLineRef = (el: HTMLElement | null, index: number) => {
  if (el) registerLine(el, index)
}

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

const getCircleClass = (index: number) => {
  const status = stepsStatus.value[index]
  if (!status) return 'is-future'
  if (status.active) return 'is-active'
  if (status.past) return 'is-past'
  return 'is-future'
}

const compactClass = (index: number) => (introActive.value ? '' : getCircleClass(index))

const getTitleClass = (index: number) => {
  const status = stepsStatus.value[index]
  return status?.active ? 'is-active' : ''
}
</script>

<style scoped>
.rt-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: none;
  flex-direction: column;
  gap: 0.8rem;
}

.rt-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.rt-circle {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  border: 1px solid var(--color-ink-dim);
  background: transparent;
  flex-shrink: 0;
  transition: background-color 0.8s var(--ease-slow), border-color 0.8s var(--ease-slow);
}

.rt-circle.is-past,
.rt-circle.is-active {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.rt-label {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  color: var(--color-ink-dim);
  transition: color 0.8s var(--ease-slow);
}

.rt-label.is-active {
  color: var(--color-ink);
}

.rt-label__step {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  line-height: 1.4;
  color: var(--color-ink-dim);
}

.rt-label__title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  line-height: 1.4;
}

.rt-connector {
  position: absolute;
  left: 0.25rem;
  top: 100%;
  width: 1px;
  height: 0.8rem;
}

.rt-connector__track {
  position: absolute;
  inset: 0;
  background: var(--color-line);
}

.rt-connector__fill {
  position: absolute;
  inset: 0;
  background: var(--color-accent);
  transform: scaleY(0);
  transform-origin: top center;
}

/* Frise compacte (< 1024px), voir commentaire dans le template : des
   chiffres Jost sans cadre, un filet sous l'étape active et les passées. */
.rt-compact {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.rt-compact__item {
  display: contents;
}

.rt-compact__seg {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  border: none;
  border-bottom: 1px solid transparent;
  background: transparent;
  color: var(--color-ink-dim);
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.8125rem;
  line-height: 1;
  cursor: pointer;
  flex-shrink: 0;
  transition: border-color 0.8s var(--ease-slow), color 0.8s var(--ease-slow);
}

.rt-compact__seg.is-past {
  color: var(--color-ink);
  border-bottom-color: var(--color-ink-dim);
}

.rt-compact__seg.is-active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}

.rt-compact__seg:hover {
  color: var(--color-accent);
}

@media (min-width: 1024px) {
  .rt-list {
    display: flex;
  }

  .rt-compact {
    display: none;
  }
}
</style>
