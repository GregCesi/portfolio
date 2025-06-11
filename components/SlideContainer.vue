<template>
  <div ref="container" class="h-screen overflow-hidden">
    <div ref="wrapper">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useNuxtApp } from '#app'

// Définition des props avec types
interface Props {
  scrollThreshold?: number
  transitionDuration?: number
}

const props = withDefaults(defineProps<Props>(), {
  scrollThreshold: 50,
  transitionDuration: 0.8,
})

// Références typées
const container = ref<HTMLElement | null>(null)
const wrapper = ref<HTMLElement | null>(null)
const current = ref(0)
const slides = ref<HTMLElement[]>([])
let isAnimating = false
let wheelDelta = 0
let touchStartY = 0
let touchDelta = 0

const { $gsap, $emitter } = useNuxtApp()

function goTo(index: number) {
  if (!wrapper.value || index === current.value || isAnimating || index < 0 || index >= slides.value.length) {
    return
  }

  isAnimating = true
  window.removeEventListener('wheel', onWheel)
  
  $gsap.timeline({
    onComplete() {
      current.value = index
      isAnimating = false
      wheelDelta = 0
      window.addEventListener('wheel', onWheel, { passive: false })
    }
  })
    .to(slides.value[current.value], { autoAlpha: 0, duration: 0.3 })
    .add(() => $emitter.emit('accelerate-stars', props.transitionDuration))
    .to(wrapper.value, { 
      y: -index * window.innerHeight, 
      duration: props.transitionDuration 
    })
    .fromTo(
      slides.value[index], 
      { autoAlpha: 0 }, 
      { autoAlpha: 1, duration: 0.3 }
    )
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  wheelDelta += e.deltaY
  if (Math.abs(wheelDelta) >= props.scrollThreshold) {
    const dir = wheelDelta > 0 ? 1 : -1
    goTo(current.value + dir)
  }
}

function onTouchStart(e: TouchEvent) {
  touchStartY = e.touches[0].clientY
}

function onTouchMove(e: TouchEvent) {
  e.preventDefault()
  touchDelta = touchStartY - e.touches[0].clientY
  if (Math.abs(touchDelta) >= props.scrollThreshold) {
    const dir = touchDelta > 0 ? 1 : -1
    goTo(current.value + dir)
    touchStartY = e.touches[0].clientY
  }
}

function onTouchEnd() {
  touchDelta = 0
}

onMounted(() => {
  if (!wrapper.value) return
  // Initialisation des slides
  slides.value = Array.from(wrapper.value.children) as HTMLElement[]
  // Configuration initiale
  if (slides.value.length > 0) {
    $gsap.set(slides.value, { autoAlpha: 0 })
    $gsap.set(slides.value[0], { autoAlpha: 1 })
  }
  // Ajout des écouteurs
  window.addEventListener('wheel', onWheel, { passive: false })
  if (container.value) {
    container.value.addEventListener('touchstart', onTouchStart, { passive: false })
    container.value.addEventListener('touchmove', onTouchMove, { passive: false })
    container.value.addEventListener('touchend', onTouchEnd)
  }
})

onBeforeUnmount(() => {
  // Nettoyage des écouteurs
  window.removeEventListener('wheel', onWheel)
  if (container.value) {
    container.value.removeEventListener('touchstart', onTouchStart)
    container.value.removeEventListener('touchmove', onTouchMove)
    container.value.removeEventListener('touchend', onTouchEnd)
  }
})

defineExpose({
  goTo,
})
</script>