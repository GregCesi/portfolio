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

          <template v-for="card in projects.cards" :key="card.id">
            <!-- Plan complet : un projet par plan. -->
            <article v-if="!isSplit(card.id)" class="projects__card">
              <div class="projects__card-inner">
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

            <!-- Écran trop court pour ce projet (petit téléphone) : on découpe, on ne tronque pas.
                 Premier plan : titre, accroche, tags, liens. Second plan : le texte. -->
            <template v-else>
              <article class="projects__card">
                <div class="projects__card-inner">
                  <h3 class="projects__card-title">{{ card.title }}</h3>
                  <p class="projects__card-tagline t-body">{{ card.tagline }}</p>
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
              <article class="projects__card">
                <div class="projects__card-inner">
                  <p class="projects__card-text projects__card-text--solo t-body">{{ card.text }}</p>
                </div>
              </article>
            </template>
          </template>

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
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
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
const rootRef = ref<HTMLElement | null>(null)

// Un projet trop long pour un écran très court (petit téléphone) est découpé en deux plans (voir `measure`).
const splitIds = ref<string[]>([])
const isSplit = (id: string) => splitIds.value.includes(id)
const total = computed(() => projects.cards.length + 2 + splitIds.value.length)
const sub = useMobileSubscreens(total, 4)
const subscreenNav = useSubscreenNav()

// Marge minimale de 14 px au-dessus et au-dessous d'un plan mobile.
const FRAME_MARGIN = 28
let measureTimer: ReturnType<typeof setTimeout> | null = null
let lastSize = ''

/** Mesure chaque projet entier dans son cadre ; ceux qui ne tiennent pas sont découpés en deux plans. */
async function measure() {
  const root = rootRef.value
  if (!root) return
  const mobile = window.matchMedia('(max-width: 767.98px)').matches
  const frame = root.querySelector<HTMLElement>('.subtrack')
  if (!mobile || !frame) {
    if (splitIds.value.length) splitIds.value = []
    return
  }
  // Mesure à l'état entier : tout est remis en un plan par projet, puis rendu.
  splitIds.value = []
  await nextTick()
  const cards = Array.from(root.querySelectorAll<HTMLElement>('.projects__card'))
  const tooTall: string[] = []
  projects.cards.forEach((card, i) => {
    const inner = cards[i]?.querySelector<HTMLElement>('.projects__card-inner')
    if (inner && inner.offsetHeight > frame.clientHeight - FRAME_MARGIN) tooTall.push(card.id)
  })
  splitIds.value = tooTall
}

function scheduleMeasure() {
  const size = `${window.innerWidth}x${window.innerHeight}`
  if (size === lastSize) return
  lastSize = size
  if (measureTimer) clearTimeout(measureTimer)
  measureTimer = setTimeout(() => void measure(), 200)
}

onMounted(() => {
  subscreenNav.register('projects', sub)
  lastSize = `${window.innerWidth}x${window.innerHeight}`
  void measure()
  // Les polices changent la hauteur du texte : on mesure de nouveau une fois chargées.
  void document.fonts?.ready.then(() => {
    lastSize = ''
    scheduleMeasure()
  })
  window.addEventListener('resize', scheduleMeasure)
})
onBeforeUnmount(() => {
  subscreenNav.unregister('projects')
  window.removeEventListener('resize', scheduleMeasure)
  if (measureTimer) clearTimeout(measureTimer)
})

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

/* `safe` : un contenu plus haut que le cadre s'aligne en haut au lieu de déborder des deux côtés. */
.projects__head,
.projects__card,
.contact {
  display: flex;
  align-items: safe center;
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

.projects__card-title,
.contact__title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.05rem, 0.9rem + 0.5vw, 1.4rem);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  line-height: 1.4;
  color: var(--color-ink);
}

/* Un filet de 1 px ouvre le carton d'un plan (ornement, aucun texte). */
.projects__card-title::before,
.contact__title::before {
  content: '';
  display: block;
  width: 2.5rem;
  height: 1px;
  margin: 0 auto 1.1rem;
  background: var(--color-accent);
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

/* Texte seul sur son plan (projet découpé) : pas de marge au-dessus. */
.projects__card-text--solo {
  margin-top: 0;
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
  .projects__card-title,
  .contact__title {
    letter-spacing: 0.16em;
  }

  .projects__card-title::before,
  .contact__title::before {
    margin-bottom: 0.75rem;
  }

  /* Le plus long plan (rag-eval-scifact) doit tenir dans le cadre avec de l'air autour du lien. */
  .projects__card-inner .t-body {
    line-height: 1.5;
  }

  .projects__card-tagline {
    margin-top: 0.7rem;
  }

  .projects__card-text {
    margin-top: 0.4rem;
  }

  .projects__tags {
    margin-top: 0.7rem;
  }

  .projects__card-actions {
    margin-top: 0.4rem;
  }
}
</style>
