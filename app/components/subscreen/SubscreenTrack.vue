<template>
  <div class="subtrack" @touchstart="onTouchStart" @touchend="onTouchEnd">
    <div class="subtrack__rail" :style="{ transform: `translateX(-${index * 100}%)` }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Piste glissante mobile pour les sous-écrans d'une section (§2.3 de la
 * spec). Sur mobile (< 768px), chaque enfant direct du slot occupe l'écran
 * entier ; `index` sélectionne celui qui est visible, un glissement
 * horizontal (ou les boutons de `SubscreenNav`) en change. À partir de
 * 768px, le wrapper s'efface (`display: contents`) : les enfants du slot
 * deviennent des enfants directs du conteneur parent, qui les met en page
 * dans sa propre grille (tout le contenu tient dans l'écran, §2.3).
 */
interface Props {
  index: number
  total: number
}

const props = defineProps<Props>()
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
  transition: transform 0.4s cubic-bezier(0.65, 0, 0.35, 1);
}

/*
 * Dimensionnement des panneaux mobiles uniquement (< 768px) : au-delà,
 * `.subtrack`/`.subtrack__rail` s'effacent (`display: contents` ci-dessous)
 * et chaque section reprend la main sur la hauteur de ses propres enfants
 * (grille ou frise). Sans ce garde-fou par media query, cette règle
 * `height: 100%` — plus spécifique que les media queries des sections —
 * s'appliquait aussi au-delà de 768px et forçait toutes les cartes/entrées
 * à occuper toute la hauteur du panneau, quel que soit leur contenu.
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
  .subtrack,
  .subtrack__rail {
    display: contents;
  }
}
</style>
