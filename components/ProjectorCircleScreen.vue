<template>
  <div class="flex flex-col items-center justify-center">
    <!-- Conteneur relatif : image + overlay de scan-lines -->
    <div class="relative overflow-hidden">
      <img
        class="w-48 h-48 rounded-full object-cover"
        :src="image"
        alt="Mon écran holographique"
      >
      <div class="scan-lines"></div>
    </div>

    <!-- Votre projecteur SVG, inchangé -->
    <img
      class="w-1/3 -mt-6"
      src="@/public/images/ScreenProjector/screenProjector.svg"
      alt="Projecteur"
    >
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  image: {
    type: String,
    required: true,
    default: undefined,
  }
})

const image = computed(() => {
  return props.image
})

</script>