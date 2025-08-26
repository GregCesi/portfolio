import * as THREE from 'three'
import { ref, type Ref } from 'vue'

export function useInteractiveControls(container: Ref<HTMLElement | undefined>) {
  const isDragging = ref(false)
  const previousMousePosition = ref({ x: 0, y: 0 })
  
  // Objet actuellement contrôlé
  let controlledObject: THREE.Object3D | null = null

  const onMouseDown = (event: MouseEvent) => {
    if (!controlledObject) return
    
    isDragging.value = true
    previousMousePosition.value = {
      x: event.clientX,
      y: event.clientY
    }
  }

  const onMouseMove = (event: MouseEvent) => {
    if (!isDragging.value || !controlledObject) return
    
    // Calculer le mouvement de la souris
    const deltaMove = {
      x: event.clientX - previousMousePosition.value.x,
      y: event.clientY - previousMousePosition.value.y
    }
    
    // Appliquer la rotation à l'objet
    // Mouvement horizontal = rotation Y, mouvement vertical = rotation X
    controlledObject.rotation.y += deltaMove.x * 0.01
    controlledObject.rotation.x += deltaMove.y * 0.01
    
    // Sauvegarder la nouvelle position
    previousMousePosition.value = {
      x: event.clientX,
      y: event.clientY
    }
  }

  const onMouseUp = () => {
    isDragging.value = false
  }

  const onMouseLeave = () => {
    isDragging.value = false
  }

  const setupControls = (targetObject: THREE.Object3D) => {
    if (!container.value) return
    
    // Définir l'objet à contrôler
    controlledObject = targetObject
    
    // Ajouter les événements souris au conteneur
    container.value.addEventListener('mousedown', onMouseDown)
    container.value.addEventListener('mousemove', onMouseMove)
    container.value.addEventListener('mouseup', onMouseUp)
    container.value.addEventListener('mouseleave', onMouseLeave)
  }

  const removeControls = () => {
    if (!container.value) return
    
    // Retirer tous les événements
    container.value.removeEventListener('mousedown', onMouseDown)
    container.value.removeEventListener('mousemove', onMouseMove)
    container.value.removeEventListener('mouseup', onMouseUp)
    container.value.removeEventListener('mouseleave', onMouseLeave)
    
    controlledObject = null
  }

  return {
    isDragging,
    setupControls,
    removeControls
  }
}