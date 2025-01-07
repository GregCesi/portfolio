// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint'],
  compatibilityDate: '2025-01-06',
  colorMode: {
    preference: 'light'
  },
  plugins: [
    '~/plugins/gsap.client.js',
  ],
})