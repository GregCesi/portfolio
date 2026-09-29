import { Pane } from 'tweakpane'
import { ARRIVAL_EASES, journey, type JourneySettings } from '~/composables/useJourney'

// Les types de tweakpane 4 déclarent ses méthodes dans `@tweakpane/core`,
// paquet absent du dépôt (son code est déjà inclus dans tweakpane). Seules les
// deux méthodes utilisées ici sont décrites.
interface TunePane {
  addBinding(
    target: JourneySettings,
    key: keyof JourneySettings,
    params: { label: string; min?: number; max?: number; step?: number; options?: Record<string, string> },
  ): unknown
  addButton(params: { title: string }): { on(event: 'click', handler: () => void): unknown }
}

/**
 * Panneau de réglage du voyage (EXE-72), affiché seulement avec `?tune` dans
 * l'adresse (voir plugins/tune.client.ts, seul point d'entrée de ce module).
 * Chaque réglage modifie directement `journey` : le changement de section
 * suivant le prend en compte, sans rechargement. « Copier les valeurs » met
 * dans le presse-papier le JSON de tous les réglages, prêt à devenir les
 * valeurs par défaut (`JOURNEY_DEFAULTS`).
 */
export function mountJourneyPane() {
  const container = document.createElement('div')
  container.className = 'journey-pane'
  Object.assign(container.style, {
    position: 'fixed',
    top: '5.5rem',
    right: '1rem',
    zIndex: '1000',
    width: '20rem',
  })
  // Une touche ou une molette dans le panneau reste au panneau : sans ça, les
  // flèches d'un champ ou le défilement du panneau changeraient aussi de
  // section (SlideContainer écoute la fenêtre). Hors du panneau, la navigation
  // au clavier et à la molette est inchangée.
  container.addEventListener('keydown', (event) => event.stopPropagation())
  container.addEventListener('wheel', (event) => event.stopPropagation())
  document.body.appendChild(container)

  const pane = new Pane({ container, title: 'Voyage' }) as unknown as TunePane
  const seconds = { min: 0, max: 3, step: 0.05 }

  pane.addBinding(journey, 'departDuration', { label: 'Durée du départ (s)', ...seconds, min: 0.05 })
  pane.addBinding(journey, 'travelDuration', { label: 'Durée du trajet (s)', ...seconds })
  pane.addBinding(journey, 'arrivalDelay', { label: 'Délai avant l’arrivée (s)', ...seconds })
  pane.addBinding(journey, 'arrivalDuration', { label: 'Durée de l’arrivée (s)', ...seconds, min: 0.05 })
  pane.addBinding(journey, 'arrivalStartScale', {
    label: 'Taille de départ du bloc',
    min: 0.01,
    max: 1,
    step: 0.01,
  })
  pane.addBinding(journey, 'arrivalEase', {
    label: 'Courbe de l’arrivée',
    options: Object.fromEntries(ARRIVAL_EASES.map((ease) => [ease, ease])),
  })
  pane.addBinding(journey, 'starsCruiseSpeed', { label: 'Croisière des étoiles', min: 1, max: 20, step: 0.5 })
  pane.addBinding(journey, 'starsReboundSpeed', { label: 'Amplitude du recul', min: 0, max: 10, step: 0.25 })
  pane.addBinding(journey, 'starsReboundDuration', { label: 'Durée du recul (s)', ...seconds })

  pane.addButton({ title: 'Copier les valeurs' }).on('click', () => {
    void navigator.clipboard.writeText(JSON.stringify({ ...journey }, null, 2))
  })
}
