import { reactive } from 'vue'
import type { SectionId } from '~/types/content'

/**
 * Contrôleur de sous-écrans d'une section (§2.3 de la spec) : sur mobile,
 * une section qui ne tient pas se découpe en sous-écrans navigables par
 * flèches, glissement horizontal ou clavier (gauche/droite). Sur desktop,
 * ce contrôleur existe toujours mais n'a pas d'effet visuel (la CSS montre
 * tout le contenu d'un coup, voir chaque section pour le détail).
 */
export interface SubscreenController {
  next: () => void
  prev: () => void
  goTo: (index: number) => void
}

/** Registre singleton : une section s'enregistre au montage, le clavier global (SlideContainer) déclenche par section active. */
const registry = reactive(new Map<SectionId, SubscreenController>())

export function useSubscreenNav() {
  function register(id: SectionId, controller: SubscreenController) {
    registry.set(id, controller)
  }

  function unregister(id: SectionId) {
    registry.delete(id)
  }

  function trigger(id: SectionId | undefined, direction: 'next' | 'prev') {
    if (!id) return
    registry.get(id)?.[direction]()
  }

  function goTo(id: SectionId, index: number) {
    registry.get(id)?.goTo(index)
  }

  return { register, unregister, trigger, goTo }
}
