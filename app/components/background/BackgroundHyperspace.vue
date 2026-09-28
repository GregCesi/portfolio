<template>
  <canvas
    ref="canvas"
    class="fixed inset-0 -z-10"
    :style="{
      'transform': 'translateZ(0)', // Active l'accélération matérielle
      'will-change': 'transform', // Prévient le navigateur des changements
      'pointer-events': 'none' // Permet les clics à travers le canvas
    }"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useNuxtApp } from '#app'
import Renderer from '@/graphics/background/Renderer'
import StarsField from '@/graphics/background/StarsField'
import WarpEffect from '@/graphics/background/WarpEffect'
import ReadingZones from '@/graphics/background/ReadingZones'
import { usePrefersReducedMotion } from '~/composables/usePrefersReducedMotion'
import { DEPART_DURATION, TRAVEL_DURATION, ARRIVE_DURATION } from '~/composables/useDepthTransition'

const canvas = ref<HTMLCanvasElement | null>(null)
let renderer: Renderer
let starsField: StarsField
let warpEffect: WarpEffect
let zones: ReadingZones

const { $emitter } = useNuxtApp()
const prefersReducedMotion = usePrefersReducedMotion()

const accelerate = () => {
  // Le texte bouge pendant la transition : les zones de lecture suivent à chaque image.
  zones.boost(3000)
  // `prefers-reduced-motion` : warp atténué et raccourci (§2.3 de la spec), inchangé par EXE-49.
  if (prefersReducedMotion.value) {
    warpEffect.start(0.25, 2)
  } else {
    // Même découpage en trois phases que le changement de section « en
    // profondeur » (voir useDepthTransition) : les étoiles accélèrent, filent,
    // puis freinent jusqu'au repos pile quand le texte entrant se pose.
    warpEffect.journey(DEPART_DURATION, TRAVEL_DURATION, ARRIVE_DURATION, 4)
  }
}

onMounted(() => {
  if (!canvas.value) return

  renderer = new Renderer(canvas.value)
  renderer.init()

  starsField = new StarsField()
  zones = new ReadingZones()
  starsField.setZones(zones)
  warpEffect = new WarpEffect(starsField)

  renderer.register(starsField)
  renderer.register(warpEffect)
  renderer.start()

  // Écoute de l'event pour déclencher le warp (identique à l'original)
  $emitter.on('accelerate-stars', accelerate)
})

onUnmounted(() => {
  $emitter.off('accelerate-stars', accelerate)
  warpEffect.destroy()
  renderer.destroy()
})
</script>

<style scoped>
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -10;
  pointer-events: none;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
