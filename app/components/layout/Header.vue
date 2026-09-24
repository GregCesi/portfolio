<template>
  <header class="site-header">
    <div class="site-header__inner">
      <div>
        <p class="site-header__name">{{ siteContent.global.name }}</p>
        <p class="site-header__title">{{ siteContent.global.headerTitle }}</p>
      </div>
      <ul class="site-header__links">
        <li>
          <a :href="contact.github" target="_blank" rel="noopener noreferrer" class="site-header__link">
            {{ contact.githubLabel }}
          </a>
        </li>
        <li v-if="contact.linkedin">
          <a :href="contact.linkedin" target="_blank" rel="noopener noreferrer" class="site-header__link">
            {{ contact.linkedinLabel }}
          </a>
        </li>
        <li>
          <a :href="`mailto:${contact.email}`" class="site-header__link">{{ contact.emailLabel }}</a>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup lang="ts">
import { siteContent } from '~/data/content'

const contact = siteContent.contact
</script>

<style scoped>
/* Nom et titre posés sur le noir, comme un carton en coin d'écran (§2.3 bis) :
   ni cadre, ni fond, le voile du layout garantit le contraste. Les trois liens
   de contact sont à l'autre coin, dans le style du nom. */
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  pointer-events: none;
}

.site-header__inner {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.25rem 0.85rem;
}

.site-header__name {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.34em;
  color: var(--color-ink);
}

.site-header__title {
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
  color: var(--color-ink-dim);
  margin-top: 0.3rem;
}

/* Mobile : les liens s'empilent à droite, pour ne pas toucher le nom ni le titre. */
.site-header__links {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
  list-style: none;
  pointer-events: auto;
}

.site-header__link {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--color-ink);
}

@media (min-width: 768px) {
  .site-header__inner {
    padding: 1.4rem 1.5rem 0.8rem;
  }

  .site-header__name {
    font-size: 0.875rem;
  }

  .site-header__links {
    flex-direction: row;
    gap: 2rem;
  }

  .site-header__link {
    font-size: 0.875rem;
    letter-spacing: 0.34em;
  }
}

@media (min-width: 1280px) {
  .site-header__inner {
    padding: 1.6rem 2.5rem 1.1rem;
  }
}
</style>
