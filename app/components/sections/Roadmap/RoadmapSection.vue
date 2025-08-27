<template>
  <BaseSection>
    <div class="flex items-center justify-center h-full w-full">
      <!-- Timeline - gauche avec marge -->
      <RoadmapTimeline class="" />

      <!-- Contenu + nav - centre -->
      <div class="">
        <RoadmapContent />
      </div>

      <!-- Planète - background avec espace pour SlideMenu -->
      <RoadmapPlanet class="" />
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
  import BaseSection from '../BaseSection.vue'
  import RoadmapTimeline from './RoadmapTimeline.vue'
  import RoadmapContent from './RoadmapContent.vue'
  import RoadmapPlanet from './RoadmapPlanet.vue'
</script>