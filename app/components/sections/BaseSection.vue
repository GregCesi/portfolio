<template>
  <section ref="sectionRef" class="section-viewport">
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
  /** Numéro 1-based de la section (repère mono "01 / 05", §2.3 bis de la spec). */
  index: number
  total?: number
}

const props = withDefaults(defineProps<Props>(), { total: 5 })

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
    padding-top: calc(var(--header-height, 80px) + 2rem);
    padding-bottom: 2rem;
    padding-left: var(--slidemenu-width, 0px);
  }
}

/*
 * Fond plat opaque (même traitement que `.panel`) : le repère "01 / 05" est
 * posé directement sur le canvas hyperspace, comme le Header et le menu
 * (même défaut, même correctif — voir feedback-2.md). Élément déjà en
 * position absolue : le padding ajouté ici ne modifie aucune hauteur de
 * flux, aucun risque pour la contrainte "tient dans l'écran" (§2.3).
 */
.section-marker {
  position: absolute;
  top: 0.75rem;
  right: 1.25rem;
  margin: 0;
  z-index: 1;
  background-color: var(--panel-bg);
  border: 1px solid var(--color-line);
  padding: 0.25rem 0.5rem;
}

@media (min-width: 768px) {
  .section-marker {
    top: 1.5rem;
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
