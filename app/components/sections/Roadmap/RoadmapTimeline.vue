<template>
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StepStatus } from '~/types/roadmap'
import { useRoadmapState } from '~/composables/useRoadmapState'

const { currentStep, steps, registerCircle, registerLine } = useRoadmapState()

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
</style>
