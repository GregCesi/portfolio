<template>
  <header
    class=" fixed top-0 left-0 right-0 mt-8 mx-64 p-4 rounded-full border-4 border-white light-shadow" 
  >
  <div class="flex items-center justify-between px-4 text-white">
    <div class=" font-bold ">
      <div class="text-3xl light-shadow-text">Grégoire MARCHAND</div>
      <div class="text-xl pl-4 light-shadow-text">Développeur Full-Stack</div>
    </div>
    <div>
      <nav>
        <ul class="flex gap-12 text-white text-2xl font-bold pr-8">
          <li class="light-shadow-text"><a href="#">Projets</a></li>
          <li class="light-shadow-text"><a href="#">Lab</a></li>
        </ul> 
      </nav>
    </div>
  </div>
  </header>
</template>

<script setup lang="ts">

</script>

<style scoped>
.light-shadow {
  /* offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: 0px 0px 30px 0px rgba(255, 255, 255, 0.7);
}

.light-shadow-text {
  /* décalage-X | décalage-Y | blur-radius | couleur */
  text-shadow: 0px 0px 15px rgba(255, 255, 255, 0.7);
}
</style>
