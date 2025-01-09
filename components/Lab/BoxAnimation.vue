<template>
  <div
    class="flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-teal-300 font-sans"
  >
    <div
      id="animated-box"
      :class="[
        'flex items-center justify-center w-36 h-36 text-white text-center rounded-lg shadow-md transform transition-all duration-[3000ms]',
        isVisible
          ? 'opacity-100 scale-100 rotate-0'
          : 'opacity-0 scale-50 -rotate-180',
        isClicked ? 'bg-yellow-400 animate-bounce' : 'bg-purple-500',
      ]"
      @click="handleClick"
    >
      ✨ Animation Vue.js ✨
    </div>
    <button
      class="mt-5 px-5 py-2 text-white bg-green-500 rounded-lg hover:bg-blue-500 transition-colors duration-300"
      @click="toggleVisibility"
    >
      {{ isVisible ? "Masquer la boîte" : "Afficher la boîte" }}
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false,
      isClicked: false,
    };
  },
  methods: {
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },
    handleClick() {
      this.isClicked = true;
      setTimeout(() => {
        this.isClicked = false;
      }, 1000)
    },
  },
}
</script>

<style scoped>
@keyframes bounce {
  0% {
    transform: scale(0.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
