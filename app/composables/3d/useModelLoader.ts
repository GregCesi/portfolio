import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { ref, shallowRef, type Ref } from 'vue'

export function useModelLoader(scene: Ref<THREE.Scene | undefined>) {
  // États réactifs
  const loading = ref(false)
  const error = ref<string | null>(null)
  const progress = ref(0)
  
  // Cache des modèles chargés (pour éviter de recharger le même)
  const loadedModels = shallowRef(new Map<string, THREE.Object3D>())
  
  // Instance du loader GLTF
  const loader = new GLTFLoader()
  
  const loadModel = async (path: string): Promise<THREE.Object3D | null> => {
    if (!scene.value) {
      error.value = 'Scene not initialized'
      return null
    }
    
    // Reset des états
    loading.value = true
    error.value = null
    progress.value = 0
    
    try {
      // Charger le modèle avec GLTFLoader
      const gltf = await new Promise<GLTF>((resolve, reject) => {
        loader.load(
          path,
          resolve, // Succès
          (progressEvent) => {
            // Progression du chargement
            if (progressEvent.lengthComputable) {
              progress.value = (progressEvent.loaded / progressEvent.total) * 100
            }
          },
          reject // Erreur
        )
      })
      
      // Récupérer le modèle 3D depuis le GLTF
      const model = gltf.scene
      
      // L'ajouter à la scène
      scene.value.add(model)
      
      // Sauvegarder dans le cache
      loadedModels.value.set(path, model)
      
      // Reset des états de chargement
      loading.value = false
      progress.value = 100
      
      return model
      
    } catch (err) {
      // Gestion d'erreur
      loading.value = false
      error.value = `Erreur lors du chargement du modèle: ${err}`
      console.error('Erreur chargement modèle:', err)
      return null
    }
  }
  
  const removeModel = (model: THREE.Object3D) => {
    if (!scene.value) return
    
    scene.value.remove(model)
    
    // Nettoyer la mémoire
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        if (Array.isArray(child.material)) {
          child.material.forEach(material => material.dispose())
        } else {
          child.material.dispose()
        }
      }
    })
  }
  
  return {
    loading,
    error,
    progress,
    loadedModels,
    loadModel,
    removeModel
  }
}