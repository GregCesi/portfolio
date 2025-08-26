import { ref, onMounted, onUnmounted } from 'vue'

export function useLayoutDimensions() {
  const headerHeight = ref(0)
  const slidemenuWidth = ref(0)

  const measureDimensions = () => {
    // Mesurer le Header
    const header = document.querySelector('header')
    if (header) {
      const headerRect = header.getBoundingClientRect()
      headerHeight.value = headerRect.height + headerRect.top // hauteur + marge top
    }
    
    // Mesurer le SlideMenu (desktop seulement)
    if (window.innerWidth >= 768) {
      // Sur desktop, chercher le nav qui contient les SlideMenuItem verticaux
      const slideMenuDesktop = document.querySelector('nav.hidden.md\\:flex')
      if (slideMenuDesktop) {
        // Utiliser seulement la position de base (left-12 = 48px + un peu de marge)
        slidemenuWidth.value = 48 + 80// left-12 + marge pour les barres qui slide
        console.log('🎯 SlideMenu desktop: utilisation largeur fixe', slidemenuWidth.value + 'px')
      } else {
        console.log('❌ SlideMenu desktop non trouvé')
        slidemenuWidth.value = 0
      }
    } else {
      slidemenuWidth.value = 0 // Pas de SlideMenu sur mobile
      console.log('📱 Mode mobile: SlideMenu width = 0')
    }

    console.log('📏 Dimensions mesurées:', {
      headerHeight: headerHeight.value + 'px',
      slidemenuWidth: slidemenuWidth.value + 'px',
      viewport: `${window.innerWidth - slidemenuWidth.value}x${window.innerHeight - headerHeight.value}`
    })

    // Mettre à jour les CSS custom properties
    document.documentElement.style.setProperty('--header-height', headerHeight.value + 'px')
    document.documentElement.style.setProperty('--slidemenu-width', slidemenuWidth.value + 'px')
  }

  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    // Mesure initiale avec un petit délai pour s'assurer que tout est rendu
    setTimeout(measureDimensions, 200)

    // Re-mesurer au redimensionnement
    window.addEventListener('resize', measureDimensions)

    // Observer les changements de taille des éléments
    resizeObserver = new ResizeObserver(measureDimensions)
    
    const header = document.querySelector('header')
    if (header) resizeObserver.observe(header)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', measureDimensions)
    resizeObserver?.disconnect()
  })

  return {
    headerHeight,
    slidemenuWidth,
    measureDimensions
  }
}