import { reactive } from 'vue'

/**
 * Réglages du voyage entre deux sections (EXE-72) : le changement de section
 * en profondeur (useDepthTransition) et le fond étoilé (BackgroundHyperspace)
 * lisent ces valeurs à chaque changement de section. Le panneau `?tune` les
 * modifie en direct et « Copier les valeurs » les exporte telles quelles.
 *
 * `JOURNEY_DEFAULTS` et `CUBE_DEFAULTS` (cube de Projets, plus bas) sont le
 * seul endroit où les valeurs par défaut du site sont écrites.
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

/**
 * Réglages du cube de Projets (EXE-73), écrits ici avec ceux du voyage : même
 * panneau `?tune`, même « Copier les valeurs ». ProjectsSection les lit à
 * chaque rotation ; perspective et dimensions s'appliquent en direct.
 */
export interface CubeSettings {
  /** Perspective de la scène (px) : plus petite, plus la rotation est marquée. */
  perspective: number
  /** Durée de la rotation d'une face (s). */
  rotationDuration: number
  /** Délai (s) sans molette avant que le cube se cale sur une face. */
  settleDelay: number
  /** Part d'une face à dépasser (molette ou glisser) pour se caler sur la suivante. */
  snapThreshold: number
  /** Largeur d'une face, en part de la largeur disponible. */
  widthRatio: number
  /** Hauteur d'une face, en part de la hauteur disponible. */
  heightRatio: number
}

export const CUBE_DEFAULTS: Readonly<CubeSettings> = Object.freeze({
  perspective: 1800,
  rotationDuration: 0.7,
  settleDelay: 0.25,
  snapThreshold: 0.2,
  widthRatio: 0.62,
  heightRatio: 0.86,
})

export const cube = reactive<CubeSettings>({ ...CUBE_DEFAULTS })

/** Instant (s, depuis le geste) où commence l'arrivée. */
export function arrivalStart(settings: JourneySettings = journey): number {
  return settings.departDuration + settings.travelDuration + settings.arrivalDelay
}

/** Durée totale du voyage (s) : l'instant où le texte arrivé est posé et les étoiles au repos. */
export function journeyDuration(settings: JourneySettings = journey): number {
  return arrivalStart(settings) + settings.arrivalDuration
}
