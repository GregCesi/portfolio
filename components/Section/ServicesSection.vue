<template>
    <section class="relative w-full h-screen overflow-hidden flex items-center justify-center">
        <h1 class="absolute top-[20%] left-[20%]  text-3xl font-bold text-white light-shadow-text">Ce que je peux vous apporter...</h1>
        <OrbitCarousel />
    </section>
</template>

<script setup lang="ts">
import OrbitCarousel from '../OrbitCarousel.vue'
</script>

<style scoped>
</style>