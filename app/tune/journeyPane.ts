import { Pane } from 'tweakpane'
import { ARRIVAL_EASES, cube, journey } from '~/composables/useJourney'

// Les types de tweakpane 4 déclarent ses méthodes dans `@tweakpane/core`,
// paquet absent du dépôt (son code est déjà inclus dans tweakpane). Seules les
// méthodes utilisées ici sont décrites.
interface TuneContainer {
  addBinding<T extends object>(
    target: T,
    key: keyof T & string,
    params: { label: string; min?: number; max?: number; step?: number; options?: Record<string, string> },
  ): unknown
  addButton(params: { title: string }): { on(event: 'click', handler: () => void): unknown }
  addFolder(params: { title: string }): TuneContainer
}

/**
 * Panneau de réglage du voyage (EXE-72) et du cube de Projets (EXE-73),
 * affiché seulement avec `?tune` dans l'adresse (voir plugins/tune.client.ts,
 * seul point d'entrée de ce module). Chaque réglage modifie directement
 * `journey` ou `cube` : le changement de section ou la rotation suivante le
 * prend en compte, sans rechargement. « Copier les valeurs » met dans le
 * presse-papier le JSON de tous les réglages, prêt à devenir les valeurs par
 * défaut (`JOURNEY_DEFAULTS`, `CUBE_DEFAULTS`).
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

  const pane = new Pane({ container, title: 'Voyage' }) as unknown as TuneContainer
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

  const projects = pane.addFolder({ title: 'Projets' })
  projects.addBinding(cube, 'perspective', { label: 'Perspective (px)', min: 400, max: 4000, step: 50 })
  projects.addBinding(cube, 'rotationDuration', { label: 'Durée de rotation (s)', ...seconds, min: 0.05 })
  projects.addBinding(cube, 'settleDelay', { label: 'Délai avant calage (s)', min: 0.05, max: 1.5, step: 0.05 })
  projects.addBinding(cube, 'snapThreshold', { label: 'Seuil de calage', min: 0.05, max: 0.5, step: 0.01 })
  projects.addBinding(cube, 'widthRatio', { label: 'Largeur d’une face', min: 0.3, max: 1, step: 0.01 })
  projects.addBinding(cube, 'heightRatio', { label: 'Hauteur d’une face', min: 0.3, max: 1, step: 0.01 })

  pane.addButton({ title: 'Copier les valeurs' }).on('click', () => {
    void navigator.clipboard.writeText(JSON.stringify({ journey: { ...journey }, cube: { ...cube } }, null, 2))
  })
}
