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
      } else {
        slidemenuWidth.value = 0
      }
    } else {
      slidemenuWidth.value = 0 // Pas de SlideMenu sur mobile
    }


    // Calculer la hauteur fixe en pixels
    const fixedHeight = window.innerHeight - headerHeight.value
    
    // Au chargement : appliquer à toutes les sections
    const sections = document.querySelectorAll('.section-viewport')
    if (sections.length > 0 && headerHeight.value > 0) {
      sections.forEach((section) => {
        const sectionEl = section as HTMLElement
        sectionEl.style.height = fixedHeight + 'px'
        sectionEl.style.width = `calc(100vw - ${slidemenuWidth.value}px)`
        sectionEl.style.paddingTop = headerHeight.value + 'px'
        sectionEl.style.marginLeft = slidemenuWidth.value + 'px'
        sectionEl.style.boxSizing = 'border-box'
        sectionEl.style.position = 'relative'
      })
    }
  }


  const resizeHandler = () => {
    // Mesurer header et slidemenu
    const header = document.querySelector('header')
    if (header) {
      const headerRect = header.getBoundingClientRect()
      headerHeight.value = headerRect.height + headerRect.top
    }
    
    if (window.innerWidth >= 768) {
      slidemenuWidth.value = 48 + 80
    } else {
      slidemenuWidth.value = 0
    }

    // Trouver la section active
    const currentScroll = window.scrollY
    const currentSectionIndex = Math.floor(currentScroll / window.innerHeight)
    
    // Recalculer SEULEMENT la section active (viewport)
    const sections = document.querySelectorAll('.section-viewport')
    const activeSection = sections[currentSectionIndex] as HTMLElement
    
    if (activeSection) {
      const newFixedHeight = window.innerHeight - headerHeight.value
      activeSection.style.height = newFixedHeight + 'px'
      activeSection.style.width = `calc(100vw - ${slidemenuWidth.value}px)`
      activeSection.style.paddingTop = headerHeight.value + 'px'
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
    measureDimensions
  }
}