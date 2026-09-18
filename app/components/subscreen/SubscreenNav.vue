<template>
  <div class="subnav scrim" role="group" aria-label="Navigation entre les sous-écrans">
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
   section tient dans l'écran d'un coup (§2.3 de la spec). Chiffres en Jost,
   flèches sans cadre ni fond : le voile du layout porte le contraste. */
.subnav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.subnav__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.25rem;
  border: none;
  background: transparent;
  color: var(--color-ink);
  font-family: var(--font-display);
  font-weight: 300;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  transition: color 0.6s var(--ease-slow), opacity 0.6s var(--ease-slow);
}

.subnav__btn:not(:disabled):hover {
  color: var(--color-accent);
}

.subnav__btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.subnav__indicator {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  color: var(--color-ink-dim);
  min-width: 5ch;
  text-align: center;
}

@media (min-width: 768px) {
  .subnav {
    display: none;
  }
}
</style>
