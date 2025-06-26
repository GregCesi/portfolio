<template>
    <section class="relative w-full h-screen overflow-hidden flex items-center justify-center">
        <h2 class="absolute top-[20%] left-[20%] text-4xl font-bold text-white light-shadow-text text-center">
            Mes solutions        
        </h2>
        <div class="flex items-center justify-center max-w-6xl gap-16">
            <ProjectorScreen class="w-full" :images="['/images/ProjectScreenCatra.png', '/images/ProjectScreenPARC.png']" />
            <div class="flex flex-col gap-4 text-white light-shadow-text">
                <h3 class="text-4xl font-bold">Sites vitrines</h3>
                <p>Pour présenter votre activité, inspirer confiance et convertir vos visiteurs en prospects.  Clair, rapide, à votre image… et surtout professionnel.  Le tout pensé pour rester flexible et évolutif : on peut facilement le faire évoluer en e-commerce ou en site plus complexe si besoin.</p>
                <button class="px-6 py-4 rounded-full bg-white text-black font-bold light-shadow-text hover:light-shadow hover:scale-105 transition-transform">
                    Discutons de votre projet
                </button>
            </div>
        </div>

        <div class="">
            <button class="absolute top-1/2 left-60 text-white text-9xl">
                 &#8249;
            </button>
            <button class="absolute top-1/2 right-60 text-white text-9xl">
                &#8250;
            </button>
        </div>
    </section>
</template>

<script setup lang="ts">
import ProjectorScreen from './ProjectorScreen.vue'
</script>