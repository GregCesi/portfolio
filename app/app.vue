<template>
  <!--
    Mode WIP (EXE-177) : l'accueil est la seule page, ni sas, ni menu, ni
    section. Toute autre adresse reste la page 404 (pages/[...slug].vue).
  -->
  <template v-if="wip && route.path === '/'">
    <BackgroundHyperspace />
    <Header />
    <StatusScreen :title="siteContent.wip.title" :subtitle="siteContent.hero.title" />
  </template>
  <NuxtPage v-else-if="wip" />
  <NuxtLayout v-else>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useAppConfig, useHead, useRoute } from '#app'
import Header from '~/components/layout/Header.vue'
import BackgroundHyperspace from '~/components/background/BackgroundHyperspace.vue'
import StatusScreen from '~/components/status/StatusScreen.vue'
import { siteContent } from '~/data/content'

const { wip } = useAppConfig()
const route = useRoute()

// Sans JavaScript, les éléments révélés par le mouvement lent (`.rv`,
// masqués par défaut) restent visibles et le sas d'entrée, que rien ne pourrait
// ouvrir, n'est pas affiché : le contenu ne dépend pas du script.
useHead({
  noscript: [{ innerHTML: '<style>.rv{opacity:1!important}.entry-gate{display:none!important}</style>' }],
})
</script>
