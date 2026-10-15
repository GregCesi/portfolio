<template>
  <!--
    Page 404 (EXE-177), dans les deux modes : toute adresse inconnue. Fond étoilé
    et header, ni sas ni menu. Une page plutôt qu'un `error.vue` : une route sans
    correspondance fait journaliser une erreur à Nuxt dans la console.
  -->
  <BackgroundHyperspace />
  <Header />
  <StatusScreen
    :title="siteContent.notFound.code"
    :subtitle="siteContent.notFound.text"
    :link="{ label: siteContent.notFound.backLabel, href: '/' }"
  />
</template>

<script setup lang="ts">
import Header from '~/components/layout/Header.vue'
import BackgroundHyperspace from '~/components/background/BackgroundHyperspace.vue'
import StatusScreen from '~/components/status/StatusScreen.vue'
import { siteContent } from '~/data/content'

definePageMeta({ layout: false })
</script>
