<template>
  <div class="flex flex-col">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="flex items-start gap-4"
    >
      <div class="flex flex-col items-center">
        <div v-if="index > 0" class="w-px h-14 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-full bg-gray-500" />
          <div
            :ref="(el) => setLine(el as HTMLElement, index - 1)"
            class="absolute top-0 left-0 w-full h-full bg-white"
          />
        </div>
        <div
          :ref="(el) => setCircle(el as HTMLElement, index)"
          class="w-8 h-8 rounded-full border-2 bg-gray-600 border-gray-600"
        />
      </div>
      <p
        :ref="(el) => setText(el as HTMLElement, index)"
        class="text-white opacity-70 transition-all duration-300 text-lg"
        :class="index > 0 ? 'place-self-end -translate-y-1' : 'mt-1'"
      >
        Etape {{ index + 1 }} : {{ step.title }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'

interface Step {
  title: string;
  descriptions: string[];
  model: string;
}

const props = defineProps<{
  steps: Step[];
  activeStep: number;
}>();

const lines = ref<HTMLElement[]>([]);
const circles = ref<HTMLElement[]>([]);
const texts = ref<HTMLElement[]>([]);

function setActiveText(el: HTMLElement) {
  el.classList.add("font-bold", "light-shadow-text");
  el.classList.remove("opacity-70");
}

function setInactiveText(el: HTMLElement) {
  el.classList.remove("font-bold", "light-shadow-text");
  if (!el.classList.contains("opacity-70")) {
    el.classList.add("opacity-70");
  }
}

function setLine(el: HTMLElement | null, index: number) {
  if (el) lines.value[index] = el
}
function setCircle(el: HTMLElement | null, index: number) {
  if (el) circles.value[index] = el
}
function setText(el: HTMLElement | null, index: number) {
  if (el) texts.value[index] = el
}

const { $gsap } = useNuxtApp()

onMounted(() => {
  lines.value.forEach((line, idx) => {
    if (line) {
      $gsap.set(line, {
        scaleY: idx < props.activeStep ? 1 : 0,
        transformOrigin: 'top center',
      })
    }
  })
  activateCircle(props.activeStep)
})

function expandLine(index: number) {
  const line = lines.value[index]
  return new Promise<void>((resolve) => {
    if (!line) {
      resolve()
      return
    }
     $gsap.fromTo(
      line,
      { scaleY: 0, transformOrigin: 'top center' },
      { scaleY: 1, duration: 1, ease: 'power1.inOut', onComplete: resolve }
    )
  })
}

function collapseLine(index: number) {
  const line = lines.value[index]
  return new Promise<void>((resolve) => {
    if (!line) {
      resolve()
      return
    }
    $gsap.fromTo(
      line,
      { scaleY: 1, transformOrigin: 'top center' },
      { scaleY: 0, duration: 1, ease: 'power1.inOut', onComplete: resolve }
    )
  })
}

function updateCircles(activeIndex: number) {
  circles.value.forEach((circle, idx) => {
    if (!circle) return
    if (idx === activeIndex) {
      circle.classList.add('pulse')
      $gsap.set(circle, {
        backgroundColor: '#ffffff',
        borderColor: '#ffffff',
        boxShadow: '0 0 6px rgba(255,255,255,0.6)',
        scale: 1,
      })
      if (texts.value[idx]) setActiveText(texts.value[idx]);
    } else {
      circle.classList.remove('pulse')
      const color = idx < activeIndex ? '#ffffff' : '#4b5563'
      $gsap.set(circle, {
        backgroundColor: color,
        borderColor: color,
        boxShadow: 'none',
        scale: 1,
      })
      if (texts.value[idx]) setInactiveText(texts.value[idx]);
    }
  })
}

function activateCircle(index: number) {
  updateCircles(index)
}

function deactivateCircle(index: number) {
  const circle = circles.value[index]
  if (circle) {
    circle.classList.remove('pulse')
    $gsap.set(circle, {
      backgroundColor: '#4b5563',
      borderColor: '#4b5563',
      boxShadow: 'none',
      scale: 1,
    })
  }
  const text = texts.value[index];
  if (text) {
    setInactiveText(text);
  }
}

function removePulse(index: number) {
  const circle = circles.value[index]
  if (circle) {
    circle.classList.remove('pulse')
  }
  const text = texts.value[index];
  if (text) {
    setInactiveText(text);
  }
}

function pulseCircle(index: number) {
  updateCircles(index)
  return Promise.resolve()
}

defineExpose({ expandLine, collapseLine, activateCircle, deactivateCircle, removePulse, pulseCircle })
</script>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
}

.pulse {
  animation: pulse 1.5s infinite;
}
</style>