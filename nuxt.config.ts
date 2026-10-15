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
  // Mode WIP (EXE-177) : fixé au build par NUXT_PUBLIC_WIP=true, seule façon
  // de l'activer. `appConfig` est figé dans le bundle : aucune variable
  // d'environnement au lancement du serveur ne le bascule ensuite.
  appConfig: {
    wip: process.env.NUXT_PUBLIC_WIP === 'true',
  },
  nitro: {
    prerender: {
      // Adresse inconnue : rendue par la page 404 (pages/[...slug].vue).
      routes: ['/404'],
    },
    hooks: {
      // `nuxt generate` écrit 404.html en coquille vide, rendue par le seul
      // client : l'hébergement statique la servirait sans texte. Elle est
      // remplacée par le rendu complet de la page 404.
      'prerender:generate'(route) {
        if (route.route === '/404.html') {
          route.skip = true
        } else if (route.route === '/404') {
          route.fileName = '/404.html'
          // Le rendu serveur échappe l'apostrophe : le fichier garde le texte
          // de content/portfolio.md tel quel (attributs entre guillemets doubles).
          route.contents = route.contents?.replaceAll('&#39;', "'")
        }
      },
    },
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
