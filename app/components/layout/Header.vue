<template>
  <!-- barre fixe 100% largeur, avec marge haute + latérales -->
  <header class="fixed top-2 left-1/2 -translate-x-1/2 z-50 w-full">
    <div class="mt-4 sm:mt-6 md:mt-8 mx-3 sm:mx-8 md:mx-16 lg:mx-32">
      <!-- capsule arrondie avec bord + glow + padding interne -->
      <div
        class="rounded-full border-2 sm:border-3 lg:border-4 border-white light-shadow
               px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 bg-transparent"
      >
        <div class="flex items-center justify-between text-white">
          <!-- bloc titre -->
          <div class="font-bold text-left">
            <div class="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl light-shadow-text">
              Grégoire MARCHAND
            </div>
            <div class="text-[11px] sm:text-sm md:text-base lg:text-lg xl:text-xl pl-2 lg:pl-4 -mt-1 light-shadow-text">
              Développeur Full-Stack
            </div>
          </div>

          <!-- navigation -->
          <nav class="pr-1 lg:pr-6 hidden">
            <ul class="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10
                       text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
              <li>
                <a href="#" class="block py-1 light-shadow-text hover:scale-105 transition-transform">
                  Projets
                </a>
              </li>
              <li>
                <a href="#" class="block py-1 light-shadow-text hover:scale-105 transition-transform">
                  Lab
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// aucun script nécessaire pour l’instant
</script>
