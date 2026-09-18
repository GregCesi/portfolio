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
  content: null as HTMLElement | null,
})

// Fonction de changement de texture planète (enregistrée par PlanetModel)
let planetTextureChanger: ((textureName: string) => Promise<void> | void) | null = null

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
    gsap.fromTo(
      line,
      { scaleY: 0, transformOrigin: 'top center' },
      { scaleY: 1, duration: 1.5, ease: 'power2.inOut', onComplete: resolve },
    )
  })
}

const animateLineShrink = async (line: HTMLElement): Promise<void> => {
  return new Promise((resolve) => {
    gsap.to(line, {
      scaleY: 0,
      transformOrigin: 'top center',
      duration: 1.5,
      ease: 'power2.inOut',
      onComplete: resolve,
    })
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
  const registerPlanetMaterial = (
    changeTextureFunction: (textureName: string) => Promise<void> | void,
  ) => {
    planetTextureChanger = changeTextureFunction
  }

  // Déclenche le fondu de texture de la planète. Le fondu lui-même (opacité
  // du matériau WebGL) est géré par `useCrossfadeTexture`, appelé par la
  // fonction enregistrée via `registerPlanetMaterial` (voir RoadmapPlanet.vue) :
  // il n'y a pas de fondu DOM séparé à orchestrer ici, la classe
  // `.planet-container` visée par une ancienne version de ce code n'a jamais
  // existé dans le template (code mort, source de l'avertissement console
  // « GSAP target .planet-container not found »).
  const animatePlanetTexture = async (textureName: string): Promise<void> => {
    if (!planetTextureChanger) return
    await planetTextureChanger(textureName)
  }

  // Navigation avec limites
  const nextStep = () => {
    if (currentStep.value < steps.value.length) {
      // Pas au-delà de 6
      currentStep.value++
    }
  }

  const prevStep = () => {
    if (currentStep.value > 1) {
      // Pas en dessous de 1
      currentStep.value--
    }
  }

  // Navigation directe (pour plus tard)
  const goToStep = (stepNumber: number) => {
    if (stepNumber >= 1 && stepNumber <= steps.value.length) {
      currentStep.value = stepNumber
    }
  }

  // Navigation animée avec GSAP.
  //
  // Les deux sens (next/prev) suivent désormais exactement la même séquence,
  // dans le même ordre, pour éliminer l'asymétrie relevée à l'itération 4
  // (feedback-4.md) : `currentStep.value` n'est mis à jour qu'une fois le
  // texte totalement invisible (après le fade-out), jamais avant — donc
  // aucun flash de contenu n'est possible dans aucun des deux sens.
  //
  // Le texte réapparaît dès que possible : le fade-in du contenu démarre
  // juste après la mise à jour du modèle, sans attendre la fin de
  // l'animation de ligne (1,5s). La ligne continue d'animer en arrière-plan
  // (langage visuel inchangé, même durée, même easing) mais elle ne bloque
  // plus la lisibilité du texte — la fonction attend malgré tout sa fin
  // avant de résoudre, pour que les appelants (navigation clavier en file
  // d'attente notamment) restent synchronisés sur l'état final réel.
  const goToStepAnimated = async (newStep: number): Promise<void> => {
    if (newStep === currentStep.value) return
    if (newStep < 1 || newStep > steps.value.length) return

    const direction = newStep > currentStep.value ? 'next' : 'prev'
    const oldStep = currentStep.value
    const circles = timelineElements.value.circles
    const lines = timelineElements.value.lines
    const content = timelineElements.value.content

    // 🪐 Lancer le morphing planète en parallèle (commence maintenant, finit à la fin)
    const planetMorphPromise = animatePlanetTexture(steps.value[newStep - 1]?.planetTexture || '')

    // 1. FADE-OUT du texte (identique dans les deux sens)
    if (content) await fadeOut(content)

    // 2. Mettre à jour le modèle au même point du cycle dans les deux sens :
    // le texte est déjà invisible, donc aucun flash de contenu possible.
    currentStep.value = newStep

    // 3. Mise à jour visuelle des cercles + démarrage de l'animation de
    // ligne, en arrière-plan (ne bloque pas la réapparition du texte).
    let linePromise: Promise<void> = Promise.resolve()
    if (direction === 'next') {
      const newCircle = circles[newStep - 1]
      if (newCircle) newCircle.classList.add('pulse')
      const line = lines[oldStep - 1]
      if (line) linePromise = animateLineGrow(line)
    } else {
      const oldCircle = circles[oldStep - 1]
      if (oldCircle) oldCircle.classList.remove('pulse')
      const line = lines[newStep - 1]
      if (line) linePromise = animateLineShrink(line)
    }

    // 4. FADE-IN du texte immédiatement (le contenu redevient lisible en
    // ~0,6s au lieu de ~2s) + attendre la fin de la ligne et du morphing
    // planète avant de résoudre, pour la synchronisation des appelants.
    const fadeInPromise = content ? fadeIn(content) : Promise.resolve()
    await Promise.all([fadeInPromise, planetMorphPromise, linePromise])
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
    currentStep,
    steps,
    activeStep,
    nextStep,
    prevStep,
    goToStep,
    canGoNext,
    canGoPrev,
    goToStepAnimated,
    nextStepAnimated,
    prevStepAnimated,
    registerCircle,
    registerLine,
    registerContent,
    registerPlanetMaterial,
    animatePlanetTexture,
  }
}
