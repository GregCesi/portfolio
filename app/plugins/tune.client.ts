// Panneau de réglage du voyage (EXE-72) : chargé seulement avec `?tune` dans
// l'adresse. L'import dynamique garde tweakpane hors du chargement normal.
// Jamais en mode WIP (EXE-177) : aucun élément du site complet n'y apparaît.
export default defineNuxtPlugin(() => {
  if (useAppConfig().wip) return
  if (!new URLSearchParams(window.location.search).has('tune')) return
  void import('~/tune/journeyPane').then(({ mountJourneyPane }) => mountJourneyPane())
})
