import * as THREE from 'three'
import { shallowRef, type Ref } from 'vue'

export function use3DScene(container: Ref<HTMLElement | undefined>) {
  // Les 3 objets Three.js essentiels (shallowRef pour éviter les proxies Vue)
  const scene = shallowRef<THREE.Scene>()
  const camera = shallowRef<THREE.PerspectiveCamera>()
  const renderer = shallowRef<THREE.WebGLRenderer>()
  
  const initScene = () => {
    if (!container.value) return
    
    // 1. Créer la scène (conteneur de tous les objets 3D)
    scene.value = new THREE.Scene()
    
    // 2. Créer la caméra (point de vue, comme vos yeux)
    camera.value = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.value.position.z = 2 // Position de la caméra (plus grand = plus loin)
    
    // 3. Créer le renderer (dessine sur le canvas HTML)
    renderer.value = new THREE.WebGLRenderer({ alpha: true })
    renderer.value.setClearColor(0x000000, 0) // Fond transparent
    
    // 4. Ajouter les lumières pour voir les objets
    // Lumière ambiante = éclaire tout uniformément
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.value.add(ambientLight)
    
    // Lumière directionnelle = comme le soleil
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    scene.value.add(directionalLight)
    
    // 5. Attacher le canvas au DOM
    container.value.appendChild(renderer.value.domElement)
  }
  
  const render = () => {
    if (!scene.value || !camera.value || !renderer.value) return
    renderer.value.render(scene.value, camera.value)
  }
  
  const resize = (width: number, height: number) => {
    if (!camera.value || !renderer.value) return
    
    camera.value.aspect = width / height
    camera.value.updateProjectionMatrix()
    renderer.value.setSize(width, height)
  }
  
  const cleanup = () => {
    if (renderer.value) {
      renderer.value.dispose()
    }
  }
  
  return {
    scene,
    camera, 
    renderer,
    initScene,
    render,
    resize,
    cleanup
  }
}