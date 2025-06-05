<template>
  <div class="fixed inset-0 -z-10">
  <canvas 
    ref="canvas" 
    class="w-full h-full"
    :style="{
      'transform': 'translateZ(0)', // Active l'accélération matérielle
      'will-change': 'transform' // Prévient le navigateur des changements
    }"
  />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useNuxtApp } from '#app'

const canvas = ref<HTMLCanvasElement | null>(null);

interface Star {
  x: number;
  y: number;
  z: number;
  prevZ: number;
  speed: number;
  color: string;
}

// Configuration
const config = {
  starCount: 800,
  starSpeed: 0.1,
  starSize: 1.5,
  starColors: [
    { color: "#ffffff", weight: 40 },
    { color: "#4cc9f0", weight: 40 },
    { color: "#f72585", weight: 2 }
  ],
  fov: 250,
  warpSpeed: 1,
  warpFactor: 0
};

let resizeTimeout: number | null = null;
const RESIZE_DELAY = 100; // Délai en ms

// Variables d'état
const width = ref(0);
const height = ref(0);
const centerX = ref(0);
const centerY = ref(0);
const stars = ref<Star[]>([]);
let lastTime = 0;
let time = 0;
let animationFrameId: number;
let ctx: CanvasRenderingContext2D | null = null;

// Fonction pour choisir une couleur aléatoire
function getRandomColor() {
  const totalWeight = config.starColors.reduce((sum, color) => sum + color.weight, 0);
  let random = Math.random() * totalWeight;

  for (const color of config.starColors) {
    random -= color.weight;
    if (random <= 0) return color.color;
  }
  
  return config.starColors[0].color;
}

// Initialisation des étoiles
function initStars() {
  const newStars = [];
  for (let i = 0; i < config.starCount; i++) {
    const z = Math.random() * 2000;
    newStars.push({
      x: (Math.random() - 0.5) * 5000,
      y: (Math.random() - 0.5) * 5000,
      z,
      prevZ: z,
      speed: 0.1 + Math.random() * 0.5,
      color: getRandomColor()
    });
  }
  stars.value = newStars;
}

// Gestion du redimensionnement
function handleResize() {
  if (!canvas.value) return;
  
  // Annuler le redimensionnement précédent s'il n'est pas encore exécuté
  if (resizeTimeout) {
    window.cancelAnimationFrame(resizeTimeout);
  }

  // Utiliser requestAnimationFrame pour regrouper les mises à jour
  resizeTimeout = window.requestAnimationFrame(() => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    
    // Ne mettre à jour que si la taille a réellement changé
    if (newWidth !== width.value || newHeight !== height.value) {
      width.value = canvas.value!.width = newWidth;
      height.value = canvas.value!.height = newHeight;
      centerX.value = newWidth / 2;
      centerY.value = newHeight / 2;
      
      // Redessiner immédiatement après le redimensionnement
      if (ctx) {
        ctx.fillStyle = "rgba(0, 0, 0, 1)"; // Fond noir plein pour éviter le clignotement
        ctx.fillRect(0, 0, newWidth, newHeight);
      }
    }
  });
}

// Mise à jour des étoiles
function updateStars(deltaTime: number) {
  time += deltaTime * 0.001;
  config.warpFactor = 0.5 + 0.5 * Math.sin(time * 0.5);
  
  const updatedStars = [...stars.value];
  for (let i = 0; i < updatedStars.length; i++) {
    const star = updatedStars[i];
    star.prevZ = star.z;
    star.z -= (star.speed * 10 + config.warpSpeed * 10 * config.warpFactor) * deltaTime * 0.01;

    if (star.z <= 0) {
      star.z = 2000;
      star.x = (Math.random() - 0.5) * 5000;
      star.y = (Math.random() - 0.5) * 5000;
      star.prevZ = star.z;
    }
  }
  stars.value = updatedStars;
}

// Dessiner les étoiles
function drawStars() {
  if (!ctx) return;
  
  // Effet de traînée
  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  ctx.fillRect(0, 0, width.value, height.value);

  // Trier les étoiles par profondeur
  const sortedStars = [...stars.value].sort((a, b) => b.z - a.z);

  for (const star of sortedStars) {
    const scale = config.fov / (star.z + config.fov);
    const x = centerX.value + star.x * scale;
    const y = centerY.value + star.y * scale;
    const prevScale = config.fov / (star.prevZ + config.fov);
    const prevX = centerX.value + star.x * prevScale;
    const prevY = centerY.value + star.y * prevScale;

    // Dessiner la ligne de vitesse
    if (Math.abs(x - prevX) < width.value / 2 && Math.abs(y - prevY) < height.value / 2) {
      ctx.beginPath();
      ctx.strokeStyle = star.color;
      ctx.lineWidth = scale * config.starSize * 0.5;
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Dessiner l'étoile
    ctx.beginPath();
    ctx.fillStyle = star.color;
    ctx.arc(x, y, scale * config.starSize, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Boucle d'animation
function animate(timestamp: number) {
  if (!lastTime) lastTime = timestamp;
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  updateStars(deltaTime);
  drawStars();
  animationFrameId = requestAnimationFrame(animate);
}

const { $emitter } = useNuxtApp()
const accelerate = () => { config.warpSpeed = 10 }
const normalize = () => { config.warpSpeed = 1 }

onMounted(() => {
  if (!canvas.value) return;

  $emitter.on('accelerate-stars', accelerate)
  $emitter.on('normalize-stars', normalize)
  
  // Initialisation du contexte
  const context = canvas.value.getContext("2d");
  if (!context) return;
  ctx = context;
  
  // Configuration initiale
  handleResize();
  initStars();
  
  // Démarrer l'animation
  window.addEventListener("resize", handleResize);
  animationFrameId = requestAnimationFrame(animate);
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  window.removeEventListener("resize", handleResize);
  $emitter.off('accelerate-stars', accelerate);
  $emitter.off('normalize-stars', normalize);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});

function handleVisibilityChange() {
  if (document.hidden) {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  } else {
    lastTime = performance.now();
    animationFrameId = requestAnimationFrame(animate);
  }
}  
</script>

<style scoped>
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -10; /* Assurez-vous qu'il est derrière tout le contenu */
  pointer-events: none; /* Permet les clics à travers le canvas */
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>