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
  border-top: 1px solid var(--color-line);
  /* `--panel-bg` (même fond que `.panel`/Header/menu desktop) : 85%
     d'opacité tenait une marge trop faible (4,88:1 mesuré, feedback-2.md). */
  background-color: var(--panel-bg);
}

.mobile-nav__numbers {
  display: flex;
  gap: 0.35rem;
}

.mobile-nav__num {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.05em;
  color: var(--color-ink);
  /* 0.62 d'opacité : même marge de sécurité AA que le menu desktop
     (>= 6.5:1 mesuré sur pixels réels), au lieu de 0.4 (~3.2-3.75:1). */
  opacity: 0.62;
  background: transparent;
  border: none;
  padding: 0.35rem 0.4rem;
  cursor: pointer;
  transition: opacity 0.2s ease, color 0.2s ease;
}

.mobile-nav__num:hover {
  opacity: 0.8;
}

.mobile-nav__num.is-active {
  opacity: 1;
  color: var(--color-accent);
}

.mobile-nav__label {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.04em;
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
    left: 2.5rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 50;
    /*
     * Fond plat opaque (même traitement que `.panel`) : le menu était posé
     * directement sur le canvas hyperspace, sans aucun fond. Une opacité de
     * texte seule (0.62) ne suffit pas : une étoile blanche pleine derrière
     * un libellé faisait chuter le contraste à ~1,13-1,26:1 (mesuré sur
     * pixels réels, feedback-2.md). `--slidemenu-width` (utilisé par
     * `BaseSection` pour ne pas chevaucher le contenu) est mesuré en
     * direct sur la largeur réelle de cet élément (voir
     * `useLayoutDimensions.ts`) : le padding ajouté ici est donc pris en
     * compte automatiquement, aucune valeur à recalculer à la main.
     */
    background-color: var(--panel-bg);
    border: 1px solid var(--color-line);
    padding: 1.1rem 1.35rem;
  }

  .mobile-nav {
    display: none;
  }
}
</style>
