<template>
  <BaseSection :index="3">
    <div ref="rootRef" class="method">
      <div class="method__scene rv">
        <!--
          Un plan à la fois, comme un générique : le titre et l'introduction, puis
          une carte par plan. Sur mobile la piste glisse, sur desktop les plans
          se fondent l'un dans l'autre (§2.3, §2.3 bis). Rien n'est coupé.
        -->
        <SubscreenTrack stage :index="sub.index.value" :total="sub.total.value" @update:index="sub.goTo">
          <header class="method__head">
            <div class="method__head-inner">
              <h2 class="method__title t-title rv">{{ method.title }}</h2>
              <p class="method__intro t-body">{{ method.intro }}</p>
            </div>
          </header>

          <article v-for="card in method.cards" :key="card.title" class="method__card">
            <div class="method__card-inner">
              <h3 class="method__card-title">{{ card.title }}</h3>
              <p class="method__card-text t-body">{{ card.text }}</p>
            </div>
          </article>
        </SubscreenTrack>
      </div>

      <SubscreenNav persistent :index="sub.index.value" :total="sub.total.value" @prev="sub.prev" @next="sub.next" />
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
const sub = useMobileSubscreens(method.cards.length + 1, 2)
const subscreenNav = useSubscreenNav()

onMounted(() => subscreenNav.register('method', sub))
onBeforeUnmount(() => subscreenNav.unregister('method'))

const rootRef = ref<HTMLElement | null>(null)
useSplitReveal(rootRef, {
  index: 2,
  titles: '.method__title',
  lines: '.method__scene',
})
</script>

<style scoped>
.method {
  height: 100%;
  width: 100%;
  max-width: 64rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 0 var(--pad-x);
}

.method__scene {
  flex: 1;
  min-height: 0;
}

/* `safe` : un contenu plus haut que le cadre s'aligne en haut au lieu de déborder des deux côtés. */
.method__head,
.method__card {
  display: flex;
  align-items: safe center;
  justify-content: center;
}

.method__head-inner,
.method__card-inner {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.method__title {
  font-size: clamp(1.15rem, 0.95rem + 0.9vw, 1.9rem);
  margin-bottom: 1.5rem;
  text-wrap: balance;
}

.method__intro {
  max-width: 31rem;
}

.method__card-title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1rem, 0.85rem + 0.35vw, 1.2rem);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  line-height: 1.5;
  color: var(--color-ink);
  max-width: 30rem;
  text-wrap: balance;
}

/* Un filet de 1 px ouvre le carton d'un plan (ornement, aucun texte). */
.method__card-title::before {
  content: '';
  display: block;
  width: 2.5rem;
  height: 1px;
  margin: 0 auto 1.1rem;
  background: var(--color-accent);
}

.method__card-text {
  max-width: 27rem;
  margin-top: 1.1rem;
}

@media (max-width: 767.98px) {
  .method__card-title {
    letter-spacing: 0.16em;
  }

  .method__card-title::before {
    margin-bottom: 0.9rem;
  }
}
</style>
