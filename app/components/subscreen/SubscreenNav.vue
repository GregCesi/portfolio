<template>
  <div class="subnav" :class="{ 'subnav--persistent': persistent }" role="group" aria-label="Navigation entre les sous-écrans">
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
defineProps<{ index: number; total: number; persistent?: boolean }>()
defineEmits<{ prev: []; next: [] }>()
</script>

<style scoped>
/* Chiffres en Jost, flèches sans cadre ni fond. */
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

/* Desktop : masquée, sauf pour les sections en scène (`persistent`) où elle
   est la seule façon de passer d'un plan au suivant. */
@media (min-width: 768px) {
  .subnav:not(.subnav--persistent) {
    display: none;
  }
}
</style>
