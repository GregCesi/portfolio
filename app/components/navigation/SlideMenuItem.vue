<template>
  <button
    class="relative group flex items-center h-24 w-48 overflow-hidden "
    @click="onClick"
  >
    <div
      class="absolute left-0 top-0 bottom-0 w-1 bg-white transition-all duration-300 group-hover:translate-x-[3rem] group-hover:shadow-[0_0_15px_rgba(255,255,255,0.9)]"
    />
    <div
      class="relative z-10 pl-2 pb-24 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 rotate-90 uppercase max-w-20 text-wrap"
    >
      {{ label }}
    </div>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{ label: string; index: number }>()
const emit = defineEmits<{
  (e: 'select', index: number): void
}>()

function onClick() {
  emit('select', props.index)
}
</script>