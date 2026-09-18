<template>
<div :ref="setContentRef" class="text-center text-white px-2">
    <!-- Titre de l'étape active -->
    <h3 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 light-shadow-text">
    {{ activeStep?.title }}
    </h3>

    <!-- Descriptions de l'étape active -->
    <div class="space-y-3 sm:space-y-4 mb-6 sm:mb-8 max-w-xl mx-auto content-panel">
    <p v-for="desc in activeStep?.descriptions" :key="desc" class="text-base sm:text-lg lg:text-xl">
        {{ desc }}
    </p>
    </div>

    <!-- Navigation avec icônes -->
    <div class="flex gap-6 sm:gap-8 justify-center items-center">
    <button
        :disabled="!canGoPrev"
        aria-label="Étape précédente"
        class="roadmap-nav-btn"
        @click="prevStepAnimated">
        ←
    </button>

    <button
        :disabled="!canGoNext"
        aria-label="Étape suivante"
        class="roadmap-nav-btn"
        @click="nextStepAnimated">
        →
    </button>
    </div>
</div>
</template>

<script setup lang="ts">
    import type { ComponentPublicInstance } from 'vue'

    const { activeStep, nextStepAnimated, prevStepAnimated, canGoNext, canGoPrev, registerContent } = useRoadmapState()

    // Fonction pour enregistrer l'élément de contenu dans le composable
    const setContentRef = (el: Element | ComponentPublicInstance | null) => {
      if (el && el instanceof HTMLElement) registerContent(el)
    }
</script>

<style scoped>
.content-panel {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 1rem;
  padding: 1rem 1.25rem;
}

/*
 * Flèches Précédent/Suivant de la Roadmap : un vrai contour de bouton
 * (fond + bordure plats, pas de dégradé) pour donner des états
 * survol/appui/désactivé nettement distincts, au-delà du seul contour de
 * focus générique du site.
 */
.roadmap-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background-color: rgba(0, 0, 0, 0.35);
  color: #ffffff;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.15s ease, opacity 0.2s ease;
}

@media (min-width: 640px) {
  .roadmap-nav-btn {
    width: 3.5rem;
    height: 3.5rem;
    font-size: 2rem;
  }
}

@media (min-width: 1024px) {
  .roadmap-nav-btn {
    width: 4rem;
    height: 4rem;
    font-size: 2.25rem;
  }
}

.roadmap-nav-btn:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.75);
}

.roadmap-nav-btn:active:not(:disabled) {
  transform: scale(0.92);
}

.roadmap-nav-btn:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 3px;
}

.roadmap-nav-btn:disabled {
  border-color: rgba(255, 255, 255, 0.12);
  background-color: rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.3);
  cursor: not-allowed;
}
</style>