import { useState } from '#app'

/**
 * Tout ce dont le site a besoin avant d'ouvrir le sas d'entrée : les polices,
 * la planète (modèle puis textures) et le modèle de satellite déjà présent
 * dans `public/3d/models/`. Chaque tâche est un voyant du sas.
 *
 * Les polices et le satellite sont demandés par `preloadSiteAssets`. La
 * planète est chargée par son propre composant, qui signale ses deux étapes
 * avec `markLoaded` : le voyant s'allume quand elle est réellement prête.
 */
export const LOAD_TASKS = [
  'font-display',
  'font-sans',
  'planet-model',
  'planet-textures',
  'satellite-model',
] as const

export type LoadTask = (typeof LOAD_TASKS)[number]

const SATELLITE_MODEL = '/3d/models/DSCOVR-Triana.glb'

export function useSiteLoad() {
  const loaded = useState<LoadTask[]>('site-load', () => [])

  function markLoaded(task: LoadTask) {
    if (!loaded.value.includes(task)) loaded.value = [...loaded.value, task]
  }

  function loadFonts(task: LoadTask, specs: string[]) {
    if (!document.fonts) {
      markLoaded(task)
      return
    }
    Promise.all(specs.map((spec) => document.fonts.load(spec)))
      .then(() => markLoaded(task))
      .catch((error) => console.error('Erreur chargement police :', error))
  }

  // Le modèle n'est lu par aucun composant : on le télécharge en entier pour
  // qu'il soit dans le cache du navigateur quand il servira.
  function loadSatellite() {
    fetch(SATELLITE_MODEL)
      .then((response) => {
        if (!response.ok) throw new Error(`${response.status} ${SATELLITE_MODEL}`)
        return response.arrayBuffer()
      })
      .then(() => markLoaded('satellite-model'))
      .catch((error) => console.error('Erreur chargement modèle :', error))
  }

  function preloadSiteAssets() {
    loadFonts('font-display', ['300 1em Jost', '400 1em Jost'])
    loadFonts('font-sans', ['400 1em "Hanken Grotesk"'])
    loadSatellite()
  }

  return { loaded, markLoaded, preloadSiteAssets }
}
