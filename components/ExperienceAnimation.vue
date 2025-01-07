<template>
    <div class="relative">
      <!-- Ligne animée -->
      <div 
        class="line absolute left-1/2 transform -translate-x-1/2 bg-primary w-[8px]"
        ref="line">
      </div>
  
      <!-- Liste des expériences -->
      <div class="experience-wrapper relative flex flex-col gap-16 place-self-center py-32">
        <div 
          v-for="(experience, index) in experiencesList" 
          :key="index" 
          :class="[
            'experience w-full flex min-h-[300px]',
            index % 2 === 0 ? '-translate-x-[80%]' : 'translate-x-[80%]'
          ]"
        >
          <div 
            class="content w-[300px] p-4 bg-gray-200 rounded-lg opacity-0 transform transition-transform duration-300 border-2 border-primary"
            :class="colorMode.value === 'dark' ? 'bg-primary-950' : 'bg-primary-50'"
          >
            <h3 class="text-xl font-bold">{{ experience.title }}</h3>
            <p class="mt-2 text-gray-600">{{ experience.description }}</p>
          </div>
        </div>
      </div>
    </div>
</template>  

<script setup>
import { onMounted, ref } from 'vue';
import { useNuxtApp } from '#app';
import { useColorMode } from '#imports';

const colorMode = useColorMode();

const line = ref(null); // Référence pour la ligne

// Liste des expériences avec variables "title" et "description"
const experiencesList = ref([
  {
    title: 'Expérience 1',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    title: 'Expérience 2',
    description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    title: 'Expérience 3',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  },
]);

onMounted(() => {
  const { $gsap } = useNuxtApp();

  // Animation de la ligne
  $gsap.to(line.value, {
    scrollTrigger: {
      trigger: '.experience-wrapper',
      start: 'top center',
      end: 'bottom center',
      scrub: true,
    },
    height: () => `${document.querySelector('.experience-wrapper').offsetHeight}px`, // Ligne dynamique
  });

  // Animation des expériences
  const experienceElements = document.querySelectorAll('.experience'); // Récupère tous les éléments avec la classe "experience"

  experienceElements.forEach((experience, index) => {
    const isLeft = index % 2 === 0; // Détermine si l'expérience est à gauche ou à droite
    $gsap.fromTo(
      experience.querySelector('.content'),
      {
        x: isLeft ? '-100%' : '100%', // Déplacement initial selon la position
        opacity: 0,
      },
      {
        x: '0%', // Arrive à sa position finale
        opacity: 1,
        scrollTrigger: {
          trigger: experience, // Déclenché par l'entrée dans la vue
          start: 'top 80%', // Début de l'animation quand 80% de l'élément est visible
          end: 'top 60%', // Fin de l'animation après avoir scrollé un peu
          scrub: true,
        },
      }
    );
  });
});
</script>


  
  
<style scoped>
  .content {
    transition: transform 0.3s, opacity 0.3s; /* Transition initiale */
  }
</style>
  