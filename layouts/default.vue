<template>
  <div class="relative min-h-screen">
    <SpaceBackground />
    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>

<script setup>
import SpaceBackground from '~/components/Background/SpaceBackground.vue'
</script>