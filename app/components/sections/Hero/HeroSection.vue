<template>
  <BaseSection>
    <h1 class="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight light-shadow-text text-white text-balance">
      Booster votre activité avec des solutions sur-mesure
    </h1>

    <!-- Texte desktop -->
    <div class="hidden sm:flex flex-col gap-8 text-lg sm:text-xl md:text-2xl text-white pb-4">
      <div>
        <p>Je conçois des solutions sur-mesure, pensées pour s'adapter</p>
        <p class="font-bold">à votre activité, à vos objectifs, et à votre budget.</p>
      </div>
      <div>
        <p>Mon rôle : vous accompagner à chaque étape,</p>
        <p>en créant un outil qui <span class="font-bold">évolue avec vous.</span></p>
      </div>
    </div>

    <!-- Texte mobile -->
    <div class="sm:hidden text-sm sm:text-xl md:text-2xl text-white space-y-4 text-balance pb-2">
      <p>
        Je conçois des solutions sur-mesure, pensées pour s'adapter
        <span class="font-bold">à votre activité, à vos objectifs, et à votre budget.</span>
      </p>
      <p>
        Mon rôle : vous accompagner à chaque étape,
        en créant un outil qui <span class="font-bold">évolue avec vous.</span>
      </p>
    </div>

    <!-- Boutons -->
    <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full max-w-xs sm:max-w-3xl lg:max-w-4xl mx-auto">
      <button 
        class="w-full sm:w-auto flex-1 rounded-full bg-white light-shadow light-shadow-text-black text-base sm:text-xl lg:text-2xl text-black font-bold px-6 py-2 sm:py-6 hover:scale-105 transition-transform"
      >
        Discutons de votre projet
      </button>
      <button 
        class="w-full sm:w-auto flex-1 rounded-full border-2 sm:border-4 border-white light-shadow text-base sm:text-xl lg:text-2xl text-white bg-transparent px-6 py-2 sm:py-6 hover:scale-105 transition-transform"
      >
        Comment je vous accompagne ?
      </button>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import BaseSection from '~/components/sections/BaseSection.vue'
</script>
