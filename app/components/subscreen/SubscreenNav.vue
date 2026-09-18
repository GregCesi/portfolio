<template>
  <div class="subnav" role="group" aria-label="Navigation entre les sous-écrans">
    <button
      type="button"
      class="subnav__btn"
      :disabled="index === 0"
      aria-label="Précédent"
      @click="$emit('prev')"
    >
      ‹
    </button>
    <span class="subnav__indicator">{{ index + 1 }} / {{ total }}</span>
    <button
      type="button"
      class="subnav__btn"
      :disabled="index === total - 1"
      aria-label="Suivant"
      @click="$emit('next')"
    >
      ›
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ index: number; total: number }>()
defineEmits<{ prev: []; next: [] }>()
</script>

<style scoped>
/* Visible uniquement sur mobile (< 768px) : au-delà, tout le contenu de la
   section tient dans l'écran d'un coup (§2.3 de la spec). */
.subnav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.subnav__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  border: 1px solid var(--color-line);
  /* Fond plat opaque plutôt que transparent : ce bouton est posé
     directement sur le canvas, hors de tout `.panel-inset` (§2.3). Un fond
     opaque sur une boîte déjà dimensionnée ne change aucune taille de
     flux, donc aucun risque pour "tient dans l'écran" sur mobile. */
  background-color: var(--panel-bg);
  color: var(--color-ink);
  font-size: 1.15rem;
  line-height: 1;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, opacity 0.2s ease;
}

.subnav__btn:not(:disabled):hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.subnav__btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.subnav__indicator {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  color: var(--color-ink-dim);
  min-width: 3.5ch;
  text-align: center;
  /* Même correctif que `.subnav__btn` : fond opaque, texte posé sur le
     canvas. Padding modeste, sans risque de hauteur : la rangée flex est
     déjà dimensionnée par les boutons ronds (2.25rem), plus hauts que ce
     texte même avec padding. */
  background-color: var(--panel-bg);
  border: 1px solid var(--color-line);
  padding: 0.15rem 0.45rem;
}

@media (min-width: 768px) {
  .subnav {
    display: none;
  }
}
</style>
