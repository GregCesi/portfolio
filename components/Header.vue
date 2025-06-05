<template>
  <header
    class="fixed top-0 left-0 right-0 mt-4 sm:mt-6 md:mt-8 mx-2 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-64 px-3 sm:px-4 py-2 sm:py-3 md:py-4 rounded-full border-2 sm:border-3 lg:border-4 border-white light-shadow z-50"
  >
    <div class="flex items-center justify-between text-white">
      <!-- Nom et Titre -->
      <div class="font-bold text-left sm:pl-4 lg:pl-8">
        <div class="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl light-shadow-text whitespace-nowrap">Grégoire MARCHAND</div>
        <div class="text-xs sm:text-base md:text-lg lg:text-xl pl-2 lg:pl-4 -mt-1 light-shadow-text">Développeur Full-Stack</div>
      </div>
      
      <!-- Navigation -->
      <nav class="pr-2 lg:pr-8">
        <ul class="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
          <li class="light-shadow-text hover:scale-105 transition-transform">
            <a href="#" class="block py-1 whitespace-nowrap">Projets</a>
          </li>
          <li class="light-shadow-text hover:scale-105 transition-transform">
            <a href="#" class="block py-1 whitespace-nowrap">Lab</a>
          </li>
        </ul> 
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">

</script>

<style scoped>
.light-shadow {
  /* offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: 0px 0px 30px 0px rgba(255, 255, 255, 0.7);
}

.light-shadow-text {
  /* décalage-X | décalage-Y | blur-radius | couleur */
  text-shadow: 0px 0px 15px rgba(255, 255, 255, 0.7);
}
</style>
