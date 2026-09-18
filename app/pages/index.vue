<template>
  <SlideMenu
    :labels="siteContent.global.menuLabels"
    :container="slideRef"
    :active-index="currentIndex"
    @select="onMenuSelect"
  />
  <SlideContainer ref="slideRef" :transition-duration="transitionDuration" @section-change="onSectionChange">
    <section class="slide"><HeroSection /></section>
    <section class="slide"><AboutMeSection /></section>
    <section class="slide"><MethodSection /></section>
    <section class="slide"><RoadmapSection /></section>
    <section class="slide"><ProjectsSection /></section>
  </SlideContainer>
</template>

<script setup lang="ts">
import { computed, nextTick, provide, ref } from 'vue'
import { useNuxtApp, useSeoMeta } from '#app'

import SlideContainer from '@/components/SlideContainer.vue'
import SlideMenu from '@/components/navigation/SlideMenu.vue'
import HeroSection from '@/components/sections/Hero/HeroSection.vue'
import AboutMeSection from '@/components/sections/AboutMe/AboutMeSection.vue'
import MethodSection from '@/components/sections/Method/MethodSection.vue'
import RoadmapSection from '@/components/sections/Roadmap/RoadmapSection.vue'
import ProjectsSection from '@/components/sections/Projects/ProjectsSection.vue'

import { siteContent, SECTION_INDEX, SECTION_ORDER } from '~/data/content'
import type { SectionId } from '~/types/content'
import { appNavigationKey } from '~/composables/useAppNavigation'
import { usePrefersReducedMotion } from '~/composables/usePrefersReducedMotion'

import type { SlideContainerExposed } from '~/types/slides'

useSeoMeta({
  title: siteContent.global.pageTitle,
  description: siteContent.global.metaDescription,
  ogTitle: siteContent.global.pageTitle,
  ogDescription: siteContent.global.metaDescription,
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

const { $emitter } = useNuxtApp()
const prefersReducedMotion = usePrefersReducedMotion()
const transitionDuration = computed(() => (prefersReducedMotion.value ? 0.2 : 0.8))

const slideRef = ref<SlideContainerExposed | null>(null)
const currentIndex = ref(0)
const pendingAnchor = ref<string | null>(null)

function onSectionChange(index: number) {
  currentIndex.value = index
  $emitter.emit('accelerate-stars')

  if (pendingAnchor.value) {
    const anchorId = pendingAnchor.value
    pendingAnchor.value = null
    nextTick(() => scrollToAnchor(anchorId))
  }
}

function onMenuSelect(index: number) {
  const section = SECTION_ORDER[index]
  if (section) goToSection(section)
}

function goToSection(section: SectionId) {
  slideRef.value?.goTo(SECTION_INDEX[section])
}

function scrollToAnchor(anchorId: string) {
  const el = document.getElementById(anchorId)
  el?.scrollIntoView({ behavior: prefersReducedMotion.value ? 'auto' : 'smooth', block: 'start' })
}

function goToAnchor(section: SectionId, anchorId: string) {
  if (currentIndex.value === SECTION_INDEX[section]) {
    scrollToAnchor(anchorId)
    return
  }

  pendingAnchor.value = anchorId
  goToSection(section)
}

provide(appNavigationKey, { goToSection, goToAnchor })
</script>

<style scoped>
.slide {
  height: 100vh;
}
</style>
