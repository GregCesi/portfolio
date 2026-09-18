<template>
  <BaseSection>
    <div ref="rootRef" class="about">
      <div class="about__intro panel px-4 py-4 sm:px-6 sm:py-5">
        <h2 class="about__title light-shadow-text">{{ about.title }}</h2>
        <p class="about__lead">{{ about.intro }}</p>
      </div>

      <ol class="about__timeline">
        <li v-for="(entry, index) in about.timeline" :key="entry.period" class="about__entry">
          <div class="about__marker">
            <span :ref="(el) => setCircleRef(el as HTMLElement, index)" class="about__circle" />
            <span v-if="index < about.timeline.length - 1" class="about__line">
              <span :ref="(el) => setLineRef(el as HTMLElement, index)" class="about__line-fill" />
            </span>
          </div>

          <div class="about__content">
            <p class="about__period light-shadow-text">{{ entry.period }}</p>
            <p class="about__place light-shadow-text">{{ entry.place }}</p>
            <p class="about__role">{{ entry.role }}</p>
            <p v-if="entry.detail" class="about__detail light-shadow-text">{{ entry.detail }}</p>
          </div>
        </li>
      </ol>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import BaseSection from '~/components/sections/BaseSection.vue'
import { siteContent } from '~/data/content'
import { usePrefersReducedMotion } from '~/composables/usePrefersReducedMotion'

const about = siteContent.about
const prefersReducedMotion = usePrefersReducedMotion()

const rootRef = ref<HTMLElement | null>(null)
const circles = ref<HTMLElement[]>([])
const lines = ref<HTMLElement[]>([])

let observer: IntersectionObserver | null = null
let hasPlayed = false

function setCircleRef(el: HTMLElement | null, index: number) {
  if (el) circles.value[index] = el
}

function setLineRef(el: HTMLElement | null, index: number) {
  if (el) lines.value[index] = el
}

function playReveal() {
  if (hasPlayed) return
  hasPlayed = true

  if (prefersReducedMotion.value) {
    gsap.set(circles.value, { opacity: 1, scale: 1 })
    gsap.set(lines.value, { scaleY: 1 })
    return
  }

  gsap.set(circles.value, { opacity: 0.25, scale: 0.6 })
  gsap.set(lines.value, { scaleY: 0, transformOrigin: 'top center' })

  const tl = gsap.timeline()
  about.timeline.forEach((_, index) => {
    tl.to(circles.value[index]!, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' }, index === 0 ? 0 : '+=0')
    if (lines.value[index]) {
      tl.to(lines.value[index]!, { scaleY: 1, duration: 0.5, ease: 'power2.inOut' }, '<0.1')
    }
  })
}

onMounted(() => {
  if (!rootRef.value || typeof IntersectionObserver === 'undefined') {
    playReveal()
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry?.isIntersecting) {
        playReveal()
      }
    },
    { threshold: 0.25 }
  )
  observer.observe(rootRef.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  gsap.killTweensOf([...circles.value, ...lines.value])
})
</script>

<style scoped>
.about {
  width: 100%;
  max-width: 64rem;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
  color: white;
}

.about__intro {
  max-width: 42rem;
  margin: 0 auto 2.5rem;
  text-align: center;
}

.about__title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.about__lead {
  font-size: 1.05rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
}

.about__timeline {
  list-style: none;
  margin: 0;
  padding: 0;
}

.about__entry {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.about__marker {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 2rem;
  flex-shrink: 0;
}

.about__circle {
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 999px;
  background: white;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
}

.about__line {
  width: 2px;
  flex: 1;
  min-height: 3rem;
  background: rgba(255, 255, 255, 0.25);
  overflow: hidden;
  margin-top: 0.35rem;
}

.about__line-fill {
  display: block;
  width: 100%;
  height: 100%;
  background: white;
}

/*
 * Contrairement au reste du texte de la page (protégé par `.panel`, fond
 * rgba(0,0,0,0.4)), ce bloc n'avait aucune protection contre le fond
 * hyperspace mouvant : une traînée d'étoile brillante croisant le texte
 * pouvait faire chuter le contraste à ~1,10:1. Fond plus opaque ici
 * (0.65 au lieu de 0.4) car ce texte est aussi en opacité réduite
 * (voir .about__period / .about__detail) : la marge doit tenir même sur un
 * pixel de fond proche du blanc pur, pas seulement sur la moyenne du fond.
 */
.about__content {
  background-color: rgba(0, 0, 0, 0.65);
  border-radius: 1rem;
  padding: 0.85rem 1.1rem;
  margin-bottom: 1.5rem;
}

.about__period {
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 0.15rem;
}

.about__place {
  font-size: 1.15rem;
  font-weight: 700;
}

.about__role {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.85);
}

.about__detail {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 0.25rem;
}

@media (min-width: 768px) {
  .about__title {
    font-size: 2.5rem;
  }
}
</style>
