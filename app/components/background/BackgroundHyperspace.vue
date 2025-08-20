<template>
  <canvas
    ref="canvas"
    class="fixed inset-0 -z-10"
    style="pointer-events:none"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useNuxtApp } from '#app'
import HyperspaceRenderer from '@/graphics/background/Renderer'
import StarsField from '@/graphics/background/StarsField'
import WarpEffect from '@/graphics/background/WarpEffect'

const canvas = ref<HTMLCanvasElement | null>(null)
let renderer: HyperspaceRenderer
let starsField: StarsField
let warpEffect: WarpEffect

const { $emitter } = useNuxtApp()

onMounted(() => {
  if (!canvas.value) return

  renderer = new HyperspaceRenderer(canvas.value)
  renderer.init()
  starsField = new StarsField()
  warpEffect = new WarpEffect(starsField)

  renderer.register(starsField)
  renderer.register(warpEffect)
  renderer.start()

  console.log('warpEffect', warpEffect)


  // écoute de l'event pour déclencher le warp
  $emitter.on('accelerate-stars', (duration?: number) => warpEffect.start())
})

onUnmounted(() => {
  // cleanup
  $emitter.off('accelerate-stars', (duration?: number) => warpEffect.start())
  renderer.stop()
})
</script>
