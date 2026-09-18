# Generator State — Run 2, itération 5 (dernière)

## Contexte

Feedback de l'itération 4 (`gan-harness/feedback/feedback-4.md`, commit
`15853e6`, 7.7/10, **sous le seuil réel de 8.0** demandé pour ce run) :
**les 9 portes bloquantes passent toutes** pour la première fois de ce run,
aucune régression détectée. Un seul Major Issue relevé, pré-existant (pas
une régression de l'itération 4) : asymétrie et latence de la navigation
animée du « Projet phare » (`useRoadmapState.ts`).

Consigne explicite pour cette dernière itération : corriger ce défaut
**prudemment**, sans risquer aucune régression sur les 9 portes bloquantes
déjà acquises. Deux points mineurs à traiter *uniquement si sûrs et
rapides*.

## Ce qui a été corrigé cette itération

### 1. Asymétrie et latence de `goToStepAnimated` (`app/composables/useRoadmapState.ts`)

**Avant** : les deux sens de navigation ("next" via bouton `›` /
flèche clavier droite, "prev" via `‹` / flèche gauche) suivaient des
séquences différentes :
- `next` : `fadeOut` (0,3s) → `animateLineGrow` (1,5s, texte invisible
  pendant toute la durée) → **puis seulement** `currentStep.value = newStep`
  → `fadeIn` (0,3s). Le texte redevenait lisible après ~1,9 à 2,1s.
- `prev` : `currentStep.value = newStep` appliqué **avant** le `fadeOut` —
  le nouveau texte remplaçait l'ancien dans le DOM à pleine opacité, avant
  même le début du fondu de sortie, avec un risque de flash de contenu
  visible.

**Après** : les deux sens suivent désormais exactement la même séquence,
dans le même ordre :
1. `fadeOut` du texte (0,3s, identique dans les deux sens).
2. Mise à jour de `currentStep.value` **au même point du cycle** dans les
   deux sens — toujours après le fade-out, jamais avant. Le texte est déjà
   invisible à ce moment, donc aucun flash de contenu n'est possible ni sur
   `next` ni sur `prev`.
3. Mise à jour visuelle des cercles (pulse ajouté/retiré) + démarrage de
   l'animation de ligne (`animateLineGrow`/`animateLineShrink`, toujours
   1,5s, `power2.inOut` — langage visuel GSAP inchangé, comme demandé), mais
   **en arrière-plan**, sans bloquer la suite.
4. `fadeIn` du texte démarré **immédiatement** après la mise à jour du
   modèle, en parallèle de l'animation de ligne et du morphing planète
   (`Promise.all`), au lieu d'attendre la fin de la ligne. La fonction
   attend toujours la fin des trois animations avant de résoudre, pour que
   les appelants (navigation clavier en file d'attente notamment) restent
   synchronisés sur l'état final réel — seule la *perception* utilisateur
   change, pas le contrat de la fonction.

Résultat mesuré (voir méthodologie ci-dessous) : le texte redevient lisible
en **~370-385ms** au lieu de ~1,9-2,1s (facteur ~5), identique dans les
deux sens, sans aucun flash de contenu détecté. L'animation de ligne garde
sa durée et son easing d'origine, elle continue simplement de jouer après
que le texte est redevenu lisible — le fondu de ligne fait toujours partie
du langage visuel voulu par la spec, il n'a pas été raccourci ni supprimé,
seulement découplé de la lisibilité du texte.

Les 3 chemins de navigation (segments compacts mobile, boutons `‹ ›`
desktop, flèches clavier gauche/droite) utilisent tous la même fonction
`goToStepAnimated` (ou `goToStep` direct pour les segments compacts, non
touché) — vérifiés synchronisés après le changement, y compris sous spam
de clics/touches rapides.

### 2. README : limitation connue de `npx nuxi typecheck` documentée

Ajout d'une section dans `README.md` expliquant l'échec
`ERR_PACKAGE_PATH_NOT_EXPORTED` de `npx nuxi typecheck` en environnement
local (résolution de `typescript/package.json` par le cache npx de la
machine, hors du dépôt), avec piste de contournement
(`npx clear-npx-cache`). Reproduit à l'identique par le générateur et
l'évaluateur sur plusieurs itérations, sans lien avec le code du projet.

## Ce qui a été tenté puis explicitement annulé (par prudence)

### Taille tactile des segments compacts de la frise mobile — non modifiée

Tentative d'augmenter `.rt-compact__seg` de `1.6rem` à `1.75rem` (suggestion
de l'évaluateur), puis test empirique via Playwright sur `.section-inner`
aux 5 tailles requises. **Régression détectée** : à 375×667, la section
« Projet phare » passe de 0px à **1px de débordement** sur
`.section-inner` (confirmé de façon répétée, et déjà présent dès `1.7rem`,
pas seulement `1.75rem`). Revert immédiat à `1.6rem` (valeur inchangée
depuis l'itération 4), re-vérifié : 25/25 mesures (5 tailles × 5 sections)
à nouveau à 0 débordement.

Consigne explicite reçue pour cette itération : ne prendre aucun risque de
régression sur P7/P4 pour un gain mineur de confort tactile. Le segment
reste au-dessus du minimum WCAG 2.5.8 AA (24px), fonctionnel, mais toujours
« serré » comme noté par l'évaluateur — point laissé pour une itération
future si le budget vertical de la frise compacte est revu plus largement
(ex. réduire un autre espacement pour compenser).

## Méthodologie de vérification — indépendante, sur l'app en direct

Playwright (`chromium` 1244, cache `~/Library/Caches/ms-playwright/`
de la machine, package `playwright` 1.64.0-alpha installé hors dépôt dans
le scratchpad de session), serveur de dev relancé sur
`http://localhost:3000` après modification :

- **Mesure de latence réelle** (pas de calcul théorique) : clic direct sur
  `rc__btn` « suivant » puis « précédent », lecture de `.rc__title` et de
  l'opacité calculée de `.rc` toutes les 50ms pendant 2s. Premier
  changement de titre détecté à **376ms** (next) et **366ms** (prev) sur
  deux exécutions consécutives (résultats quasi identiques). Aucun cas où
  le nouveau titre apparaît alors que l'opacité est encore > 0,9 (donc
  aucun flash de contenu) sur les deux sens.
- **Synchronisation des 3 chemins** : clic sur un segment compact mobile
  (étape 3) → état final correct ; flèche clavier droite après → état
  final correct (étape 4) ; confirmé après le changement de code.
- **Non-régression sous spam** (5 clics rapides à 100ms d'intervalle sur
  « suivant », puis 6 appuis clavier alternés gauche/droite à 80ms
  d'intervalle) : convergence vers un état final cohérent (« Étape 3 / 6 »
  puis « Étape 5 / 6 »), **0 erreur console/page** en dehors des warnings
  WebGL habituels du driver (`GPU stall due to ReadPixels`, préexistants,
  sans rapport avec le code).
- **Tenue à l'écran (`.section-inner`)** : 25/25 mesures (5 tailles requises
  × 5 sections) à 0 débordement après le changement final (segment mobile
  revenu à 1,6rem). Confirme qu'aucune régression P7/P4 n'a été introduite.

## Vérifications faites

- `npm run lint` → 0 erreur.
- `npm run build` → succès.
- `npm run generate` → succès (mêmes warnings sourcemap Tailwind
  préexistants, non applicatifs).
- `npx nuxi typecheck` → échoue toujours pour la même raison
  d'environnement déjà documentée depuis l'itération 2
  (`ERR_PACKAGE_PATH_NOT_EXPORTED` sur `typescript/package.json` résolu par
  le cache npx de la machine, aucun fichier du projet référencé) — pas un
  nouvel échec, maintenant documenté dans le README.
- Tenue à l'écran (`.section-inner`) : 25/25 mesures, 0 débordement partout
  (5 tailles × 5 sections), après le changement final.
- Latence et symétrie de la navigation Roadmap : mesurée en direct
  (Playwright), ~370-385ms dans les deux sens, 0 flash de contenu détecté.
- Synchronisation des 3 chemins de navigation Roadmap (segments compacts,
  boutons `‹ ›`, clavier) : vérifiée fonctionnelle, y compris sous spam de
  clics/touches.
- 0 erreur console Vue/JS pendant tous les tests ci-dessus (seuls des
  warnings WebGL du driver, préexistants).
- `git diff --stat` : seuls `README.md` et
  `app/composables/useRoadmapState.ts` modifiés au final (le changement de
  taille des segments compacts a été tenté puis annulé, le fichier
  `RoadmapTimeline.vue` est revenu strictement identique à l'état commité à
  l'itération 4).

## Connu, non fait / risques résiduels

- Taille tactile des segments compacts (`.rt-compact__seg`, 25,6px) : non
  augmentée cette itération, la tentative a régressé P7 de 1px à 375×667 —
  voir section « tenté puis annulé » ci-dessus. Reste fonctionnelle et
  au-dessus du minimum WCAG 2.5.8 AA (24px).
- Marge de contraste la plus faible du site : accusé de réception clavier
  (`.queued-hint`, 5,03:1 mesuré à l'itération 3) — non retouché, non
  re-mesuré cette itération, hors périmètre demandé.
- Zone vide en bas des sous-écrans mobile (signalée itération 1) — toujours
  non retouchée.

## Dev Server

- URL : http://localhost:3000
- Status : en cours d'exécution (arrière-plan, `nuxt dev --port 3000`)
- Commande : `npm run dev`
