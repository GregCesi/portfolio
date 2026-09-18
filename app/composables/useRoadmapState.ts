import { gsap } from 'gsap'
import { siteContent } from '~/data/content'
import type { Step } from '~/types/roadmap'

// État global partagé (singleton)
const currentStep = ref(1)

// Steps global partagé, alimentés par la source de contenu unique
const steps = ref<Step[]>(siteContent.roadmap.steps)

// Éléments DOM centralisés pour les animations
const timelineElements = ref({
  circles: [] as HTMLElement[],
  lines: [] as HTMLElement[],
  content: null as HTMLElement | null
})

// Fonction de changement de texture planète (enregistrée par PlanetModel)
let planetTextureChanger: ((textureName: string) => void) | null = null

// === FONCTIONS UTILITAIRES D'ANIMATION ===

const fadeOut = async (element: HTMLElement): Promise<void> => {
  return new Promise((resolve) => {
    gsap.to(element, { opacity: 0, duration: 0.3, onComplete: resolve })
  })
}

const fadeIn = async (element: HTMLElement): Promise<void> => {
  return new Promise((resolve) => {
    gsap.to(element, { opacity: 1, duration: 0.3, onComplete: resolve })
  })
}

const animateLineGrow = async (line: HTMLElement): Promise<void> => {
  return new Promise((resolve) => {
    gsap.fromTo(line, 
      { scaleY: 0, transformOrigin: 'top center' },
      { scaleY: 1, duration: 1.5, ease: 'power2.inOut', onComplete: resolve }
    )
  })
}

const animateLineShrink = async (line: HTMLElement): Promise<void> => {
  return new Promise((resolve) => {
    gsap.to(line, 
      { scaleY: 0, transformOrigin: 'top center', duration: 1.5, ease: 'power2.inOut', onComplete: resolve }
    )
  })
}

export const useRoadmapState = () => {
    
    // Computed : récupère l'étape active 
    const activeStep = computed(() => steps.value[currentStep.value - 1])

    const canGoNext = computed(() => currentStep.value < steps.value.length)
    const canGoPrev = computed(() => currentStep.value > 1)

    // Fonctions pour enregistrer les éléments DOM
    const registerCircle = (element: HTMLElement, index: number) => {
      timelineElements.value.circles[index] = element
    }

    const registerLine = (element: HTMLElement, index: number) => {
      timelineElements.value.lines[index] = element
    }

    const registerContent = (element: HTMLElement) => {
      timelineElements.value.content = element
    }

    // Fonction pour enregistrer le changement de texture planète
    const registerPlanetMaterial = (changeTextureFunction: (textureName: string) => void) => {
      planetTextureChanger = changeTextureFunction
    }

    // Fonction d'animation de texture planète avec morphing fluide
    const animatePlanetTexture = async (textureName: string, duration: number = 2.1): Promise<void> => {
      return new Promise((resolve) => {
        if (planetTextureChanger) {
          // Créer un morphing fluide avec GSAP
          // 1. Fade out la planète actuelle
          gsap.to('.planet-container', {
            opacity: 0.3,
            duration: duration * 0.3, // 30% du temps pour fade out
            ease: 'power2.out',
            onComplete: () => {
              // 2. Changer la texture au milieu
              if (planetTextureChanger) {
                planetTextureChanger(textureName)
              }
              
              // 3. Fade in avec la nouvelle texture
              gsap.to('.planet-container', {
                opacity: 1,
                duration: duration * 0.7, // 70% du temps pour fade in
                ease: 'power2.inOut',
                onComplete: resolve
              })
            }
          })
        } else {
          console.warn('Planet texture changer not registered')
          resolve()
        }
      })
    }

    // Navigation avec limites
    const nextStep = () => {
      if (currentStep.value < steps.value.length) {  // Pas au-delà de 6
        currentStep.value++
      }
    }

    const prevStep = () => {
      if (currentStep.value > 1) {  // Pas en dessous de 1
        currentStep.value--
      }
    }

    // Navigation directe (pour plus tard)
    const goToStep = (stepNumber: number) => {
      if (stepNumber >= 1 && stepNumber <= steps.value.length) {
        currentStep.value = stepNumber
      }
    }

    // Navigation animée avec GSAP
    const goToStepAnimated = async (newStep: number): Promise<void> => {
      if (newStep === currentStep.value) return
      if (newStep < 1 || newStep > steps.value.length) return

      const direction = newStep > currentStep.value ? 'next' : 'prev'
      const oldStep = currentStep.value
      const circles = timelineElements.value.circles
      const lines = timelineElements.value.lines
      const content = timelineElements.value.content

      if (direction === 'next') {
        // NEXT: Fade-out, ligne, cercle, fade-in + morphing planète en parallèle
        
        // Calculer la durée totale: fadeOut(0.3) + lineGrow(1.5) + fadeIn(0.3) = 2.1s
        const totalDuration = 2.1
        
        // 🪐 Lancer le morphing planète en parallèle (commence maintenant, finit à la fin)
        const planetMorphPromise = animatePlanetTexture(
          steps.value[newStep - 1]?.planetTexture || '', 
          totalDuration
        )
        
        // 1. FADE-OUT du texte
        if (content) await fadeOut(content)
        
        // 2. Animation ligne
        const lineIndex = oldStep - 1
        const line = lines[lineIndex]
        if (line) await animateLineGrow(line)
        
        // 3. Mettre à jour currentStep + ajout pulse cercle
        currentStep.value = newStep
        const newCircle = circles[newStep - 1]
        if (newCircle) newCircle.classList.add('pulse')
        
        // 4. FADE-IN du texte + attendre la fin du morphing
        const fadeInPromise = content ? fadeIn(content) : Promise.resolve()
        await Promise.all([fadeInPromise, planetMorphPromise])
        
      } else {
        // PREV: Cercle, fade-out, ligne, fade-in + morphing planète en parallèle
        
        // Calculer la durée totale: fadeOut(0.3) + lineShrink(1.5) + fadeIn(0.3) = 2.1s
        const totalDuration = 2.1
        
        // 🪐 Lancer le morphing planète en parallèle
        const planetMorphPromise = animatePlanetTexture(
          steps.value[newStep - 1]?.planetTexture || '', 
          totalDuration
        )
        
        // 1. Retirer le pulse + mise à jour currentStep
        const oldCircle = circles[oldStep - 1]
        if (oldCircle) oldCircle.classList.remove('pulse')
        currentStep.value = newStep
        
        // 2. FADE-OUT du texte
        if (content) await fadeOut(content)
        
        // 3. Animer la ligne à l'envers
        const lineIndex = newStep - 1
        const lineToAnimate = lines[lineIndex]
        if (lineToAnimate) await animateLineShrink(lineToAnimate)
        
        // 4. FADE-IN du texte + attendre la fin du morphing
        const fadeInPromise = content ? fadeIn(content) : Promise.resolve()
        await Promise.all([fadeInPromise, planetMorphPromise])
      }
    }

    // Fonctions de navigation animées
    const nextStepAnimated = async () => {
      if (canGoNext.value) {
        await goToStepAnimated(currentStep.value + 1)
      }
    }

    const prevStepAnimated = async () => {
      if (canGoPrev.value) {
        await goToStepAnimated(currentStep.value - 1)
      }
    }

    return { 
      currentStep, steps, activeStep, nextStep, prevStep, goToStep, canGoNext, canGoPrev,
      goToStepAnimated, nextStepAnimated, prevStepAnimated,
      registerCircle, registerLine, registerContent,
      registerPlanetMaterial, animatePlanetTexture
    }
}