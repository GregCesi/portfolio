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
        >
          <div class="absolute top-0 left-0 w-full h-full bg-gray-500" />
          <div
            :ref="el => setLine(el, index - 1)"
            class="absolute top-0 left-0 w-full h-full bg-white"
          />
        </div>
        <div
          :ref="el => setCircle(el, index)"
          :class="[indicatorClass(index), pulseIndex === index ? 'animate-pulse' : '']"
          class="w-8 h-8 rounded-full border-2 transition-all duration-[300ms] transform"
        />
      </div>
      <p 
        :ref="el => setText(el, index)"
        :class="[
          'text-white transition-all duration-300',
          pulseIndex === index ? 'light-shadow-text font-bold' : 'opacity-70',
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
import { ref, watch } from 'vue'
import { useNuxtApp } from '#app'

interface Step {
  title: string
  descriptions: string[]
  model: string
}

const props = defineProps<{
  steps: Step[]
  activeStep: number
  isAnimating: boolean
}>()

const lines = ref<HTMLElement[]>([])
const circles = ref<HTMLElement[]>([])
const texts = ref<HTMLElement[]>([])
const pulseIndex = ref(props.activeStep)

function setLine(el: HTMLElement | null, index: number) {
  if (el) lines.value[index] = el
}
function setCircle(el: HTMLElement | null, index: number) {
  if (el) circles.value[index] = el
}
function setText(el: HTMLElement | null, index: number) {
  if (el) texts.value[index] = el
}

function indicatorClass(index: number) {
  if (index < props.activeStep) return 'bg-white border-white light-shadow'
  if (index === props.activeStep) return 'bg-white border-white light-shadow'
  return 'bg-gray-600 border-gray-600'
}

const { $gsap } = useNuxtApp()

onMounted(() => {
  lines.value.forEach((line, idx) => {
    if (line) {
      $gsap.set(line, { scaleY: idx < props.activeStep ? 1 : 0, transformOrigin: 'top center' })
    }
  })
})

function animateToStep(newIndex: number) {
  return new Promise<void>((resolve) => {
    pulseIndex.value = -1
    const dir = newIndex > props.activeStep ? 1 : -1
    const lineIndex = dir > 0 ? props.activeStep : newIndex
    const line = lines.value[lineIndex]
    if (!line) {
      pulseIndex.value = newIndex
      resolve()
      return
    }

    // Animation différente selon la direction
    if (dir > 0) {
      // Animation pour la flèche droite (du haut vers le bas)
      $gsap.fromTo(
        line,
        {
          scaleY: 0,
          transformOrigin: 'top center',
        },
        {
          scaleY: 1,
          duration: 1,
          ease: 'power1.inOut',
          onComplete() {
            pulseIndex.value = newIndex
            resolve()
          },
        }
      )
    } else {
      // Animation pour la flèche gauche (du bas vers le haut)
      $gsap.fromTo(
        line,
        {
          scaleY: 0,
          transformOrigin: 'bottom center',
        },
        {
          scaleY: 0,
          duration: 1,
          ease: 'power1.inOut',
          onComplete() {
            pulseIndex.value = newIndex
            resolve()
          },
        }
      )
    }
  })
}

watch(
  () => props.activeStep,
  (val) => {
    pulseIndex.value = val
  }
)

defineExpose({ animateToStep })
</script>