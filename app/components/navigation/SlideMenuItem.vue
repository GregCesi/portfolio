<template>
  <button
    class="relative group flex items-center h-24 w-48 overflow-hidden"
    :aria-pressed="active"
    @click="onClick"
  >
    <div
      class="absolute left-0 top-0 bottom-0 w-1 bg-white transition-all duration-300 group-hover:translate-x-[3rem] group-hover:shadow-[0_0_15px_rgba(255,255,255,0.9)]"
      :class="active ? 'translate-x-[3rem] shadow-[0_0_15px_rgba(255,255,255,0.9)]' : ''"
    />
    <div
      class="relative z-10 pl-2 pb-24 text-white transition-opacity duration-300 rotate-90 uppercase max-w-20 text-wrap"
      :class="active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
    >
      {{ label }}
    </div>
  </button>
</template>

<script setup lang="ts">
import type { SlideMenuItemProps, SlideMenuItemEmits } from '~/types/navigation'

const props = defineProps<SlideMenuItemProps>()
const emit = defineEmits<SlideMenuItemEmits>()

function onClick() {
  emit('select', props.index)
}
</script>
