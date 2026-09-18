<template>
  <BaseSection :index="3">
    <div ref="rootRef" class="method">
      <div class="method__scene">
        <!-- Mobile : titre et introduction en premier sous-écran, puis une carte par sous-écran (§2.3). -->
        <SubscreenTrack :index="sub.index.value" :total="sub.total.value" @update:index="sub.goTo">
          <header class="method__head">
            <div class="method__head-inner scrim">
              <h2 class="method__title t-title rv">{{ method.title }}</h2>
              <p class="method__intro t-body rv">{{ method.intro }}</p>
            </div>
          </header>

          <article v-for="(card, index) in method.cards" :key="card.title" class="method__card">
            <div class="method__card-inner scrim">
              <p class="method__number rv">{{ String(index + 1).padStart(2, '0') }}</p>
              <h3 class="method__card-title rv">{{ card.title }}</h3>
              <p class="method__card-text t-body rv">{{ card.text }}</p>
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
import BaseSection from '~/components/sections/BaseSection.vue'
import SubscreenTrack from '~/components/subscreen/SubscreenTrack.vue'
import SubscreenNav from '~/components/subscreen/SubscreenNav.vue'
import { siteContent } from '~/data/content'
import { useMobileSubscreens } from '~/composables/useMobileSubscreens'
import { useSubscreenNav } from '~/composables/useSubscreenNav'
import { useSplitReveal } from '~/composables/useSplitReveal'

const method = siteContent.method

// Sous-écrans mobiles : titre + introduction, puis une carte chacun.
const sub = useMobileSubscreens(method.cards.length + 1)
const subscreenNav = useSubscreenNav()

onMounted(() => subscreenNav.register('method', sub))
onBeforeUnmount(() => subscreenNav.unregister('method'))

const rootRef = ref<HTMLElement | null>(null)
useSplitReveal(rootRef, {
  index: 2,
  titles: '.method__title',
  lines: '.method__intro, .method__number, .method__card-title, .method__card-text',
})
</script>

<style scoped>
.method {
  height: 100%;
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 var(--scrim-x);
}

.method__head,
.method__card {
  display: flex;
  align-items: center;
  justify-content: center;
}

.method__head-inner {
  text-align: center;
}

.method__title {
  font-size: clamp(1.15rem, 0.95rem + 0.9vw, 1.9rem);
  margin-bottom: 1.25rem;
  text-wrap: balance;
}

.method__intro {
  max-width: 31rem;
  margin: 0 auto;
}

.method__card-inner {
  max-width: 28rem;
  border-top: 1px solid var(--color-line);
  padding-top: 0.9rem;
  /* Le numéro se pose sur la ligne du titre, le texte occupe toute la largeur. */
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: 0.9rem;
  align-items: baseline;
}

.method__number {
  grid-column: 1;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.8125rem;
  letter-spacing: 0.3em;
  color: var(--color-accent);
}

.method__card-title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.9375rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  line-height: 1.5;
  color: var(--color-ink);
  grid-column: 2;
  margin-bottom: 0.6rem;
}

.method__card-text {
  grid-column: 1 / -1;
  color: var(--color-ink-dim);
}

@media (min-width: 768px) {
  .method__scene {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
    row-gap: clamp(0.9rem, 2.2vh, 1.5rem);
  }

  .method__head {
    margin-bottom: clamp(0.5rem, 2vh, 1.5rem);
  }

  .method__card {
    width: 100%;
    max-width: 34rem;
    justify-content: flex-start;
  }

  .method__card-inner {
    max-width: none;
    width: 100%;
    padding-top: 0.7rem;
  }

  .method__card-title {
    margin-bottom: 0.4rem;
  }
}

/* >= 1024px : deux colonnes de deux plans, chacune une colonne de texte de 45 à 60 signes. */
@media (min-width: 1024px) {
  .method__scene {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: clamp(2rem, 5vw, 5rem);
    justify-items: stretch;
    align-items: start;
  }

  .method__head {
    grid-column: 1 / -1;
  }

  .method__card {
    max-width: none;
  }
}
</style>
