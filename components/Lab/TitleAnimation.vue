<template>
  <div class="flex items-center justify-between bg-gray-100 p-4">
    <h1
      class="text-4xl font-bold text-gray-800 opacity-0 overflow-hidden relative"
      :class="{ 'animate-title opacity-100': isVisible }"
    >
      Bienvenue chez CATRA
    </h1>
    <button
      class="ml-5 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
      @click="toggleVisibility"
    >
      {{ isVisible ? "Cacher le titre" : "Afficher le titre" }}
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false,
    }
  },
  methods: {
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },
  },
}
</script>

<style scoped>
h1 {
  white-space: nowrap;
  overflow: hidden;
  transform: translateX(100%);
}
.animate-title {
  animation: slide-in 1.5s ease-out forwards;
}
@keyframes slide-in {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
