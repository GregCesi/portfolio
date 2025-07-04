<template>
  <div>
    <Header />
    <SlideContainer ref="slideContainer">
      <section class="slide flex items-center justify-center">
        <HeroSection />
      </section>
      <section class="slide flex items-center justify-center">
        <AboutMeSection />
      </section>
      <section class="slide flex items-center justify-center">
        <ServicesSection />
      </section>
      <section class="slide flex items-center justify-center">
        <ClientRoadmapSection />
      </section>
      <section class="slide flex items-center justify-center">
        <SolutionsSection />
      </section>
      <section class="slide flex items-center justify-center">
        <ThreeSphere  width="1000px" height="1000px" :camera-position="10" :enable-scan="true" :satellite-model="'DSCOVR-Triana'"/>
      </section>
    </SlideContainer>
    <SlideMenu 
      :labels="['START', 'À PROPOS DE MOI', 'SERVICES', 'ROADMAP', 'SOLUTIONS']" 
      :container="slideContainer"
      class="max-sm:hidden"
    />
    
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'

import Header from '~/components/Header.vue'
import HeroSection from '~/components/Section/HeroSection.vue'
import ProjectSection from '~/components/ProjectSection.vue'
import AboutMeSection from '~/components/Section/AboutMeSection.vue'
import ServicesSection from '~/components/Section/ServicesSection.vue'
import Footer from '~/components/Footer.vue'
import SlideContainer from '~/components/SlideContainer.vue'
import SlideMenu from '~/components/SlideMenu.vue'
import ThreeSphere from '~/components/ThreeSphere.vue'
import ClientRoadmapSection from '~/components/Section/ClientRoadmapSection.vue'
import SolutionsSection from '~/components/Section/SolutionsSection.vue'

const slideContainer = ref<ComponentPublicInstance | null>(null)
</script>

<style scoped>
.slide {
  height: 100vh;
}
</style>