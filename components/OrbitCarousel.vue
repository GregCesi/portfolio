<template>
  <div ref="container" class="relative w-full h-screen overflow-hidden">
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

    <!-- Texte central -->
    <!-- <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div class="relative text-center max-w-md space-y-4 text-white">
        <h2 class="text-3xl font-bold relative inline-block">
          Écoute et sens
        </h2>
        <img src="/arrow-service.svg" alt="Arrow" class="absolute top-0 left-0 -translate-x-[40%]"/>
        <p class="font-bold">Être à l’écoute pour construire quelque chose qui a du sens.</p>
        <p>Avant de penser à la technique, je prends le temps de comprendre votre situation, vos contraintes, vos objectifs : je ne crée pas des sites. Je crée des outils qui font avancer.</p>
        <p>Cette écoute me permet de proposer des solutions qui anticipent vos besoins futurs.</p>
        <button class="mt-4 px-6 py-2 rounded-full bg-white text-black">Discutons de votre projet</button>
      </div>
    </div> -->

    <!-- Contrôles -->
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
      <button @click="next" class="text-2xl text-white">&#8592;</button>
      <button @click="prev" class="text-2xl text-white">&#8594;</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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

const planets = ref([0, 1, 2, 3])
const planetRefs = ref<HTMLElement[]>([])
const centerSphere = ref<HTMLElement | null>(null)

const positions = [
  { x: 200, y: 200, scale: 1 },
  { x: 900, y: 0, scale: 0.6 },
  { x: 1300, y: 250, scale: 0.8 },
  { x: 700, y: 460, scale: 0.9 },
]

const { $gsap } = useNuxtApp()

function updatePositions() {
  planetRefs.value.forEach((el, i) => {
    if (!el) return
    const pos = positions[i]
    $gsap.to(el, {
      x: pos.x,
      y: pos.y,
      scale: pos.scale,
      duration: 2,
    })
  })
}

function next() {
  const first = planets.value.shift()
  if (first === undefined) return
  planets.value.push(first)
  updatePositions()
}

function prev() {
  const last = planets.value.pop()
  if (last === undefined) return
  planets.value.unshift(last)
  updatePositions()
}

const currentService = computed(() => services[planets.value[0]])

onMounted(() => {
  updatePositions()
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