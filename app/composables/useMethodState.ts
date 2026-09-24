import { gsap } from 'gsap'
import { siteContent } from '~/data/content'
import type { Step } from '~/types/method'

// État global partagé (singleton)
const currentStep = ref(1)

// Mobile (< 768px) : la section Méthode se découpe en sous-écrans, le
// premier montre le surtitre, le titre et le sous-titre avec la planète, les
// suivants une étape chacun. `introVisible` ne compte que sur mobile.
const introVisible = ref(true)
const isMobileViewport = ref(false)
const introActive = computed(() => introVisible.value && isMobileViewport.value)

// Steps global partagé, alimentés par la source de contenu unique
const steps = ref<Step[]>(siteContent.method.steps)

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
    gsap.to(element, { opacity: 0, duration: 0.45, ease: 'power1.out', onComplete: resolve })
  })
}

const fadeIn = async (element: HTMLElement): Promise<void> => {
  return new Promise((resolve) => {
    gsap.to(element, { opacity: 1, duration: 0.9, ease: 'power1.out', onComplete: resolve })
  })
}

// Verrou de la phase critique d'un changement d'étape (fade-out du texte) et
// dernière étape demandée pendant ce temps.
let stepLocked = false
let queuedStep: number | null = null

const animateLine = (line: HTMLElement, grow: boolean, duration: number, delay: number): Promise<void> =>
  new Promise((resolve) => {
    gsap.fromTo(
      line,
      { scaleY: grow ? 0 : 1, transformOrigin: 'top center' },
      { scaleY: grow ? 1 : 0, duration, delay, ease: 'power2.inOut', onComplete: resolve },
    )
  })

export const useMethodState = () => {
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
  // fonction enregistrée via `registerPlanetMaterial` (voir MethodPlanet.vue) :
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

  // Navigation animée avec GSAP, seul point d'entrée des changements d'étape
  // (flèches, clavier, jalon de la frise, segment mobile).
  //
  // Les deux sens (next/prev) suivent la même séquence : `currentStep.value`
  // n'est mis à jour qu'une fois le texte totalement invisible (après le
  // fade-out), jamais avant, donc aucun flash de contenu. Le fondu de texture
  // de la planète démarre dès l'appel, quel que soit le déclencheur.
  //
  // Une demande reçue pendant le fade-out (phase critique, ~0,45 s) est mise
  // en file : la dernière l'emporte et s'exécute dès que le texte est masqué,
  // sans réafficher l'étape intermédiaire. Après cette phase, l'animation de
  // ligne (1,5 s) continue en arrière-plan sans bloquer la navigation.
  //
  // Un saut de plusieurs étapes (clic sur un jalon) recale toutes les lignes
  // intermédiaires : celles qui précèdent la nouvelle étape se remplissent,
  // les suivantes se vident.
  const goToStepAnimated = async (newStep: number, options: { contentHidden?: boolean } = {}): Promise<void> => {
    if (newStep < 1 || newStep > steps.value.length) return
    if (stepLocked) {
      queuedStep = newStep
      return
    }
    if (newStep === currentStep.value) return

    stepLocked = true
    const direction = newStep > currentStep.value ? 'next' : 'prev'
    const oldStep = currentStep.value
    const circles = timelineElements.value.circles
    const lines = timelineElements.value.lines
    const content = timelineElements.value.content

    // Morphing planète en parallèle (commence maintenant, finit à la fin).
    const planetMorphPromise = animatePlanetTexture(steps.value[newStep - 1]?.planetTexture || '')

    // 1. FADE-OUT du texte (sauf s'il est déjà masqué : sortie d'introduction mobile).
    if (content) {
      if (options.contentHidden) gsap.set(content, { opacity: 0 })
      else await fadeOut(content)
    }

    // 2. Mettre à jour le modèle : le texte est invisible, aucun flash possible.
    currentStep.value = newStep
    stepLocked = false

    // Une demande plus récente attend : on l'enchaîne, le texte reste masqué.
    const queued = queuedStep
    queuedStep = null
    if (queued !== null && queued !== newStep) {
      void planetMorphPromise
      await goToStepAnimated(queued, { contentHidden: true })
      return
    }

    // 3. Cercles et lignes, en arrière-plan (ne bloque pas le texte).
    circles.forEach((circle, i) => circle?.classList.toggle('pulse', i === newStep - 1))
    const linePromises: Promise<void>[] = []
    const first = Math.min(oldStep, newStep) - 1
    const last = Math.max(oldStep, newStep) - 1
    const span = last - first
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (!line) continue
      if (i >= first && i < last) {
        // Ligne située entre l'ancienne et la nouvelle étape : elle se trace ou s'efface en cascade.
        const order = direction === 'next' ? i - first : last - 1 - i
        linePromises.push(animateLine(line, direction === 'next', 1.5 / span, (1.5 / span) * order))
      } else {
        gsap.set(line, { scaleY: i < newStep - 1 ? 1 : 0, transformOrigin: 'top center' })
      }
    }

    // 4. FADE-IN du texte immédiatement, puis attente de la fin de la ligne et
    // du morphing planète pour la synchronisation des appelants.
    const fadeInPromise = content ? fadeIn(content) : Promise.resolve()
    await Promise.all([fadeInPromise, planetMorphPromise, ...linePromises])
  }

  // Sélection directe d'une étape (jalon de la frise, segment mobile, flèches
  // gauche/droite en sous-écran) : même fondu que les flèches, y compris de
  // texture. Sur mobile, quitter l'introduction masque d'abord le texte pour
  // ne jamais montrer l'ancienne étape.
  const selectStep = (stepNumber: number): void => {
    const leavingIntro = introVisible.value && isMobileViewport.value
    introVisible.value = false
    if (stepNumber === currentStep.value && !stepLocked) return
    void goToStepAnimated(stepNumber, { contentHidden: leavingIntro })
  }

  // Fonctions de navigation animées
  // Pendant un fade-out en cours, le point de départ est la cible déjà demandée.
  const effectiveStep = () => queuedStep ?? currentStep.value

  const nextStepAnimated = async () => {
    if (effectiveStep() < steps.value.length) {
      await goToStepAnimated(effectiveStep() + 1)
    }
  }

  const prevStepAnimated = async () => {
    if (effectiveStep() > 1) {
      await goToStepAnimated(effectiveStep() - 1)
    }
  }

  return {
    introVisible,
    isMobileViewport,
    introActive,
    currentStep,
    steps,
    activeStep,
    nextStep,
    prevStep,
    goToStep,
    canGoNext,
    canGoPrev,
    goToStepAnimated,
    selectStep,
    isStepTransitioning: () => stepLocked,
    nextStepAnimated,
    prevStepAnimated,
    registerCircle,
    registerLine,
    registerContent,
    registerPlanetMaterial,
    animatePlanetTexture,
  }
}
