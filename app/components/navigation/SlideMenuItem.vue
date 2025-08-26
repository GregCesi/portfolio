<template>
  <button
    :class="[
      'relative group flex items-center',
      horizontal 
        ? 'h-8 justify-center flex-1' 
        : 'h-24 w-48'
    ]"
    :aria-pressed="active"
    @click="onClick"
  >
    <!-- Barre d'indication -->
    <div
      :class="[
        'absolute bg-white transition-all duration-300 max-md:w-full',
        horizontal
          ? 'left-1/2 -translate-x-1/2 bottom-0 h-0.5 w-4 group-hover:translate-y-[1rem] group-hover:shadow-[0_0_15px_rgba(255,255,255,0.9)]'
          : 'left-0 top-0 bottom-0 w-1 group-hover:translate-x-[3rem] group-hover:shadow-[0_0_15px_rgba(255,255,255,0.9)]',
        horizontal && active 
          ? 'translate-y-[1rem] shadow-[0_0_15px_rgba(255,255,255,0.9)]'
          : '',
        !horizontal && active 
          ? 'translate-x-[3rem] shadow-[0_0_15px_rgba(255,255,255,0.9)]' 
          : ''
      ]"
    />
    
    <!-- Texte du label -->
    <div
      :class="[
        'relative z-10 text-white transition-opacity duration-300 uppercase text-wrap',
        horizontal 
          ? 'text-[8px] sm:text-[12px] text-center max-w-20' 
          : 'pl-2 pb-24 rotate-90 max-w-20',
        horizontal 
          ? 'opacity-100'  
          : active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      ]"
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
