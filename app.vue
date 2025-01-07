<template class="flex flex-col gap-16">
<div class="dark:bg-primary-900">
  <!-- Menu -->
  <section class="flex justify-between p-4 bg-custom_white font-bold shadow-xl">
    <div>Grégoire MARCHAND</div>
    <div>Mes projets</div>
    <ColorModeButton></ColorModeButton>
  </section>

  <!-- Présentation du site -->
  <section class="container mx-auto">
    
    <div class="flex flex-col lg:flex-row px-4 gap-16 py-16">

      <div class="basis-1/2 flex flex-col gap-4">
        <h1 class="text-pretty text-4xl xl:text-5xl font-bold pb-8">Bienvenue sur mon Portfolio</h1>
        <p class="text-pretty">Passionné par le développement, j’aime relever de nouveaux défis et je serai ravi de vous <span class="font-bold text-primary">accompagner dans vos projets.</span> </p> 
        <p class="text-pretty">Ici, vous découvrirez mon <span class="font-bold text-primary">parcours</span> et mes <span class="font-bold text-primary">réalisations</span>. Prenez quelques instants pour explorer le site, j’espère qu’il saura vous donner envie d’en savoir plus et, qui sait, de collaborer ensemble !</p>
        <div class="flex gap-4 place-self-end mr-12 py-4">
          <UButton size="xl" color="primary" variant="soft"><UIcon class="text-xl" name="i-heroicons-envelope-solid"></UIcon>Me contacter</UButton>
          <UButton size="xl" color="primary" variant="soft"><UIcon class="text-xl" name="i-heroicons-document-text-solid"></UIcon>Mon CV</UButton>
        </div>
      </div>

      <div class="mx-auto xl:basis-1/3 rounded-lg flex flex-col gap-8 p-8" :class="colorMode.value === 'dark' ? 'bg-primary-950' : 'bg-primary-100'" >
        <div class="flex gap-4 items-center">
          <img class="w-24 h-24 rounded-full object-cover" src="/Users/gregoiremarchand/Desktop/Code/portfolio/public/images/PDP.jpg"/>
          <div>
            <h2 class="font-bold text-3xl">Grégoire MARCHAND</h2>
            <p>Développeur full-stack</p>
          </div>
        </div>
        
        <div class="flex m-auto"> 
          <CarrouselLogo></CarrouselLogo>
        </div>
          
      </div>

    </div>
  </section>

  <!-- Presentation des services -->
  <section class="container mx-auto py-8">
    <UDivider size="lg"><h2 class="text-4xl font-bold text-center py-8">Des services selon vos besoins</h2></UDivider>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:max-w-[80%] xl:max-w-[60%] gap-8 p-4 mx-auto">
      
      <div class="flex flex-col gap-2 p-4 rounded-lg " :class="colorMode.value === 'dark' ? 'bg-primary-950' : 'bg-primary-100'">
        <div class="flex gap-2 items-center">
          <UIcon class="text-3xl" name="i-heroicons-computer-desktop"></UIcon>
          <h3 class="font-bold text-lg">Site vitrine</h3>
        </div>
       
        <p class="text-balance">Je suis capable de réaliser des sites vitrines pour votre entreprise avec des CMS comme WordPress pour vous permettre d'éditer le contenu.</p>
      </div>

      <div class="flex flex-col gap-2 p-4 rounded-lg" :class="colorMode.value === 'dark' ? 'bg-primary-950' : 'bg-primary-100'">
        <div class="flex gap-2 items-center">
          <UIcon class="text-3xl" name="i-heroicons-computer-desktop"></UIcon>
          <h3 class="font-bold text-lg">Site vitrine</h3>
        </div>
        <p class="text-balance">Je suis capable de réaliser des sites vitrines pour votre entreprise avec des CMS comme WordPress pour vous permettre d'éditer le contenu.</p>
      </div>

      <div class="flex flex-col gap-2 p-4 rounded-lg" :class="colorMode.value === 'dark' ? 'bg-primary-950' : 'bg-primary-100'">
        <div class="flex gap-2 items-center">
          <UIcon class="text-3xl" name="i-heroicons-computer-desktop"></UIcon>
          <h3 class="font-bold text-lg">Site vitrine</h3>
        </div>
        <p class="text-balance">Je suis capable de réaliser des sites vitrines pour votre entreprise avec des CMS comme WordPress pour vous permettre d'éditer le contenu.</p>
      </div>

    </div>
  </section>

  <!-- Mes experiences -->
  <section class="container mx-auto py-8">
    <UDivider size="lg"><h2 class="text-4xl font-bold text-center py-8">Mes experiences</h2></UDivider>
    <ExperienceAnimation></ExperienceAnimation>
  </section>

  <!-- FAQ -->
  <section class="container mx-auto py-8">
    <UDivider size="lg"><h2 class="text-4xl font-bold text-center py-8">FAQ</h2></UDivider>
    <AccordionFAQ></AccordionFAQ>
  </section>

</div>
</template>

<script setup lang="ts">
  import ExperienceAnimation from '@/components/ExperienceAnimation.vue';
  import AccordionFAQ from '@/components/AccordionFAQ.vue';
  import CarrouselLogo from '@/components/CarrouselLogo.vue';
  import { useColorMode } from '#imports'

  import { ref, computed } from 'vue';

  import ColorModeButton from '@/components/ColorModeButton.vue';
  const colorMode = useColorMode()

  

</script>