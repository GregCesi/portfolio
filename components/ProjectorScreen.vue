<template>
  <div class="flex flex-col items-center justify-center">
    <!-- Conteneur relatif : image + overlay de scan-lines -->
    <div class="relative w-1/2 aspect-video overflow-hidden">
      <img
        class="w-full h-full object-cover"
        :src="currentImage"
        alt="Mon écran holographique"
      >
      <div class="scan-lines"></div>
      <button
        v-if="images.length > 1"
        class="absolute left-0 top-1/2 -translate-y-1/2 px-2 text-white text-2xl"
        @click="prev"
      >
        &#8249;
      </button>
      <button
        v-if="images.length > 1"
        class="absolute right-0 top-1/2 -translate-y-1/2 px-2 text-white text-2xl"
        @click="next"
      >
        &#8250;
      </button>
    </div>

    <!-- Votre projecteur SVG, inchangé -->
    <img
      class="w-1/4 -mt-10"
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
  },
  images: {
    type: Array as () => string[],
    default: () => [],
  },
})

const images = computed(() => {
  return props.images.length ? props.images : props.image ? [props.image] : []
})

const currentIndex = ref(0)
const currentImage = computed(() => images.value[currentIndex.value] || '')

function next() {
  if (images.value.length > 1) {
    currentIndex.value = (currentIndex.value + 1) % images.value.length
  }
}

function prev() {
  if (images.value.length > 1) {
    currentIndex.value =
      (currentIndex.value - 1 + images.value.length) % images.value.length
  }
}
</script>