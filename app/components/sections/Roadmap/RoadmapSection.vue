<template>
  <BaseSection :index="4">
    <div ref="rootRef" class="roadmap" :class="{ 'is-intro': introVisible }">
      <header class="roadmap__head">
        <div ref="headRef" class="roadmap__head-inner">
          <p class="roadmap__kicker t-label rv">{{ roadmap.kicker }}</p>
          <h2 class="roadmap__title t-title rv">{{ roadmap.title }}</h2>
          <p class="roadmap__subtitle t-body rv">{{ roadmap.subtitle }}</p>
        </div>
      </header>

      <div class="roadmap__stage rv">
        <RoadmapTimeline class="roadmap__timeline" />
        <div ref="contentRef" class="roadmap__content">
          <RoadmapContent />
        </div>
        <RoadmapPlanet class="roadmap__planet" />
      </div>

      <!-- Mobile, introduction seule : passe à la première étape. -->
      <button type="button" class="roadmap__intro-next" aria-label="Suivant" @click="introVisible = false">
        ›
      </button>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import gsap from 'gsap'
import BaseSection from '../BaseSection.vue'
import RoadmapTimeline from './RoadmapTimeline.vue'
import RoadmapContent from './RoadmapContent.vue'
import RoadmapPlanet from './RoadmapPlanet.vue'
import { siteContent } from '~/data/content'
import { useRoadmapState } from '~/composables/useRoadmapState'
import { useSubscreenNav } from '~/composables/useSubscreenNav'
import { useSplitReveal } from '~/composables/useSplitReveal'

const roadmap = siteContent.roadmap
const {
  nextStepAnimated,
  prevStepAnimated,
  goToStep,
  canGoPrev,
  introVisible,
  isMobileViewport,
} = useRoadmapState()
const subscreenNav = useSubscreenNav()

const rootRef = ref<HTMLElement | null>(null)
const headRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

// Mobile (< 768px) : sous-écran d'introduction (surtitre, titre, sous-titre),
// puis une étape par sous-écran. Ailleurs, tout tient d'un coup.
let mobileQuery: MediaQueryList | null = null
const onMobileChange = (event: MediaQueryListEvent) => {
  isMobileViewport.value = event.matches
}

onMounted(() => {
  mobileQuery = window.matchMedia('(max-width: 767.98px)')
  isMobileViewport.value = mobileQuery.matches
  mobileQuery.addEventListener('change', onMobileChange)

  // Les six étapes sont elles-mêmes des sous-écrans (§2.3 de la spec) :
  // flèches gauche/droite, comme sur les autres sections découpées.
  subscreenNav.register('roadmap', {
    next: () => {
      if (isMobileViewport.value && introVisible.value) {
        introVisible.value = false
        return
      }
      void nextStepAnimated()
    },
    prev: () => {
      if (isMobileViewport.value && !canGoPrev.value) {
        introVisible.value = true
        return
      }
      void prevStepAnimated()
    },
    goTo: (index: number) => {
      introVisible.value = false
      goToStep(index + 1)
    },
  })
})

onBeforeUnmount(() => {
  mobileQuery?.removeEventListener('change', onMobileChange)
  subscreenNav.unregister('roadmap')
})

// Fondu lent entre l'introduction mobile et les étapes.
watch(introVisible, async (isIntro) => {
  await nextTick()
  const target = isIntro ? headRef.value : contentRef.value
  if (target) gsap.fromTo(target, { opacity: 0 }, { opacity: 1, duration: 0.9, ease: 'power1.out' })
})

// Mouvement d'entrée : le titre se révèle, puis le surtitre et le sous-titre
// en cascade, puis la frise, le texte et la planète émergent ensemble du noir.
function extra(tl: gsap.core.Timeline | null) {
  const stage = rootRef.value?.querySelector<HTMLElement>('.roadmap__stage')
  if (!stage) return
  if (!tl) {
    gsap.set(stage, { opacity: 1 })
    return
  }
  tl.fromTo(stage, { opacity: 0 }, { opacity: 1, duration: 1.6, ease: 'power1.out' }, 1.0)
}

function hideExtra() {
  const stage = rootRef.value?.querySelector<HTMLElement>('.roadmap__stage')
  if (stage) gsap.set(stage, { opacity: 0 })
}

useSplitReveal(rootRef, {
  index: 3,
  titles: '.roadmap__title',
  lines: '.roadmap__kicker, .roadmap__subtitle',
  extra,
  hideExtra,
})
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
  gap: clamp(0.75rem, 3vh, 2rem);
  padding: 0 var(--pad-x);
}

.roadmap__head {
  display: flex;
  justify-content: center;
}

.roadmap__head-inner {
  text-align: center;
}

.roadmap__kicker {
  margin-bottom: 0.6rem;
}

.roadmap__title {
  font-size: clamp(1.05rem, 0.85rem + 0.8vw, 1.75rem);
  letter-spacing: 0.22em;
  margin: 0 auto 0.75rem;
  max-width: 44rem;
  text-wrap: balance;
}

.roadmap__subtitle {
  max-width: 34rem;
  margin: 0 auto;
  color: var(--color-ink-dim);
}

.roadmap__stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

/* Empilement (< 1024px) : planète, texte de l'étape, puis frise compacte. */
.roadmap__planet {
  order: 0;
}

.roadmap__content {
  order: 1;
  width: 100%;
  max-width: 28rem;
}

.roadmap__timeline {
  order: 2;
}

.roadmap__intro-next {
  display: none;
  align-self: center;
  width: 2.5rem;
  height: 2.25rem;
  border: none;
  background: transparent;
  color: var(--color-ink);
  font-family: var(--font-display);
  font-weight: 300;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  transition: color 0.6s var(--ease-slow);
}

.roadmap__intro-next:hover {
  color: var(--color-accent);
}

/*
 * Mobile : deux sous-écrans par section. L'introduction montre le titre avec
 * la planète et un bouton « suivant » ; les étapes montrent la planète, le
 * texte de l'étape et la frise compacte (le titre complet reste lisible en
 * entier, on découpe, on ne tronque pas).
 */
@media (max-width: 767.98px) {
  .roadmap.is-intro .roadmap__content {
    display: none;
  }

  .roadmap:not(.is-intro) .roadmap__head {
    display: none;
  }

  .roadmap.is-intro .roadmap__intro-next {
    display: flex;
  }
}

@media (min-width: 768px) {
  .roadmap__stage {
    gap: 0.9rem;
  }
}

/* >= 1024px : une rangée, frise | texte de l'étape | planète. */
@media (min-width: 1024px) {
  .roadmap__stage {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: clamp(1.25rem, 2.5vw, 2.5rem);
  }

  .roadmap__timeline {
    order: 1;
    flex-shrink: 0;
    width: 12.5rem;
  }

  .roadmap__content {
    order: 2;
    flex-shrink: 0;
    width: 22rem;
    max-width: none;
  }

  .roadmap__planet {
    order: 3;
  }
}

@media (min-width: 1440px) {
  .roadmap__timeline {
    width: 14rem;
  }

  .roadmap__content {
    width: 25rem;
  }
}
</style>
