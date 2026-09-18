import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { useNuxtApp } from '#app'
import gsap from 'gsap'
import { usePrefersReducedMotion } from '~/composables/usePrefersReducedMotion'

/**
 * Révélation lente d'une section, façon générique de film (§2.3 bis de la
 * spec) : fondu depuis le noir de 0,8 à 1,6 s, titres qui se révèlent en
 * resserrant leur interlettrage, lignes de texte en cascade. Aucun rebond.
 *
 * Rejoue à chaque arrivée sur la section (événement `section-enter` émis
 * par `pages/index.vue`) ; la section 0 se joue au montage. Sous
 * `prefers-reduced-motion`, tout apparaît directement, sans animation.
 *
 * - `titles` : sélecteur des titres (interlettrage qui se resserre).
 * - `lines`  : sélecteur des blocs de texte (fondu en cascade).
 * - `extra`  : tweens propres à la section (frise, planète...), ajoutés à la
 *              même timeline ; reçoit `null` en mouvement réduit (état final
 *              direct). `hideExtra` remet ces éléments dans l'état masqué.
 */
export interface SectionRevealOptions {
  index: number
  titles?: string
  lines?: string
  extra?: (tl: gsap.core.Timeline | null) => void
  hideExtra?: () => void
}

const TITLE_DURATION = 1.6
const LINE_DURATION = 1.2
const LINE_STAGGER = 0.24
const ENTER_DELAY = 0.55

export function useSplitReveal(rootRef: Ref<HTMLElement | null>, options: SectionRevealOptions) {
  const { $emitter } = useNuxtApp()
  const prefersReducedMotion = usePrefersReducedMotion()
  let timeline: gsap.core.Timeline | null = null

  function query(selector?: string): HTMLElement[] {
    if (!selector || !rootRef.value) return []
    return Array.from(rootRef.value.querySelectorAll<HTMLElement>(selector))
  }

  function showAll() {
    const targets = [...query(options.titles), ...query(options.lines)]
    gsap.set(targets, { opacity: 1, y: 0, clearProps: 'letterSpacing,height' })
    gsap.set(targets, { opacity: 1 })
    options.extra?.(null)
  }

  function hide() {
    timeline?.kill()
    timeline = null
    gsap.set([...query(options.titles), ...query(options.lines)], { opacity: 0 })
    options.hideExtra?.()
  }

  function play(delay = ENTER_DELAY) {
    if (!rootRef.value) return
    timeline?.kill()

    if (prefersReducedMotion.value) {
      showAll()
      return
    }

    const titles = query(options.titles)
    const lines = query(options.lines)
    const tl = gsap.timeline({ delay })
    timeline = tl

    titles.forEach((el) => {
      // Mesure de l'interlettrage final et de la hauteur finale, puis départ
      // plus large : la hauteur est figée pendant l'animation pour que le
      // retour à la ligne, qui varie avec l'interlettrage, ne décale rien.
      gsap.set(el, { clearProps: 'letterSpacing,height' })
      const style = getComputedStyle(el)
      const finalSpacing = parseFloat(style.letterSpacing) || 0
      const fontSize = parseFloat(style.fontSize) || 16
      const height = el.getBoundingClientRect().height
      gsap.set(el, { height, opacity: 0, letterSpacing: finalSpacing + fontSize * 0.24 })
      tl.to(
        el,
        {
          opacity: 1,
          letterSpacing: finalSpacing,
          duration: TITLE_DURATION,
          ease: 'power2.out',
          onComplete: () => {
            gsap.set(el, { clearProps: 'letterSpacing,height' })
            gsap.set(el, { opacity: 1 })
          },
        },
        0,
      )
    })

    if (lines.length > 0) {
      tl.fromTo(
        lines,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: LINE_DURATION,
          ease: 'power2.out',
          stagger: LINE_STAGGER,
          clearProps: 'transform',
        },
        titles.length > 0 ? 0.55 : 0,
      )
    }

    options.extra?.(tl)
  }

  function onEnter(index: number) {
    if (index !== options.index) return
    hide()
    play()
  }

  onMounted(() => {
    $emitter.on('section-enter', onEnter)
    if (options.index === 0) {
      const start = () => play(0.5)
      if (typeof document !== 'undefined' && document.fonts?.ready) {
        void document.fonts.ready.then(start)
      } else {
        start()
      }
    } else if (prefersReducedMotion.value) {
      showAll()
    } else {
      hide()
    }
  })

  onBeforeUnmount(() => {
    $emitter.off('section-enter', onEnter)
    timeline?.kill()
  })

  return { play, hide }
}
