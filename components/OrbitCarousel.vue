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
        <ThreeSphere class="w-40 h-40" />
      </div>
    </div>

    <!-- Texte positionné à côté de la planète principale -->
    <div 
      ref="textElement" 
      class="absolute max-w-2xl space-y-4 text-white"
      :style="{
        left: `${textPosition.x}px`,
        top: `${textPosition.y}px`,
        transform: 'translateY(-50%)'
      }"
    >
      <h2 class="text-3xl font-bold relative">
        Écoute et sens
      </h2>
      <img src="/arrow-service.svg" alt="Arrow" class="absolute -left-8 top-8 -translate-x-10 -translate-y-2"/>
      <div class="space-y-4">
        <p class="font-bold">Être à l'écoute pour construire quelque chose qui a du sens.</p>
        <p>Avant de penser à la technique, je prends le temps de comprendre votre situation, vos contraintes, vos objectifs : je ne crée pas des sites. Je crée des outils qui font avancer.</p>
        <p>Cette écoute me permet de proposer des solutions qui anticipent vos besoins futurs.</p>
      </div>
      <button class="mt-4 px-6 py-2 rounded-full bg-white text-black">Discutons de votre projet</button>
    </div>

    <!-- Contrôles -->
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
      <button @click="prev" :disabled="isAnimating" class="text-2xl text-white">&#8592;</button>
      <button @click="next" :disabled="isAnimating" class="text-2xl text-white">&#8594;</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useNuxtApp } from '#app'
import ThreeSphere from './ThreeSphere.vue'

interface Service {
  title: string
  description: string
  cta: string
}

const services: Service[] = [
  {
    title: 'Service A',
    description: 'Description du service A',
    cta: 'En savoir plus',
  },
  {
    title: 'Service B',
    description: 'Description du service B',
    cta: 'En savoir plus',
  },
  {
    title: 'Service C',
    description: 'Description du service C',
    cta: 'En savoir plus',
  },
  {
    title: 'Service D',
    description: 'Description du service D',
    cta: 'En savoir plus',
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


// Mettre à jour la position du texte par rapport à la planète principale
function updateTextPosition(planetElement: HTMLElement) {
  if (!planetElement || !textElement.value) return
  
  const planetRect = planetElement.getBoundingClientRect()
  const containerRect = container.value?.getBoundingClientRect()
  
  if (!containerRect) return
  
  // Positionner le texte à droite de la planète principale
  textPosition.value = {
    x: planetRect.right - containerRect.left + 20, // 20px de marge
    y: planetRect.top - containerRect.top + (planetRect.height / 2)
  }
}

// Fonction pour calculer les positions en fonction de la largeur de l'écran
function calculatePositions() {
  const width = window.innerWidth
  const height = window.innerHeight
  const scaleFactor = Math.min(width / 1920, 1)
  
  // Positions de base (en pourcentage de la largeur/hauteur)
   const basePositions = [
    { x: 0.1, y: 0.25, scale: 1 },    // 10% depuis la gauche, 20% depuis le haut
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
  planetRefs.value.forEach((el, i) => {
    if (!el || !positions.value[i]) return
    const pos = positions.value[i]
    $gsap.to(el, {
      x: pos.x,
      y: pos.y,
      scale: pos.scale,
      duration: 2,
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

function next() {
  if (isAnimating.value) return
  const first = planets.value.shift()
  if (first === undefined) return
  planets.value.push(first)
  updatePositions()
}

function prev() {
  if (isAnimating.value) return
  const last = planets.value.pop()
  if (last === undefined) return
  planets.value.unshift(last)
  updatePositions()
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