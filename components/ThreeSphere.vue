<template>
  <div class="relative" :style="{ width: width, height: height }">
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
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const props = defineProps({
  model: {
    type: String,
    default: 'DSCOVR-Triana', // Modèle par défaut
  },
  cameraPosition: {
    type: Number,
    default: 3,
  },
  width: {
    type: String,
    default: '500px',
  },
  height: {
    type: String,
    default: '500px',
  },
})

const container = ref<HTMLElement | null>(null)
const error = ref<string | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let animationFrameId: number
let planet: THREE.Object3D | null = null

// Variables pour la rotation de la planète
let isDragging = false
let previousMousePosition = { x: 0, y: 0 }
let onMouseDown: (event: MouseEvent) => void
let onMouseMove: (event: MouseEvent) => void
let onMouseUp: () => void


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
    
    // camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera = new THREE.PerspectiveCamera(
      45, // Réduire légèrement le FOV pour éviter la distorsion
      container.value.clientWidth / container.value.clientHeight,
      0.1,
      1000
    )
    // On recule la caméra pour voir la scène
    camera.position.z = props.cameraPosition
    // On ajoute la caméra à la scène afin de pouvoir lui attacher la lumière
    scene.add(camera)

    // Initialisation du moteur de rendu WebGL
    renderer = new THREE.WebGLRenderer({ 
      antialias: true,  // Active l'antialiasing pour des bords plus lisses
      alpha: true       // Permet un fond transparent
    })
    // On définit la taille du rendu
    renderer.setSize(width, height)
    // On ajoute le canvas du rendu dans le DOM
    container.value.appendChild(renderer.domElement)

    // Configuration des contrôles de la caméra
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true  // Ajoute de l'inertie aux mouvements
    controls.enableZoom = false
    controls.enablePan = false
    
    // Désactiver la rotation de la caméra
    controls.enableRotate = false
    
    // Variables pour la rotation de la planète
    let isDragging = false
    let previousMousePosition = { x: 0, y: 0 }
    
    // Gestion des événements de souris
    const onMouseDown = (event: MouseEvent) => {
      isDragging = true
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      }
    }
    
    const onMouseMove = (event: MouseEvent) => {
      if (!isDragging || !planet) return
      
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      }
      
      // Ajuster la rotation de la planète en fonction du mouvement de la souris
      planet.rotation.y += deltaMove.x * 0.01
      planet.rotation.x += deltaMove.y * 0.01
      
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      }
    }
    
    const onMouseUp = () => {
      isDragging = false
    }

    // Ajout des écouteurs d'événements
    container.value.addEventListener('mousedown', onMouseDown)
    container.value.addEventListener('mousemove', onMouseMove)
    container.value.addEventListener('mouseup', onMouseUp)
    container.value.addEventListener('mouseleave', onMouseUp)


    // Ajout des lumières à la scène
    // Lumière ambiante : éclaire uniformément tous les objets avec une teinte
    // légèrement chaude pour renforcer l'ambiance martienne
    const ambientLight = new THREE.AmbientLight(0x553322, 5)
    scene.add(ambientLight)
    
    // Lumière directionnelle simulant le soleil. Elle est attachée à la caméra
    // pour rester fixe par rapport à la vue de l'utilisateur.
    const directionalLight = new THREE.DirectionalLight(0xffd2a1, 5)
    // Position relative à la caméra : principalement sur la droite
    directionalLight.position.set(2, 1, 0.5).normalize()
    // On attache la lumière à la caméra pour qu'elle suive ses mouvements
    scene.add(directionalLight)

    // Ajout d'une grille de repère pour mieux visualiser l'espace 3D
    // Paramètres : taille de la grille (10x10), nombre de divisions (10x10)
    const gridHelper = new THREE.GridHelper(10, 10)
        // scene.add(gridHelper)
    
    // Chargement du modèle GLB de la planète
    const loader = new GLTFLoader()
    loader.load(
    `/models/${props.model}.glb`,
    (gltf) => {
      planet = gltf.scene
      planet.rotation.x = Math.PI / 2
      scene.add(planet)
    },
    undefined,
    (err) => {
      console.error('Erreur de chargement du modèle :', err)
    }
  ) 
    
    // Gestion du redimensionnement
    window.addEventListener('resize', handleResize)

    // Boucle d'animation
    const animate = () => {
      // On demande la prochaine frame d'animation
      animationFrameId = requestAnimationFrame(animate)
      
      // Mise à jour des contrôles (nécessaire pour l'inertie)
      controls.update()

      // Rotation continue de la planète lorsqu'elle est chargée
      if (planet) {
        planet.rotation.z += 0.005
      }
      
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

// N'oubliez pas de nettoyer les écouteurs d'événements dans onBeforeUnmount
onBeforeUnmount(() => {
  if (container.value) {
    container.value.removeEventListener('mousedown', onMouseDown)
    container.value.removeEventListener('mousemove', onMouseMove)
    container.value.removeEventListener('mouseup', onMouseUp)
    container.value.removeEventListener('mouseleave', onMouseUp)
  }
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  
  if (renderer) {
    renderer.dispose()
  }
  
  if (controls) {
    controls.dispose()
  }
  
  if (planet && scene) {
    scene.remove(planet)
  }
  
  window.removeEventListener('resize', handleResize)
})
</script>