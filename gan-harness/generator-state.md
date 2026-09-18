# Generator State — Run 2, itération 2

## Contexte

Correctif ciblé après l'évaluation de l'itération 1 (commit `efb489d`,
4,7/10, FAIL — voir `gan-harness/feedback/feedback-1.md`). Une seule porte
bloquante a échoué, **P2 Contraste**, mesurée sur pixels réellement rendus
(pas seulement un calcul analytique) : les libellés inactifs du menu latéral
(~3,2–3,75:1) et le titre/texte du Hero posé sans fond sur le canvas
hyperspace (~1:1–1,6:1 quand une étoile blanche traverse un glyphe). Cette
seule porte plafonnait les 4 critères notés à 5/10. Le reste de l'itération 1
(sections tenant à l'écran, sous-écrans mobile, clavier/molette/tactile,
direction artistique « instrument de bord ») était solide et n'a pas été
touché au-delà des correctifs demandés.

## Ce qui a été corrigé

### P2 — Contraste, menu latéral (`SlideMenuItem.vue`, `SlideMenu.vue`)

- `.menu-item` : opacité inactive `0.4` → `0.62`, survol `0.7` → `0.8`.
- `.menu-item__number` avait une opacité **imbriquée** (`0.8` sur un parent
  déjà à `0.4`, soit un facteur effectif de `0.32`) : supprimée (`1`), le
  numéro hérite désormais de la même opacité que le libellé, plus stricte.
- `.mobile-nav__num` (barre mobile) : même correctif (`0.4` → `0.62`, survol
  `0.7`/`0.8` → `0.8`), pour la même raison (le fond de la barre mobile est
  translucide, pas garanti noir pur).
- Mesure (script Playwright indépendant, `getComputedStyle` + couleur/opacité
  réelles, composité sur noir — le cas le plus favorable comme dans
  l'évaluation) : **6,58:1** au repos (calcul confirmé par un second calcul
  analytique manuel avant implémentation). Marge de sécurité de ~46%
  au-dessus du seuil AA 4,5:1, pour absorber les étoiles claires qui
  passent derrière le menu à l'occasion (non mesurées séparément mais la
  marge est volontairement large).
- L'état actif garde sa distinction visuelle intacte (opacité pleine, accent
  `#C98A4B`, trait à gauche) — seule l'opacité de repos des items inactifs a
  changé, conformément à la demande de garder l'actif identifiable (§2.3 bis
  de la spec).

### P2 — Contraste, Hero (`HeroSection.vue`)

- Le Hero était la seule section sans fond derrière son texte (posé
  directement sur le canvas hyperspace animé). Ajout d'un `.hero__scrim` :
  fond plat `rgb(8 7 6 / 93%)`, filet `1px` (`--color-line`), **pas de flou,
  pas de glow, pas de coin arrondi** — même langage visuel que l'utilitaire
  `.panel` déjà défini dans `main.css` pour exactement cet usage (jusqu'ici
  inutilisé nulle part dans le code, alors que sa raison d'être documentée
  en commentaire est précisément « posé derrière les blocs de texte, pour
  garantir le contraste WCAG AA sur le fond hyperspace mouvant »).
- Calcul (avant implémentation, puis revérifié après coup par script) : pour
  le texte secondaire (`--color-ink-dim`, 60% d'opacité, le cas le plus
  défavorable du Hero) contre le scrim composé avec une étoile blanche pleine
  juste derrière (pire cas absolu) → **~5,83:1**, marge de ~30% au-dessus du
  seuil AA 4,5:1. Le titre (opacité pleine) est encore plus confortable.
- Les deux boutons (`hero__btn`) sont maintenant à l'intérieur du scrim :
  leur libellé, qui portait le même risque (posé sur transparent), est
  protégé du même coup.
- Layout : le scrim ajoute un padding modeste (`clamp(1.1rem, …, 1.85rem)`
  vertical) autour du contenu existant, sans changer sa structure. Revérifié
  qu'aucune section ne déborde aux 4 tailles requises (voir Vérifications) —
  le Hero avait de la marge verticale disponible, aucun régression.

### Craft — deux `<nav>` avec le même `aria-label`

`SlideMenu.vue` : `data-desktop-nav` et `data-mobile-bar` portaient tous deux
`aria-label="Navigation entre les sections"`. Libellés distincts :
« Navigation entre les sections, menu latéral » (desktop) et « Navigation
entre les sections, barre mobile » (mobile).

### Craft — appuis clavier perdus pendant une transition

`SlideContainer.vue` :

- Auparavant, `goTo()` **retirait complètement** les écouteurs `wheel`/
  `keydown`/`touch*` du DOM pendant toute la durée de la transition GSAP
  (~0,65s), pour les rattacher une fois l'animation finie. Un appui clavier
  pendant ce laps de temps ne déclenchait donc même pas `onKeydown` — il
  n'existait pas de garde-fou à corriger, l'événement n'atteignait
  simplement jamais le gestionnaire.
- Les écouteurs restent maintenant attachés en permanence (attachés une
  seule fois au montage, retirés au démontage) ; chaque gestionnaire garde
  son garde-fou interne (`state.isAnimating`) pour ne pas déclencher une
  nouvelle transition en double.
- Ajout d'une **file d'attente d'une seule entrée** (`requestNavigate` /
  `runPendingAction`) pour les quatre touches de changement de section
  (flèches haut/bas, PageUp/PageDown, Home, End) : si l'une d'elles est
  pressée pendant une transition en cours, la dernière intention est retenue
  et rejouée automatiquement dès que la transition se termine — rien n'est
  perdu.
- Retour visuel : un petit accusé de réception mono (`···`, couleur accent,
  pulsation discrète, `aria-hidden`) s'affiche tant qu'une entrée est en
  file d'attente et disparaît dès qu'elle est consommée. Respecte
  `prefers-reduced-motion` (pas d'animation, opacité fixe). Vérifié par
  script : appui rapide de deux `ArrowDown` pendant la même fenêtre de
  transition → avance bien de 2 sections au total (aucune perte), indicateur
  visible pendant la fenêtre d'attente puis disparu.
- Molette et tactile n'ont pas été touchés (hors périmètre de la demande,
  qui portait spécifiquement sur le clavier) : ils gardent leur propre
  garde-fou (`if (state.isAnimating) return`), inchangé.

## Vérifications faites

- `npm run lint` → 0 erreur/avertissement.
- `npm run build` → succès.
- `npm run generate` → succès (warnings sourcemap Tailwind préexistants,
  non applicatifs, déjà documentés à l'itération précédente).
- `npx nuxi typecheck` → échoue dans ce sandbox pour la raison d'environnement
  déjà documentée et **indépendamment reproduite par l'Évaluateur lui-même**
  dans son propre environnement (`ERR_PACKAGE_PATH_NOT_EXPORTED` sur
  `typescript/package.json` résolu par `npx`, message ne référençant aucun
  fichier du projet). Tentative de contournement (installation isolée de
  `vue-tsc@2.2.0`/`typescript@5.9.2` dans un répertoire temporaire hors
  dépôt) bloquée par une protection de l'environnement d'exécution sur les
  commandes destructrices ; non poursuivie car hors périmètre du correctif
  demandé et déjà qualifiée de non bloquante par l'Évaluateur (P3 passé
  « avec réserve d'environnement » à l'itération précédente).
- Script Playwright indépendant (hors dépôt, `playwright` déjà présent dans
  le cache npx de la machine, même outil que l'Évaluateur) :
  - Menu, item inactif : `getComputedStyle` réel (`opacity: 0.62`,
    `color: rgb(237,232,222)`) composé sur noir → **6,58:1** mesuré (calcul
    programmatique, formule WCAG complète).
  - Hero : `hero__scrim` présent avec `background-color: rgba(8,7,6,0.93)`
    confirmé en `getComputedStyle` réel.
  - `aria-label` des deux `<nav>` confirmés distincts.
  - Tenue à l'écran : les 5 sections aux 4 tailles requises (1920×1080,
    1440×900, 1280×720, 768×1024) → `scrollHeight === clientHeight` partout
    (0 px d'écart, aucune régression du Hero malgré le scrim ajouté). Mobile
    375×667 : les 5 sections tiennent aussi exactement (667/667), 0 erreur
    console sur le parcours complet.
  - Boutons Hero : « Voir mes projets » et « Me contacter » amènent bien à
    la section Projets (index actif 4), aucune régression fonctionnelle.
  - File d'attente clavier : deux `ArrowDown` rapprochés pendant une
    transition font bien avancer de 2 sections (aucune perte), indicateur
    `.queued-hint` visible pendant la fenêtre d'attente puis absent une fois
    consommé.
  - Aucune erreur console sur l'ensemble de ces parcours.

## Connu, non fait

- Seuls le Hero et le menu ont été traités, conformément au périmètre exact
  de la demande. L'Évaluateur note en suggestion (non bloquante à
  l'itération 1) que les autres sections (Parcours, Méthode, Projet phare,
  Projets) posent aussi du texte directement sur le canvas sans `.panel` —
  elles n'ont pas été signalées en échec et n'ont pas été touchées ici pour
  ne rien régresser hors périmètre ; à auditer systématiquement si
  l'Évaluateur les signale à son tour.
- Molette et tactile ne bénéficient pas de la file d'attente ajoutée pour le
  clavier (non demandé).
- Typecheck non vérifié à 0 erreur dans ce sandbox précis pour la raison
  d'environnement documentée ci-dessus (déjà actée comme non bloquante par
  l'Évaluateur à l'itération précédente, reproduite indépendamment de son
  côté).

## Dev Server

- URL : http://localhost:3000
- Status : en cours d'exécution (arrière-plan)
- Commande : `npm run dev`
