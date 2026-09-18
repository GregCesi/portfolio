<template>
  <BaseSection :index="1">
    <div ref="rootRef" class="hero">
      <!--
        Carton de générique, centré : un titre, deux lignes de texte, deux
        liens. Le voile noir à bords fondus (`.scrim`) protège le contraste
        AA sur le champ d'étoiles, sans former de carte ni de cadre.
      -->
      <div class="hero__block scrim">
        <h1 class="hero__title t-title rv">{{ hero.title }}</h1>

        <div class="hero__text">
          <p v-for="paragraph in hero.paragraphs" :key="paragraph" class="t-body rv">
            {{ paragraph }}
          </p>
        </div>

        <div class="hero__actions rv">
          <button type="button" class="hero__btn hero__btn--primary" @click="goToSection('projects')">
            {{ hero.ctaProjects }}
          </button>
          <button type="button" class="hero__btn" @click="goToAnchor('projects', siteContent.projects.cards.length + 1)">
            {{ hero.ctaContact }}
          </button>
        </div>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseSection from '~/components/sections/BaseSection.vue'
import { siteContent } from '~/data/content'
import { useAppNavigation } from '~/composables/useAppNavigation'
import { useSplitReveal } from '~/composables/useSplitReveal'

const hero = siteContent.hero
const { goToSection, goToAnchor } = useAppNavigation()

const rootRef = ref<HTMLElement | null>(null)
useSplitReveal(rootRef, {
  index: 0,
  titles: '.hero__title',
  lines: '.hero__text p, .hero__actions',
})
</script>

<style scoped>
.hero {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--scrim-x);
}

.hero__block {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: clamp(1.25rem, 3.5vh, 2.5rem);
  max-width: 46rem;
}

.hero__title {
  font-size: clamp(1.15rem, 0.8rem + 1.5vw, 2.25rem);
  letter-spacing: 0.22em;
  line-height: 1.5;
  text-wrap: balance;
}

.hero__text {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 30rem;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem 2.75rem;
  margin-top: 0.25rem;
}

/* Liens de générique : Jost capitales espacées, un filet de 1 px dessous,
   ni cadre, ni fond, ni relief. */
.hero__btn {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.8125rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--color-ink);
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--color-line);
  padding: 0.7rem 0 0.6rem 0.3em;
  cursor: pointer;
  transition: border-color 0.8s var(--ease-slow), color 0.8s var(--ease-slow);
}

.hero__btn--primary {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}

.hero__btn:hover {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}
</style>
