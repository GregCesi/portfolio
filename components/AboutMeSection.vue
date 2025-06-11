<template>
    <section class="container mx-auto mt-[32rem]">
        <div class="max-w-4xl mx-auto flex gap-8 border-4 border-white light-shadow rounded-full p-8 items-center">
            <ProjectorCircleScreen :image="'/images/PDP.jpg'" />
            <div class="flex flex-col gap-4">
                <div class="font-bold text-white light-shadow-text">
                    <h2 class="text-2xl ">Grégoire MARCHAND</h2>
                    <p class="text-lg -mt-1 ml-2">Développeur full-stack</p>
                </div>
                <p class="text-white light-shadow-text"> Grégoire MARCHAND est un développeur full-stack passionné par la création d'expériences utilisateur exceptionnelles. Mon parcours m'a permis de développer des sites web m'assurant que chaque projet est optimisé pour les utilisateurs et les moteurs de recherche.</p>
                <button 
                    class="w-1/2 sm:w-auto flex-1 rounded-full bg-white light-shadow light-shadow-text-black text-base sm:text-lg md:text-lg text-black justify-center font-bold px-4 py-3 sm:py-4 hover:scale-105 transition-transform place-self-end mr-12" 

                >
                    En découvrir plus sur moi
                </button>
            </div>
        </div>
        <ProjectSection />
    </section>
</template>

<script setup lang="ts">
import ProjectorCircleScreen from './ProjectorCircleScreen.vue'
import ProjectSection from './ProjectSection.vue'
</script>
