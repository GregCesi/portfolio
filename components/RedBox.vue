<template>
    <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
      <!-- Titre animé -->
      <h1 ref="title" class="text-4xl font-bold text-gray-800 mb-5">
        Bienvenue chez CATRA
      </h1>
  
      <!-- Boîte animée -->
      <div ref="box" class="w-32 h-32 bg-blue-500 rounded-lg"></div>
  
      <!-- Bouton pour déclencher l'animation -->
      <button
        @click="triggerAnimation"
        class="mt-5 px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-blue-500 transition-colors duration-300"
      >
        Animer
      </button>
    </div>
  </template>
  
  <script>
  import { gsap } from "gsap";
  
  export default {
    name: "GsapAnimation",
    mounted() {
      // Animation d'entrée du titre
      gsap.from(this.$refs.title, {
        x: -300, // Le titre commence hors de l'écran à gauche
        opacity: 0, // Le titre est invisible au départ
        duration: 1.5, // Durée de l'animation
        ease: "power3.out", // Animation fluide
      });
    },
    methods: {
      triggerAnimation() {
        // Animation de la boîte
        gsap.to(this.$refs.box, {
          rotate: 360, // Rotation complète
          scale: 1.5, // Agrandissement
          backgroundColor: "#ff6347", // Changement de couleur
          duration: 1, // Durée
          ease: "elastic.out(1, 0.3)", // Effet élastique
          onComplete: () => {
            // Retour à l'état initial
            gsap.to(this.$refs.box, {
              rotate: 0,
              scale: 1,
              backgroundColor: "#3b82f6", // Couleur initiale
              duration: 1,
              ease: "power2.inOut",
            });
          },
        });
      },
    },
  };
  </script>
  
  <style scoped>
  /* Pas de styles additionnels nécessaires */
  </style>
  