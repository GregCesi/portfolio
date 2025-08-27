<template>
  <section class="section-viewport" ref="sectionRef">
    <slot />
  </section>
</template>

<script setup lang="ts">
import { useLayoutDimensions } from '~/composables/useLayoutDimensions'

// Initialiser la mesure des dimensions réelles
useLayoutDimensions()
</script>

<style scoped>
.section-viewport {
  height: 100vh;
  width: calc(100vw - var(--slidemenu-width, 0px));
  padding-top: var(--header-height, 80px);
  margin-left: var(--slidemenu-width, 0px);
  box-sizing: border-box;
  position: relative;
}
</style>
