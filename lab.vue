<template>
    <div class="flex flex-col gap-0">
      <!-- Titre animé -->
      <TitleAnimation />
  
      <!-- Boîte animée avec rotation -->
      <BoxAnimation />
  
      <!-- Boîte rouge animée -->
      <RedBox />
  
      <CardTurn />
    </div>
  </template>
  
  <script>
  import TitleAnimation from '@/components/TitleAnimation.vue';
  import BoxAnimation from '@/components/BoxAnimation.vue';
  import RedBox from '@/components/RedBox.vue';
  import CardTurn from './components/CardTurn.vue';
  
  export default {
    components: {
      TitleAnimation,
      BoxAnimation,
      RedBox,
      CardTurn
    },
  };
  </script>
  