<template>
  <SlideMenu :labels="siteContent.global.menuLabels" :active-index="currentIndex" @select="onMenuSelect" />
  <SlideContainer
    ref="slideRef"
    :transition-duration="transitionDuration"
    @section-change="onSectionChange"
    @section-settled="onSectionSettled"
  >
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
}

// Déclenché par SlideContainer une fois la transition GSAP totalement terminée
// (onComplete du timeline, pas au milieu de l'animation) : c'est seulement à ce
// moment que la géométrie de la section cible est stable et qu'on peut y faire
// défiler un ancrage interne en toute sécurité.
function onSectionSettled() {
  if (!pendingAnchor.value) return

  const anchorId = pendingAnchor.value
  pendingAnchor.value = null
  nextTick(() => scrollToAnchor(anchorId))
}

function onMenuSelect(index: number) {
  const section = SECTION_ORDER[index]
  if (section) goToSection(section)
}

function goToSection(section: SectionId) {
  slideRef.value?.goTo(SECTION_INDEX[section])
}

// Fait défiler la zone de défilement interne de la section (`.section-scroll-area`,
// voir BaseSection.vue), jamais `Element.scrollIntoView()` : ce dernier remonte
// aussi le conteneur `.overflow-hidden` piloté par transform GSAP dans
// SlideContainer et additionne les deux décalages, poussant tout le contenu
// hors de l'écran (bug « Me contacter »).
function scrollToAnchor(anchorId: string) {
  const el = document.getElementById(anchorId)
  if (!el) return

  const scrollArea = el.closest('.section-scroll-area') as HTMLElement | null
  if (!scrollArea) return

  const targetTop = scrollArea.scrollTop + (el.getBoundingClientRect().top - scrollArea.getBoundingClientRect().top)

  scrollArea.scrollTo({ top: targetTop, behavior: prefersReducedMotion.value ? 'auto' : 'smooth' })
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
