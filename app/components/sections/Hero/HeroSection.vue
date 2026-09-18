<template>
  <BaseSection>
    <div
      class="w-full max-w-5xl text-center mx-auto flex flex-col gap-6 sm:gap-10 h-full items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      <h1
        class="text-3xl sm:text-5xl md:text-[50px] lg:text-[64px] font-bold leading-tight light-shadow-text text-white text-balance"
      >
        {{ hero.title }}
      </h1>

      <div class="hero__panel flex flex-col gap-3 text-base sm:text-xl md:text-2xl text-white">
        <p v-for="paragraph in hero.paragraphs" :key="paragraph">
          {{ paragraph }}
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full max-w-xs sm:max-w-2xl mx-auto pt-2">
        <button
          type="button"
          class="w-full sm:w-auto flex-1 rounded-full bg-white light-shadow light-shadow-text-black text-base sm:text-lg lg:text-xl text-black font-bold px-6 py-3 sm:py-4 hover:scale-105 focus-visible:scale-105 transition-transform"
          @click="goToSection('projects')"
        >
          {{ hero.ctaProjects }}
        </button>
        <button
          type="button"
          class="w-full sm:w-auto flex-1 rounded-full border-2 sm:border-3 border-white light-shadow text-base sm:text-lg lg:text-xl text-white bg-transparent px-6 py-3 sm:py-4 hover:scale-105 focus-visible:scale-105 transition-transform"
          @click="goToAnchor('projects', 'contact')"
        >
          {{ hero.ctaContact }}
        </button>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import BaseSection from '~/components/sections/BaseSection.vue'
import { siteContent } from '~/data/content'
import { useAppNavigation } from '~/composables/useAppNavigation'

const hero = siteContent.hero
const { goToSection, goToAnchor } = useAppNavigation()
</script>

<style scoped>
.hero__panel {
  background: rgba(0, 0, 0, 0.35);
  border-radius: 1.25rem;
  padding: 1rem 1.25rem;
}

@media (min-width: 640px) {
  .hero__panel {
    padding: 1.5rem 2rem;
  }
}
</style>
