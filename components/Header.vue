<template>
    <header class="fixed top-0 left-0 w-full z-50 dark:bg-primary-950 flex text-xl justify-between px-8 py-4 bg-white font-bold shadow-2xl">
        <div>Grégoire MARCHAND</div>
        <div class="flex gap-2 items-center">
        <UButton color="gray" variant="ghost" aria-label="Theme">
            <a href="https://github.com/GregCesi" class="">
                <i class="fa-brands fa-github text-xl"></i>
            </a>
        </UButton>
        <ColorModeButton></ColorModeButton>
        </div>
        
  </header>
</template>

<script setup lang="ts">
  import { useColorMode } from '#imports'

  import ColorModeButton from '~/components/Option/ColorModeButton.vue';
  const colorMode = useColorMode()
</script>