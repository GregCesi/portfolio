import { computed, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { useNuxtApp } from '#app'

/**
 * État de pagination local à une section pour ses sous-écrans mobile
 * (§2.3 de la spec). L'index est maintenu quelle que soit la largeur de
 * fenêtre : c'est la CSS qui décide de l'exploiter (mobile, < 768px) ou de
 * l'ignorer en montrant tout le contenu d'un coup (desktop).
 *
 * Avec `sectionIndex` (0-based), la section repart de son premier plan une fois
 * quittée : on y revient comme au début d'un film. Le délai laisse la section
 * sortir de l'écran avant le retour au premier plan ; une nouvelle arrivée
 * l'annule (le bouton « Me contacter » vise un plan précis à l'arrivée).
 */
export function useMobileSubscreens(count: Ref<number> | number, sectionIndex?: number) {
  const total = computed(() => (typeof count === 'number' ? count : count.value))
  const index = ref(0)

  const canPrev = computed(() => index.value > 0)
  const canNext = computed(() => index.value < total.value - 1)

  function next() {
    if (canNext.value) index.value += 1
  }

  function prev() {
    if (canPrev.value) index.value -= 1
  }

  function goTo(target: number) {
    if (target >= 0 && target < total.value) index.value = target
  }

  if (sectionIndex !== undefined) {
    const { $emitter } = useNuxtApp()
    let timer: ReturnType<typeof setTimeout> | null = null
    const onEnter = (entered: number) => {
      if (timer) clearTimeout(timer)
      timer = null
      if (entered !== sectionIndex) timer = setTimeout(() => goTo(0), 1300)
    }
    onMounted(() => $emitter.on('section-enter', onEnter))
    onBeforeUnmount(() => {
      $emitter.off('section-enter', onEnter)
      if (timer) clearTimeout(timer)
    })
  }

  return { index, total, canPrev, canNext, next, prev, goTo }
}
