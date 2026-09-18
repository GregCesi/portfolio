import { ref, onMounted, onUnmounted } from 'vue'

/** Espace vertical (px) laissé entre le Header et le nav mobile horizontal, et entre ce nav et le contenu. */
const MOBILE_NAV_GAP = 16
const MOBILE_BREAKPOINT = 768

export function useLayoutDimensions() {
  const headerHeight = ref(0)
  const slidemenuWidth = ref(0)

  // Positionne le nav mobile horizontal juste sous le Header (résout le TODO
  // historique de SlideMenu.vue), puis renvoie le bas réel de ce nav — c'est
  // cette valeur, et non la seule hauteur du Header, qui doit servir de
  // padding-top aux sections sur mobile pour ne jamais chevaucher le H1 (§P4).
  const positionMobileNav = (headerRect: DOMRect): number => {
    const mobileNav = document.querySelector<HTMLElement>('[data-mobile-nav]')
    if (!mobileNav) return headerRect.bottom + MOBILE_NAV_GAP

    mobileNav.style.top = `${headerRect.bottom + MOBILE_NAV_GAP}px`
    // Lecture après écriture : déclenche un reflow synchrone, la valeur est à jour.
    return mobileNav.getBoundingClientRect().bottom + MOBILE_NAV_GAP
  }

  const measureDimensions = () => {
    // Mesurer le Header
    const header = document.querySelector('header')
    let headerRect: DOMRect | null = null
    if (header) {
      headerRect = header.getBoundingClientRect()
      headerHeight.value = headerRect.height + headerRect.top // hauteur + marge top
    }

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT

    // Mesurer le SlideMenu (desktop seulement)
    if (!isMobile) {
      // Sur desktop, chercher le nav qui contient les SlideMenuItem verticaux
      const slideMenuDesktop = document.querySelector('nav.hidden.md\\:flex')
      if (slideMenuDesktop) {
        // Utiliser seulement la position de base (left-12 = 48px + un peu de marge)
        slidemenuWidth.value = 48 + 80 // left-12 + marge pour les barres qui slide
      } else {
        slidemenuWidth.value = 0
      }
    } else {
      slidemenuWidth.value = 0 // Pas de SlideMenu vertical sur mobile
    }

    // Sur mobile, le contenu doit démarrer sous le Header ET le nav horizontal
    // (les deux sont des éléments `fixed` indépendants qui, sans cela, se
    // chevauchent avec le H1 de la section Start).
    const contentTop = isMobile && headerRect ? positionMobileNav(headerRect) : headerHeight.value

    // Calculer la hauteur fixe en pixels
    const fixedHeight = window.innerHeight - contentTop

    // Au chargement : appliquer à toutes les sections
    const sections = document.querySelectorAll('.section-viewport')
    if (sections.length > 0 && contentTop > 0) {
      sections.forEach((section) => {
        const sectionEl = section as HTMLElement
        sectionEl.style.height = fixedHeight + 'px'
        sectionEl.style.width = `calc(100vw - ${slidemenuWidth.value}px)`
        sectionEl.style.paddingTop = contentTop + 'px'
        sectionEl.style.marginLeft = slidemenuWidth.value + 'px'
        sectionEl.style.boxSizing = 'border-box'
        sectionEl.style.position = 'relative'
      })
    }
  }

  const resizeHandler = () => {
    // Mesurer header et slidemenu
    const header = document.querySelector('header')
    let headerRect: DOMRect | null = null
    if (header) {
      headerRect = header.getBoundingClientRect()
      headerHeight.value = headerRect.height + headerRect.top
    }

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT
    slidemenuWidth.value = isMobile ? 0 : 48 + 80

    const contentTop = isMobile && headerRect ? positionMobileNav(headerRect) : headerHeight.value

    // Trouver la section active
    const currentScroll = window.scrollY
    const currentSectionIndex = Math.floor(currentScroll / window.innerHeight)

    // Recalculer SEULEMENT la section active (viewport)
    const sections = document.querySelectorAll('.section-viewport')
    const activeSection = sections[currentSectionIndex] as HTMLElement

    if (activeSection) {
      const newFixedHeight = window.innerHeight - contentTop
      activeSection.style.height = newFixedHeight + 'px'
      activeSection.style.width = `calc(100vw - ${slidemenuWidth.value}px)`
      activeSection.style.paddingTop = contentTop + 'px'
      activeSection.style.marginLeft = slidemenuWidth.value + 'px'
    }

    // Mettre à jour AUSSI le SlideContainer
    const slideContainer = document.querySelector('.overflow-hidden') as HTMLElement
    if (slideContainer) {
      slideContainer.style.height = window.innerHeight + 'px'

      // Repositionner le wrapper pour la slide active
      const wrapper = slideContainer.querySelector('div') as HTMLElement
      if (wrapper) {
        wrapper.style.transform = `translateY(${-currentSectionIndex * window.innerHeight}px)`
      }
    }
  }

  onMounted(() => {
    // Mesure initiale : toutes les sections
    setTimeout(measureDimensions, 200)

    // Au redimensionnement : seulement section active
    window.addEventListener('resize', resizeHandler)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler)
  })

  return {
    headerHeight,
    slidemenuWidth,
    measureDimensions,
  }
}
