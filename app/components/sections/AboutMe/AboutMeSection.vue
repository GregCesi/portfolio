<template>
  <BaseSection :index="2">
    <div ref="rootRef" class="about">
      <div class="about__scene">
        <!--
          Mobile : le titre et l'introduction forment le premier sous-écran,
          puis une entrée de frise par sous-écran (§2.3). Au-delà de 768px la
          piste s'efface (`display: contents`) et tout se lit d'un coup.
        -->
        <SubscreenTrack :index="sub.index.value" :total="sub.total.value" @update:index="sub.goTo">
          <header class="about__head">
            <div class="about__head-inner scrim">
              <h2 class="about__title t-title rv">{{ about.title }}</h2>
              <p class="about__intro t-body rv">{{ about.intro }}</p>
            </div>
          </header>

          <article
            v-for="(entry, index) in about.timeline"
            :key="entry.period"
            class="about__entry"
          >
            <div class="about__entry-inner scrim">
              <div class="about__marker" aria-hidden="true">
                <span :ref="(el) => setCircleRef(el as HTMLElement, index)" class="about__circle" />
                <span v-if="index < about.timeline.length - 1" class="about__connector">
                  <span :ref="(el) => setLineRef(el as HTMLElement, index)" class="about__connector-fill" />
                </span>
              </div>

              <div class="about__body rv">
                <p class="about__period">{{ entry.period }}</p>
                <p class="about__place">{{ entry.place }}</p>
                <p class="about__role">{{ entry.role }}</p>
                <p v-if="entry.detail" class="about__detail">{{ entry.detail }}</p>
              </div>
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
import { useMobileSubscreens } from '~/composables/useMobileSubscreens'
import { useSubscreenNav } from '~/composables/useSubscreenNav'
import { useSplitReveal } from '~/composables/useSplitReveal'

const about = siteContent.about

const rootRef = ref<HTMLElement | null>(null)
const circles = ref<HTMLElement[]>([])
const lines = ref<HTMLElement[]>([])

// Sous-écrans mobiles : titre + introduction, puis une entrée de frise chacun.
const sub = useMobileSubscreens(about.timeline.length + 1)
const subscreenNav = useSubscreenNav()

onMounted(() => subscreenNav.register('about', sub))
onBeforeUnmount(() => subscreenNav.unregister('about'))

function setCircleRef(el: HTMLElement | null, index: number) {
  if (el) circles.value[index] = el
}

function setLineRef(el: HTMLElement | null, index: number) {
  if (el) lines.value[index] = el
}

// À partir de 1024px la frise passe d'une colonne à une rangée : seule cette
// variable pilote l'axe de la ligne qui se trace, la mise en page reste 100% CSS.
function isRow(): boolean {
  return window.matchMedia('(min-width: 1024px)').matches
}

function hideExtra() {
  gsap.set(circles.value, { opacity: 0 })
  gsap.set(lines.value, { scaleX: 0, scaleY: 0 })
}

// La frise se trace comme un décompte : un point apparaît, le trait vers le
// suivant s'étire, puis le point suivant. Mouvement lent, aucun rebond.
function extra(tl: gsap.core.Timeline | null) {
  if (!tl) {
    gsap.set(circles.value, { opacity: 1 })
    gsap.set(lines.value, { scaleX: 1, scaleY: 1 })
    return
  }
  const row = isRow()
  const prop = row ? 'scaleX' : 'scaleY'
  const other = row ? 'scaleY' : 'scaleX'
  const origin = row ? 'left center' : 'top center'
  gsap.set(lines.value, { [prop]: 0, [other]: 1, transformOrigin: origin })

  about.timeline.forEach((_, index) => {
    const at = 1.2 + index * 0.55
    tl.to(circles.value[index]!, { opacity: 1, duration: 0.9, ease: 'power2.out' }, at)
    if (lines.value[index]) {
      tl.to(lines.value[index]!, { [prop]: 1, duration: 0.9, ease: 'power2.inOut' }, at + 0.25)
    }
  })
}

useSplitReveal(rootRef, {
  index: 1,
  titles: '.about__title',
  lines: '.about__intro, .about__body',
  extra,
  hideExtra,
})

onBeforeUnmount(() => {
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
  padding: 0 var(--scrim-x);
}

/* Mobile : la piste glisse, chaque sous-écran centre son contenu. */
.about__head,
.about__entry {
  display: flex;
  align-items: center;
  justify-content: center;
}

.about__head-inner {
  text-align: center;
}

.about__title {
  font-size: clamp(1.25rem, 1rem + 1vw, 2rem);
  margin-bottom: 1.25rem;
}

.about__intro {
  max-width: 30rem;
  margin: 0 auto;
  text-align: center;
}

.about__entry-inner {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 1.1rem;
  max-width: 24rem;
}

.about__marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  padding-top: 0.3rem;
}

.about__circle {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: var(--color-accent);
  flex-shrink: 0;
}

.about__connector {
  width: 1px;
  flex: 1;
  min-height: 1.5rem;
  background: var(--color-line);
  overflow: hidden;
  margin-top: 0.5rem;
}

.about__connector-fill {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--color-accent);
}

.about__body {
  padding-bottom: 0.5rem;
}

.about__period {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  line-height: 1.5;
  color: var(--color-accent);
  margin-bottom: 0.3rem;
}

.about__place {
  font-size: 1rem;
  line-height: 1.4;
  color: var(--color-ink);
}

.about__role {
  font-size: 0.9375rem;
  line-height: 1.4;
  color: var(--color-ink-dim);
  margin-top: 0.15rem;
}

.about__detail {
  font-size: 0.875rem;
  line-height: 1.45;
  color: var(--color-ink-dim);
  margin-top: 0.3rem;
}

/*
 * >= 768px : la piste s'efface, la scène devient une grille. Tablette
 * portrait : frise verticale sous le titre et l'introduction.
 */
@media (min-width: 768px) {
  .about__scene {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
  }

  .about__head {
    margin-bottom: clamp(1rem, 3vh, 2.25rem);
  }

  .about__entry {
    width: 100%;
    max-width: 24rem;
    justify-content: flex-start;
  }

  .about__entry-inner {
    width: 100%;
    max-width: none;
  }
}

/*
 * >= 1024px : la frise passe en rangée, un carton de dates de six colonnes,
 * les points reliés par un filet qui se trace de gauche à droite.
 */
@media (min-width: 1024px) {
  .about__scene {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    column-gap: clamp(1rem, 2vw, 2rem);
    justify-items: stretch;
    align-items: start;
  }

  .about__head {
    grid-column: 1 / -1;
    margin-bottom: clamp(1.5rem, 6vh, 3.5rem);
  }

  .about__entry {
    max-width: none;
    align-items: flex-start;
  }

  .about__entry-inner {
    flex-direction: column;
    gap: 0.75rem;
  }

  .about__marker {
    flex-direction: row;
    align-items: center;
    width: 100%;
    padding-top: 0;
  }

  .about__connector {
    width: auto;
    height: 1px;
    flex: 1;
    min-height: 0;
    min-width: 0.75rem;
    margin-top: 0;
    margin-left: 0.6rem;
  }

  .about__body {
    padding-bottom: 0;
  }
}
</style>
