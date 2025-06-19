<template>
    <section class="container mx-auto">
        <div class="flex flex-col items-center justify-center">
            <ProjectorScreen :images="['/images/ProjectScreenCatra.png', '/images/ProjectScreenPARC.png']" />
        </div>
    </section>
</template>

<script setup lang="ts">
import ProjectorScreen from './ProjectorScreen.vue'
</script>