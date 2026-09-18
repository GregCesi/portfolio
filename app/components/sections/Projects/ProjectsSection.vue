<template>
  <BaseSection :index="5">
    <div ref="rootRef" class="projects">
      <header class="projects__head panel-inset">
        <h2 class="projects__title">{{ projects.title }}</h2>
        <p class="projects__intro">{{ projects.intro }}</p>
      </header>

      <div class="projects__grid panel-inset">
        <SubscreenTrack :index="sub.index.value" :total="sub.total.value" @update:index="sub.goTo">
          <article v-for="(card, index) in projects.cards" :key="card.id" class="projects__card">
            <p class="projects__number">{{ String(index + 1).padStart(2, '0') }}</p>
            <h3 class="projects__card-title">{{ card.title }}</h3>
            <p class="projects__card-tagline">{{ card.tagline }}</p>
            <p class="projects__card-text">{{ card.text }}</p>

            <ul class="projects__tags">
              <li v-for="tag in card.tags" :key="tag" class="projects__tag">{{ tag }}</li>
            </ul>

            <div class="projects__card-actions">
              <a v-if="card.href" :href="card.href" target="_blank" rel="noopener noreferrer" class="projects__link">
                Voir le code
              </a>
              <button v-if="card.cta" type="button" class="projects__link projects__link--button" @click="goToSection(card.cta.section)">
                {{ card.cta.label }}
              </button>
            </div>
          </article>

          <div id="contact" class="contact">
            <p class="contact__number">{{ String(projects.cards.length + 1).padStart(2, '0') }}</p>
            <h3 class="contact__title">{{ contact.title }}</h3>
            <p class="contact__text">{{ contact.text }}</p>

            <ul class="contact__list">
              <li>
                <span class="contact__label">{{ contact.emailLabel }}</span>
                <a :href="`mailto:${contact.email}`" class="contact__value">{{ contact.email }}</a>
              </li>
              <li>
                <a :href="contact.github" target="_blank" rel="noopener noreferrer" class="contact__value contact__value--link">
                  {{ contact.githubLabel }} ↗
                </a>
              </li>
              <li v-if="contact.linkedin">
                <a :href="contact.linkedin" target="_blank" rel="noopener noreferrer" class="contact__value contact__value--link">
                  {{ contact.linkedinLabel }} ↗
                </a>
              </li>
            </ul>

            <a v-if="contact.cvUrl" :href="contact.cvUrl" target="_blank" rel="noopener noreferrer" class="contact__cv">
              {{ contact.cvLabel }}
            </a>
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

// Sous-écrans mobiles : un projet par écran, puis le contact (§2.3 de la spec).
const sub = useMobileSubscreens(projects.cards.length + 1)
const subscreenNav = useSubscreenNav()

onMounted(() => subscreenNav.register('projects', sub))
onBeforeUnmount(() => subscreenNav.unregister('projects'))

const rootRef = ref<HTMLElement | null>(null)
useSplitReveal(rootRef, '.projects__title, .projects__intro')
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
  /* 0.75vh (au lieu de 1.8vh) : un débordement de 8px mesuré à 768x1024
     (`.section-inner` scrollHeight vs clientHeight, empilement colonne des
     3 cartes + contact) resserre ce budget vertical. */
  gap: clamp(0.6rem, 0.75vh, 1.5rem);
  padding: 0 1.25rem;
}

/* `.panel-inset` (posé sur `.projects__head` et `.projects__grid`, ce
   dernier englobant aussi le bloc `#contact`, dans le template) protège le
   texte du canvas hyperspace sans ajouter de hauteur au flux — voir la
   classe utilitaire dans main.css pour le détail. */
.projects__head {
  max-width: 46rem;
  flex-shrink: 0;
}

.projects__title {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: clamp(1.5rem, 1.1rem + 1.6vw, 2.5rem);
  line-height: 1.15;
  margin-bottom: 0.5rem;
}

.projects__intro {
  font-size: clamp(0.9rem, 0.8rem + 0.4vw, 1.05rem);
  line-height: 1.5;
  color: var(--color-ink-dim);
  max-width: 60ch;
}

.projects__grid {
  height: 52vh;
  max-height: 28rem;
  min-height: 14rem;
}

.projects__card,
.contact {
  height: 100%;
  overflow: hidden;
  padding: 0.9rem 0.25rem 0;
  border-top: 1px solid var(--color-line);
}

.projects__number,
.contact__number {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-accent);
  letter-spacing: 0.08em;
  margin-bottom: 0.4rem;
}

.projects__card-title,
.contact__title {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: clamp(1.05rem, 0.95rem + 0.3vw, 1.25rem);
  line-height: 1.25;
}

.projects__card-tagline {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-ink);
  margin-top: 0.35rem;
}

.projects__card-text,
.contact__text {
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--color-ink-dim);
  margin-top: 0.4rem;
}

.projects__tags {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0.6rem 0 0;
  padding: 0;
  font-family: var(--font-mono);
}

.projects__tag {
  font-size: 0.68rem;
  letter-spacing: 0.03em;
  padding: 0.15rem 0.5rem;
  border: 1px solid var(--color-line);
  color: var(--color-ink-dim);
}

.projects__card-actions {
  margin-top: 0.6rem;
  display: flex;
  gap: 1.25rem;
}

.projects__link {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.contact__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin: 0.6rem 0 0;
  padding: 0;
  font-size: 0.85rem;
}

.contact__label {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  color: var(--color-ink-dim);
  margin-right: 0.5rem;
}

.contact__value {
  color: var(--color-ink);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.contact__value:hover {
  color: var(--color-accent);
}

.contact__cv {
  display: inline-block;
  margin-top: 0.8rem;
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
  padding: 0.4rem 1rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.contact__cv:hover {
  background: var(--color-accent);
  color: #0a0908;
}

@media (min-width: 768px) {
  /* Colonne unique (empilement) : flexbox plutôt que grid, pour que chaque
     carte garde sa hauteur naturelle sans dépendre de l'algorithme de
     dimensionnement des rangées "auto" de CSS Grid. */
  .projects__grid {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    gap: 0.3rem;
    height: auto;
    max-height: none;
  }

  .projects__card,
  .contact {
    height: auto;
    overflow: visible;
    padding: 0.5rem 0 0;
  }

  .projects__card-text,
  .contact__text {
    font-size: 0.78rem;
    line-height: 1.4;
    margin-top: 0.3rem;
  }

  .projects__tags {
    margin-top: 0.4rem;
  }
}

@media (min-width: 1024px) {
  .projects__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-content: start;
    column-gap: 2rem;
    row-gap: 1.25rem;
  }

  .contact {
    grid-column: 1 / -1;
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    column-gap: 2.5rem;
    row-gap: 0.35rem;
  }

  .contact__number {
    margin-bottom: 0;
  }

  .contact__title {
    margin-right: 0.5rem;
  }

  .contact__text {
    margin-top: 0;
    flex: 1 1 auto;
    min-width: 20ch;
  }

  .contact__list {
    flex-direction: row;
    gap: 1.5rem;
    margin-top: 0;
  }

  .contact__cv {
    margin-top: 0;
  }
}
</style>
