<template>
  <SlideMenu
    :labels="labels"
    :container="slideRef"
    @select="goToSection"
  />
  <SlideContainer ref="slideRef" @section-change="triggerWarp">
    <section class="slide"><HeroSection /></section>
    <section class="slide"><AboutSection /></section>
    <section class="slide"><ValueSection /></section>
    <section class="slide"><RoadmapSection /></section>
    <section class="slide"><SolutionsSection /></section>
  </SlideContainer>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app'

import SlideContainer from '@/components/SlideContainer.vue'
import SlideMenu from '@/components/navigation/SlideMenu.vue'
import HeroSection from '@/components/sections/Hero/HeroSection.vue'
import AboutSection from '@/components/sections/AboutMe/AbouteMeSection.vue'
import ValueSection from '@/components/sections/Value/ValueSection.vue'
import RoadmapSection from '@/components/sections/Roadmap/RoadmapSection.vue'
import SolutionsSection from '@/components/sections/Solutions/SolutionsSection.vue'

const { $emitter } = useNuxtApp() as any

const labels = ['Start', 'À propos', 'Valeur ajoutée', 'Roadmap', 'Solutions']
const slideRef = ref<InstanceType<typeof SlideContainer> | null>(null)
const currentIndex = ref(0)

function triggerWarp() {
  $emitter.emit('accelerate-stars')
}

function onSectionChange(index: number) {
  currentIndex.value = index
  // (si tu déclenches le warp ici, garde-le, sinon laisse SlideContainer le faire)
  $emitter.emit('accelerate-stars')
}

function goToSection(index: number) {
  slideRef.value?.goTo(index)
}
</script>

<style scoped>
.slide {
  height: 100vh;
}
</style>
