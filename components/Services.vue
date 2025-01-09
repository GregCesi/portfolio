<template>
    
    <UDivider size="lg"><h2 class="text-2xl lg:text-4xl font-bold text-center py-8">Des services selon vos besoins</h2></UDivider>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:max-w-[80%] xl:max-w-[75%] gap-8 p-4 mx-auto">
      
      <div class="flex flex-col gap-4 p-4 rounded-lg " :class="colorMode.value === 'dark' ? 'bg-primary-950' : 'bg-primary-100'">
        <div class="flex gap-2 items-center">
          <UIcon class="text-3xl" name="i-heroicons-computer-desktop"></UIcon>
          <h3 class="font-bold text-lg">Sites vitrines</h3>
        </div>
        <p class="my-auto ml-2">Des sites conçus pour mettre en valeur votre activité, avec un design moderne et responsive. Que ce soit pour présenter votre entreprise, un projet, ou un événement, chaque site est unique et pensé pour capter l'attention de vos visiteurs.</p>
      </div>

      <div class="flex flex-col gap-4 p-4 rounded-lg" :class="colorMode.value === 'dark' ? 'bg-primary-950' : 'bg-primary-100'">
        <div class="flex gap-2 items-center">
          <UIcon class="text-3xl" name="i-heroicons-wallet"></UIcon>
          <h3 class="font-bold text-lg">Sites d'e-commerce</h3>
        </div>
        <p class="my-auto ml-2">Des boutiques en ligne performantes et faciles à gérer, adaptées à vos besoins. Que vous vendiez des produits physiques ou numériques, l’objectif est de créer une expérience d’achat fluide pour vos clients.</p>
      </div>

      <div class="flex flex-col gap-4 p-4 rounded-lg" :class="colorMode.value === 'dark' ? 'bg-primary-950' : 'bg-primary-100'">
        <div class="flex gap-2 items-center">
          <UIcon class="text-3xl" name="i-heroicons-presentation-chart-line"></UIcon>
          <h3 class="font-bold text-lg">Optimisation UX et SEO</h3>
        </div>
        <p class="my-auto ml-2">Un site beau, c’est bien. Mais un site optimisé pour vos utilisateurs et pour les moteurs de recherche, c’est encore mieux. Amélioration de l’expérience utilisateur, optimisation des temps de chargement et des performances, tout est fait pour que votre site soit à la hauteur.</p>
      </div>

      <div class="flex flex-col gap-4 p-4 rounded-lg" :class="colorMode.value === 'dark' ? 'bg-primary-950' : 'bg-primary-100'">
        <div class="flex gap-2 items-center">
          <UIcon class="text-3xl" name="i-heroicons-device-phone-mobile"></UIcon>
          <h3 class="font-bold text-lg">Applications web et mobiles</h3>
        </div>
        <p class="my-auto ml-2">Développement d’applications modernes, accessibles depuis n’importe quel appareil. Multiplateformes (iOS et Android), elles sont adaptées à vos besoins, que ce soit pour simplifier un processus ou proposer une solution innovante.</p>
      </div>

    </div>
    
</template>

<script setup lang="ts">
  import { useColorMode } from '#imports'
  const colorMode = useColorMode()
</script>