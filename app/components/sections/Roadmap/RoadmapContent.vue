<template>
<div :ref="setContentRef" class="text-center text-white translate-x-16">
    <!-- Titre de l'étape active -->
    <h3 class="text-4xl font-bold mb-8 light-shadow-text">
    {{ activeStep?.title }}
    </h3>

    <!-- Descriptions de l'étape active -->
    <div class="space-y-4 mb-8 max-w-xl mx-auto">
    <p v-for="desc in activeStep?.descriptions" :key="desc" class="text-xl">
        {{ desc }}
    </p>
    </div>

    <!-- Navigation avec icônes -->
    <div class="flex gap-8 justify-center items-center">
    <button
        :disabled="!canGoPrev"
        class="text-6xl transition-all duration-300"
        :class="canGoPrev ? 'text-white hover:text-gray-300' : 'text-gray-600'"
        @click="prevStepAnimated">
        ←
    </button>

    <button
        :disabled="!canGoNext"
        class="text-6xl transition-all duration-300"
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