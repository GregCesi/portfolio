<template>
  <div class="w-full h-full">
    <!-- TresCanvas = le canvas WebGL où tout sera rendu -->
    <TresCanvas class="w-full h-full">
      <!-- Camera = point de vue (position x,y,z) -->
      <TresPerspectiveCamera :position="[0, 0, 3.5]" />
      
      <!-- Contrôles de caméra simples -->
      <OrbitControls />
      
      <!-- Lumières pour éclairer les objets -->
      <TresAmbientLight :intensity="0.5" />
      <TresDirectionalLight :position="[10, 10, 10]" />
      
      <!-- Ta planète GLB - DEBUG -->
      <Suspense>
        <PlanetModel />
        <template #fallback>
          <!-- Pendant le chargement du modèle -->
          <TresMesh>
            <TresSphereGeometry :args="[1, 32, 32]" />
            <TresMeshStandardMaterial color="gray" />
          </TresMesh>
        </template>
      </Suspense>
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
// import { TresCanvas } from '@tresjs/core'
// import { OrbitControls } from '@tresjs/cientos'
// import PlanetModel from './PlanetModel.vue'
// Pas besoin d'importer les autres composants Tres* 
// Ils sont automatiquement générés par TresJS
</script> 