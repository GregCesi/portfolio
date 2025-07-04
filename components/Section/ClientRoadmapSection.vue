<template>
  <section class="relative container mx-auto mt-20 ">
    <h2 class="absolute hidden top-16 left-1/2 -translate-x-1/2 text-4xl font-bold text-white light-shadow-text text-center z-10">
      Comment je vous accompagne ?
    </h2>

    <div class="relative">
      <TimeLineRoadmap
        ref="timeline"
        :steps="steps"
        :active-step="activeStep"
        class="absolute left-16 top-1/2 -translate-y-1/2"
      />

      <div class="absolute top-1/2 left-[55%] -translate-x-1/2 -translate-y-[60%] z-10">
        <div ref="textRef" class="flex flex-col gap-8 text-white z-10 translate-x-16">
          <h3 class="text-5xl font-bold">{{ currentStep.title }}</h3>
          <div class="flex flex-col gap-4 text-2xl">
            <p v-for="description in currentStep.descriptions" :key="description" >
              {{ description }}
            </p>
          </div>
          
        </div>
      </div>

      <ThreeSphere 
        ref="sphereRef" 
        width="1000px" 
        height="1000px" 
        :model="currentStep.model" 
        :camera-position="4" 
        :enable-scan="shouldEnableScan"
        :satellite-model="shouldShowSatellite ? 'DSCOVR-Triana' : undefined"
        class="absolute left-1/2 -translate-x-[10%] translate-y-[5%]"
      />
    
      <div class="absolute bottom-40 left-[55%] -translate-x-1/2 text-white">
        <div class="flex gap-16 text-5xl">
          <button
            @click="prevStep"
            :disabled="isAnimating || activeStep === 0"
            class="transition-opacity"
            :class="{ 'opacity-50': isAnimating || activeStep === 0 }"
          >
            &#8592;
          </button>
          <button
            @click="nextStep"
            :disabled="isAnimating || activeStep === steps.length - 1"
            class="transition-opacity"
            :class="{ 'opacity-50': isAnimating || activeStep === steps.length - 1 }"
          >
            &#8594;
          </button>
        </div> 
      </div> 
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ComponentPublicInstance } from 'vue'
import { useNuxtApp } from '#app'
import ThreeSphere from '../ThreeSphere.vue'
import TimeLineRoadmap from '../TimeLineRoadmap.vue'

interface Step {
  title: string
  descriptions: string[]
  model: string
}

const { $gsap } = useNuxtApp()

const steps = ref<Step[]>([
  {
    title: "Premier contact",
    descriptions: [
      "Discutons ensemble de votre projet.", 
      "Un formulaire, un mail, un message : peu importe. Ce premier échange permet de fixer un rendez-vous pour faire connaissance et comprendre rapidement ce que vous cherchez."
    ],
    model: "Planet-1",
  },
  {
    title: "Échange découverte",
    descriptions: [
      "Comprendre votre entreprise, vos enjeux et vos besoins.", 
      "Ce call me permet de mieux cerner votre activité, vos objectifs, vos contraintes et vos idées. L’objectif ? Vous écouter et poser les bases d’un projet aligné avec vous."
    ],
    model: "Planet-1",
  },
  {
    title: "Proposition personnalisée",
    descriptions: [
      "Je vous présente une solution sur-mesure, à ajuster ensemble.", 
      "Je vous propose une structure claire, que l’on affine si besoin. Une fois la solution validée, on signe le devis et on se lance, avec un plan précis."
    ],
    model: "Planet-3",
  },
  {
    title: "Conception et suivi agile",
    descriptions: [
      "Vous suivez l’avancement du projet en temps réel.",
      "Je travaille en mode itératif, avec la possibilité de vous partager des maquettes, idées et avancements via Miro ou d'autres outils. Vous êtes impliqué(e) autant que vous le souhaitez."
    ],
    model: "Planet-4",
  },
  {
    title: "Livraison et déploiement",
    descriptions: [
      "Une solution fonctionnelle, optimisée, prête à être utilisée.",
      "Une fois le projet finalisé, je vous le livre dans les conditions définies. Je vous accompagne aussi pour le lancement si besoin."
    ],
    model: "Planet-5",
  },
  {
    title: "Suivi & évolution",
    descriptions: [
      "Le projet ne s’arrête pas à la livraison.",
      "Je reste disponible pour les mises à jour, ajustements ou évolutions futures. L’objectif est que vous puissiez faire grandir votre projet dans le temps, sans repartir de zéro."
    ],
    model: "Planet-5",
  }
]);

const activeStep = ref(0)
const isAnimating = ref(false)
const timeline = ref<InstanceType<typeof TimeLineRoadmap> | null>(null)
const textRef = ref<HTMLElement | null>(null)
const sphereRef = ref<ComponentPublicInstance | null>(null)
const currentStep = computed(() => steps.value[activeStep.value])

const shouldShowSatellite = computed(() => {
  // Par exemple, afficher le satellite uniquement pour les étapes 1 et 2 (index 0 et 1)
  return activeStep.value > 0
})

const shouldEnableScan = computed(() => {
  // Par exemple, activer le scan uniquement pour l'étape 1 (index 0)
  return activeStep.value > 0
})


async function goToStep(newIndex: number) {
  if (isAnimating.value) return
  isAnimating.value = true

  const elements: HTMLElement[] = []
  if (textRef.value) elements.push(textRef.value)
  if (sphereRef.value?.$el) elements.push(sphereRef.value.$el as HTMLElement)

  if (elements.length) {
    await $gsap.to(elements, { opacity: 0, duration: 2 })
  }

  if (newIndex > activeStep.value) {
    timeline.value?.removePulse(activeStep.value)
    await timeline.value?.expandLine(activeStep.value)
  } else if (newIndex < activeStep.value) {
    timeline.value?.deactivateCircle(activeStep.value)
    await timeline.value?.collapseLine(newIndex)
  }
  timeline.value?.activateCircle(newIndex)

  activeStep.value = newIndex

  if (elements.length) {
    await $gsap.to(elements, { opacity: 1, duration: 2 })
  }

  isAnimating.value = false
}

function nextStep() {
  if (activeStep.value >= steps.value.length - 1) return
  goToStep(activeStep.value + 1)
}

function prevStep() {
  if (activeStep.value <= 0) return
  goToStep(activeStep.value - 1)
}
</script>

    

    