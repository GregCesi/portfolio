import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxt/eslint'],
  css: ['@/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  hooks: {
    // Le panneau `?tune` (EXE-72) et tweakpane ne se chargent qu'à la demande :
    // aucune balise de préchargement ne les annonce dans la page.
    'build:manifest': (manifest) => {
      for (const resource of Object.values(manifest)) {
        if (resource.src?.startsWith('tune/')) {
          resource.prefetch = false
          resource.preload = false
        }
      }
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'fr',
      },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href:
            'https://fonts.googleapis.com/css2?' +
            'family=Jost:wght@300;400&' +
            'family=Hanken+Grotesk:wght@400&' +
            'display=swap',
        },
      ],
    },
  },
})
