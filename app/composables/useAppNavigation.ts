import { inject, type InjectionKey } from 'vue'
import type { SectionId } from '~/types/content'

export interface AppNavigation {
  /** Change de section plein écran. */
  goToSection: (section: SectionId) => void
  /** Change de section puis fait défiler jusqu'à un ancrage interne (ex. bloc Contact). */
  goToAnchor: (section: SectionId, anchorId: string) => void
}

export const appNavigationKey: InjectionKey<AppNavigation> = Symbol('app-navigation')

/** À utiliser dans les sections pour déclencher une navigation (boutons, cartes, CTA). */
export function useAppNavigation(): AppNavigation {
  const navigation = inject(appNavigationKey)
  if (!navigation) {
    throw new Error(
      'useAppNavigation() doit être appelé sous le fournisseur de navigation (app/pages/index.vue)',
    )
  }
  return navigation
}
