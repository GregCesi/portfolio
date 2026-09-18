<template>
  <BaseSection :index="5">
    <div ref="rootRef" class="projects">
      <div class="projects__scene">
        <!--
          Mobile : titre et introduction en premier sous-écran, un projet par
          sous-écran, puis le contact (§2.3). Au-delà de 768px, tout tient
          d'un coup : trois plans côte à côte, le contact en dessous.
        -->
        <SubscreenTrack :index="sub.index.value" :total="sub.total.value" @update:index="sub.goTo">
          <header class="projects__head">
            <div class="projects__head-inner scrim">
              <h2 class="projects__title t-title rv">{{ projects.title }}</h2>
              <p class="projects__intro t-body rv">{{ projects.intro }}</p>
            </div>
          </header>

          <article v-for="(card, index) in projects.cards" :key="card.id" class="projects__card">
            <div class="projects__card-inner scrim">
              <div class="projects__card-body rv">
                <p class="projects__number">{{ String(index + 1).padStart(2, '0') }}</p>
                <h3 class="projects__card-title">{{ card.title }}</h3>
                <p class="projects__card-tagline t-body">{{ card.tagline }}</p>
                <p class="projects__card-text t-body">{{ card.text }}</p>
                <div class="projects__foot">
                  <p class="projects__tags">{{ card.tags.join(' · ') }}</p>

                  <div class="projects__card-actions">
                    <a v-if="card.href" :href="card.href" target="_blank" rel="noopener noreferrer" class="projects__link">
                      Voir le code
                    </a>
                    <button v-if="card.cta" type="button" class="projects__link" @click="goToSection(card.cta.section)">
                      {{ card.cta.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <div id="contact" class="contact">
            <div class="contact__inner scrim">
              <div class="contact__body rv">
                <h3 class="contact__title">{{ contact.title }}</h3>
                <p class="contact__text t-body">{{ contact.text }}</p>

                <ul class="contact__list">
                  <li>
                    <span class="contact__label">{{ contact.emailLabel }}</span>
                    <a :href="`mailto:${contact.email}`" class="contact__value">{{ contact.email }}</a>
                  </li>
                  <li>
                    <a :href="contact.github" target="_blank" rel="noopener noreferrer" class="contact__value">
                      {{ contact.githubLabel }}
                    </a>
                  </li>
                  <li v-if="contact.linkedin">
                    <a :href="contact.linkedin" target="_blank" rel="noopener noreferrer" class="contact__value">
                      {{ contact.linkedinLabel }}
                    </a>
                  </li>
                </ul>

                <a v-if="contact.cvUrl" :href="contact.cvUrl" target="_blank" rel="noopener noreferrer" class="projects__link">
                  {{ contact.cvLabel }}
                </a>
              </div>
            </div>
          </div>
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
import { useAppNavigation } from '~/composables/useAppNavigation'
import { useMobileSubscreens } from '~/composables/useMobileSubscreens'
import { useSubscreenNav } from '~/composables/useSubscreenNav'
import { useSplitReveal } from '~/composables/useSplitReveal'

const projects = siteContent.projects
const contact = siteContent.projects.contact
const { goToSection } = useAppNavigation()

// Sous-écrans mobiles : titre + introduction, un projet par écran, puis le contact (§2.3).
const sub = useMobileSubscreens(projects.cards.length + 2)
const subscreenNav = useSubscreenNav()

onMounted(() => subscreenNav.register('projects', sub))
onBeforeUnmount(() => subscreenNav.unregister('projects'))

const rootRef = ref<HTMLElement | null>(null)
useSplitReveal(rootRef, {
  index: 4,
  titles: '.projects__title',
  lines: '.projects__intro, .projects__card-body, .contact__body',
})
</script>

<style scoped>
.projects {
  height: 100%;
  width: 100%;
  max-width: 78rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 var(--scrim-x);
}

.projects__head,
.projects__card,
.contact {
  display: flex;
  align-items: center;
  justify-content: center;
}

.projects__head-inner {
  text-align: center;
}

.projects__title {
  font-size: clamp(1.25rem, 1rem + 1vw, 2rem);
  margin-bottom: 1rem;
}

.projects__intro {
  max-width: 30rem;
  margin: 0 auto;
}

.projects__card-inner,
.contact__inner {
  max-width: 30rem;
  width: 100%;
}

.projects__card-body,
.contact__body {
  border-top: 1px solid var(--color-line);
  padding-top: 0.9rem;
}

/* Le numéro se pose sur la ligne du titre ; le reste occupe toute la largeur. */
.projects__card-body {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: 0.9rem;
  align-items: baseline;
}

.projects__card-body > * {
  grid-column: 1 / -1;
}

.projects__card-body > .projects__number {
  grid-column: 1;
}

.projects__card-body > .projects__card-title {
  grid-column: 2;
}

.projects__number {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.8125rem;
  letter-spacing: 0.3em;
  color: var(--color-accent);
}

.projects__card-title,
.contact__title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  line-height: 1.4;
  color: var(--color-ink);
}

.projects__card-tagline {
  margin-top: 0.6rem;
}

.projects__card-text,
.contact__text {
  color: var(--color-ink-dim);
  margin-top: 0.5rem;
}

.projects__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.25rem 1.25rem;
  margin-top: 0.75rem;
}

.projects__tags {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  line-height: 1.6;
  color: var(--color-ink-dim);
}

.projects__card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.75rem;
}

/* Liens : Jost capitales espacées, un filet de 1 px dessous, ni cadre ni fond. */
.projects__link {
  display: inline-block;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-accent);
  background: none;
  border: none;
  border-bottom: 1px solid var(--color-accent);
  padding: 0.4rem 0 0.3rem;
  cursor: pointer;
  transition: color 0.8s var(--ease-slow), border-color 0.8s var(--ease-slow);
}

.projects__link:hover {
  color: var(--color-ink);
  border-bottom-color: var(--color-ink);
}

.contact__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin: 0.75rem 0 0;
  padding: 0;
}

.contact__label {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.28em;
  color: var(--color-ink-dim);
  margin-right: 0.9rem;
}

.contact__value {
  color: var(--color-ink);
  text-decoration: underline;
  text-decoration-color: var(--color-line);
  text-underline-offset: 5px;
  transition: color 0.8s var(--ease-slow), text-decoration-color 0.8s var(--ease-slow);
}

.contact__value:hover {
  color: var(--color-accent);
  text-decoration-color: var(--color-accent);
}

.contact__body .projects__link {
  margin-top: 0.9rem;
}

/* Tablette portrait : les trois plans et le contact en colonne. */
@media (min-width: 768px) {
  .projects__scene {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
    row-gap: clamp(0.5rem, 1.2vh, 1.25rem);
  }

  .projects__head {
    margin-bottom: 0;
  }

  .projects__card,
  .contact {
    width: 100%;
    max-width: 38rem;
    justify-content: flex-start;
  }

  .projects__card-inner,
  .contact__inner {
    max-width: none;
  }

  .projects__card-body,
  .contact__body {
    padding-top: 0.45rem;
  }

  .projects__card-text,
  .contact__text {
    margin-top: 0.3rem;
  }

  .projects__card-tagline {
    margin-top: 0.4rem;
  }

  .projects__foot {
    margin-top: 0.5rem;
  }

  .contact__list {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.25rem 1.5rem;
  }

  .projects__title {
    margin-bottom: 0.6rem;
  }
}

/* >= 1024px : trois plans côte à côte (le banc d'évaluation, plus long, prend plus de largeur), le contact en dessous. */
@media (min-width: 1024px) {
  .projects__scene {
    grid-template-columns: 1fr 1.9fr 1fr;
    column-gap: clamp(1.5rem, 3vw, 3rem);
    justify-items: stretch;
    align-items: start;
  }

  .projects__head {
    grid-column: 1 / -1;
    margin-bottom: 0.5rem;
  }

  .projects__card {
    max-width: none;
  }

  .contact {
    grid-column: 1 / -1;
    max-width: none;
  }

  .contact__body {
    display: flex;
    flex-wrap: nowrap;
    align-items: baseline;
    column-gap: clamp(1.5rem, 3vw, 3rem);
    row-gap: 0.25rem;
  }

  .contact__text {
    margin-top: 0;
    flex: 1 1 0;
    min-width: 0;
  }

  .contact__list {
    flex-shrink: 0;
    flex-direction: row;
    gap: 1.75rem;
    margin-top: 0;
  }

  .contact__body .projects__link {
    margin-top: 0;
  }
}
</style>
