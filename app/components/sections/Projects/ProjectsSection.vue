<template>
  <BaseSection>
    <div class="projects">
      <div class="projects__intro panel px-4 py-4 sm:px-6 sm:py-5">
        <h2 class="projects__title light-shadow-text">{{ projects.title }}</h2>
        <p class="projects__lead">{{ projects.intro }}</p>
      </div>

      <div class="projects__grid">
        <article v-for="card in projects.cards" :key="card.id" class="projects__card">
          <h3 class="projects__card-title">{{ card.title }}</h3>
          <p class="projects__card-tagline">{{ card.tagline }}</p>
          <p class="projects__card-text">{{ card.text }}</p>

          <ul class="projects__tags">
            <li v-for="tag in card.tags" :key="tag" class="projects__tag">{{ tag }}</li>
          </ul>

          <div class="projects__card-actions">
            <a
              v-if="card.href"
              :href="card.href"
              target="_blank"
              rel="noopener noreferrer"
              class="projects__link"
            >
              Voir le code
            </a>
            <button
              v-if="card.cta"
              type="button"
              class="projects__link projects__link--button"
              @click="goToSection(card.cta.section)"
            >
              {{ card.cta.label }}
            </button>
          </div>
        </article>
      </div>

      <div id="contact" class="contact panel px-5 py-6 sm:px-8 sm:py-8">
        <h2 class="contact__title light-shadow-text">{{ contact.title }}</h2>
        <p class="contact__text">{{ contact.text }}</p>

        <ul class="contact__list">
          <li>
            <a :href="`mailto:${contact.email}`" class="contact__link">
              <span class="contact__link-label">{{ contact.emailLabel }}</span>
              <span class="contact__link-value">{{ contact.email }}</span>
            </a>
          </li>
          <li>
            <a :href="contact.github" target="_blank" rel="noopener noreferrer" class="contact__link">
              <span class="contact__link-label">{{ contact.githubLabel }}</span>
            </a>
          </li>
          <li v-if="contact.linkedin">
            <a :href="contact.linkedin" target="_blank" rel="noopener noreferrer" class="contact__link">
              <span class="contact__link-label">{{ contact.linkedinLabel }}</span>
            </a>
          </li>
        </ul>

        <a
          v-if="contact.cvUrl"
          :href="contact.cvUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="contact__cv"
        >
          {{ contact.cvLabel }}
        </a>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import BaseSection from '~/components/sections/BaseSection.vue'
import { siteContent } from '~/data/content'
import { useAppNavigation } from '~/composables/useAppNavigation'

const projects = siteContent.projects
const contact = siteContent.projects.contact
const { goToSection } = useAppNavigation()
</script>

<style scoped>
.projects {
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
  color: white;
}

.projects__intro {
  max-width: 46rem;
  margin: 0 auto 2rem;
  text-align: center;
}

.projects__title {
  font-size: 1.9rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.projects__lead {
  font-size: 1.05rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
}

.projects__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.projects__card {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.projects__card-title {
  font-size: 1.15rem;
  font-weight: 700;
}

.projects__card-tagline {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.projects__card-text {
  font-size: 0.9rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.8);
}

.projects__tags {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0.25rem 0 0;
  padding: 0;
}

.projects__tag {
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.85);
}

.projects__card-actions {
  margin-top: 0.5rem;
  display: flex;
  gap: 1rem;
}

.projects__link {
  font-size: 0.9rem;
  font-weight: 700;
  color: white;
  text-decoration: underline;
  text-underline-offset: 3px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.contact {
  max-width: 32rem;
  margin: 0 auto;
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.contact__title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.contact__text {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 1.25rem;
}

.contact__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  margin: 0 0 1.25rem;
  padding: 0;
}

.contact__link {
  display: inline-flex;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: white;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.contact__link-label {
  font-weight: 700;
}

.contact__cv {
  display: inline-block;
  border-radius: 999px;
  border: 2px solid white;
  padding: 0.55rem 1.5rem;
  font-weight: 700;
  color: white;
}

@media (min-width: 640px) {
  .projects__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .projects__card:last-child:nth-child(odd) {
    grid-column: span 2;
  }
}

@media (min-width: 1024px) {
  .projects__grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .projects__card:last-child:nth-child(odd) {
    grid-column: auto;
  }
}

@media (min-width: 768px) {
  .projects__title {
    font-size: 2.3rem;
  }
}
</style>
