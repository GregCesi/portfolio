<template>
  <!-- Desktop : liste verticale à gauche, libellés toujours visibles (§2.3 bis). -->
  <nav data-desktop-nav class="desktop-nav" aria-label="Navigation entre les sections, menu latéral">
    <SlideMenuItem
      v-for="(label, idx) in labels"
      :key="idx"
      :label="label"
      :index="idx"
      :active="idx === props.activeIndex"
      @select="selectSlide"
    />
  </nav>

  <!-- Mobile : barre compacte en bas, numéros visibles, libellé de l'actif seul (§2.3 bis). -->
  <nav data-mobile-bar class="mobile-nav" aria-label="Navigation entre les sections, barre mobile">
    <div class="mobile-nav__numbers">
      <button
        v-for="(label, idx) in labels"
        :key="idx"
        type="button"
        class="mobile-nav__num"
        :class="{ 'is-active': idx === props.activeIndex }"
        :aria-label="label"
        :aria-current="idx === props.activeIndex ? 'true' : undefined"
        @click="selectSlide(idx)"
      >
        {{ String(idx + 1).padStart(2, '0') }}
      </button>
    </div>
    <p class="mobile-nav__label">{{ labels[props.activeIndex] }}</p>
  </nav>
</template>

<script setup lang="ts">
import SlideMenuItem from '~/components/navigation/SlideMenuItem.vue'
import type { SlideMenuProps, SlideMenuEmits } from '~/types/navigation'

const props = defineProps<SlideMenuProps>()
const emit = defineEmits<SlideMenuEmits>()

function selectSlide(i: number) {
  emit('select', i)
}
</script>

<style scoped>
.desktop-nav {
  display: none;
}

/* Barre mobile : même style que le menu desktop (Jost capitales espacées,
   actif à pleine opacité avec un trait fin), sur le noir du voile du layout. */
.mobile-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.6rem 1rem;
}

.mobile-nav__numbers {
  display: flex;
  gap: 0.1rem;
}

.mobile-nav__num {
  position: relative;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--color-ink);
  opacity: 0.55;
  background: transparent;
  border: none;
  padding: 0.35rem 0.45rem;
  cursor: pointer;
  transition: opacity 0.6s var(--ease-slow), color 0.6s var(--ease-slow);
}

.mobile-nav__num:hover {
  opacity: 0.85;
}

.mobile-nav__num.is-active {
  opacity: 1;
  color: var(--color-accent);
}

.mobile-nav__num::after {
  content: '';
  position: absolute;
  left: 0.45rem;
  right: 0.65rem;
  bottom: 0.1rem;
  height: 1px;
  background-color: currentColor;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.8s var(--ease-slow);
}

.mobile-nav__num.is-active::after {
  transform: scaleX(1);
}

.mobile-nav__label {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--color-accent);
  white-space: nowrap;
}

@media (min-width: 768px) {
  .desktop-nav {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    position: fixed;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 50;
    /* Aucun fond, aucun cadre : le voile du layout porte le contraste.
       `--slidemenu-width` (utilisé par `BaseSection`) est mesuré en direct
       sur la largeur réelle de cet élément (voir `useLayoutDimensions.ts`). */
  }

  .mobile-nav {
    display: none;
  }
}

@media (min-width: 1024px) {
  .desktop-nav {
    left: 1.5rem;
  }
}

@media (min-width: 1280px) {
  .desktop-nav {
    left: 2.5rem;
  }
}
</style>
