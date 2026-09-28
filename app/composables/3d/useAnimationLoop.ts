import { ref } from 'vue'

type AnimationCallback = (deltaTime: number) => void

interface AnimationSubscription {
  id: string
  callback: AnimationCallback
}

export function useAnimationLoop() {
  const isRunning = ref(false)
  const subscriptions = ref<AnimationSubscription[]>([])
  
  let animationFrameId: number | null = null
  let lastTime = 0

  const animate = (currentTime: number) => {
    // Calculer le temps écoulé depuis la dernière frame
    const deltaTime = currentTime - lastTime
    lastTime = currentTime

    // Exécuter toutes les animations abonnées
    subscriptions.value.forEach(sub => {
      try {
        sub.callback(deltaTime * 0.001) // Convertir en secondes
      } catch (error) {
        console.error(`Erreur dans l'animation ${sub.id}:`, error)
      }
    })

    // Continuer la boucle si elle est active
    if (isRunning.value) {
      animationFrameId = requestAnimationFrame(animate)
    }
  }

  const start = () => {
    if (isRunning.value) return
    
    isRunning.value = true
    lastTime = 0
    animationFrameId = requestAnimationFrame(animate)
  }

  const stop = () => {
    isRunning.value = false
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  }

  const subscribe = (id: string, callback: AnimationCallback) => {
    // Vérifier si l'ID existe déjà, le remplacer si c'est le cas
    const existingIndex = subscriptions.value.findIndex(sub => sub.id === id)
    
    if (existingIndex !== -1) {
      subscriptions.value[existingIndex] = { id, callback }
    } else {
      subscriptions.value.push({ id, callback })
    }

    // Démarrer la boucle automatiquement
    if (!isRunning.value) {
      start()
    }
  }

  const unsubscribe = (id: string) => {
    const index = subscriptions.value.findIndex(sub => sub.id === id)
    if (index !== -1) {
      subscriptions.value.splice(index, 1)
    }

    // Arrêter la boucle si plus d'abonnements
    if (subscriptions.value.length === 0) {
      stop()
    }
  }

  const clear = () => {
    stop()
    subscriptions.value = []
  }

  return {
    isRunning,
    start,
    stop,
    subscribe,
    unsubscribe,
    clear
  }
}