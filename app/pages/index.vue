<template>
  <SlideMenu :labels="siteContent.global.menuLabels" :active-index="currentIndex" @select="onMenuSelect" />
  <SlideContainer
    ref="slideRef"
    :transition-duration="transitionDuration"
    :depth-motion="!prefersReducedMotion"
    :locked="!entryGate.opened.value"
    :capture="captureFor"
    :axis-locked="axisLockedFor"
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
import { useSlideScrollCapture } from '~/composables/useSlideScrollCapture'
import { useEntryGate } from '~/composables/useEntryGate'
import { journeyDuration } from '~/composables/useJourney'

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
const transitionDuration = computed(() => (prefersReducedMotion.value ? 0.2 : journeyDuration()))
const subscreenNav = useSubscreenNav()
const scrollCapture = useSlideScrollCapture()
const entryGate = useEntryGate()

// Rétention de molette (EXE-52) : SlideContainer reste ignorant des sections,
// c'est ici que l'index numérique se traduit en SectionId pour interroger le
// registre (même pont que subscreenNav ci-dessous).
function captureFor(index: number) {
  return scrollCapture.get(SECTION_ORDER[index])
}

// Parcours (EXE-71) : seule section sans sous-écran dont la molette doit
// ignorer tout deltaX de bruit plutôt que de le perdre vers un sous-écran
// qui n'existe pas (voir SlideContainer.axisLocked). Volontairement limité à
// Parcours : Projets a la même absence de sous-écran aujourd'hui mais son
// comportement molette n'est pas du périmètre de ce tour.
const AXIS_LOCKED_SECTIONS: SectionId[] = ['about']
function axisLockedFor(index: number) {
  const id = SECTION_ORDER[index]
  return id !== undefined && AXIS_LOCKED_SECTIONS.includes(id)
}

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

// Un clic dans le menu est un saut direct (EXE-54) : même vers une section
// adjacente, il ne porte aucune continuité de défilement (voir SlideContainer.goTo).
function onMenuSelect(index: number) {
  slideRef.value?.goTo(index, { direct: true })
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
