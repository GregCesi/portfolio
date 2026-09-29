import { reactive } from 'vue'

/**
 * Réglages du voyage entre deux sections (EXE-72) : le changement de section
 * en profondeur (useDepthTransition) et le fond étoilé (BackgroundHyperspace)
 * lisent ces valeurs à chaque changement de section. Le panneau `?tune` les
 * modifie en direct et « Copier les valeurs » les exporte telles quelles.
 *
 * `JOURNEY_DEFAULTS` est le seul endroit où les valeurs par défaut du site
 * sont écrites.
 */
export const ARRIVAL_EASES = [
  'none',
  'sine.out',
  'power1.out',
  'power2.out',
  'power3.out',
  'sine.inOut',
  'power1.inOut',
  'power2.inOut',
] as const

export type ArrivalEase = (typeof ARRIVAL_EASES)[number]

export interface JourneySettings {
  /** Durée du départ (s) : la section quittée part vers le visiteur et s'efface. */
  departDuration: number
  /** Durée du trajet (s) : aucun texte à l'écran, les étoiles filent. */
  travelDuration: number
  /** Délai (s) entre la fin du trajet et le début de l'arrivée. */
  arrivalDelay: number
  /** Durée de l'arrivée (s) : la section vient du fond jusqu'à sa taille normale. */
  arrivalDuration: number
  /** Taille de départ du bloc qui arrive, en fraction de sa taille finale. */
  arrivalStartScale: number
  /** Courbe GSAP appliquée à la distance du bloc qui arrive (sa taille vaut 1 / distance). */
  arrivalEase: ArrivalEase
  /** Vitesse de croisière des étoiles pendant le trajet (repos : 1). */
  starsCruiseSpeed: number
  /** Amplitude du recul des étoiles : vitesse atteinte à rebours avant le repos. */
  starsReboundSpeed: number
  /** Durée du recul des étoiles (s), prise sur la fin de l'arrivée. */
  starsReboundDuration: number
}

export const JOURNEY_DEFAULTS: Readonly<JourneySettings> = Object.freeze({
  departDuration: 0.4,
  travelDuration: 0.5,
  arrivalDelay: 0,
  arrivalDuration: 0.7,
  arrivalStartScale: 0.08,
  arrivalEase: 'sine.out',
  starsCruiseSpeed: 4,
  starsReboundSpeed: 1,
  starsReboundDuration: 0.2,
})

export const journey = reactive<JourneySettings>({ ...JOURNEY_DEFAULTS })

/** Instant (s, depuis le geste) où commence l'arrivée. */
export function arrivalStart(settings: JourneySettings = journey): number {
  return settings.departDuration + settings.travelDuration + settings.arrivalDelay
}

/** Durée totale du voyage (s) : l'instant où le texte arrivé est posé et les étoiles au repos. */
export function journeyDuration(settings: JourneySettings = journey): number {
  return arrivalStart(settings) + settings.arrivalDuration
}
