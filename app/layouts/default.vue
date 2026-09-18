<template>
  <BackgroundHyperspace />
  <!--
    Voiles noirs à bords fondus, entre le canvas et l'interface : ils gardent
    le Header, le repère de section, le menu latéral et la barre mobile lisibles
    (contraste AA) sans fond de carte ni cadre.
  -->
  <div class="veil veil--top" aria-hidden="true" />
  <div class="veil veil--menu" aria-hidden="true" />
  <div class="veil veil--bar" aria-hidden="true" />
  <div class="relative">
    <Header />
    <slot />
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/layout/Header.vue'
import BackgroundHyperspace from '~/components/background/BackgroundHyperspace.vue'
</script>

<style scoped>
.veil {
  position: fixed;
  z-index: -5;
  pointer-events: none;
}

.veil--top {
  top: 0;
  left: 0;
  right: 0;
  height: 6.5rem;
  background: linear-gradient(
    to bottom,
    rgb(var(--bg-rgb) / 97%) 0,
    rgb(var(--bg-rgb) / 97%) 4.25rem,
    rgb(var(--bg-rgb) / 0%) 100%
  );
}

.veil--menu {
  display: none;
}

.veil--bar {
  left: 0;
  right: 0;
  bottom: 0;
  height: 5.5rem;
  background: linear-gradient(
    to top,
    rgb(var(--bg-rgb) / 97%) 0,
    rgb(var(--bg-rgb) / 97%) 3rem,
    rgb(var(--bg-rgb) / 0%) 100%
  );
}

@media (min-width: 768px) {
  .veil--menu {
    display: block;
    left: 0;
    top: 22vh;
    bottom: 22vh;
    width: 16rem;
    background: radial-gradient(
      ellipse 100% 60% at 0% 50%,
      rgb(var(--bg-rgb) / 97%) 0,
      rgb(var(--bg-rgb) / 97%) 55%,
      rgb(var(--bg-rgb) / 0%) 100%
    );
  }

  .veil--bar {
    display: none;
  }
}
</style>
