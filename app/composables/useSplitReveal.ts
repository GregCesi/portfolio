import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import gsap from 'gsap'
import { usePrefersReducedMotion } from '~/composables/usePrefersReducedMotion'

/**
 * Cascade de lignes de texte à l'arrivée sur une section (§2.3 bis de la
 * spec). Anime en rafale chaque élément ciblé par `selector` (titre, puis
 * chaque paragraphe) — une cascade au niveau du bloc plutôt qu'au niveau de
 * la ligne typographique individuelle : GSAP seul suffit, sans dépendre
 * d'un plugin de découpage de texte dont le chargement SSR s'est révélé
 * instable dans ce projet (échec de `npm run generate`, `gsap.registerPlugin
 * is not a function` lors du prérendu). Ne joue qu'une fois, au premier
 * passage en visibilité. Sous `prefers-reduced-motion`, le texte apparaît
 * directement, sans animation.
 */
export function useSplitReveal(rootRef: Ref<HTMLElement | null>, selector: string) {
  const prefersReducedMotion = usePrefersReducedMotion()
  let observer: IntersectionObserver | null = null
  let hasPlayed = false

  function play() {
    if (hasPlayed || !rootRef.value) return
    hasPlayed = true

    const targets = Array.from(rootRef.value.querySelectorAll<HTMLElement>(selector))
    if (targets.length === 0) return

    if (prefersReducedMotion.value) {
      gsap.set(targets, { opacity: 1, y: 0 })
      return
    }

    gsap.set(targets, { opacity: 0, y: '0.6em' })
    gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.08,
    })
  }

  onMounted(() => {
    if (!rootRef.value || typeof IntersectionObserver === 'undefined') {
      play()
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) play()
      },
      { threshold: 0.2 }
    )
    observer.observe(rootRef.value)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
  })
}
