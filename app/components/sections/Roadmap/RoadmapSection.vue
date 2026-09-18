<template>
  <BaseSection>
    <div class="roadmap">
      <div class="roadmap__intro panel px-4 py-4 sm:px-6 sm:py-5">
        <p class="roadmap__kicker">{{ roadmap.kicker }}</p>
        <h2 class="roadmap__title light-shadow-text">{{ roadmap.title }}</h2>
        <p class="roadmap__subtitle">{{ roadmap.subtitle }}</p>
      </div>

      <div class="roadmap__grid">
        <RoadmapTimeline class="roadmap__timeline" />
        <RoadmapContent class="roadmap__content" />
        <RoadmapPlanet class="roadmap__planet" />
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import BaseSection from '../BaseSection.vue'
import RoadmapTimeline from './RoadmapTimeline.vue'
import RoadmapContent from './RoadmapContent.vue'
import RoadmapPlanet from './RoadmapPlanet.vue'
import { siteContent } from '~/data/content'

const roadmap = siteContent.roadmap
</script>

<style scoped>
.roadmap {
  width: 100%;
  max-width: 90rem;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
  color: white;
}

.roadmap__intro {
  max-width: 46rem;
  margin: 0 auto 2rem;
  text-align: center;
}

.roadmap__kicker {
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 0.5rem;
}

.roadmap__title {
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.25;
  margin-bottom: 0.75rem;
}

.roadmap__subtitle {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
}

.roadmap__grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
}

.roadmap__timeline {
  order: 2;
  width: 100%;
  max-width: 26rem;
}

.roadmap__content {
  order: 1;
  width: 100%;
}

.roadmap__planet {
  order: 0;
  display: flex;
  justify-content: center;
}

@media (min-width: 768px) {
  .roadmap__title {
    font-size: 2.1rem;
  }
}

@media (min-width: 1024px) {
  .roadmap__grid {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }

  .roadmap__timeline {
    order: 1;
    max-width: 18rem;
    flex-shrink: 0;
  }

  .roadmap__content {
    order: 2;
    max-width: 24rem;
    flex-shrink: 0;
  }

  .roadmap__planet {
    order: 3;
    flex: 1 1 auto;
    min-width: 0;
  }
}

@media (min-width: 1440px) {
  .roadmap__timeline {
    max-width: 20rem;
  }

  .roadmap__content {
    max-width: 28rem;
  }
}
</style>
