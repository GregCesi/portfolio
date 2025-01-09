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
import TitleAnimation from "~/components/Lab/TitleAnimation.vue";
import BoxAnimation from '~/components/Animation/Lab/BoxAnimation.vue';
import RedBox from '~/components/Lab/RedBox.vue';
import CardTurn from './components/Animation/Lab/CardTurn.vue';

export default {
  components: {
    TitleAnimation,
    BoxAnimation,
    RedBox,
    CardTurn,
  },
}
</script>
