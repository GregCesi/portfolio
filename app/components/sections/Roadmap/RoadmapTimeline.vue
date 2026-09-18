<template>
  <!-- >= 768px : frise verticale (>= 1024px : horizontale, voir RoadmapSection.vue)
       complète, les 6 libellés toujours visibles. En dessous, la mise en page
       empile planète + contenu + frise (§2.2 point 4 de la spec) : la liste
       complète n'a pas la place de tenir sans déborder (mesuré : 129px de trop
       à 375x667), elle est donc remplacée par la frise compacte ci-dessous,
       même logique que la barre mobile du menu (§2.3 bis : "numéros visibles,
       libellé de l'actif seul") — aucun texte n'est perdu : le titre complet de
       l'étape active reste affiché en entier par RoadmapContent ("Étape X / 6"
       + titre + texte), qui, lui, n'est jamais coupé. -->
  <!-- Racine unique (Vue n'hérite `class`/`$attrs` automatiquement que sur un
       composant à racine unique) : c'est ce noeud qui reçoit
       `class="roadmap__timeline panel-inset"` posé par RoadmapSection.vue,
       donc le fond de protection AA (§2.3) s'applique quelle que soit la
       frise affichée à l'intérieur (liste complète ou compacte). -->
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

    <!-- < 768px : frise compacte, 6 segments numérotés, l'étape active en accent.
         Chaque segment reste un vrai bouton de navigation directe (même rôle que
         les flèches ‹ › de RoadmapContent), avec le titre complet de l'étape en
         `aria-label` pour les lecteurs d'écran. -->
    <ol class="rt-compact" aria-label="Étapes du projet phare">
      <li v-for="(step, index) in steps" :key="`compact-${index}`" class="rt-compact__item">
        <button
          type="button"
          class="rt-compact__seg"
          :class="getCircleClass(index)"
          :aria-label="`Étape ${index + 1} : ${step.title}`"
          :aria-current="stepsStatus[index]?.active ? 'step' : undefined"
          @click="goToStep(index + 1)"
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

const { currentStep, steps, registerCircle, registerLine, goToStep } = useRoadmapState()

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
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.rt-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.rt-circle {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 999px;
  border: 1px solid var(--color-line);
  background: transparent;
  flex-shrink: 0;
  transition: background-color 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
}

.rt-circle.is-past,
.rt-circle.is-active {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.rt-circle.is-active {
  transform: scale(1.35);
}

.rt-label {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-ink-dim);
  transition: color 0.25s ease;
}

.rt-label.is-active {
  color: var(--color-ink);
}

.rt-label__step {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.05em;
  color: var(--color-ink-dim);
  flex-shrink: 0;
}

.rt-label__title {
  font-family: var(--font-serif);
  font-weight: 500;
}

.rt-connector {
  position: absolute;
  left: 0.34rem;
  top: 100%;
  width: 2px;
  height: 0.6rem;
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

/* Frise compacte (< 768px), voir commentaire dans le template. */
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
  border-radius: 999px;
  border: 1px solid var(--color-line);
  /* Posé directement sur le canvas hyperspace : même fond opaque que les
     boutons `SubscreenNav` (§2.3), zéro risque pour "tient dans l'écran"
     puisque la boîte est déjà dimensionnée. */
  background-color: var(--panel-bg);
  color: var(--color-ink-dim);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  line-height: 1;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease, transform 0.25s ease;
}

.rt-compact__seg.is-past,
.rt-compact__seg.is-active {
  background-color: var(--color-accent);
  border-color: var(--color-accent);
  color: #0a0908;
}

.rt-compact__seg.is-active {
  transform: scale(1.15);
}

.rt-compact__seg:hover {
  border-color: var(--color-accent);
}

@media (max-width: 767.98px) {
  .rt-list {
    display: none;
  }
}

@media (min-width: 768px) {
  .rt-compact {
    display: none;
  }
}
</style>
