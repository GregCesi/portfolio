<template>
  <BaseSection :index="3">
    <div ref="rootRef" class="method">
      <header class="method__head panel-inset">
        <h2 class="method__title">{{ method.title }}</h2>
        <p class="method__intro">{{ method.intro }}</p>
      </header>

      <div class="method__grid panel-inset">
        <SubscreenTrack :index="sub.index.value" :total="sub.total.value" @update:index="sub.goTo">
          <article v-for="(card, index) in method.cards" :key="card.title" class="method__card">
            <p class="method__number">{{ String(index + 1).padStart(2, '0') }}</p>
            <h3 class="method__card-title">{{ card.title }}</h3>
            <p class="method__card-text">{{ card.text }}</p>
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

const sub = useMobileSubscreens(method.cards.length)
const subscreenNav = useSubscreenNav()

onMounted(() => subscreenNav.register('method', sub))
onBeforeUnmount(() => subscreenNav.unregister('method'))

const rootRef = ref<HTMLElement | null>(null)
useSplitReveal(rootRef, '.method__title, .method__intro')
</script>

<style scoped>
.method {
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

/* `.panel-inset` (posé sur `.method__head` et `.method__grid` dans le
   template) protège le texte du canvas hyperspace sans ajouter de hauteur
   au flux — voir la classe utilitaire dans main.css pour le détail. */
.method__head {
  max-width: 46rem;
}

.method__title {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: clamp(1.5rem, 1.1rem + 1.6vw, 2.5rem);
  line-height: 1.15;
  margin-bottom: 0.6rem;
}

.method__intro {
  font-size: clamp(0.9rem, 0.8rem + 0.4vw, 1.05rem);
  line-height: 1.55;
  color: var(--color-ink-dim);
  max-width: 68ch;
}

.method__grid {
  height: 46vh;
  max-height: 24rem;
  min-height: 12rem;
}

.method__card {
  height: 100%;
  padding: 1rem 0.25rem 0;
  border-top: 1px solid var(--color-line);
}

.method__number {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-accent);
  letter-spacing: 0.08em;
  margin-bottom: 0.5rem;
}

.method__card-title {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: clamp(1.05rem, 0.95rem + 0.4vw, 1.3rem);
  line-height: 1.25;
  margin-bottom: 0.5rem;
}

.method__card-text {
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--color-ink-dim);
  max-width: 58ch;
}

@media (min-width: 768px) {
  /* Colonne unique (empilement) : flexbox plutôt que grid, pour que chaque
     carte garde sa hauteur naturelle sans dépendre de l'algorithme de
     dimensionnement des rangées "auto" de CSS Grid. */
  .method__grid {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    gap: 1.5rem;
    height: auto;
    max-height: none;
  }

  .method__card {
    height: auto;
    overflow: visible;
    padding: 1.1rem 0 0;
  }
}

@media (min-width: 1024px) {
  .method__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-content: start;
    column-gap: 2.5rem;
    row-gap: 1.5rem;
  }
}
</style>
