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
/* Instrument de bord, sans capsule ni lueur (§2.3 bis de la spec) : un simple
   bloc mono/serif posé en haut à gauche. */
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;
}

/*
 * Fond plat opaque (`--panel-bg`, même traitement que `.panel`) : le nom
 * est persistant sur les 5 sections, posé directement sur le canvas
 * hyperspace animé. Sans ce fond, une étoile blanche pleine derrière le
 * glyphe fait chuter le contraste à ~1,21:1 (mesuré sur pixels réels,
 * feedback-2.md) — corrigé ici, tient >= 4,5:1 dans le pire cas.
 */
.site-header__inner {
  padding: 1rem 1.25rem 0.85rem;
  background-color: var(--panel-bg);
  border: 1px solid var(--color-line);
}

.site-header__name {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: 1rem;
  color: var(--color-ink);
  letter-spacing: 0.01em;
}

.site-header__title {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  color: var(--color-ink-dim);
  margin-top: 0.15rem;
}

@media (min-width: 768px) {
  .site-header__inner {
    padding: 1.5rem 2.5rem 1.1rem;
  }

  .site-header__name {
    font-size: 1.15rem;
  }

  .site-header__title {
    font-size: 0.72rem;
  }
}
</style>
