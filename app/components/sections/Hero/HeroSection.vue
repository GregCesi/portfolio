<template>
  <BaseSection :index="1">
    <div ref="rootRef" class="hero">
      <!--
        Scrim opaque derrière le titre et le texte (§2.3, contraste WCAG AA) :
        le Hero est posé directement sur le canvas hyperspace animé, où des
        étoiles quasi blanches peuvent traverser un glyphe. Un fond plat
        (`--panel-bg`, pas de flou, pas de glow, pas de coin arrondi — même
        langage visuel que `.panel`) garantit >= 4,5:1 même quand une étoile
        blanche pleine est exactement derrière le texte, marge de sécurité
        incluse.
      -->
      <div class="hero__scrim">
        <h1 class="hero__title">{{ hero.title }}</h1>

        <div class="hero__text">
          <p v-for="paragraph in hero.paragraphs" :key="paragraph">
            {{ paragraph }}
          </p>
        </div>

        <div class="hero__actions">
          <button type="button" class="hero__btn hero__btn--primary" @click="goToSection('projects')">
            {{ hero.ctaProjects }}
          </button>
          <button type="button" class="hero__btn" @click="goToAnchor('projects', siteContent.projects.cards.length)">
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
useSplitReveal(rootRef, '.hero__title, .hero__text p')
</script>

<style scoped>
.hero {
  height: 100%;
  width: 100%;
  max-width: 46rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 1.25rem;
}

.hero__scrim {
  background-color: var(--panel-bg);
  border: 1px solid var(--color-line);
  display: flex;
  flex-direction: column;
  gap: clamp(1.25rem, 3vh, 2rem);
  padding: clamp(1.1rem, 2vh + 0.5rem, 1.85rem) clamp(1.25rem, 3vw, 2.25rem);
}

.hero__title {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: clamp(1.9rem, 1.2rem + 3vw, 3.5rem);
  line-height: 1.1;
  max-width: 20ch;
}

.hero__text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: clamp(0.95rem, 0.85rem + 0.4vw, 1.1rem);
  line-height: 1.55;
  color: var(--color-ink-dim);
  max-width: 62ch;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
}

.hero__btn {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  color: var(--color-ink);
  background: transparent;
  border: 1px solid var(--color-line);
  padding: 0.7rem 1.4rem;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease;
}

.hero__btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.hero__btn--primary {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.hero__btn--primary:hover {
  background-color: var(--color-accent);
  color: #0a0908;
}
</style>
