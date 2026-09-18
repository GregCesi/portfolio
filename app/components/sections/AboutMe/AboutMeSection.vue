<template>
  <BaseSection :index="2">
    <div ref="rootRef" class="about">
      <div class="about__scene">
        <!--
          Mobile : le titre et l'introduction forment le premier sous-écran,
          puis une entrée de frise par sous-écran (§2.3). Au-delà de 768px la
          piste s'efface (`display: contents`) : la frise se lit d'un coup, sur
          deux ou trois colonnes, un carton de dates.
        -->
        <SubscreenTrack :index="sub.index.value" :total="sub.total.value" @update:index="sub.goTo">
          <header class="about__head">
            <div class="about__head-inner">
              <h2 class="about__title t-title rv">{{ about.title }}</h2>
              <p class="about__intro t-body rv">{{ about.intro }}</p>
            </div>
          </header>

          <article
            v-for="(entry, index) in about.timeline"
            :key="entry.period"
            class="about__entry"
            :class="{ 'about__entry--e2': index % 2 === 1, 'about__entry--e3': index % 3 === 2 }"
          >
            <div class="about__entry-inner">
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
const sub = useMobileSubscreens(about.timeline.length + 1, 1)
const subscreenNav = useSubscreenNav()

onMounted(() => subscreenNav.register('about', sub))
onBeforeUnmount(() => subscreenNav.unregister('about'))

function setCircleRef(el: HTMLElement | null, index: number) {
  if (el) circles.value[index] = el
}

function setLineRef(el: HTMLElement | null, index: number) {
  if (el) lines.value[index] = el
}

// À partir de 768px chaque entrée porte sa ligne à l'horizontale (carton de
// dates) : seule cette fonction pilote l'axe de la ligne qui se trace, la mise
// en page reste 100 % CSS.
function isRow(): boolean {
  return window.matchMedia('(min-width: 768px)').matches
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
    const at = 0.9 + index * 0.36
    tl.to(circles.value[index]!, { opacity: 1, duration: 0.8, ease: 'power2.out' }, at)
    if (lines.value[index]) {
      tl.to(lines.value[index]!, { [prop]: 1, duration: 0.8, ease: 'power2.inOut' }, at + 0.2)
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
  padding: 0 var(--pad-x);
}

/* Mobile : la piste glisse, chaque sous-écran centre son contenu, la
   navigation reste en bas. */
@media (max-width: 767.98px) {
  .about__scene {
    flex: 1;
    min-height: 0;
  }
}

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
  font-size: var(--fs-body);
  line-height: 1.4;
  color: var(--color-ink);
}

.about__role {
  font-size: var(--fs-body);
  line-height: 1.4;
  color: var(--color-ink-dim);
  margin-top: 0.15rem;
}

.about__detail {
  font-size: var(--fs-body);
  line-height: 1.45;
  color: var(--color-ink-dim);
  margin-top: 0.3rem;
}

/*
 * >= 768px : la piste s'efface, la scène devient une grille de deux colonnes
 * (tablette portrait) puis de trois (>= 1024px), trois dates sur deux rangées.
 * Chaque entrée porte sa ligne : un point, un filet qui se trace.
 */
@media (min-width: 768px) {
  .about__scene {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: clamp(1.25rem, 3vw, 3rem);
    row-gap: clamp(1rem, 3.5vh, 2.75rem);
    justify-items: stretch;
    align-items: start;
  }

  .about__head {
    grid-column: 1 / -1;
    margin-bottom: clamp(0.75rem, 3.5vh, 2.5rem);
  }

  .about__entry {
    max-width: none;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .about__entry-inner {
    width: 100%;
    max-width: none;
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

  /* Deux colonnes : la fin de chaque rangée n'a pas de filet vers le vide. */
  .about__entry--e2 .about__connector {
    display: none;
  }
}

@media (min-width: 1024px) {
  .about__scene {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .about__entry--e2 .about__connector {
    display: block;
  }

  .about__entry--e3 .about__connector {
    display: none;
  }
}
</style>
