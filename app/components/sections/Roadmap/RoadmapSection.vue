<template>
  <BaseSection>
    <div class="relative w-full h-full">
      <!-- Timeline - gauche avec marge -->
      <RoadmapTimeline class="absolute left-8 top-1/2 -translate-y-[65%] z-10" />

      <!-- Contenu + nav - centre -->
      <div class="absolute top-1/2 -translate-y-[60%] left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
        <RoadmapContent />
      </div>

      <!-- Planète - background avec espace pour SlideMenu -->
      <RoadmapPlanet class="absolute right-8 top-0 translate-x-12 -translate-y-16 z-0" />
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
  import BaseSection from '../BaseSection.vue'
  import RoadmapTimeline from './RoadmapTimeline.vue'
  import RoadmapContent from './RoadmapContent.vue'
  import RoadmapPlanet from './RoadmapPlanet.vue'
</script>