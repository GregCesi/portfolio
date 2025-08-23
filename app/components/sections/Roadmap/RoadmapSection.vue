<template>
  <BaseSection>
    <div class="relative w-full h-screen">

      <!-- Timeline - gauche -->
      <RoadmapTimeline class="absolute left-64 top-1/2 -translate-y-1/2 z-10" />

      <!-- Contenu + nav - centre -->
      <div class="absolute inset-0 z-20 flex items-center justify-center">
        <RoadmapContent />
      </div>

      <!-- Planète - background -->
      <RoadmapPlanet class="absolute inset-0 z-0" />

    </div>
  </BaseSection>
</template>

<script setup lang="ts">
  import RoadmapTimeline from './RoadmapTimeline.vue'
  import RoadmapContent from './RoadmapContent.vue'

</script>