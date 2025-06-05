<template>
    <Header />
  <SlideContainer>
    <section class="slide flex items-center justify-center">
      <HeroSection />
    </section>
    <section class="slide flex items-center justify-center">
      <ProjectSection />
    </section>
    <section class="slide flex items-center justify-center">
      <Services />
    </section>
    <section class="slide flex items-center justify-center">
      <Footer class="w-full" />
    </section>
  </SlideContainer>
</template>

<script setup lang="ts">
import Header from '~/components/Header.vue'
import HeroSection from '~/components/HeroSection.vue'

import ProjectSection from '~/components/ProjectSection.vue'
import Services from '~/components/Services.vue'
import Footer from '~/components/Footer.vue'
import SlideContainer from '~/components/SlideContainer.vue'
</script>

<style scoped>
.slide {
  height: 100vh;
}
</style>