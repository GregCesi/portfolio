<template>
  <div class="flex flex-col">
     <div
      v-for="(step, index) in steps"
      :key="index"
      class="flex items-start gap-4 transition-all duration-300"
      :class="{
        'opacity-100': index <= activeStep,
        'opacity-50': index > activeStep,
        'pointer-events-none': isAnimating
      }"
    >
      <div class="flex flex-col items-center">
        <div 
          v-if="index > 0" 
          class="w-px h-16 relative overflow-hidden"
          :style="{'--progress': index < activeStep ? 1 : (index === activeStep ? progress : 0)}"
        >
          <div class="absolute top-0 left-0 w-full h-full bg-gray-500" />
          <div 
            class="absolute top-0 left-0 w-full h-full bg-white transition-all duration-1000" 
            :style="{ 
              transform: `scaleY(${index < activeStep ? 1 : (index === activeStep ? progress : 0)})`,
              transformOrigin: 'top center'
            }" 
          />
        </div>
        <div
          :class="[indicatorClass(index), index === activeStep ? 'animate-pulse' : '']"
          class="w-8 h-8 rounded-full border-2 transition-all duration-[300ms] transform"
        />
        
      </div>
      <p 
        :class="[
          'text-white transition-all duration-300',
          index === activeStep ? 'light-shadow-text font-bold' : 'opacity-70',
          index > 0 ? 'place-self-end -translate-y-1' : 'mt-1'
        ]"
      >
        Etape {{ index + 1 }} : {{ step.title }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Ajout d'une animation de pulse personnalisée */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
}

.animate-pulse {
  animation: pulse 3s infinite;
}

/* Transition pour le changement d'opacité */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

interface Step {
  title: string;
  descriptions: string[];
  model: string;
}

const props = defineProps<{ 
  steps: {
    title: string;
    descriptions: string[];
    model: string;
  }[]; 
  activeStep: number;
  isAnimating: boolean;
}>();
const progress = ref(0);

// Fonction pour déterminer la classe de l'indicateur
function indicatorClass(index: number) {
  if (index < props.activeStep) return "bg-white border-white";
  if (index === props.activeStep) return "bg-white border-white shadow";
  return "bg-gray-600 border-gray-600";
}

// Fonction pour animer la progression
function animateProgress() {
  progress.value = 0;
  let start: number | null = null;
  const duration = 1000; // durée de l'animation en ms

  function step(timestamp: number) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    const progressValue = Math.min(elapsed / duration, 1);
    progress.value = progressValue;

    if (progressValue < 1) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}

// Observer les changements d'étape active
watch(() => props.activeStep, () => {
  animateProgress();
});

// Initialiser l'animation au montage
onMounted(() => {
  animateProgress();
});
</script>