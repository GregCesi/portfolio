<template>
    <section class="container mx-auto flex items-center">
        <!-- A propos de moi -->
        <div class="w-2/3 flex flex-col gap-32 mt-20">
            <div class="flex items-center justify-center gap-8 ml-28">
                <div>
                    <ProjectorCircleScreen image="images/PDP.jpg" />
                </div>
                <div class="flex flex-col gap-4 text-white light-shadow-text text-balance ">
                    <p>Enchanté, je suis Grégoire MARCHAND, développeur fullstack.</p>
                    <p>Je serais votre guide dans cette vaste univers du numérique.</p>
                    <p>Grâce à mes nombreuses années de passion pour le code, d’experiences variés au fin fond de la galaxie. Je suis aujourd’hui capable de vous aider a conceptualiser et developper vos futurs solutions et vous permettrent de naviguer correctement votre activité.</p>
                </div>
            </div>
            <div class="flex flex-col gap-8 items-center justify-center">
                <p class="text-white light-shadow-text text-center w-1/2">Envie d'en découvrir plus sur moi ? Mes compétences techniques et mon parcours professionnel ?</p>
                <button class="px-6 py-4 rounded-full bg-white text-black font-bold light-shadow-text hover:light-shadow hover:scale-105 transition-transform">
                    En découvrir plus sur moi
                </button>
            </div>
       </div>
       <!-- Projets -->
       <aside class="w-1/3 flex flex-col gap-4 items-center mt-20">
            <h2 class="text-2xl font-bold text-white light-shadow-text text-center">Mes projets récents</h2>
            <ProjectorScreen 
                :images="['/images/ProjectScreenCatra.png', '/images/ProjectScreenPARC.png']"
                width="70%"
                max-width="800px"
                projector-width="200px"
            />
            <ProjectorScreen 
                :images="['/images/ProjectScreenCatra.png', '/images/ProjectScreenPARC.png']"
                width="70%"
                max-width="800px"
                projector-width="200px"
            />
       </aside>
    </section>
</template>

<script setup lang="ts">
import ProjectorCircleScreen from './ProjectorCircleScreen.vue'
import ProjectSection from './ProjectSection.vue'
</script>
