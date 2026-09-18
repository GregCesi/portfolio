<template>
  <section ref="sectionRef" class="section-viewport">
    <div class="section-scroll-area">
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

/*
 * Défilement interne : quand le contenu d'une section dépasse la hauteur
 * disponible (frise, cartes, surtout sur mobile), il défile ici en premier.
 * SlideContainer ne change de section que lorsque ce conteneur atteint
 * une butée haute ou basse (voir `.overflow-hidden` > SlideContainer.vue).
 */
.section-scroll-area {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.35) transparent;
}

.section-scroll-area::-webkit-scrollbar {
  width: 6px;
}

.section-scroll-area::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.35);
  border-radius: 999px;
}
</style>
