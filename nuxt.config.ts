export default defineNuxtConfig({
  app: {
    head: {
      title: 'Portfolio Grégoire Marchand',
      meta: [
        { name: 'description', content: 'Portfolio developpeur full-stack web mobile application site vitrine informatique informaticien' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/images/logo_site.png' },
      ],
    },
  },
  modules: ['@nuxt/ui', '@nuxt/eslint'],
  compatibilityDate: '2025-01-06',
  colorMode: {
    preference: 'light',
  },
  plugins: ['~/plugins/gsap.client.js'],
  ssr: false, // Désactive le SSR pour un mode SPA
});
