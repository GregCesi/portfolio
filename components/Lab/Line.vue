<template>
    <div class="relative">
      <!-- La div parent avec position relative pour servir de conteneur à la ligne animée -->
  
      <!-- Ligne animée -->
      <div 
        class="line absolute left-1/2 transform -translate-x-1/2 bg-blue-500" 
        ref="line">
        <!-- Cette div représente la ligne animée. -->
        <!-- Classes utilisées : -->
        <!-- - absolute : Positionne la ligne par rapport à son parent (la div relative). -->
        <!-- - left-1/2 : Centre horizontalement la ligne en la décalant à 50% du parent. -->
        <!-- - transform -translate-x-1/2 : Ajuste la position pour que la ligne soit parfaitement centrée. -->
        <!-- - bg-blue-500 : Donne une couleur de fond à la ligne (bleu par défaut, peut être modifié). -->
        <!-- ref="line" : Permet de manipuler cette ligne dans le script avec GSAP. -->
      </div>
    
      <!-- Contenu pour le scroll -->
      <div class="content">
        <!-- Cette div sert de déclencheur pour l'animation. -->
        <div class="h-[1000px]"></div>
        <!-- La hauteur importante (3000px) simule un contenu long pour permettre le défilement. -->
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
import { onMounted, ref } from 'vue'; 
// - `onMounted` : Fonction de Vue qui exécute le code une fois que le composant est monté dans le DOM.
// - `ref` : Permet de créer une référence réactive pour manipuler directement des éléments HTML.

import { useNuxtApp } from '#app'; 

const line = ref(null); 
// - Création d'une référence pour accéder à la ligne animée dans le DOM.
// - `line.value` correspondra à l'élément `<div ref="line">`.

onMounted(() => {
  // - Le code dans cette fonction sera exécuté une fois que le composant est rendu dans le DOM.

  const { $gsap } = useNuxtApp(); 
  // - Récupère GSAP depuis les plugins Nuxt. Assure-toi que GSAP est bien configuré comme plugin.

  $gsap.to(line.value, {
    // - Crée une animation avec GSAP pour l'élément `line`.

    scrollTrigger: {
      // - Configure l'animation pour être déclenchée par le défilement de la page.

      trigger: '.content', 
      // - Définit `.content` comme élément déclencheur. 
      //   Cela signifie que l'animation commence lorsque cette section entre ou quitte la vue.

      start: 'top center', 
      // - Définit le point de départ de l'animation.
      //   "top center" signifie que l'animation démarre lorsque le haut de `.content` atteint le centre de la fenêtre.

      end: 'bottom center', 
      // - Définit le point de fin de l'animation.
      //   "bottom center" signifie que l'animation se termine lorsque le bas de `.content` quitte le centre de la fenêtre.

      scrub: true, 
      // - Synchronise l'animation avec le défilement. 
      //   Plus l'utilisateur scrolle, plus l'animation progresse.

    },

    height: '100%', 
    // - L'animation change la hauteur de la ligne.
    //   Elle commence à 0 et s'étend progressivement pour atteindre 100% de la hauteur de son parent.
  });
});
</script>


<style scoped>
.line {
  height: 0; /* Hauteur initiale à 0, la ligne commence invisible verticalement. */
  width: 8px; /* Épaisseur de la ligne (modifiable si besoin). */
  background-color: #0000ff; /* Couleur bleue par défaut, modifiable selon les préférences. */
}
</style>
