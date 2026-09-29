// Panneau de réglage du voyage (EXE-72) : chargé seulement avec `?tune` dans
// l'adresse. L'import dynamique garde tweakpane hors du chargement normal.
export default defineNuxtPlugin(() => {
  if (!new URLSearchParams(window.location.search).has('tune')) return
  void import('~/tune/journeyPane').then(({ mountJourneyPane }) => mountJourneyPane())
})
