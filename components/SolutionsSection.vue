<template>
  <section class="relative w-full h-screen overflow-hidden flex items-center justify-center">
    <h2 class="absolute top-[20%] left-[20%] text-4xl font-bold text-white light-shadow-text text-center">
      Mes solutions        
    </h2>
    <transition name="fade" mode="out-in">
        <div class="flex items-center justify-center max-w-6xl gap-16">
            <ProjectorScreen 
            :key="currentIndex" 
            class="w-full" 
            :images="[currentSolution.image]" 
            />
            <div :key="'content-' + currentIndex" class="flex flex-col gap-4 text-white light-shadow-text">
            <h3 class="text-4xl font-bold">{{ currentSolution.title }}</h3>
            <div v-for="(desc, i) in currentSolution.description" :key="i">
                <p>{{ desc }}</p>
            </div>
            <button class="px-6 py-4 rounded-full bg-white text-black font-bold light-shadow-text hover:light-shadow hover:scale-105 transition-transform">
                {{ currentSolution.cta }}
            </button>
            </div>
        </div>
    </transition>

    <div>
      <button 
        class="absolute top-1/2 left-60 text-white text-9xl hover:scale-110 transition-transform" 
        @click="prev"
        :disabled="isAnimating"
      >
        &#8249;
      </button>
      <button 
        class="absolute top-1/2 right-60 text-white text-9xl hover:scale-110 transition-transform" 
        @click="next"
        :disabled="isAnimating"
      >
        &#8250;
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectorScreen from './ProjectorScreen.vue'

const currentIndex = ref(0)
const isAnimating = ref(false)

interface Solution {
  title: string
  description: string[]
  cta: string
  image: string
}

const solutions = ref<Solution[]>([
    {
        title: "Sites vitrines",
        description: [
            "Pour présenter votre activité, inspirer confiance et convertir vos visiteurs en prospects.",
            " Clair, rapide, à votre image… et surtout professionnel",
            "Le tout pensé pour rester flexible et évolutif : on peut facilement le faire évoluer en e-commerce ou en site plus complexe si besoin.",
        ],
        cta: "Discutons de votre projet",
        image: "/images/ProjectScreenCatra.png"
    },
    {
        title: "Site e-commerce ",
        description: [
            "Pour vendre vos produits ou services en ligne, simplement et efficacement.",
            "Catalogue produit, fiches détaillées, gestion des commandes, paiements sécurisés, suivi client…",
            "Tout est pensé pour que vous puissiez gérer votre boutique en autonomie.",
        ],
        cta: "Discutons de votre projet",
        image: "/images/ProjectScreenPARC.png"
    },
    {
        title: "Application mobile",
        description: [
            "Pour créer une application simple, centrée sur une fonctionnalité précise, pensée pour une utilisation mobile.",
        ],
        cta: "Discutons de votre projet",
        image: "/images/ProjectScreenPARC.png"
    },
    {
        title: "SEO & performance",
        description: [
            "J’optimise le chargement des pages, la structure du code et l’organisation du contenu.",
            "Tout est pensé pour améliorer la visibilité de votre site et respecter les bonnes pratiques du référencement naturel.",
        ],
        cta: "Discutons de votre projet",
        image: "/images/ProjectScreenPARC.png"
    },
    {
        title: "Optimisation UX & UI",
        description: [
           "Pour rendre votre site déjà existant plus agréable à utiliser et plus efficace.",
           "Je retravaille la structure, la navigation, les visuels et les messages pour fluidifier l’expérience et améliorer la conversion.",
        ],
        cta: "Discutons de votre projet",
        image: "/images/ProjectScreenPARC.png"
    },
    {
        title: "Autres besoins spécifiques",
        description: [
          "Vous avez une idée plus complexe ou hors cadre ? Aucun souci.",
          "Parlons-en ensemble pour trouver la meilleure solution adaptée à votre projet.",
        ],
        cta: "Discutons de votre projet",
        image: "/images/ProjectScreenPARC.png"
    },
])


const currentSolution = computed(() => solutions.value[currentIndex.value])

function next() {
  if (isAnimating.value) return
  isAnimating.value = true
  currentIndex.value = (currentIndex.value + 1) % solutions.value.length
  setTimeout(() => { isAnimating.value = false }, 500)
}

function prev() {
  if (isAnimating.value) return
  isAnimating.value = true
  currentIndex.value = (currentIndex.value - 1 + solutions.value.length) % solutions.value.length
  setTimeout(() => { isAnimating.value = false }, 500)
}

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>