<template>
  <div ref="container" class="relative w-full h-screen overflow-hidden max-md:hidden">
    <!-- Planètes (sans le texte) -->
    <div
      v-for="(planetId, idx) in planets"
      :key="planetId"
      :ref="el => planetRefs[idx] = el as HTMLElement"
      class="absolute flex items-center justify-center"
    >
      <div class="relative">
        <div class="absolute rounded-lg -z-10" />
        <ThreeSphere :model="`Planet-${planetId + 1}`" class="w-40 h-40" />
      </div>
    </div>

    <!-- Texte positionné à côté de la planète principale -->
    <div 
      ref="textElement" 
      class="absolute flex flex-col max-w-2xl space-y-8 text-white light-shadow-text"
      :style="{
        left: `${textPosition.x}px`,
        top: `${textPosition.y}px`,
        transform: 'translateY(-50%)'
      }"
    >
      <h2 ref="titleRef" class="text-3xl font-bold relative ml-2">
        {{ currentService.title }}
      </h2>
      <svg
        ref="arrowSvg"
        width="571"
        height="75"
        viewBox="0 0 571 75"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="absolute -left-8 top-8 -translate-x-10 -translate-y-4"
      >
        <path
          ref="arrowPath"
          d=" M1.5017 73.5713 C1.5411 74.3988 2.24386 75.0377 3.07134 74.9983 L16.5561 74.3562 C17.3836 74.3168 18.0224 73.614 17.983 72.7865 C17.9436 71.959 17.2409 71.3202 16.4134 71.3596 L4.42695 71.9304 L3.85617 59.9439 C3.81677 59.1164 3.11401 58.4776 2.28652 58.517 C1.45903 58.5564 0.820163 59.2591 0.859568 60.0866 L1.5017 73.5713 L66.8901 0.990958 L1.89009 72.491 L3 73.5 L4.10991 74.509 L69.11 3.00898 L68 1.99997 H571"          stroke="white"
          stroke-width="1"
          fill="none"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
      </svg>
      <div ref="descRef" class="space-y-4 text-pretty max-w-lg">
        <p v-for="(description, idx) in currentService.description" :key="idx">{{ description }}</p>
      </div>
      <button
        ref="ctaRef"
        class="px-6 py-2 rounded-full bg-white text-black font-bold light-shadow-text hover:light-shadow hover:scale-105 transition-transform place-self-end mr-8"
      >
        {{ currentService.cta }}
      </button>    
    </div>

    <!-- Contrôles -->
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
      <button @click="next" :disabled="isAnimating" class="text-2xl text-white">&#8592;</button>
      <button @click="prev" :disabled="isAnimating" class="text-2xl text-white">&#8594;</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, nextTick, watch } from 'vue'
import { useNuxtApp } from '#app'
import ThreeSphere from './ThreeSphere.vue'

interface Service {
  title: string
  description: string[]
  cta: string
}

const services: Service[] = [
  {
    title: 'Écoute et sens',
    description: [ 
      'Avant de penser à la technique, je prends le temps de comprendre votre situation, vos contraintes et vos objectifs.', 
      'Cette écoute me permet de proposer des solutions qui vous font avancer et anticipent vos besoins futurs.',
    ],
    cta: 'Discutons de votre projet',
  },
  {
    title: 'Interface et expérience',
    description: [
      'Un site pro, clair et crédible, c’est le point de départ de la confiance.', 
      'Je structure mes interfaces pour qu’elles donnent envie de passer à l’action : contacter, acheter, s’engager, tout en simplifiant les étapes pour vos visiteurs.'
    ],
    cta: 'Discutons de votre projet',
  },
  {
    title: 'Technologies et structure',
    description: [
      'Grâce à cette compréhension en amont, je choisis des technologies et des structures capables de suivre votre croissance.', 
      'Votre site ou votre outil peut évoluer, s’adapter, grandir avec vous, sans devoir tout recommencer.'
    ],
    cta: 'Discutons de votre projet',
  },
  {
    title: 'Impact et quotidien',
    description: [
      'Mon objectif n’est pas de “livrer une solution", c’est de créer un outil pertinant, qui vous fait gagner du temps, vous rapproche de vos clients, ou simplifie vos processus.',
      'Chaque ligne de code à un impact concret sur votre quotidien.'
    ],
    cta: 'Discutons de votre projet',
  },
]

// Ajout de 'text' comme une planète
const planets = ref([0, 1, 2, 3]) // Seulement les planètes normales
const planetRefs = ref<HTMLElement[]>([])
const container = ref<HTMLElement | null>(null)
const textElement = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)
const positions = ref<Array<{x: number, y: number, scale: number}>>([])
const textPosition = ref({ x: 0, y: 0 })
const isAnimating = ref(false)
const arrowSvg = ref<SVGSVGElement | null>(null)
const arrowPath = ref<SVGPathElement | null>(null)
let pathLength = 0

// Mettre à jour la position du texte par rapport à la planète principale
function updateTextPosition(planetElement: HTMLElement) {
  if (!planetElement || !textElement.value) return
  
  const planetRect = planetElement.getBoundingClientRect()
  const containerRect = container.value?.getBoundingClientRect()
  
  if (!containerRect) return
  
  // Positionner le texte à droite de la planète principale
  textPosition.value = {
    x: planetRect.right - containerRect.left + 10, // 20px de marge
    y: planetRect.top - containerRect.top + (planetRect.height / 2) - 100
  }
}

// Fonction pour calculer les positions en fonction de la largeur de l'écran
function calculatePositions() {
  const width = window.innerWidth
  const height = window.innerHeight
  const scaleFactor = Math.min(width / 1920, 1)

  // Facteur d'ajustement pour les petits écrans
  const getXPosition = (baseX: number) => {
    if (baseX == 0.1) {
       if (width >= 1280) return baseX
       if (width >= 1024) return baseX * 0.3
       if (width >= 768) return baseX * -0.5
    }
    if (width >= 1280) return baseX
    if (width >= 1024) return baseX * 0.9
    if (width >= 768) return baseX * 0.8
    return baseX
    }

  
  // Positions de base (en pourcentage de la largeur/hauteur)
  const basePositions = [
    { x: getXPosition(0.1), y: 0.3, scale: 0.7 },
    { x: getXPosition(0.5), y: 0.025, scale: 0.4 },
    { x: getXPosition(0.65), y: 0.3, scale: 0.6 },
    { x: getXPosition(0.4), y: 0.5, scale: 0.5 }
  ]
  
  return basePositions.map(pos => ({
    x: pos.x * width,
    y: pos.y * height,
    scale: pos.scale * scaleFactor
  }))
}

// Mettre à jour les positions quand la fenêtre est redimensionnée
function handleResize() {
  positions.value = calculatePositions()
  updatePositions(true)
}

onMounted(() => {
  positions.value = calculatePositions()
  window.addEventListener('resize', handleResize)
  updatePositions(true)
  
  // Attendre que les éléments soient rendus pour positionner le texte
  nextTick(() => {
    if (planetRefs.value[0]) {
      updateTextPosition(planetRefs.value[0])
    }
    animateTextIn()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

const { $gsap } = useNuxtApp()

function prepareArrow() {
  if (!arrowPath.value) return false
  
  // Calculer la longueur totale du chemin
  pathLength = arrowPath.value.getTotalLength()
  
  // Initialiser le style
  $gsap.set(arrowPath.value, {
    strokeDasharray: pathLength,
    strokeDashoffset: pathLength,
    opacity: 1,
    fill: 'none'
  })
  
  return true
}

function animateTextIn() {
  if (!prepareArrow() || !arrowPath.value) return

  const tl = $gsap.timeline()
  
  // Animation du dessin de la flèche
  tl.to(arrowPath.value, {
    strokeDashoffset: 0,
    duration: 2.5,
    ease: "power2.inOut"
  })
  
  // Animation du texte
  tl.to(titleRef.value, { autoAlpha: 1, duration: 0.3 }, '-=0.8')
    .to(descRef.value, { autoAlpha: 1, duration: 0.3 }, '-=0.2')
    .to(ctaRef.value, { autoAlpha: 1, duration: 0.3 }, '-=0.1')
}

function animateTextOut() {
  return new Promise<void>((resolve) => {
    if (!arrowPath.value) {
      resolve()
      return
    }

    const tl = $gsap.timeline({ onComplete: resolve })
    
    // Animation d'effacement de la flèche (de droite à gauche)
    tl.to(arrowPath.value, {
      strokeDashoffset: -pathLength,
      duration: 1,
      ease: "power2.in"
    })
    
    // Cacher le texte
    tl.to([ctaRef.value, descRef.value, titleRef.value], {
      autoAlpha: 0,
      duration: 0.5
    }, '<')
  })
}

function updatePositions(updateText = false) {
  isAnimating.value = true
  let completed = 0
  const total = planetRefs.value.length
  
  // Mettre à jour les positions avant l'animation
  const newPositions = calculatePositions()
  positions.value = newPositions

  planetRefs.value.forEach((el, i) => {
    if (!el || !positions.value[i]) {
      completed++
      return
    }
    
    const pos = positions.value[i]
    $gsap.to(el, {
      x: pos.x,
      y: pos.y,
      scale: pos.scale,
      duration: 1, // Réduit à 1s pour une meilleure réactivité
      ease: "power2.inOut",
      onComplete: () => {
        completed++
        if (updateText && i === 0) {
          updateTextPosition(el)
        }
        if (completed === total) {
          isAnimating.value = false // Important : réinitialiser le flag
        }
      }
    })
  })
}

async function next() {
  if (isAnimating.value) return
  isAnimating.value = true
  
  try {
    // 1. Faire disparaître le texte
    await animateTextOut()
    
    // 2. Mettre à jour les données
    const first = planets.value.shift()
    if (first === undefined) return
    planets.value = [...planets.value, first]
    
    // 3. Attendre le rendu
    await nextTick()
    
    // 4. Mettre à jour les positions
    await new Promise(resolve => {
      updatePositions(false)
      // Attendre que l'animation des planètes soit terminée
      const check = setInterval(() => {
        if (!isAnimating.value) {
          clearInterval(check)
          resolve(true)
        }
      }, 100)
    })

    await nextTick()
    
    // 5. Faire apparaître le nouveau texte
    animateTextIn()
  } catch (error) {
    console.error('Error during animation:', error)
    isAnimating.value = false
  }
}

async function prev() {
  if (isAnimating.value) return
  isAnimating.value = true
  await animateTextOut()  // Animation de sortie
  const last = planets.value.pop()
  if (last === undefined) {
    isAnimating.value = false
    return
  }
  planets.value = [last, ...planets.value]
  await nextTick()
  updatePositions()  // Met à jour les positions des planètes
  animateTextIn()    // Animation d'entrée
}

const currentService = computed(() => {
  return services[planets.value[0]]
})

onMounted(() => {
  nextTick(() => {
    prepareArrow()
    updatePositions(false)
  })
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.arrow-right {
  position: relative;
  padding-left: 1rem;
}
.arrow-right::before {
  content: '';
  position: absolute;
  left: -140px;
  top: 50%;
  width: 120px;
  height: 2px;
  background-color: white;
}
.arrow-right::after {
  content: '';
  position: absolute;
  left: -20px;
  top: 50%;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 10px solid white;
  transform: translateY(-50%);
}
</style>