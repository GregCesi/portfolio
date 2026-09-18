import { ref } from 'vue'

/**
 * Reflète `prefers-reduced-motion: reduce`. Calculé de façon synchrone pendant
 * `setup()` (pas dans `onMounted`) pour être disponible avant que les composants
 * enfants (planète 3D, transitions GSAP) ne lisent sa valeur initiale.
 */
export function usePrefersReducedMotion() {
  const prefersReducedMotion = ref(false)

  if (import.meta.client && typeof window !== 'undefined' && window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = mediaQuery.matches
    mediaQuery.addEventListener('change', (event) => {
      prefersReducedMotion.value = event.matches
    })
  }

  return prefersReducedMotion
}
