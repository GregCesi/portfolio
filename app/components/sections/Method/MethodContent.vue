<template>
  <div :ref="setContentRef" class="rc">
    <p class="rc__step">Étape {{ currentStep }} / {{ steps.length }}</p>
    <h3 class="rc__title">{{ activeStep?.title }}</h3>

    <div class="rc__text">
      <p v-for="desc in activeStep?.descriptions" :key="desc" class="t-body">{{ desc }}</p>
    </div>

    <div class="rc__nav">
      <button :disabled="prevDisabled" aria-label="Étape précédente" class="rc__btn" @click="onPrev">‹</button>
      <button :disabled="!canGoNext" aria-label="Étape suivante" class="rc__btn" @click="nextStepAnimated">›</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComponentPublicInstance } from 'vue'
import { useMethodState } from '~/composables/useMethodState'

const {
  currentStep,
  steps,
  activeStep,
  nextStepAnimated,
  prevStepAnimated,
  canGoNext,
  canGoPrev,
  registerContent,
  isMobileViewport,
  introVisible,
} = useMethodState()

// Sur mobile, « précédent » depuis la première étape revient à l'introduction
// (surtitre, titre, sous-titre) ; ailleurs il est désactivé à l'étape 1.
const prevDisabled = computed(() => !canGoPrev.value && !isMobileViewport.value)

function onPrev() {
  if (!canGoPrev.value && isMobileViewport.value) {
    introVisible.value = true
    return
  }
  void prevStepAnimated()
}

const setContentRef = (el: Element | ComponentPublicInstance | null) => {
  if (el && el instanceof HTMLElement) registerContent(el)
}
</script>

<style scoped>
.rc {
  text-align: left;
}

.rc__step {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.32em;
  color: var(--color-accent);
  margin-bottom: 0.5rem;
}

.rc__title {
  font-family: var(--font-display);
  font-weight: 300;
  text-transform: uppercase;
  font-size: clamp(1.1rem, 0.9rem + 0.7vw, 1.6rem);
  letter-spacing: 0.24em;
  line-height: 1.35;
  margin-bottom: 0.75rem;
}

.rc__text {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-width: 28rem;
}

.rc__text p:last-child {
  color: var(--color-ink-dim);
}

.rc__nav {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.6rem;
}

.rc__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
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

.rc__btn:hover:not(:disabled) {
  color: var(--color-accent);
}

.rc__btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
