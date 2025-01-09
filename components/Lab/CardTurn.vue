<template>
  <div class="container mx-auto my-8">
    <div
      class="relative aspect-square w-1/6 cursor-pointer transform-style-preserve-3d transition-transform duration-500"
      :class="{ 'rotate-y-180': isFlipped }"
      @click="toggleFlip"
    >
      <!-- Face avant -->
      <div
        class="absolute inset-0 flex items-center justify-center bg-gray-200 backface-hidden"
      >
        <div>Face Avant</div>
      </div>

      <!-- Face arrière -->
      <div
        class="absolute inset-0 flex items-center justify-center bg-gray-400 backface-hidden rotate-y-180"
      >
        <div>Face Arrière</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isFlipped: false, // État de la carte (retournée ou non)
    }
  },
  methods: {
    toggleFlip() {
      this.isFlipped = !this.isFlipped; // Inverse l'état au clic
    },
  },
}
</script>

<style>
/* Activer la perspective */
.container {
  perspective: 1000px;
}

/* Empêcher l'affichage de la face arrière tant qu'elle n'est pas visible */
.backface-hidden {
  backface-visibility: hidden;
}

/* Conserver le style 3D */
.transform-style-preserve-3d {
  transform-style: preserve-3d;
}

/* Rotation 3D */
.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
