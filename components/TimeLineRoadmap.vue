<template>
  <div class="flex flex-col">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="flex items-start gap-4"
    >
      <div class="flex flex-col items-center">
        <div v-if="index > 0" class="w-px h-16 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-full bg-gray-500" />
          <div
            :ref="el => setLine(el, index - 1)"
            class="absolute top-0 left-0 w-full h-full bg-white"
          />
        </div>
        <div
          :ref="el => setCircle(el, index)"
          class="w-8 h-8 rounded-full border-2 bg-gray-600 border-gray-600"
        />
      </div>
      <p
        :ref="el => setText(el, index)"
        class="text-white opacity-70 transition-all duration-300"
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
  title: string
  descriptions: string[]
  model: string
}

const props = defineProps<{
  steps: Step[]
  activeStep: number
}>()

const lines = ref<HTMLElement[]>([])
const circles = ref<HTMLElement[]>([])
const texts = ref<HTMLElement[]>([])

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
  circles.value.forEach((circle, idx) => {
    if (!circle) return
    if (idx === props.activeStep) {
      activateCircle(idx)
    } else if (idx < props.activeStep) {
      activateCircle(idx)
      $gsap.set(circle, { scale: 1 })
    }
  })
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
      { scaleY: 1, transformOrigin: 'bottom center' },
      { scaleY: 0, duration: 1, ease: 'power1.inOut', onComplete: resolve }
    )
  })
}

function activateCircle(index: number) {
  const circle = circles.value[index]
  if (circle) {
    $gsap.set(circle, {
      backgroundColor: '#ffffff',
      borderColor: '#ffffff',
      boxShadow: '0 0 6px rgba(255,255,255,0.6)',
    })
  }
}

function deactivateCircle(index: number) {
  const circle = circles.value[index]
  if (circle) {
    $gsap.set(circle, {
      backgroundColor: '#4b5563',
      borderColor: '#4b5563',
      boxShadow: 'none',
      scale: 1,
    })
  }
}

function pulseCircle(index: number) {
  const circle = circles.value[index]
  return new Promise<void>((resolve) => {
    if (!circle) {
      resolve()
      return
    }
    $gsap.fromTo(
      circle,
      { scale: 1 },
      {
        scale: 1.1,
        boxShadow: '0 0 0 10px rgba(255,255,255,0)',
        duration: 0.6,
        yoyo: true,
        repeat: 1,
        onComplete: resolve,
      }
    )
  })
}

defineExpose({ expandLine, collapseLine, activateCircle, deactivateCircle, pulseCircle })
</script>