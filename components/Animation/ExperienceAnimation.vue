<template>
  <div class="relative">
    <!-- Ligne animée -->
    <div
      ref="line"
      class="line absolute left-1/2 transform -translate-x-1/2 bg-primary w-[4px] sm:w-[8px]"
    />

    <!-- Liste des expériences -->
    <div
      class="experience-wrapper overflow-hidden relative flex flex-col gap-16 place-self-center px-4 sm:py-32 pt-6"
    >
      <div
        v-for="(experience, index) in experiencesList"
        :key="index"
        :class="[
          'experience flex flex-col justify-center sm:flex-row items-center sm:items-start gap-6 sm:min-h-[300px] ',
          index % 2 === 0 ? 'lg:-translate-x-[25%]' : 'lg:translate-x-[25%]',
        ]"
      >
        <div
          class="content flex flex-col sm:flex-row gap-4 sm:w-[90%] lg:w-[40%] p-4 bg-gray-200 rounded-lg opacity-0 transform transition-transform duration-300 border-2 border-primary"
          :class="
            colorMode.value === 'dark' ? 'bg-primary-950' : 'bg-primary-50'
          "
        >
          <!-- Logo de l'entreprise -->
          <div class="basis-1/4 sm:basis-1/5">
            <img
              class="w-20 sm:w-24 lg:w-28"
              :src="experience.logo_company"
              alt="Logo entreprise"
            >
          </div>
          <!-- Contenu texte -->
          <div class="basis-3/4 sm:basis-4/5 flex flex-col gap-4">
            <div>
              <h3 class="text-2xl sm:text-3xl font-bold uppercase mb-2">
                {{ experience.title }}
              </h3>
              <div
                class="inline-flex font-medium rounded-md text-xs sm:text-sm px-2 py-1 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800"
              >
                {{ experience.date }}
              </div>
            </div>
            <p class="mt-2 text-sm sm:text-base text-pretty px-2">
              {{ experience.description }}
            </p>
            <!-- Technologies utilisées -->
            <div class="flex flex-col gap-4">
              <div class="text-base sm:text-lg font-bold">
                Technologies utilisées
              </div>
              <UCarousel v-slot="{ item }" :items="experience.logos">
                <img
                  :src="item"
                  class="w-10 sm:w-12 lg:w-16 mx-2"
                  draggable="false"
                >
              </UCarousel>
            </div>
          </div>
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
    title: "Modernisation d'un site vitrine",
    logo_company: "images/logo_company/Catra.jpeg",
    date: "Depuis novembre 2024",
    description:
      'Création d’un site vitrine moderne pour CATRA, un revendeur et prestataire de services pour Renault Trucks. L’objectif principal était de remplacer leur ancien site par une version plus actuelle et responsive, tout en permettant à l’équipe de CATRA de gérer facilement le contenu.',
    logos: [
      "images/logo_techno/wordpress.png",
      "images/logo_techno/php.png",
      "images/logo_techno/tailwind.png",
      "images/logo_techno/acf.png",
      "images/logo_techno/gsap.png",
    ],
  },
  {
    title: 'Développeur full-stack',
    logo_company: "images/logo_company/Ippon.webp",
    date: "De février 2024 à août 2024",
    description:
      'Contribution au développement d’Iroco2, une solution interne d’Ippon Technologies dédiée au GreenOps. Ce projet vise à accompagner les entreprises dans la mesure et la réduction de l’empreinte carbone de leurs infrastructures Cloud. En tant que développeur full-stack, j’ai travaillé sur différentes fonctionnalités, en collaboration avec l’équipe, pour garantir des performances optimales et une expérience utilisateur intuitive..',
    logos: [
      "images/logo_techno/vuejs.png",
      "images/logo_techno/nuxt.png",
      "images/logo_techno/tailwind.png",
      "images/logo_techno/typescript.png",
      "images/logo_techno/java.png",
      "images/logo_techno/springboot.png",
    ],
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
      markers: false, // Affiche les points de déclenchement
    },
    height: "103%", // Ligne dynamique
  });

  // Animation des expériences
  const experienceElements = document.querySelectorAll('.experience');

  experienceElements.forEach((experience, index) => {
    const isLeft = index % 2 === 0;

    $gsap.fromTo(
      experience.querySelector('.content'),
      {
        x: window.innerWidth >= 640 ? (isLeft ? '-100%' : '100%') : '0%', // Animation horizontale seulement sur desktop
        y: window.innerWidth < 640 ? '50%' : '0%', // Animation verticale pour mobile
        opacity: 0,
      },
      {
        x: '0%',
        y: '0%',
        opacity: 1,
        scrollTrigger: {
          trigger: experience,
          start: 'top 80%', // Animation quand 80% visible
          end: 'top 60%', // Terminé après un léger scroll
          scrub: true,
          markers: false, // Affiche les markers ici aussi
        },
      }
    );
  })
});
</script>

<style scoped>
.content {
  transition:
    transform 0.3s,
    opacity 0.3s; /* Transition initiale */
}
</style>
