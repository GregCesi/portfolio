<template>
  <SlideMenu :labels="siteContent.global.menuLabels" :active-index="currentIndex" @select="onMenuSelect" />
  <SlideContainer
    ref="slideRef"
    :transition-duration="transitionDuration"
    :depth-motion="!prefersReducedMotion"
    :locked="!entryGate.opened.value"
    @section-change="onSectionChange"
    @subscreen-next="onSubscreenNext"
    @subscreen-prev="onSubscreenPrev"
  >
    <section class="slide"><HeroSection /></section>
    <section class="slide"><AboutMeSection /></section>
    <section class="slide"><MethodSection /></section>
    <section class="slide"><ProjectsSection /></section>
    <section class="slide"><ContactSection /></section>
  </SlideContainer>
</template>

<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import { useNuxtApp, useSeoMeta } from '#app'

import SlideContainer from '@/components/SlideContainer.vue'
import SlideMenu from '@/components/navigation/SlideMenu.vue'
import HeroSection from '@/components/sections/Hero/HeroSection.vue'
import AboutMeSection from '@/components/sections/AboutMe/AboutMeSection.vue'
import MethodSection from '@/components/sections/Method/MethodSection.vue'
import ProjectsSection from '@/components/sections/Projects/ProjectsSection.vue'
import ContactSection from '@/components/sections/Contact/ContactSection.vue'

import { siteContent, SECTION_INDEX, SECTION_ORDER } from '~/data/content'
import type { SectionId } from '~/types/content'
import { appNavigationKey } from '~/composables/useAppNavigation'
import { usePrefersReducedMotion } from '~/composables/usePrefersReducedMotion'
import { useSubscreenNav } from '~/composables/useSubscreenNav'
import { useEntryGate } from '~/composables/useEntryGate'
import { TOTAL_DURATION } from '~/composables/useDepthTransition'

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
const transitionDuration = computed(() => (prefersReducedMotion.value ? 0.2 : TOTAL_DURATION))
const subscreenNav = useSubscreenNav()
const entryGate = useEntryGate()

const slideRef = ref<SlideContainerExposed | null>(null)
const currentIndex = ref(0)

function onSectionChange(index: number) {
  currentIndex.value = index
  $emitter.emit('accelerate-stars')
  $emitter.emit('section-enter', index)
}

// Le sas d'entrée s'est ouvert : Start arrive du fond, avec l'accélération des
// étoiles d'un changement de section. En mouvement réduit, Start s'affiche
// sans elle.
watch(entryGate.opened, (opened) => {
  if (!opened) return
  slideRef.value?.enter()
  if (prefersReducedMotion.value) $emitter.emit('section-enter', 0)
})

function onMenuSelect(index: number) {
  const section = SECTION_ORDER[index]
  if (section) goToSection(section)
}

function goToSection(section: SectionId) {
  slideRef.value?.goTo(SECTION_INDEX[section])
}

// Sous-écran ciblé par bouton : le contrôleur de sous-écrans de la section cible
// (§2.3 de la spec) est piloté directement, sans défilement DOM — chaque
// section tient déjà entièrement dans l'écran, il n'y a rien à faire défiler.
function goToAnchor(section: SectionId, anchorIndex: number) {
  goToSection(section)
  subscreenNav.goTo(section, anchorIndex)
}

function onSubscreenNext() {
  subscreenNav.trigger(SECTION_ORDER[currentIndex.value], 'next')
}

function onSubscreenPrev() {
  subscreenNav.trigger(SECTION_ORDER[currentIndex.value], 'prev')
}

provide(appNavigationKey, { goToSection, goToAnchor })
</script>

<style scoped>
.slide {
  height: 100vh;
}
</style>
