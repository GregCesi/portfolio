<template>
  <button
    type="button"
    class="menu-item"
    :class="{ 'is-active': active }"
    :aria-current="active ? 'true' : undefined"
    @click="emit('select', index)"
  >
    <span class="menu-item__number">{{ paddedIndex }}</span>
    <span class="menu-item__label">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SlideMenuItemProps, SlideMenuItemEmits } from '~/types/navigation'

const props = defineProps<SlideMenuItemProps>()
const emit = defineEmits<SlideMenuItemEmits>()

const paddedIndex = computed(() => String(props.index + 1).padStart(2, '0'))
</script>

<style scoped>
/*
 * Libellé toujours visible, mono capitales, précédé du numéro (§2.3 bis).
 * Inactif : 40% d'opacité, 70% au survol. Actif : pleine opacité, accent,
 * trait à gauche.
 */
.menu-item {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-ink);
  background: transparent;
  border: none;
  border-left: 2px solid transparent;
  padding: 0.35rem 0 0.35rem 0.75rem;
  opacity: 0.4;
  cursor: pointer;
  transition: opacity 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  white-space: nowrap;
}

.menu-item:hover {
  opacity: 0.7;
}

.menu-item.is-active {
  opacity: 1;
  color: var(--color-accent);
  border-left-color: var(--color-accent);
}

.menu-item__number {
  color: inherit;
  opacity: 0.8;
}
</style>
