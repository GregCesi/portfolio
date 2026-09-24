<template>
  <BaseSection :index="5">
    <div ref="rootRef" class="contact">
      <div class="contact__block">
        <h2 class="contact__title t-title rv">{{ contact.title }}</h2>
        <p class="contact__text t-body rv">{{ contact.text }}</p>

        <ul class="contact__list rv">
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

        <a
          v-if="contact.cvUrl"
          :href="contact.cvUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="contact__cv rv"
        >
          {{ contact.cvLabel }}
        </a>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseSection from '~/components/sections/BaseSection.vue'
import { siteContent } from '~/data/content'
import { useSplitReveal } from '~/composables/useSplitReveal'

const contact = siteContent.contact

const rootRef = ref<HTMLElement | null>(null)
useSplitReveal(rootRef, {
  index: 4,
  titles: '.contact__title',
  lines: '.contact__text, .contact__list, .contact__cv',
})
</script>

<style scoped>
.contact {
  height: 100%;
  width: 100%;
  max-width: 64rem;
  margin: 0 auto;
  display: flex;
  align-items: safe center;
  justify-content: center;
  padding: 0 var(--pad-x);
}

.contact__block {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.contact__title {
  font-size: clamp(1.25rem, 1rem + 1vw, 2rem);
  margin-bottom: 1.5rem;
  text-wrap: balance;
}

.contact__text {
  max-width: 30rem;
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

/* Lien : Jost capitales espacées, un filet de 1 px dessous, ni cadre ni fond. */
.contact__cv {
  display: inline-block;
  margin-top: 1.4rem;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-accent);
  border-bottom: 1px solid var(--color-accent);
  padding: 0.5rem 0 0.35rem 0.2em;
  transition: color 0.8s var(--ease-slow), border-color 0.8s var(--ease-slow);
}

.contact__cv:hover {
  color: var(--color-ink);
  border-bottom-color: var(--color-ink);
}
</style>
