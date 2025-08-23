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
        @click="prevStepAnimated"
        :disabled="!canGoPrev"
        class="text-4xl transition-all duration-300"
        :class="canGoPrev ? 'text-white hover:text-gray-300' : 'text-gray-600'">
        ←
    </button>

    <button
        @click="nextStepAnimated"
        :disabled="!canGoNext"
        class="text-4xl transition-all duration-300"
        :class="canGoNext ? 'text-white hover:text-gray-300' : 'text-gray-600'">
        →
    </button>
    </div>
</div>
</template>

<script setup lang="ts">
    const { activeStep, nextStepAnimated, prevStepAnimated, canGoNext, canGoPrev, currentStep, registerContent } = useRoadmapState()

    // Fonction pour enregistrer l'élément de contenu dans le composable
    const setContentRef = (el: any) => {
      if (el && el instanceof HTMLElement) registerContent(el)
    }
</script>