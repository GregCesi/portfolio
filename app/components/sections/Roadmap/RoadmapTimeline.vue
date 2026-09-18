<template>
  <div class="flex flex-col gap-8 sm:gap-10 lg:gap-8">

    <div v-for="(step, index) in steps" :key="index" class="relative flex items-center gap-4 sm:gap-6">

      <!-- Cercle vide -->
      <div
:ref="(el) => setCircleRef(el as HTMLElement, index)"
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-300 shrink-0"
            :class="getCircleClass(index)"/>

      <!-- Titre -->
      <div
class="transition-all duration-300 text-base sm:text-lg lg:text-xl"
            :class="getTitleClass(index)">
        Étape {{ index + 1 }} : {{ step.title }}
      </div>

      <!-- Ligne vers le bas (sauf pour le dernier) -->
      <div v-if="index < steps.length - 1" class="absolute left-4 sm:left-5 top-8 sm:top-10 w-0.5 h-8 sm:h-10 lg:h-8">
        <!-- Ligne grise (toujours visible) -->
        <div class="w-full h-full bg-gray-600" />

        <!-- Ligne blanche (animée par GSAP) -->
        <div
:ref="(el) => setLineRef(el as HTMLElement, index)"
             class="absolute inset-0 w-full h-full bg-white origin-top"
             style="transform: scaleY(0);" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { StepStatus } from '~/types/roadmap'
  
  const { currentStep, steps, registerCircle, registerLine } = useRoadmapState()

  // Fonction pour enregistrer les cercles dans le composable
  const setCircleRef = (el: HTMLElement | null, index: number) => {
    if (el) registerCircle(el, index)
  }

  // Fonction pour enregistrer les lignes blanches dans le composable  
  const setLineRef = (el: HTMLElement | null, index: number) => {
    if (el) registerLine(el, index)
  }

  // Computed qui calcule l'état de chaque étape (typé)
  const stepsStatus = computed((): StepStatus[] => {
    return steps.value.map((_, index) => {
      const stepNumber = index + 1
      return {
        active: stepNumber === currentStep.value,
        past: stepNumber < currentStep.value,
        future: stepNumber > currentStep.value
      }
    })
  })

  // Classes pour les cercles (optimisées + sécurisées)
  const getCircleClass = (index: number) => {
    const status = stepsStatus.value[index]
    if (!status) return 'bg-gray-600 border-gray-600' // Fallback sécurisé
    
    if (status.active) return 'bg-white border-white pulse'
    if (status.past) return 'bg-white border-white'
    return 'bg-gray-600 border-gray-600'
  }

  // Classes pour les titres (optimisées + sécurisées)
  const getTitleClass = (index: number) => {
    const status = stepsStatus.value[index]
    if (!status) return 'text-gray-400 font-normal' // Fallback sécurisé
    
    if (status.active) return 'text-white font-bold light-shadow-text'
    return 'text-gray-400 font-normal'
  }

  // Plus besoin de getLineAnimationClass - GSAP gère tout

  // Plus besoin de watcher, tout géré par les classes
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 12px rgba(255, 255, 255, 0);
  }
}

.pulse {
  animation: pulse 2s infinite;
}

/* Classes pour l'animation des lignes */
.scale-y-0 {
  transform: scaleY(0);
}

.scale-y-100 {
  transform: scaleY(1);
}

.origin-top {
  transform-origin: top center;
}
</style>