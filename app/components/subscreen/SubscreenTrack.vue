<template>
  <div class="subtrack" :class="{ 'subtrack--stage': stage }" @touchstart="onTouchStart" @touchend="onTouchEnd">
    <div ref="railRef" class="subtrack__rail" :style="{ '--sub-x': `-${index * 100}%` }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

/**
 * Piste de sous-écrans d'une section (§2.3 de la spec). Chaque enfant direct
 * du slot occupe l'écran entier ; `index` sélectionne celui qui est visible.
 *
 * - Mobile (< 768px) : la piste glisse horizontalement (glissement du doigt ou
 *   boutons de `SubscreenNav`).
 * - À partir de 768px, sans `stage` : le wrapper s'efface (`display: contents`)
 *   et les enfants se mettent en page dans la grille de la section, tout le
 *   contenu tenant dans l'écran d'un coup.
 * - À partir de 768px, avec `stage` : mise en scène séquentielle, un plan à la
 *   fois, fondu lent d'un plan à l'autre (le texte n'est ni coupé ni reformulé,
 *   il est découpé en plans).
 */
interface Props {
  index: number
  total: number
  /** Desktop : un plan à la fois, en fondu, au lieu de tout montrer d'un coup. */
  stage?: boolean
}

const props = defineProps<Props>()
const railRef = ref<HTMLElement | null>(null)

/** Marque le plan courant (attribut posé à la main : Vue ne le touche pas au rendu). */
function markActive() {
  const rail = railRef.value
  if (!rail) return
  Array.from(rail.children).forEach((child, i) => {
    if (i === props.index) child.setAttribute('data-active', '')
    else child.removeAttribute('data-active')
    // Seuls les plans en scène sont masqués aux lecteurs d'écran (les autres entrées restent toutes visibles sur desktop).
    if (props.stage) child.setAttribute('aria-hidden', i === props.index ? 'false' : 'true')
  })
}

onMounted(markActive)
watch(() => props.index, markActive, { flush: 'post' })
const emit = defineEmits<{ 'update:index': [number] }>()

let startX = 0
let dragging = false

function onTouchStart(e: TouchEvent) {
  const touch = e.touches[0]
  if (!touch) return
  startX = touch.clientX
  dragging = true
}

const SWIPE_THRESHOLD = 40

function onTouchEnd(e: TouchEvent) {
  if (!dragging) return
  dragging = false

  const touch = e.changedTouches[0]
  if (!touch) return

  const delta = startX - touch.clientX
  if (delta > SWIPE_THRESHOLD && props.index < props.total - 1) {
    emit('update:index', props.index + 1)
  } else if (delta < -SWIPE_THRESHOLD && props.index > 0) {
    emit('update:index', props.index - 1)
  }
}
</script>

<style scoped>
.subtrack {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.subtrack__rail {
  display: flex;
  height: 100%;
  transform: translateX(var(--sub-x, 0%));
  transition: transform 0.8s var(--ease-slow);
}

/*
 * Dimensionnement des panneaux mobiles uniquement (< 768px) : au-delà,
 * `.subtrack`/`.subtrack__rail` s'effacent (`display: contents`) ou passent
 * en scène (`stage`), et chaque section reprend la main sur la mise en page.
 */
@media (max-width: 767.98px) {
  :deep(.subtrack__rail > *) {
    flex: 0 0 100%;
    max-width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
}

@media (min-width: 768px) {
  .subtrack:not(.subtrack--stage),
  .subtrack:not(.subtrack--stage) .subtrack__rail {
    display: contents;
  }

  /* Scène : tous les plans dans la même cellule, un seul visible à la fois. */
  .subtrack--stage .subtrack__rail {
    display: grid;
    transform: none;
    transition: none;
  }

  .subtrack--stage :deep(.subtrack__rail > *) {
    grid-area: 1 / 1;
    min-width: 0;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: translateY(0.6rem);
    transition:
      opacity 0.9s var(--ease-slow),
      transform 0.9s var(--ease-slow),
      visibility 0s linear 0.9s;
  }

  .subtrack--stage :deep(.subtrack__rail > [data-active]) {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: none;
    transition-delay: 0.35s, 0.35s, 0s;
  }
}
</style>
