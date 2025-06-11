<template>
  <button
    class="relative group flex items-center h-24 w-48 overflow-hidden "
    @click="onClick"
  >
    <span
      class="absolute left-0 top-0 bottom-0 w-1 bg-white transition-transform duration-300 group-hover:translate-x-[3rem] hover:light-shadow"
    />
    <span
      class="relative z-10 pl-2 pb-24 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 rotate-90 uppercase max-w-20 text-wrap"
    >
      {{ label }}
    </span>
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