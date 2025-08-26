<template>
  <BaseSection>
    <div class="relative w-full h-screen">

      <!-- Timeline - gauche -->
      <RoadmapTimeline class="absolute left-0 top-1/2 -translate-y-[65%] z-10" />

      <!-- Contenu + nav - centre -->
      <div class="absolute top-1/2 -translate-y-[60%] left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
        <RoadmapContent />
      </div>

      <!-- Planète - background -->
      <RoadmapPlanet class="absolute right-0 top-0 translate-x-24 -translate-y-16 z-0" />

    </div>
  </BaseSection>
</template>

<script setup lang="ts">
  import RoadmapTimeline from './RoadmapTimeline.vue'
  import RoadmapContent from './RoadmapContent.vue'
  import RoadmapPlanet from './RoadmapPlanet.vue'
  import BaseSection from '~/components/sections/BaseSection.vue'
</script>