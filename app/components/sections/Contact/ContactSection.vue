<template>
  <BaseSection :index="5">
    <div ref="rootRef" class="contact">
      <div class="contact__block">
        <h2 class="contact__title t-title rv">{{ contact.title }}</h2>

        <div class="contact__badge rv">
          <span class="contact__badge-dot" aria-hidden="true" />
          <span class="contact__badge-label t-label">{{ contact.badge }}</span>
        </div>

        <p class="contact__text t-body rv">{{ contact.text }}</p>

        <div class="contact__cards rv">
          <div class="contact__card contact__card--email">
            <a
              :href="`mailto:${contact.email}`"
              class="contact__card-hitbox"
              :aria-label="`${contact.emailLabel} : ${contact.email}`"
            />
            <svg class="contact__card-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="1.5" />
              <path d="M4 6.5 12 13 20 6.5" />
            </svg>
            <p class="contact__card-kicker">{{ contact.channelEmailLabel }}</p>
            <p class="contact__card-label">{{ contact.emailLabel }}</p>
            <p class="contact__card-value">{{ contact.email }}</p>
            <button
              type="button"
              class="contact__copy"
              aria-live="polite"
              @click="onCopy"
            >
              {{ copied ? contact.copiedLabel : contact.copyLabel }}
            </button>
          </div>

          <a
            v-if="contact.linkedin"
            :href="contact.linkedin"
            target="_blank"
            rel="noopener noreferrer"
            class="contact__card"
          >
            <svg class="contact__card-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="7.5" y1="10" x2="7.5" y2="17" />
              <circle cx="7.5" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
              <path d="M11.5 17v-4.2c0-1.6 1-2.6 2.4-2.6s2.1 1 2.1 2.6V17" />
            </svg>
            <p class="contact__card-kicker">{{ contact.channelLinkedinLabel }}</p>
            <p class="contact__card-label">{{ contact.linkedinLabel }}</p>
            <p class="contact__card-value">{{ contact.linkedinName }}</p>
          </a>

          <a :href="contact.github" target="_blank" rel="noopener noreferrer" class="contact__card">
            <svg class="contact__card-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M12 3c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4v-1.6c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1.1.1-2.3 0 0 .7-.2 2.2.8a7.7 7.7 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.4 1.2.2 2.1.1 2.3.5.5.8 1.2.8 2.1 0 3.1-1.9 3.7-3.6 3.9.3.3.6.8.6 1.6v2.4c0 .2.1.5.6.4A8 8 0 0 0 20 11c0-4.4-3.6-8-8-8Z"
              />
            </svg>
            <p class="contact__card-kicker">{{ contact.channelGithubLabel }}</p>
            <p class="contact__card-label">{{ contact.githubLabel }}</p>
            <p class="contact__card-value">{{ contact.githubName }}</p>
          </a>
        </div>

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
import { onBeforeUnmount, ref } from 'vue'
import BaseSection from '~/components/sections/BaseSection.vue'
import { siteContent } from '~/data/content'
import { useSplitReveal } from '~/composables/useSplitReveal'

const contact = siteContent.contact

const rootRef = ref<HTMLElement | null>(null)
useSplitReveal(rootRef, {
  index: 4,
  titles: '.contact__title',
  lines: '.contact__badge, .contact__text, .contact__cards, .contact__cv',
})

const copied = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | undefined

async function onCopy() {
  try {
    await navigator.clipboard.writeText(contact.email)
  } catch {
    // Presse-papier refusé par le navigateur : le libellé change quand même.
  }
  copied.value = true
  clearTimeout(copyTimeout)
  copyTimeout = setTimeout(() => {
    copied.value = false
  }, 2500)
}

onBeforeUnmount(() => clearTimeout(copyTimeout))
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
  overflow-y: auto;
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
  margin-bottom: 1rem;
  text-wrap: balance;
}

.contact__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.contact__badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-online);
  animation: contact-pulse 2.4s var(--ease-slow) infinite;
}

@keyframes contact-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgb(110 231 160 / 55%);
  }
  50% {
    box-shadow: 0 0 0 6px rgb(110 231 160 / 0%);
  }
}

.contact__badge-label {
  color: var(--color-ink-dim);
}

.contact__text {
  max-width: 30rem;
}

.contact__cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 26rem;
  margin: 1.6rem 0 0;
}

.contact__card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.35rem;
  padding: 1.1rem 1rem;
  border: 1px solid var(--color-line);
  color: var(--color-ink);
  transition: border-color 0.5s var(--ease-slow), box-shadow 0.5s var(--ease-slow);
}

.contact__card:hover {
  border-color: var(--color-accent);
  box-shadow: 0 0 24px rgb(169 203 221 / 30%);
}

.contact__card--email {
  border-color: var(--color-accent);
  padding: 1.5rem 1.25rem;
}

.contact__card-hitbox {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.contact__card-icon {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  color: var(--color-accent);
}

.contact__card-kicker {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: var(--color-accent);
  margin-top: 0.5rem;
}

.contact__card-label {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-ink-dim);
}

.contact__card-value {
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  word-break: break-word;
}

.contact__copy {
  position: relative;
  z-index: 2;
  margin-top: 0.5rem;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-accent);
  background: none;
  border: none;
  border-bottom: 1px solid var(--color-accent);
  padding: 0.35rem 0 0.25rem;
  cursor: pointer;
  transition: color 0.5s var(--ease-slow), border-color 0.5s var(--ease-slow);
}

.contact__copy:hover {
  color: var(--color-ink);
  border-bottom-color: var(--color-ink);
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

@media (min-width: 768px) {
  .contact__cards {
    flex-direction: row;
    align-items: stretch;
    max-width: none;
  }

  .contact__card {
    flex: 1 1 0%;
  }

  .contact__card--email {
    flex: 1.3 1 0%;
  }
}
</style>
