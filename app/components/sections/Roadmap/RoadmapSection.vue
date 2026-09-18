<template>
  <BaseSection :index="4">
    <div class="roadmap">
      <header class="roadmap__head">
        <p class="roadmap__kicker">{{ roadmap.kicker }}</p>
        <h2 class="roadmap__title">{{ roadmap.title }}</h2>
        <p class="roadmap__subtitle">{{ roadmap.subtitle }}</p>
      </header>

      <div class="roadmap__grid">
        <RoadmapTimeline class="roadmap__timeline" />
        <RoadmapContent class="roadmap__content" />
        <RoadmapPlanet class="roadmap__planet" />
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import BaseSection from '../BaseSection.vue'
import RoadmapTimeline from './RoadmapTimeline.vue'
import RoadmapContent from './RoadmapContent.vue'
import RoadmapPlanet from './RoadmapPlanet.vue'
import { siteContent } from '~/data/content'
import { useRoadmapState } from '~/composables/useRoadmapState'
import { useSubscreenNav } from '~/composables/useSubscreenNav'

const roadmap = siteContent.roadmap
const { nextStepAnimated, prevStepAnimated, goToStep } = useRoadmapState()
const subscreenNav = useSubscreenNav()

// Les six étapes sont elles-mêmes des sous-écrans (§2.3 de la spec) :
// flèches gauche/droite, comme sur les autres sections découpées.
onMounted(() =>
  subscreenNav.register('roadmap', {
    next: () => nextStepAnimated(),
    prev: () => prevStepAnimated(),
    goTo: (index: number) => goToStep(index + 1),
  })
)
onBeforeUnmount(() => subscreenNav.unregister('roadmap'))
</script>

<style scoped>
.roadmap {
  height: 100%;
  width: 100%;
  max-width: 84rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(1rem, 2.5vh, 1.75rem);
  padding: 0 1.25rem;
}

.roadmap__head {
  max-width: 46rem;
}

.roadmap__kicker {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 0.4rem;
}

.roadmap__title {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: clamp(1.25rem, 1rem + 1.1vw, 2rem);
  line-height: 1.2;
  margin-bottom: 0.4rem;
}

.roadmap__subtitle {
  font-size: 0.85rem;
  color: var(--color-ink-dim);
  max-width: 60ch;
}

.roadmap__grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
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

@media (min-width: 1024px) {
  .roadmap__grid {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }

  .roadmap__timeline {
    order: 1;
    max-width: 17rem;
    flex-shrink: 0;
  }

  .roadmap__content {
    order: 2;
    max-width: 22rem;
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
    max-width: 19rem;
  }

  .roadmap__content {
    max-width: 26rem;
  }
}
</style>
