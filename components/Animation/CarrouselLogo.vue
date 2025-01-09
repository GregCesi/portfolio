<template>
  <div
    class="relative overflow-hidden w-full h-12 sm:h-24 bg-primary-100"
    :class="colorMode.value === 'dark' ? 'bg-primary-950' : 'bg-primary-100'"
  >
    <!-- Conteneur des logos -->
    <div ref="logosContainer" class="logos flex">
      <img
        v-for="(logo, index) in logos"
        :key="'logo-' + index"
        :src="logo"
        alt="Logo"
        class="w-12 h-12 sm:w-24 sm:h-24 object-contain mx-4"
      >
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';

const colorMode = useColorMode()

const logos = [
  "images/logo_techno/vuejs.png",
  "images/logo_techno/tailwind.png",
  "images/logo_techno/typescript.png",
  "images/logo_techno/wordpress.png",
]; // Liste des logos

const logosContainer = ref(null);

onMounted(() => {
  const { $gsap } = useNuxtApp();

  // Duplique les logos pour permettre un défilement fluide
  const container = logosContainer.value;
  const logosLength = container.children.length;

  for (let i = 0; i < logosLength; i++) {
    const clone = container.children[i].cloneNode(true);
    container.appendChild(clone);
  }

  // Animation GSAP pour le défilement infini
  $gsap.to(container, {
    x: `-${container.scrollWidth / 2}px`, // Fait défiler la moitié des éléments (une boucle complète)
    duration: 10, // Durée de l'animation
    repeat: -1, // Boucle infinie
    ease: 'linear', // Défilement fluide
  });
})
</script>

<style scoped>
/* Assure que le conteneur est masqué en dehors de la zone visible */
.overflow-hidden {
  position: relative;
  white-space: nowrap;
}

.logos img {
  display: inline-block;
}
</style>
