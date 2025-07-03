<template>
    <section class="container mx-auto flex items-center">
        <!-- A propos de moi -->
        <div class="w-2/3 flex flex-col gap-32 mt-20">
            <div class="flex items-center justify-center gap-8 ml-28">
                <div>
                    <ProjectorCircleScreen image="images/PDP.jpg" />
                </div>
                <div class="flex flex-col gap-4 text-white light-shadow-text text-balance ">
                    <p class="text-lg font-bold">Enchanté, je suis Grégoire MARCHAND, développeur fullstack.</p>
                    <p class="text-lg font-bold">Je serais votre guide dans cette vaste univers du numérique.</p>
                    <p>Grâce à mes nombreuses années de passion pour le code, d’experiences variés au fin fond de la galaxie. Je suis aujourd’hui capable de vous aider a conceptualiser et developper vos futurs solutions et vous permettrent de naviguer correctement votre activité.</p>
                </div>
            </div>
            <div class="relative flex flex-col gap-8 items-center justify-center">
                <div class="w-full flex flex-col items-center">
                    <p class="text-white light-shadow-text text-center w-1/2">Envie d'en découvrir plus sur moi ?</p>
                    <p class="text-white light-shadow-text text-center w-1/2">Mes compétences techniques et mon parcours professionnel ?</p>
                </div>
                <button class="px-6 py-4 rounded-full bg-white text-black font-bold light-shadow-text hover:light-shadow hover:scale-105 transition-transform">
                    En découvrir plus sur moi
                </button>
                <div class="absolute -z-10">
                    <ThreeSphere model="Planet-2" :width="'300'" :height="'300'" class="orbit-sphere w-32 h-32 pointer-events-none" />
                </div>
            </div>
       </div>
       <!-- Projets -->
       <aside class="w-1/3 flex flex-col gap-4 items-center mt-20">
            <h2 class="text-2xl font-bold text-white light-shadow-text text-center">Mes projets récents</h2>
            <ProjectorScreen 
                :images="['/images/ScreenProjector/ProjectScreenCatra.png', '/images/ScreenProjector/ProjectScreenPARC.png']"
                width="70%"
                max-width="800px"
                projector-width="200px"
            />
            <ProjectorScreen 
                :images="['/images/ScreenProjector/ProjectScreenPARC.png', '/images/ScreenProjector/ProjectScreenCatra.png']"
                width="70%"
                max-width="800px"
                projector-width="200px"
            />
       </aside>
    </section>
</template>

<script setup lang="ts">
import ProjectorCircleScreen from '../ProjectorCircleScreen.vue'
import ProjectorScreen from '../ProjectorScreen.vue'
import ThreeSphere from '../ThreeSphere.vue'
</script>

<style scoped>
@keyframes ellipseOrbit {
  0% {
    --angle: 0deg;
    transform: 
      translate(-50%, -50%)
      translate(calc(200px * cos(var(--angle))), calc(150px * sin(var(--angle))));
  }
  100% {
    --angle: 360deg;
    transform: 
      translate(-50%, -50%)
      translate(calc(200px * cos(var(--angle))), calc(100px * sin(var(--angle))));
  }
}

.orbit-sphere {
  top: 50%;
  left: 50%;
  animation: ellipseOrbit 20s linear infinite;
}

@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
</style>
