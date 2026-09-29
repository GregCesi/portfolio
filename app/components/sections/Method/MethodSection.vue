<template>
  <BaseSection :index="3" full-bleed>
    <div ref="rootRef" class="method" :class="{ 'is-intro': introVisible }">
      <header class="method__head">
        <div ref="headRef" class="method__head-inner">
          <p class="method__kicker t-label rv">{{ method.kicker }}</p>
          <h2 class="method__title t-title rv">{{ method.title }}</h2>
          <p class="method__subtitle t-body rv">{{ method.subtitle }}</p>
        </div>
      </header>

      <div class="method__stage rv">
        <div class="method__planet-wrap">
          <MethodPlanet class="method__planet" />
        </div>

        <div class="method__foreground">
          <span class="method__halo" aria-hidden="true" />
          <div ref="contentRef" class="method__content">
            <MethodContent />
          </div>
          <MethodTimeline class="method__timeline" />
        </div>
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

// Révélation (mouvement réduit seulement, où elle s'affiche d'un coup) : le
// titre, puis le surtitre et le sous-titre, puis la frise, le texte et la
// planète. En profondeur, la section arrive d'un bloc (voir useSplitReveal).
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
  gap: clamp(0.75rem, 3vh, 1.5rem);
  padding: 0 var(--pad-x);
}

/*
 * `.section-viewport` (BaseSection) réserve plus de place en haut (hauteur du
 * Header) qu'en bas (1,25rem fixe) : un centrage naïf dans `.method` (100 %
 * de l'espace restant) reste donc décalé vers le bas par rapport à la
 * fenêtre. On compense par l'écart exact entre ces deux réserves, à partir
 * des mêmes variables que BaseSection — aucun pixel arbitraire.
 */
@media (min-width: 768px) {
  .method {
    margin-top: calc((0.75rem - var(--header-height, 80px)) / 2);
  }
}

.method__head {
  flex: 0 0 auto;
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

/*
 * La planète est un décor de fond plein cadre, centrée derrière le texte de
 * l'étape et la frise (§ hypothèses TCK-230). `.method__stage` garde la
 * hauteur de son contenu (pas `flex: 1 1 auto`) : c'est `.method`, avec
 * `justify-content: center`, qui centre le bloc entier (en-tête + stage)
 * dans la fenêtre (EXE-70). `.method__planet-wrap` déborde librement de
 * `.method__stage` — seul `.section-viewport` masque le débordement.
 */
.method__stage {
  position: relative;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.method__planet-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -45%);
  z-index: 0;
  pointer-events: none;
}

.method__foreground {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(1rem, 3vh, 1.75rem);
  width: 100%;
}

/* Halo sombre derrière le texte de l'étape, pour qu'il reste lisible même
   sur la partie la plus claire de la planète. */
.method__halo {
  position: absolute;
  top: -1.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: min(46rem, 120%);
  height: calc(100% + 3rem);
  z-index: -1;
  pointer-events: none;
  background: radial-gradient(ellipse 60% 55% at 50% 38%, rgb(5 7 10 / 80%), transparent 72%);
}

.method__content {
  width: 100%;
  max-width: 36rem;
}

.method__timeline {
  width: 100%;
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
  .method:not(.is-intro) .method__planet-wrap {
    display: none;
  }
}
</style>
