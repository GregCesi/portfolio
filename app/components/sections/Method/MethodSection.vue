<template>
  <BaseSection :index="3">
    <div ref="rootRef" class="method" :class="{ 'is-intro': introVisible }">
      <header class="method__head">
        <div ref="headRef" class="method__head-inner">
          <p class="method__kicker t-label rv">{{ method.kicker }}</p>
          <h2 class="method__title t-title rv">{{ method.title }}</h2>
          <p class="method__subtitle t-body rv">{{ method.subtitle }}</p>
        </div>
      </header>

      <div class="method__stage rv">
        <MethodTimeline class="method__timeline" />
        <div ref="contentRef" class="method__content">
          <MethodContent />
        </div>
        <MethodPlanet class="method__planet" />
      </div>

      <!-- Mobile, introduction seule : passe à la première étape. -->
      <button type="button" class="method__intro-next" aria-label="Suivant" @click="introVisible = false">
        ›
      </button>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import gsap from 'gsap'
import BaseSection from '../BaseSection.vue'
import MethodTimeline from './MethodTimeline.vue'
import MethodContent from './MethodContent.vue'
import MethodPlanet from './MethodPlanet.vue'
import { siteContent } from '~/data/content'
import { useMethodState } from '~/composables/useMethodState'
import { useSubscreenNav } from '~/composables/useSubscreenNav'
import { useSplitReveal } from '~/composables/useSplitReveal'

const method = siteContent.method
const {
  nextStepAnimated,
  prevStepAnimated,
  selectStep,
  isStepTransitioning,
  canGoPrev,
  introVisible,
  isMobileViewport,
} = useMethodState()
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
  subscreenNav.register('method', {
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
      selectStep(index + 1)
    },
  })
})

onBeforeUnmount(() => {
  mobileQuery?.removeEventListener('change', onMobileChange)
  subscreenNav.unregister('method')
})

// Fondu lent entre l'introduction mobile et les étapes.
watch(introVisible, async (isIntro) => {
  await nextTick()
  // Un changement d'étape en cours (clic sur un segment depuis l'introduction) gère lui-même le fondu du texte.
  if (!isIntro && isStepTransitioning()) return
  const target = isIntro ? headRef.value : contentRef.value
  if (target) gsap.fromTo(target, { opacity: 0 }, { opacity: 1, duration: 0.9, ease: 'power1.out' })
})

// Mouvement d'entrée : le titre se révèle, puis le surtitre et le sous-titre
// en cascade, puis la frise, le texte et la planète émergent ensemble du noir.
function extra(tl: gsap.core.Timeline | null) {
  const stage = rootRef.value?.querySelector<HTMLElement>('.method__stage')
  if (!stage) return
  if (!tl) {
    gsap.set(stage, { opacity: 1 })
    return
  }
  tl.fromTo(stage, { opacity: 0 }, { opacity: 1, duration: 1.6, ease: 'power1.out' }, 1.0)
}

function hideExtra() {
  const stage = rootRef.value?.querySelector<HTMLElement>('.method__stage')
  if (stage) gsap.set(stage, { opacity: 0 })
}

useSplitReveal(rootRef, {
  index: 2,
  titles: '.method__title',
  lines: '.method__kicker, .method__subtitle',
  extra,
  hideExtra,
})
</script>

<style scoped>
.method {
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

.method__head {
  display: flex;
  justify-content: center;
}

.method__head-inner {
  text-align: center;
}

.method__kicker {
  margin-bottom: 0.6rem;
}

.method__title {
  font-size: clamp(1.05rem, 0.85rem + 0.8vw, 1.75rem);
  letter-spacing: 0.22em;
  margin: 0 auto 0.75rem;
  max-width: 44rem;
  text-wrap: balance;
}

.method__subtitle {
  max-width: 34rem;
  margin: 0 auto;
  color: var(--color-ink-dim);
}

.method__stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

/* Empilement (< 1024px) : planète, texte de l'étape, puis frise compacte. */
.method__planet {
  order: 0;
}

.method__content {
  order: 1;
  width: 100%;
  max-width: 28rem;
}

.method__timeline {
  order: 2;
}

.method__intro-next {
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

.method__intro-next:hover {
  color: var(--color-accent);
}

/*
 * Mobile : deux sous-écrans par section. L'introduction montre le titre avec
 * la planète et un bouton « suivant » ; les étapes montrent la planète, le
 * texte de l'étape et la frise compacte (le titre complet reste lisible en
 * entier, on découpe, on ne tronque pas).
 */
@media (max-width: 767.98px) {
  .method.is-intro .method__content {
    display: none;
  }

  .method:not(.is-intro) .method__head {
    display: none;
  }

  .method.is-intro .method__intro-next {
    display: flex;
  }
}

/* Très petit écran (iPhone SE, 568 px) : la planète cède la place au texte des étapes, elle reste sur l'introduction. */
@media (max-width: 767.98px) and (max-height: 620px) {
  .method:not(.is-intro) .method__planet {
    display: none;
  }
}

@media (min-width: 768px) {
  .method__stage {
    gap: 0.9rem;
  }
}

/* >= 1024px : une rangée, frise | texte de l'étape | planète. */
@media (min-width: 1024px) {
  .method__stage {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: clamp(1.25rem, 2.5vw, 2.5rem);
  }

  .method__timeline {
    order: 1;
    flex-shrink: 0;
    width: 12.5rem;
  }

  .method__content {
    order: 2;
    flex-shrink: 0;
    width: 22rem;
    max-width: none;
  }

  .method__planet {
    order: 3;
  }
}

@media (min-width: 1440px) {
  .method__timeline {
    width: 14rem;
  }

  .method__content {
    width: 25rem;
  }
}
</style>
