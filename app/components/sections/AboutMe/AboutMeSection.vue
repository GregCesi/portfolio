<template>
  <BaseSection :index="2">
    <div ref="rootRef" class="about">
      <header class="about__head">
        <h2 class="about__title">{{ about.title }}</h2>
        <p class="about__intro">{{ about.intro }}</p>
      </header>

      <div class="about__timeline">
        <SubscreenTrack :index="sub.index.value" :total="sub.total.value" @update:index="sub.goTo">
          <article
            v-for="(entry, index) in about.timeline"
            :key="entry.period"
            class="about__entry"
          >
            <div class="about__marker">
              <span :ref="(el) => setCircleRef(el as HTMLElement, index)" class="about__circle" />
              <span v-if="index < about.timeline.length - 1" class="about__connector">
                <span :ref="(el) => setLineRef(el as HTMLElement, index)" class="about__connector-fill" />
              </span>
            </div>

            <div class="about__body">
              <p class="about__period">{{ entry.period }}</p>
              <p class="about__place">{{ entry.place }}</p>
              <p class="about__role">{{ entry.role }}</p>
              <p v-if="entry.detail" class="about__detail">{{ entry.detail }}</p>
            </div>
          </article>
        </SubscreenTrack>
      </div>

      <SubscreenNav :index="sub.index.value" :total="sub.total.value" @prev="sub.prev" @next="sub.next" />
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import BaseSection from '~/components/sections/BaseSection.vue'
import SubscreenTrack from '~/components/subscreen/SubscreenTrack.vue'
import SubscreenNav from '~/components/subscreen/SubscreenNav.vue'
import { siteContent } from '~/data/content'
import { usePrefersReducedMotion } from '~/composables/usePrefersReducedMotion'
import { useMobileSubscreens } from '~/composables/useMobileSubscreens'
import { useSubscreenNav } from '~/composables/useSubscreenNav'

const about = siteContent.about
const prefersReducedMotion = usePrefersReducedMotion()

const rootRef = ref<HTMLElement | null>(null)
const circles = ref<HTMLElement[]>([])
const lines = ref<HTMLElement[]>([])

const sub = useMobileSubscreens(about.timeline.length)
const subscreenNav = useSubscreenNav()

onMounted(() => subscreenNav.register('about', sub))
onBeforeUnmount(() => subscreenNav.unregister('about'))

function setCircleRef(el: HTMLElement | null, index: number) {
  if (el) circles.value[index] = el
}

function setLineRef(el: HTMLElement | null, index: number) {
  if (el) lines.value[index] = el
}

// À partir de 1024px la frise passe d'une colonne à une rangée (§2.3 bis,
// composition libre) : seule cette variable pilote l'axe d'animation de la
// ligne qui se trace, la mise en page elle-même reste 100% CSS.
const isRow = ref(false)
let mediaQuery: MediaQueryList | null = null
function onMediaChange(e: MediaQueryListEvent) {
  isRow.value = e.matches
}

let observer: IntersectionObserver | null = null
let hasPlayed = false

function playReveal() {
  if (hasPlayed) return
  hasPlayed = true

  if (prefersReducedMotion.value) {
    gsap.set(circles.value, { opacity: 1, scale: 1 })
    gsap.set(lines.value, { scaleX: 1, scaleY: 1 })
    return
  }

  const scaleProp = isRow.value ? 'scaleX' : 'scaleY'
  const origin = isRow.value ? 'left center' : 'top center'

  gsap.set(circles.value, { opacity: 0.3, scale: 0.6 })
  gsap.set(lines.value, { [scaleProp]: 0, transformOrigin: origin })

  const tl = gsap.timeline()
  about.timeline.forEach((_, index) => {
    tl.to(circles.value[index]!, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' }, index === 0 ? 0 : '+=0.05')
    if (lines.value[index]) {
      tl.to(lines.value[index]!, { [scaleProp]: 1, duration: 0.45, ease: 'power2.inOut' }, '<0.1')
    }
  })
}

onMounted(() => {
  mediaQuery = window.matchMedia('(min-width: 1024px)')
  isRow.value = mediaQuery.matches
  mediaQuery.addEventListener('change', onMediaChange)

  if (!rootRef.value || typeof IntersectionObserver === 'undefined') {
    playReveal()
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry?.isIntersecting) playReveal()
    },
    { threshold: 0.25 }
  )
  observer.observe(rootRef.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  mediaQuery?.removeEventListener('change', onMediaChange)
  gsap.killTweensOf([...circles.value, ...lines.value])
})
</script>

<style scoped>
.about {
  height: 100%;
  width: 100%;
  max-width: 76rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(1.25rem, 3vh, 2.5rem);
  padding: 0 1.25rem;
}

.about__head {
  max-width: 42rem;
}

.about__title {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: clamp(1.5rem, 1.1rem + 1.6vw, 2.5rem);
  line-height: 1.15;
  margin-bottom: 0.6rem;
}

.about__intro {
  font-size: clamp(0.9rem, 0.8rem + 0.4vw, 1.05rem);
  line-height: 1.55;
  color: var(--color-ink-dim);
  max-width: 60ch;
}

.about__timeline {
  height: 40vh;
  max-height: 22rem;
  min-height: 12rem;
}

.about__entry {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1rem;
  height: 100%;
  padding: 0.25rem 0.25rem 0;
}

.about__marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.about__circle {
  width: 0.85rem;
  height: 0.85rem;
  border-radius: 999px;
  background: var(--color-accent);
  flex-shrink: 0;
}

.about__connector {
  width: 2px;
  flex: 1;
  min-height: 1.5rem;
  background: var(--color-line);
  overflow: hidden;
  margin-top: 0.35rem;
}

.about__connector-fill {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--color-accent);
}

.about__body {
  font-family: var(--font-sans);
}

.about__period {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  color: var(--color-accent);
  margin-bottom: 0.2rem;
}

.about__place {
  font-family: var(--font-serif);
  font-size: clamp(0.95rem, 0.85rem + 0.3vw, 1.15rem);
  font-weight: 500;
  line-height: 1.3;
}

.about__role {
  font-size: 0.85rem;
  color: var(--color-ink-dim);
  margin-top: 0.15rem;
}

.about__detail {
  font-size: 0.78rem;
  color: var(--color-ink-dim);
  margin-top: 0.3rem;
  line-height: 1.4;
}

/*
 * >= 768px : `SubscreenTrack` s'efface (`display: contents`, voir ce
 * composant), les entrées deviennent des enfants directs de
 * `.about__timeline`, qui les empile verticalement (frise verticale,
 * hauteur ample sur tablette portrait 768x1024).
 */
@media (min-width: 768px) {
  .about__timeline {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    gap: 0.85rem;
    height: auto;
    max-height: none;
  }

  .about__entry {
    height: auto;
    padding: 0;
  }
}

/*
 * >= 1024px : la frise passe en rangée horizontale (six colonnes), pour
 * limiter la hauteur occupée sur les fenêtres larges et basses (1280x720).
 */
@media (min-width: 1024px) {
  .about__timeline {
    flex-direction: row;
    align-items: flex-start;
    gap: clamp(1rem, 2vw, 2rem);
  }

  .about__entry {
    flex-direction: column;
    align-items: flex-start;
    flex: 1 1 0;
    min-width: 0;
  }

  .about__marker {
    flex-direction: row;
    align-items: center;
    width: 100%;
  }

  .about__connector {
    width: auto;
    height: 2px;
    flex: 1;
    min-height: 0;
    min-width: 0.75rem;
    margin-top: 0;
    margin-left: 0.4rem;
  }

  .about__body {
    margin-top: 0.6rem;
  }
}
</style>
