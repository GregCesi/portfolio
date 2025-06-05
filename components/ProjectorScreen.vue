<template>
  <div class="flex flex-col items-center justify-center">
    <!-- Conteneur relatif : image + overlay de scan-lines -->
    <div class="relative w-1/3 aspect-video overflow-hidden">
      <img
        class="w-full h-full object-cover"
        :src="image"
        alt="Mon écran holographique"
      >
      <div class="scan-lines"></div>
    </div>

    <!-- Votre projecteur SVG, inchangé -->
    <img
      class="w-1/5 -mt-10"
      src="@/public/images/ScreenProjector/screenProjector.svg"
      alt="Projecteur"
    >
  </div>
</template>

<script setup lang="ts">
defineProps({
  image: {
    type: String,
    required: true,
  },
})
</script>

