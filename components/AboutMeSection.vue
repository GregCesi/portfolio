<template>
    <section class="container mx-auto">
        <div class="max-w-5xl mx-auto flex gap-16 rounded-full p-8 items-center">
            <ProjectorCircleScreen :image="'/images/PDP.jpg'" />
            <div class="flex flex-col gap-8">
                <div class="font-bold text-white light-shadow-text">
                    <h2 class="text-2xl ">Grégoire MARCHAND</h2>
                    <p class="text-lg -mt-1 ml-2">Développeur full-stack</p>
                </div>
                <p class="text-white light-shadow-text"> 
                    Je suis développeur freelance full-stack . 
                    J’accompagne start-ups, PPE et PME en transformant leurs besoins en interfaces 
                    intuitives et performantes. Passionné par la logique et les défis, je crée des 
                    solutions sur-mesure pour optimiser vos process et booster votre croissance. 
                    Prêt à relever votre prochain challenge ? 
                </p>
                <button 
                    class="w-1/2 sm:w-auto flex-1 rounded-full bg-white hover:light-shadow light-shadow-text-black text-base sm:text-lg md:text-lg text-black justify-center font-bold px-4 py-3 sm:py-4 hover:scale-105 transition-transform place-self-end mr-12" 

                >
                    En découvrir plus sur moi
                </button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import ProjectorCircleScreen from './ProjectorCircleScreen.vue'
import ProjectSection from './ProjectSection.vue'
</script>
