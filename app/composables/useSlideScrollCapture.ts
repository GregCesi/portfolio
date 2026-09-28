import { reactive } from 'vue'
import type { SectionId } from '~/types/content'

/** -1 = vers la section précédente, 1 = vers la section suivante. */
export type CaptureDirection = -1 | 1

/**
 * Rétention de la molette verticale, du clavier haut/bas et du glissement
 * tactile vertical par une diapositive qui a du terrain interne à parcourir
 * avant de céder à SlideContainer le changement de section (EXE-52, réutilisé
 * par EXE-54 pour la rotation du cube Projets).
 */
export interface ScrollCaptureController {
  /** Vrai si la diapositive doit encore consommer ce sens en interne plutôt que de le céder. */
  wants: (direction: CaptureDirection) => boolean
  /** Molette ou glissement tactile : delta brut, accumulé jusqu'au prochain cran interne. */
  feed: (rawDelta: number) => void
  /** Clavier haut/bas : un cran interne plein, sans accumulation. */
  step: (direction: CaptureDirection) => void
  /**
   * Appelé quand la diapositive devient active. `from` est le sens de venue :
   * 1 depuis la section précédente, -1 depuis la suivante, 0 pour un saut direct
   * (menu, `Home`/`End`) qui ne porte aucune continuité de défilement.
   */
  onEnter: (from: CaptureDirection | 0) => void
}

/** Registre singleton : une diapositive s'enregistre au montage, SlideContainer consulte par section active. */
const registry = reactive(new Map<SectionId, ScrollCaptureController>())

export function useSlideScrollCapture() {
  function register(id: SectionId, controller: ScrollCaptureController) {
    registry.set(id, controller)
  }

  function unregister(id: SectionId) {
    registry.delete(id)
  }

  function get(id: SectionId | undefined): ScrollCaptureController | undefined {
    return id ? registry.get(id) : undefined
  }

  return { register, unregister, get }
}
