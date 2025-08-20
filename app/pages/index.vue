<template>
  <BackgroundHyperspace />
  <ClientOnly>
    <button class="text-white p-16" @click="triggerWarp">Test Warp</button>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app'
import BackgroundHyperspace from '@/components/background/BackgroundHyperspace.vue'

const { $emitter } = useNuxtApp()

function triggerWarp() {
  console.log('triggerWarp')
  $emitter.emit('accelerate-stars')
}
</script>
