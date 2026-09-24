import { useState } from '#app'

/**
 * État du sas d'entrée, partagé entre le sas (qui l'ouvre), la page (qui
 * verrouille la navigation tant qu'il est fermé et fait arriver Start une fois
 * ouvert) et le layout.
 */
export function useEntryGate() {
  const opened = useState<boolean>('entry-gate-opened', () => false)

  function markOpened() {
    opened.value = true
  }

  return { opened, markOpened }
}
