<template>
  <header class="site-header">
    <div class="site-header__inner">
      <p class="site-header__name">{{ siteContent.global.name }}</p>
      <p class="site-header__title">{{ siteContent.global.headerTitle }}</p>
    </div>
  </header>
</template>

<script setup lang="ts">
import { siteContent } from '~/data/content'
</script>

<style scoped>
/* Nom et titre posés sur le noir, comme un carton en coin d'écran (§2.3 bis) :
   ni cadre, ni fond, le voile du layout garantit le contraste. */
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
}

.site-header__inner {
  padding: 1rem 1.25rem 0.85rem;
}

.site-header__name {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.34em;
  color: var(--color-ink);
}

.site-header__title {
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
  color: var(--color-ink-dim);
  margin-top: 0.3rem;
}

@media (min-width: 768px) {
  .site-header__inner {
    padding: 1.4rem 1.5rem 0.8rem;
  }

  .site-header__name {
    font-size: 0.875rem;
  }
}

@media (min-width: 1280px) {
  .site-header__inner {
    padding: 1.6rem 2.5rem 1.1rem;
  }
}
</style>
