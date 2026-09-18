import { computed, ref, type Ref } from 'vue'

/**
 * État de pagination local à une section pour ses sous-écrans mobile
 * (§2.3 de la spec). L'index est maintenu quelle que soit la largeur de
 * fenêtre : c'est la CSS qui décide de l'exploiter (mobile, < 768px) ou de
 * l'ignorer en montrant tout le contenu d'un coup (desktop).
 */
export function useMobileSubscreens(count: Ref<number> | number) {
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

  return { index, total, canPrev, canNext, next, prev, goTo }
}
