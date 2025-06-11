<template>
  <nav class="fixed left-12 top-1/4 flex flex-col gap-4 z-50">
    <SlideMenuItem
      v-for="(label, idx) in labels"
      :key="idx"
      :label="label"
      :index="idx"
      @select="selectSlide"
    />
  </nav>
</template>

<script setup lang="ts">
import SlideMenuItem from '~/components/SlideMenuItem.vue'

interface Props {
  labels: string[]
  container: any
}

const props = defineProps<Props>()

function selectSlide(i: number) {
  if (props.container && typeof props.container.goTo === 'function') {
    props.container.goTo(i)
  }
}
</script>