<template>
  <div class="relative w-[300px] h-[300px]">
    <div ref="container" class="w-full h-full" />
    <div v-if="error" class="absolute inset-0 flex items-center justify-center text-red-500">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const container = ref<HTMLElement | null>(null)
const error = ref<string | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let animationFrameId: number

const handleResize = () => {
  if (!container.value || !camera || !renderer) return
  const width = container.value.clientWidth
  const height = container.value.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

const init = async () => {
  try {
    if (!container.value) {
      throw new Error('Le conteneur est null')
    }

    // Initialisation de la scène 3D
    // La scène est le conteneur principal qui contiendra tous nos objets 3D, lumières et caméras
    scene = new THREE.Scene()
    
    // Initialisation de la caméra
    // On récupère les dimensions du conteneur pour un affichage responsive
    const width = container.value.clientWidth
    const height = container.value.clientHeight
    
    // Création d'une caméra perspective avec les paramètres suivants :
    // - 75° : champ de vision vertical (en degrés)
    // - ratio largeur/hauteur : pour éviter les déformations
    // - 0.1 : plan de rendu le plus proche
    // - 1000 : plan de rendu le plus éloigné
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    // On recule la caméra pour voir la scène
    camera.position.z = 3

    // Initialisation du moteur de rendu WebGL
    renderer = new THREE.WebGLRenderer({ 
      antialias: true,  // Active l'antialiasing pour des bords plus lisses
      alpha: true       // Permet un fond transparent
    })
    // On définit la taille du rendu
    renderer.setSize(width, height)
    // On ajoute le canvas du rendu dans le DOM
    container.value.appendChild(renderer.domElement)

    // Configuration des contrôles de la caméra (rotation/zoom/déplacement)
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true  // Ajoute de l'inertie aux mouvements

    // Ajout des lumières à la scène
    // Lumière ambiante : éclaire uniformément tous les objets
    const ambientLight = new THREE.AmbientLight(0x404040)  // Couleur gris clair
    scene.add(ambientLight)
    
    // Lumière directionnelle : simule une source de lumière directionnelle comme le soleil
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)  // Couleur blanche, intensité 1
    directionalLight.position.set(1, 1, 1).normalize()  // Position de la lumière
    scene.add(directionalLight)

    // Ajout d'une grille de repère pour mieux visualiser l'espace 3D
    // Paramètres : taille de la grille (10x10), nombre de divisions (10x10)
    // const gridHelper = new THREE.GridHelper(10, 10)
    // scene.add(gridHelper)

    // Création d'une sphère
    // Paramètres : rayon, segments horizontaux, segments verticaux
    // Plus il y a de segments, plus la sphère est lisse (mais plus gourmande en ressources)
    const geometry = new THREE.SphereGeometry(1, 32, 32)
    
    // Définition du matériau de la sphère
    const material = new THREE.MeshStandardMaterial({
      color: 0x2194ce,  // Couleur bleue
      metalness: 0.3,   // Niveau de métal (0 à 1)
      roughness: 0.4    // Rugosité de la surface (0 à 1)
    })
    
    // Création du maillage en combinant la géométrie et le matériau
    const sphere = new THREE.Mesh(geometry, material)
    // Ajout de la sphère à la scène
    scene.add(sphere)

    // Gestion du redimensionnement
    window.addEventListener('resize', handleResize)

    // Boucle d'animation
    const animate = () => {
      // On demande la prochaine frame d'animation
      animationFrameId = requestAnimationFrame(animate)
      
      // Mise à jour des contrôles (nécessaire pour l'inertie)
      controls.update()
      
      // Rendu de la scène avec la caméra
      renderer.render(scene, camera)
    }
    // Lancement de l'animation
    animate()

  } catch (err) {
    console.error('Erreur lors de l\'initialisation de Three.js:', err)
    error.value = err instanceof Error ? err.message : 'Erreur inconnue'
  }
}

// Cycle de vie du composant
onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  if (renderer) {
    renderer.dispose()
  }
  window.removeEventListener('resize', handleResize)
})
</script>