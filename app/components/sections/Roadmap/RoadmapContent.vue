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
        class="text-4xl sm:text-5xl lg:text-6xl transition-all duration-300 focus-visible:scale-110"
        :class="canGoPrev ? 'text-white hover:text-gray-300' : 'text-gray-600'"
        @click="prevStepAnimated">
        ←
    </button>

    <button
        :disabled="!canGoNext"
        aria-label="Étape suivante"
        class="text-4xl sm:text-5xl lg:text-6xl transition-all duration-300 focus-visible:scale-110"
        :class="canGoNext ? 'text-white hover:text-gray-300' : 'text-gray-600'"
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
</style>