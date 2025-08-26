<template>
  <div>
    <BaseSection>
      <div class="flex items-center justify-center">
        <Universal3DModel model="/3d/models/Planet-1.glb" :autoRotate=true :interactive=true />
      </div>
    </BaseSection>
  </div>
</template>   

<script setup lang="ts">
import BaseSection from '~/components/sections/BaseSection.vue'
import Universal3DModel from '~/components/3d/Universal3DModel.vue'
</script>
