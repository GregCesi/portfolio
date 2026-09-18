<template>
  <BaseSection>
    <div class="method">
      <div class="method__intro panel px-4 py-4 sm:px-6 sm:py-5">
        <h2 class="method__title light-shadow-text">{{ method.title }}</h2>
        <p class="method__lead">{{ method.intro }}</p>
      </div>

      <div class="method__grid">
        <article v-for="card in method.cards" :key="card.title" class="method__card">
          <h3 class="method__card-title">{{ card.title }}</h3>
          <p class="method__card-text">{{ card.text }}</p>
        </article>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import BaseSection from '~/components/sections/BaseSection.vue'
import { siteContent } from '~/data/content'

const method = siteContent.method
</script>

<style scoped>
.method {
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
  color: white;
}

.method__intro {
  max-width: 46rem;
  margin: 0 auto 2rem;
  text-align: center;
}

.method__title {
  font-size: 1.9rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.method__lead {
  font-size: 1.05rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
}

.method__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.method__card {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
}

.method__card-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.method__card-text {
  font-size: 0.95rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.85);
}

@media (min-width: 640px) {
  .method__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .method__title {
    font-size: 2.3rem;
  }
}
</style>
