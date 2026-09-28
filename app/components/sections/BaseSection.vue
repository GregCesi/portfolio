<template>
  <section ref="sectionRef" class="section-viewport" :class="{ 'section-viewport--full-bleed': props.fullBleed }">
    <p class="section-marker" aria-hidden="true">{{ paddedIndex }} / {{ paddedTotal }}</p>
    <div class="section-inner">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLayoutDimensions } from '~/composables/useLayoutDimensions'

interface Props {
  /** Numéro 1-based de la section (repère Jost "01 / 05", §2.3 bis de la spec). */
  index: number
  total?: number
  /**
   * Ignore la réserve latérale normalement faite pour le nav desktop
   * (`--slidemenu-width`) : la section retrouve une marge symétrique, centrée
   * sur la largeur réelle de la fenêtre plutôt que sur l'espace qui reste à
   * droite du nav. Réservé aux sections dont le contenu est centré (le nav,
   * en `position: fixed`, reste au-dessus en z-index quoi qu'il arrive).
   */
  fullBleed?: boolean
}

const props = withDefaults(defineProps<Props>(), { total: 5, fullBleed: false })

const paddedIndex = computed(() => String(props.index).padStart(2, '0'))
const paddedTotal = computed(() => String(props.total).padStart(2, '0'))

// Initialiser la mesure des dimensions réelles (hauteur du header, du nav)
useLayoutDimensions()
</script>

<style scoped>
/*
 * Chaque section tient entièrement dans la fenêtre, sans défilement interne
 * (§2.3 de la spec) : la hauteur exacte est fixée par `useLayoutDimensions`
 * (hauteur de la fenêtre moins le Header et, sur mobile, le nav horizontal).
 */
.section-viewport {
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  /* Repli avant que useLayoutDimensions n'ait mesuré le rendu réel. */
  padding-top: calc(var(--header-height, 64px) + 1rem);
  padding-bottom: calc(var(--mobile-bar-height, 52px) + 0.75rem);
}

@media (min-width: 768px) {
  .section-viewport {
    padding-top: calc(var(--header-height, 80px) + 0.5rem);
    padding-bottom: 1.25rem;
    padding-left: var(--slidemenu-width, 0px);
    padding-right: 1.5rem;
  }

  .section-viewport.section-viewport--full-bleed {
    padding-left: var(--pad-x);
    padding-right: var(--pad-x);
  }
}

/*
 * Repère « 01 / 05 » : Jost, capitales espacées, posé sur le noir du voile du
 * layout (aucun cadre ni fond). Déjà en position absolue : aucune hauteur
 * ajoutée au flux, aucun risque pour la contrainte « tient dans l'écran ».
 */
.section-marker {
  position: absolute;
  top: 0.9rem;
  right: 1.25rem;
  margin: 0;
  z-index: 1;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.75rem;
  letter-spacing: 0.32em;
  color: var(--color-ink-dim);
}

@media (min-width: 768px) {
  .section-marker {
    top: 1.7rem;
    right: 2.5rem;
  }
}

.section-inner {
  height: 100%;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
