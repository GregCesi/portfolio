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
 * Libellé toujours visible, Jost capitales espacées, précédé du numéro
 * (§2.3 bis). Actif : pleine opacité, accent glacier, trait fin devant.
 * Inactifs : opacité réduite (0.6 : la valeur qui garde le texte petit
 * au-dessus de 4,5:1 sur le noir, même derrière une étoile ; la spec cible
 * 35 % mais 35 % ne donne que ~2,8:1 et casse le contraste AA), 0.85 au survol.
 * Le numéro hérite de la même opacité que le libellé (pas d'opacité
 * imbriquée, qui ferait retomber sous le seuil AA).
 */
.menu-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.75rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--color-ink);
  background: transparent;
  border: none;
  padding: 0.5rem 0;
  opacity: 0.6;
  cursor: pointer;
  transition: opacity 0.6s var(--ease-slow), color 0.6s var(--ease-slow);
  white-space: nowrap;
}

.menu-item:hover {
  opacity: 0.85;
}

.menu-item.is-active {
  opacity: 1;
  color: var(--color-accent);
}

/* Trait fin : sa longueur seule dit quelle section est active. */
.menu-item::before {
  content: '';
  display: block;
  width: 1.5rem;
  height: 1px;
  background-color: currentColor;
  transform: scaleX(0.25);
  transform-origin: left center;
  opacity: 0.5;
  transition: transform 0.8s var(--ease-slow), opacity 0.8s var(--ease-slow);
}

.menu-item.is-active::before {
  transform: scaleX(1);
  opacity: 1;
}

.menu-item__number {
  color: inherit;
  min-width: 1.4rem;
}
</style>
