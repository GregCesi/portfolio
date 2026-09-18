<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useHead } from '#app'

// Sans JavaScript, les éléments révélés par le mouvement lent (`.rv`,
// masqués par défaut) restent visibles : le contenu ne dépend pas du script.
useHead({
  noscript: [{ innerHTML: '<style>.rv{opacity:1!important}</style>' }],
})
</script>
