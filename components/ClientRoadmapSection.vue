<template>
    <section class="container mx-auto mt-20">
        <h2 class="text-4xl font-bold text-white light-shadow-text text-center">Comment je vous accompagne ?</h2>
        <div class="flex items-center justify-center">
            <div class="w-2/3">
                <TimeLineRoadmap />
            </div>
            <div class="w-1/3">
                <ThreeSphere model="Planet-1" :camera-position="3"/>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import ThreeSphere from './ThreeSphere.vue'
import TimeLineRoadmap from './TimeLineRoadmap.vue'
</script>

    

    