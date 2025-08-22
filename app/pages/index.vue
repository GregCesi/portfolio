<template>
  <SlideMenu
    :labels="labels"
    :container="slideRef"
    :active-index="currentIndex"
    @select="goToSection"
  />
  <SlideContainer ref="slideRef" @section-change="onSectionChange">
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

import type { SlideContainerExposed } from '~/types/slides'


const { $emitter } = useNuxtApp()

const labels = ['Start', 'À propos', 'Valeur ajoutée', 'Roadmap', 'Solutions']
const slideRef = ref<SlideContainerExposed | null>(null)
const currentIndex = ref(-1)

function onSectionChange(index: number) {
  currentIndex.value = index
  console.log(currentIndex.value)
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
