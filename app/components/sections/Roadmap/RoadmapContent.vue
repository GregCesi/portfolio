<template>
  <div :ref="setContentRef" class="rc">
    <p class="rc__step">Étape {{ currentStep }} / {{ steps.length }}</p>
    <h3 class="rc__title">{{ activeStep?.title }}</h3>

    <div class="rc__text">
      <p v-for="desc in activeStep?.descriptions" :key="desc">{{ desc }}</p>
    </div>

    <div class="rc__nav">
      <button :disabled="!canGoPrev" aria-label="Étape précédente" class="rc__btn" @click="prevStepAnimated">‹</button>
      <button :disabled="!canGoNext" aria-label="Étape suivante" class="rc__btn" @click="nextStepAnimated">›</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { useRoadmapState } from '~/composables/useRoadmapState'

const { currentStep, steps, activeStep, nextStepAnimated, prevStepAnimated, canGoNext, canGoPrev, registerContent } =
  useRoadmapState()

const setContentRef = (el: Element | ComponentPublicInstance | null) => {
  if (el && el instanceof HTMLElement) registerContent(el)
}
</script>

<style scoped>
.rc {
  text-align: left;
}

.rc__step {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  color: var(--color-accent);
  margin-bottom: 0.35rem;
}

.rc__title {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: clamp(1.1rem, 0.95rem + 0.6vw, 1.6rem);
  line-height: 1.2;
  margin-bottom: 0.6rem;
}

.rc__text {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--color-ink-dim);
  max-width: 42ch;
}

.rc__nav {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.rc__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  border: 1px solid var(--color-line);
  background: transparent;
  color: var(--color-ink);
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, transform 0.15s ease, opacity 0.2s ease;
}

.rc__btn:hover:not(:disabled) {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.rc__btn:active:not(:disabled) {
  transform: scale(0.92);
}

.rc__btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
