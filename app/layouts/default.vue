<template>
  <EntryGate />
  <BackgroundHyperspace />
  <div class="relative">
    <Header />
    <slot />
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/layout/Header.vue'
import EntryGate from '~/components/entry/EntryGate.vue'
import BackgroundHyperspace from '~/components/background/BackgroundHyperspace.vue'
</script>
