<template>
  <div ref="container" class="relative w-full h-screen overflow-hidden max-sm:hidden">
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
      <h2 class="text-3xl font-bold relative ml-2">
        {{ currentService.title }}
      </h2>
      <img src="/arrow-service.svg" alt="Arrow" class="absolute -left-8 top-8 -translate-x-10 -translate-y-4"/>
      <div class="space-y-4 text-pretty max-w-lg">
        <p v-for="(description, idx) in currentService.description" :key="idx">{{ description }}</p>
      </div>
      <button class="px-6 py-2 rounded-full bg-white text-black font-bold light-shadow-text hover:light-shadow hover:scale-105 transition-transform place-self-end mr-12">{{ currentService.cta }}</button>
    </div>

    <!-- Contrôles -->
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
      <button @click="next" :disabled="isAnimating" class="text-2xl text-white">&#8592;</button>
      <button @click="prev" :disabled="isAnimating" class="text-2xl text-white">&#8594;</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
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
const positions = ref<Array<{x: number, y: number, scale: number}>>([])
const textPosition = ref({ x: 0, y: 0 })
const isAnimating = ref(false)

console.log("planets : ", planets.value)


// Mettre à jour la position du texte par rapport à la planète principale
function updateTextPosition(planetElement: HTMLElement) {
  if (!planetElement || !textElement.value) return
  
  const planetRect = planetElement.getBoundingClientRect()
  const containerRect = container.value?.getBoundingClientRect()
  
  if (!containerRect) return
  
  // Positionner le texte à droite de la planète principale
  textPosition.value = {
    x: planetRect.right - containerRect.left - 110, // 20px de marge
    y: planetRect.top - containerRect.top + (planetRect.height / 2) - 90
  }
}

// Fonction pour calculer les positions en fonction de la largeur de l'écran
function calculatePositions() {
  const width = window.innerWidth
  const height = window.innerHeight
  const scaleFactor = Math.min(width / 1920, 1)
  
  // Positions de base (en pourcentage de la largeur/hauteur)
   const basePositions = [
    { x: 0.1, y: 0.3, scale: 1.1 },    // 10% depuis la gauche, 20% depuis le haut
    { x: 0.5, y: 0.025, scale: 0.6 },  // 80% depuis la gauche, 10% depuis le haut
    { x: 0.65, y: 0.3, scale: 0.8 },  // etc.
    { x: 0.4, y: 0.55, scale: 0.9 }
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
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

const { $gsap } = useNuxtApp()

function updatePositions(updateText = false) {
  isAnimating.value = true
  let completed = 0
  const total = planetRefs.value.length
  
  // Mettre à jour les positions avant l'animation
  const newPositions = calculatePositions()
  positions.value = newPositions

  planetRefs.value.forEach((el, i) => {
    if (!el || !positions.value[i]) return
    const pos = positions.value[i]
    $gsap.to(el, {
      x: pos.x,
      y: pos.y,
      scale: pos.scale,
      duration: 2, // Réduire la durée pour un effet plus rapide
      ease: "power2.inOut",
      onComplete: () => {
        completed++
        if (updateText && i === 0) {
          updateTextPosition(el)
        }
        if (completed === total) {
          isAnimating.value = false
        }
      }
    })
  })
}

async function next() {
  if (isAnimating.value) return
  const first = planets.value.shift()
  if (first === undefined) return
  planets.value = [...planets.value, first] // Crée un nouveau tableau pour déclencher la réactivité
  console.log("planets : ", planets.value)
  await nextTick()
  updatePositions() // Met à jour les positions des planètes
}

async function prev() {
  if (isAnimating.value) return
  const last = planets.value.pop()
  if (last === undefined) return
  planets.value = [last, ...planets.value] // Crée un nouveau tableau pour déclencher la réactivité
  console.log("planets : ", planets.value)
  await nextTick()
  updatePositions() // Met à jour les positions des planètes
}

const currentService = computed(() => {
  return services[planets.value[0]]
})

onMounted(() => {
  updatePositions(false)
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