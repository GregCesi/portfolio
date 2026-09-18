<template>
  <BaseSection :index="5">
    <div ref="rootRef" class="projects">
      <div class="projects__scene rv">
        <!--
          Les projets comme des plans successifs : le titre et l'introduction, un
          projet par plan, puis le contact. Mobile : la piste glisse ; desktop :
          les plans se fondent l'un dans l'autre (§2.3, §2.3 bis).
        -->
        <SubscreenTrack stage :index="sub.index.value" :total="sub.total.value" @update:index="sub.goTo">
          <header class="projects__head">
            <div class="projects__head-inner">
              <h2 class="projects__title t-title rv">{{ projects.title }}</h2>
              <p class="projects__intro t-body">{{ projects.intro }}</p>
            </div>
          </header>

          <article v-for="(card, index) in projects.cards" :key="card.id" class="projects__card">
            <div class="projects__card-inner">
              <p class="projects__number">{{ String(index + 1).padStart(2, '0') }}</p>
              <h3 class="projects__card-title">{{ card.title }}</h3>
              <p class="projects__card-tagline t-body">{{ card.tagline }}</p>
              <p class="projects__card-text t-body">{{ card.text }}</p>
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
          </article>

          <div id="contact" class="contact">
            <div class="contact__inner">
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
import { useAppNavigation } from '~/composables/useAppNavigation'
import { useMobileSubscreens } from '~/composables/useMobileSubscreens'
import { useSubscreenNav } from '~/composables/useSubscreenNav'
import { useSplitReveal } from '~/composables/useSplitReveal'

const projects = siteContent.projects
const contact = siteContent.projects.contact
const { goToSection } = useAppNavigation()

// Sous-écrans mobiles : titre + introduction, un projet par écran, puis le contact (§2.3).
const sub = useMobileSubscreens(projects.cards.length + 2, 4)
const subscreenNav = useSubscreenNav()

onMounted(() => subscreenNav.register('projects', sub))
onBeforeUnmount(() => subscreenNav.unregister('projects'))

const rootRef = ref<HTMLElement | null>(null)
useSplitReveal(rootRef, {
  index: 4,
  titles: '.projects__title',
  lines: '.projects__scene',
})
</script>

<style scoped>
.projects {
  height: 100%;
  width: 100%;
  max-width: 64rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 0 var(--pad-x);
}

.projects__scene {
  flex: 1;
  min-height: 0;
}

.projects__head,
.projects__card,
.contact {
  display: flex;
  align-items: center;
  justify-content: center;
}

.projects__head-inner,
.projects__card-inner,
.contact__inner {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.projects__title {
  font-size: clamp(1.25rem, 1rem + 1vw, 2rem);
  margin-bottom: 1.5rem;
}

.projects__intro {
  max-width: 30rem;
}

/* Grand chiffre de plan, puis un filet de 1 px : le carton d'un plan. */
.projects__number {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(3rem, 1.5rem + 5vh, 5rem);
  line-height: 1;
  letter-spacing: 0.12em;
  padding-left: 0.12em;
  color: var(--color-ink-dim);
}

.projects__number::after {
  content: '';
  display: block;
  width: 2.5rem;
  height: 1px;
  /* Sous la boîte de texte du chiffre, pas dans son emprise : le filet ne passe jamais derrière un glyphe. */
  margin: 0.4em auto 0;
  background: var(--color-accent);
}

.projects__card-title,
.contact__title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.05rem, 0.9rem + 0.5vw, 1.4rem);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  line-height: 1.4;
  color: var(--color-ink);
  margin-top: 1rem;
}

.projects__card-tagline {
  margin-top: 1rem;
  max-width: 28rem;
}

.projects__card-text,
.contact__text {
  color: var(--color-ink-dim);
  margin-top: 0.7rem;
  max-width: 30rem;
}

.contact__text {
  color: var(--color-ink);
  margin-top: 1.1rem;
}

.projects__tags {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  line-height: 1.7;
  color: var(--color-ink-dim);
  margin-top: 1.1rem;
  max-width: 28rem;
}

.projects__card-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem 2rem;
  margin-top: 0.9rem;
}

/* Liens : Jost capitales espacées, un filet de 1 px dessous, ni cadre ni fond. */
.projects__link {
  display: inline-block;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-accent);
  background: none;
  border: none;
  border-bottom: 1px solid var(--color-accent);
  padding: 0.5rem 0 0.35rem 0.2em;
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
  align-items: center;
  gap: 0.6rem;
  margin: 1.4rem 0 0;
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

.contact__inner .projects__link {
  margin-top: 1.4rem;
}

@media (max-width: 767.98px) {
  .projects__number {
    font-size: 3rem;
  }

  .projects__card-title,
  .contact__title {
    margin-top: 1rem;
    letter-spacing: 0.16em;
  }
}
</style>
