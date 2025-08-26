<template>
  <!-- Desktop: vertical left side -->
  <nav class="fixed left-12 top-1/4 hidden md:flex flex-col gap-4 z-50">
    <SlideMenuItem
      v-for="(label, idx) in labels"
      :key="idx"
      :label="label"
      :index="idx"
      :active="idx === props.activeIndex"
      :horizontal="false"
      @select="selectSlide"
    />
  </nav>
  
  <!-- Mobile: horizontal under header (TODO : modifier top-24 par la taille du Header) -->
  <nav class="fixed top-24 sm:top-30 left-0 right-0 flex md:hidden flex-row gap-2 md:gap-4 z-50 mx-8 sm:mx-12"> 
    <SlideMenuItem
      v-for="(label, idx) in labels"
      :key="idx"
      :label="label"
      :index="idx"
      :active="idx === props.activeIndex"
      :horizontal="true"
      @select="selectSlide"
    />
  </nav>
</template>

<script setup lang="ts">
import SlideMenuItem from '~/components/navigation/SlideMenuItem.vue'
import type { SlideMenuProps, SlideMenuEmits } from '~/types/navigation'

const props = defineProps<SlideMenuProps>()
const emit = defineEmits<SlideMenuEmits>()

function selectSlide(i: number) {
  emit('select', i)
}
</script>