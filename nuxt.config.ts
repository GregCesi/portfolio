export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint'],
  compatibilityDate: '2025-01-06',
  colorMode: {
    preference: 'light',
  },
  plugins: ['~/plugins/gsap.client.js'],
  ssr: false, // Désactive le SSR pour un mode SPA
});