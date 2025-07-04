<template>
  <div class="relative" :style="{ width: width, height: height }">
    <div ref="container" class="w-full h-full" />
    <div v-if="error" class="absolute inset-0 flex items-center justify-center text-red-500">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const props = defineProps({
  model: {
    type: String,
    default: 'Planet-1', // Modèle par défaut
  },
  satelliteModel: {
    type: String,
    default: 'DSCOVR-Triana',
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
let orbitGroup: THREE.Group | null = null
let satellite: THREE.Object3D | null = null

// Variables pour la rotation de la planète
let isDragging = false
let previousMousePosition = { x: 0, y: 0 }
let onMouseDown: (event: MouseEvent) => void
let onMouseMove: (event: MouseEvent) => void
let onMouseUp: () => void

const currentModel = ref(props.model)

// Fonction pour charger un nouveau modèle
async function loadModel(modelName: string) {
  if (!scene) return
  
  // Supprimer l'ancien modèle s'il existe
  if (planet) {
    scene.remove(planet)
    // Nettoyer les ressources de l'ancien modèle
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        if (Array.isArray(child.material)) {
          child.material.forEach(material => material.dispose())
        } else {
          child.material.dispose()
        }
      }
    })
    planet = null
  }

  try {
    const loader = new GLTFLoader()
    const gltf = await loader.loadAsync(`/models/${modelName}.glb`)
    
    // Configurer le nouveau modèle
    planet = gltf.scene
    planet.scale.set(1, 1, 1)
    scene.add(planet)
    
    // Réinitialiser la caméra
    camera.position.z = props.cameraPosition
    
    error.value = null
  } catch (err) {
    console.error('Erreur lors du chargement du modèle:', err)
    error.value = 'Impossible de charger le modèle 3D'
  }
}

// Fonction pour charger le satellite
async function loadSatellite(modelName: string) {
  if (!scene) return

  // Nettoyer l'ancien satellite s'il existe
  if (orbitGroup) {
    scene.remove(orbitGroup)
    orbitGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose())
        } else {
          child.material.dispose()
        }
      }
    })
    orbitGroup = null
    satellite = null
  }

  try {
    const loader = new GLTFLoader()
    const gltf = await loader.loadAsync(`/models/${modelName}.glb`)

    orbitGroup = new THREE.Group()
    scene.add(orbitGroup)

    satellite = gltf.scene
    satellite.scale.set(0.005, 0.005, 0.005)
    satellite.position.set(1.5, 0, 0)
    satellite.rotation.set(0, Math.PI / 2, 0)
    orbitGroup.add(satellite)

    error.value = null
  } catch (err) {
    console.error('Erreur lors du chargement du satellite:', err)
  }
}

// Watch sur la prop model
watch(() => props.model, (newModel) => {
  if (newModel && newModel !== currentModel.value) {
    loadModel(newModel)
    currentModel.value = newModel
  }
})

// Watch sur la prop satelliteModel
watch(() => props.satelliteModel, (newModel) => {
  if (!scene) return
  if (newModel) {
    loadSatellite(newModel)
  } else if (orbitGroup) {
    scene.remove(orbitGroup)
    orbitGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose())
        } else {
          child.material.dispose()
        }
      }
    })
    orbitGroup = null
    satellite = null
  }
})

const handleResize = () => {
  if (!container.value || !camera || !renderer) return
  const width = container.value.clientWidth
  const height = container.value.clientHeight
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

// Fonction d'initialisation
async function init() {
  if (!container.value) return

  // Initialisation de la scène, caméra, etc.
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  
  // Configuration du rendu
  renderer.setSize(container.value.offsetWidth, container.value.offsetHeight)
  container.value.appendChild(renderer.domElement)
  
  // Configuration des lumières
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(1, 1, 1)
  scene.add(directionalLight)
  
  // Configuration des contrôles
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableZoom = false
  controls.enableDamping = true
  controls.enableRotate = false
  
  // Position initiale de la caméra
  camera.position.z = props.cameraPosition
  
  // Charger le modèle initial
  await loadModel(props.model)
  if (props.satelliteModel) {
    await loadSatellite(props.satelliteModel)
  }
  
  // Animation
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)
    
    // Rotation automatique si pas de glisser-déposer en cours
    if (planet && !isDragging) {
      planet.rotation.y += 0.002
    }

    if (orbitGroup) {
      orbitGroup.rotation.y += 0.01
    }
    if (satellite) {
      const t = Date.now() * 0.002
      satellite.position.y = Math.sin(t) * 0.2
    }
    
    controls.update()
    renderer.render(scene, camera)
  }
  
  animate()
  
  // Gestion du redimensionnement
  window.addEventListener('resize', handleResize)

  // Gestion des événements de souris
  onMouseDown = (event: MouseEvent) => {
    isDragging = true
    previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    }
  }
  
  onMouseMove = (event: MouseEvent) => {
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
  
  onMouseUp = () => {
    isDragging = false
  }

  // Ajout des écouteurs d'événements
  container.value.addEventListener('mousedown', onMouseDown)
  container.value.addEventListener('mousemove', onMouseMove)
  container.value.addEventListener('mouseup', onMouseUp)
  container.value.addEventListener('mouseleave', onMouseUp)
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

  if (orbitGroup && scene) {
    scene.remove(orbitGroup)
    orbitGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose())
        } else {
          child.material.dispose()
        }
      }
    })
  }
  
  window.removeEventListener('resize', handleResize)
})
</script>