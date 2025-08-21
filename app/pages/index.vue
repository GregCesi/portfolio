<template>
  <BackgroundHyperspace />
  <SlideContainer @section-change="triggerWarp">
    <section class="slide"><HeroSection /></section>
    <section class="slide"><AboutSection /></section>
    <section class="slide"><ValueSection /></section>
    <section class="slide"><RoadmapSection /></section>
    <section class="slide"><SolutionsSection /></section>
  </SlideContainer>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app'

import BackgroundHyperspace from '@/components/background/BackgroundHyperspace.vue'
import SlideContainer from '@/components/SlideContainer.vue'
import HeroSection from '@/components/sections/Hero/HeroSection.vue'
import AboutSection from '@/components/sections/AboutMe/AbouteMeSection.vue'
import ValueSection from '@/components/sections/Value/ValueSection.vue'
import RoadmapSection from '@/components/sections/Roadmap/RoadmapSection.vue'
import SolutionsSection from '@/components/sections/Solutions/SolutionsSection.vue'

const { $emitter } = useNuxtApp() as any

function triggerWarp() {
  $emitter.emit('accelerate-stars')
}
</script>

<style scoped>
.slide {
  height: 100vh;
}
</style>
