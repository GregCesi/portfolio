
<template class="flex flex-col gap-16">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

  <!-- Menu -->
  <Header></Header>
  
  <!-- Présentation du site -->
  <section class="container mx-auto mt-16">
    <div class="flex flex-col lg:flex-row px-4 gap-16 py-16">

      <!-- Partie gauche-->
      <div class="basis-1/2 flex flex-col gap-4">
        <h1 class="text-pretty text-4xl xl:text-5xl font-bold pb-8">Bienvenue sur mon Portfolio</h1>
        <p class="text-pretty">Passionné par le développement, j’aime relever de nouveaux défis et je serai ravi de vous <span class="font-bold text-primary">accompagner dans vos projets.</span> </p> 
        <p class="text-pretty">Ici, vous découvrirez mon <span class="font-bold text-primary">parcours</span> et mes <span class="font-bold text-primary">réalisations</span>. Prenez quelques instants pour explorer le site, j’espère qu’il saura vous donner envie d’en savoir plus et, qui sait, de collaborer ensemble !</p>
        <div class="flex gap-4 place-self-end py-4">
          <UButton size="xl" color="primary" variant="soft"><UIcon class="text-xl" name="i-heroicons-envelope-solid"></UIcon>Me contacter</UButton>
          <UButton size="xl" color="primary" variant="soft"><UIcon class="text-xl" name="i-heroicons-document-text-solid"></UIcon>Mon CV</UButton>
        </div>
      </div>

      <!-- Partie droite-->
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
    <Services></Services>
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

  <!-- Footer -->
   <Footer></Footer>

</template>

<script setup lang="ts">
  import ExperienceAnimation from '~/components/Animation/ExperienceAnimation.vue';
  import AccordionFAQ from '@/components/AccordionFAQ.vue';
  import CarrouselLogo from '~/components/Animation/CarrouselLogo.vue';
  import Header from './components/Header.vue';
  import Services from './components/Services.vue';
  import Footer from './components/Footer.vue';

  import { useColorMode } from '#imports'
  const colorMode = useColorMode()

</script>