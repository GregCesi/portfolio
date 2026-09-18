import { onMounted, onUnmounted } from 'vue'

const MOBILE_BREAKPOINT = 768
/** Marge (px) entre le nav desktop et le bord gauche du contenu de section. */
const DESKTOP_NAV_GAP = 24
/** Marge réduite sous 1024 px (menu compact de la tablette portrait). */
const COMPACT_NAV_GAP = 16

/**
 * Mesure la hauteur réelle du Header, la largeur du nav desktop et la
 * hauteur de la barre mobile, puis les publie en variables CSS sur
 * `documentElement`. `BaseSection.vue` les consomme via `calc()` pour que
 * chaque section tienne exactement entre ces éléments fixes, sans
 * chevauchement ni défilement interne (§2.3 de la spec).
 */
export function useLayoutDimensions() {
  const measure = () => {
    const root = document.documentElement
    const header = document.querySelector('header')
    const headerHeight = header ? header.getBoundingClientRect().height : 0
    root.style.setProperty('--header-height', `${Math.ceil(headerHeight)}px`)

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT

    if (isMobile) {
      const bar = document.querySelector('[data-mobile-bar]')
      const barHeight = bar ? bar.getBoundingClientRect().height : 0
      root.style.setProperty('--mobile-bar-height', `${Math.ceil(barHeight)}px`)
      root.style.setProperty('--slidemenu-width', '0px')
    } else {
      const desktopNav = document.querySelector('[data-desktop-nav]')
      const navWidth = desktopNav
        ? Math.ceil(desktopNav.getBoundingClientRect().right) +
          (window.innerWidth < 1024 ? COMPACT_NAV_GAP : DESKTOP_NAV_GAP)
        : 0
      root.style.setProperty('--slidemenu-width', `${navWidth}px`)
      root.style.setProperty('--mobile-bar-height', '0px')
    }
  }

  onMounted(() => {
    // Repli avant que les polices web et le nav ne soient rendus.
    measure()
    // Une deuxième passe après le premier paint : la largeur du nav desktop
    // dépend du rendu réel des libellés mono (police chargée ou non).
    requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', measure)
  })

  return { measure }
}
