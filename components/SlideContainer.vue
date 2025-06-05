<template>
  <div ref="container" class="h-screen overflow-hidden">
    <div ref="wrapper">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useNuxtApp } from '#app'

const container = ref(null)
const wrapper = ref(null)
const current = ref(0)
let slides = []
let isAnimating = false

const { $gsap, $emitter } = useNuxtApp()

function goTo(index) {
  if (index === current.value || isAnimating || index < 0 || index >= slides.length) return
  isAnimating = true
  $gsap.timeline({
    onComplete() {
      current.value = index
      isAnimating = false
    }
  })
    .to(slides[current.value], { autoAlpha: 0, duration: 0.3 })
    .add(() => $emitter.emit('accelerate-stars'))
    .to(wrapper.value, { y: -index * window.innerHeight, duration: 0.5 })
    .add(() => $emitter.emit('normalize-stars'))
    .fromTo(slides[index], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 })
}

function onWheel(e) {
  e.preventDefault()
  const dir = e.deltaY > 0 ? 1 : -1
  goTo(current.value + dir)
}

onMounted(() => {
  slides = Array.from(wrapper.value.children)
  $gsap.set(slides.slice(1), { autoAlpha: 0 })
  window.addEventListener('wheel', onWheel, { passive: false })
})

onBeforeUnmount(() => {
  window.removeEventListener('wheel', onWheel)
})
</script>

<style scoped>
.slide {
  height: 100vh;
}
</style>
