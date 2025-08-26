<template>
  <section class="section-viewport" ref="sectionRef">
    <div class="w-full max-w-7xl text-center mx-auto flex flex-col gap-6 sm:gap-12 h-full items-center justify-center px-4 sm:px-6 lg:px-8">
      <slot />
    </div>
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
