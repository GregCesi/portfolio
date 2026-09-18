import type * as THREE from 'three'
import { ref } from 'vue'
import { gsap } from 'gsap'

export function useCrossfadeTexture() {
  const isTransitioning = ref(false)

  const crossfadeToTexture = (
    mesh: THREE.Mesh,
    fromTexture: THREE.Texture,
    toTexture: THREE.Texture,
    duration: number = 2.0,
  ): Promise<void> => {
    return new Promise((resolve) => {
      if (isTransitioning.value) {
        console.warn('Transition déjà en cours, ignorée')
        resolve()
        return
      }

      isTransitioning.value = true

      const originalMaterial = mesh.material as THREE.MeshStandardMaterial

      // 1. Créer le deuxième mesh avec toTexture
      const mesh2 = mesh.clone()
      const material2 = originalMaterial.clone()
      material2.map = toTexture
      material2.transparent = true
      material2.opacity = 0 // Invisible au début
      mesh2.material = material2

      // Ajouter mesh2 au même parent
      mesh.parent?.add(mesh2)

      // 2. Modifier le mesh original avec fromTexture
      const material1 = originalMaterial.clone()
      material1.map = fromTexture
      material1.transparent = true
      material1.opacity = 1 // Visible au début
      mesh.material = material1

      // 3. Animation crossfade
      const progress = { value: 0 }

      gsap.to(progress, {
        value: 1,
        duration,
        ease: 'power2.inOut',
        onUpdate: () => {
          // Opacités complémentaires pour éviter la transparence
          material1.opacity = 1 - progress.value // De 1 à 0
          material2.opacity = progress.value // De 0 à 1
        },
        onComplete: () => {
          // 4. Remplacer le matériau original par le nouveau (sans transparence)
          const finalMaterial = originalMaterial.clone()
          finalMaterial.map = toTexture
          finalMaterial.transparent = false
          finalMaterial.opacity = 1
          mesh.material = finalMaterial

          // 5. Nettoyer le mesh temporaire
          mesh.parent?.remove(mesh2)
          material1.dispose()
          material2.dispose()

          isTransitioning.value = false
          resolve()
        },
      })
    })
  }

  return {
    isTransitioning,
    crossfadeToTexture,
  }
}
