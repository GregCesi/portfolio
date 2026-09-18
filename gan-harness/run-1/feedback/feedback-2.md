# Évaluation — Itération 2

Commits évalués : `2d0f3c6` (correctifs) et `7bd44d3` (état du générateur), branche
`ia-refonte`. Au moment du test, `git status` montrait une modification non
committée sur `app/composables/useLayoutDimensions.ts` (diff vérifié : virgules
finales, une ligne vide, fin de fichier — aucun changement de logique). Ce n'est
pas une violation de périmètre, mais c'est la même négligence d'hygiène que
`feedback-1.md` avait déjà signalée (Major Issue #2), en plus petit.

## Mode d'évaluation

**Atteint : `playwright`.** Navigation complète des 5 sections via Playwright MCP
sur `http://localhost:3000`, complétée par des scripts Playwright autonomes
(Node, package `playwright` déjà installé de façon isolée dans le scratchpad,
hors dépôt) pour : mesure de contraste par échantillonnage de pixels réels
ciblant précisément le texte et le fond du panneau (méthode affinée par rapport
à l'itération 1 — voir Craft), test à 375×667 sans outil de resize MCP
disponible, mesure géométrique de l'éventuel chevauchement H1/nav (`getBoundingClientRect`),
polling du `scrollTop` de `.section-scroll-area` pour observer le
comportement temporel réel du bouton « Me contacter », et test à 768 et
1920 px. Build/generate/lint relancés en CLI ; typecheck revérifié avec
`vue-tsc@2.2.0` + `typescript@5.9.2` épinglés hors dépôt.

## Portes bloquantes

| Porte | Statut | Preuve |
|---|---|---|
| **P1 Contenu** | **PASS** | Snapshots d'accessibilité sur les 5 sections : titres, paragraphes, 6 entrées de frise, 4 cartes Méthode, 6 étapes de roadmap, 3 cartes projet, bloc Contact — identiques mot pour mot à `content/portfolio.md`. `{{LINKEDIN_URL}}`/`{{CV_URL}}` toujours vides → lien LinkedIn et bouton CV absents du DOM, conforme. Diff `git diff b428dff..7bd44d3 -- app/data/content.ts` inspecté ligne à ligne : uniquement des virgules finales et des retours à la ligne (Prettier), aucune chaîne de caractères modifiée — confirmé par un `sort \| uniq -c` qui isole les lignes non appariées (uniquement des reformulations de wrapping, pas de texte différent). |
| **P2 Contraste** | **PASS** | Mesure ciblée sur `.about__period`/`.about__detail` (frise Parcours) : glyphe de texte le plus sombre observé sur 35 frames (~2,1 s de balayage d'étoiles) = `rgb(221,221,221)`, fond du panneau (zone garantie sans glyphe, à l'intérieur de `.about__content`) le plus clair observé = `rgb(73,73,73)`. **Contraste dans le pire cas mesuré : 6,63:1**, au-dessus du seuil 4,5:1 (à comparer aux ≈1,10:1 mesurés à l'itération 1). Un premier script plus naïf (classification par simple seuil de luminance sur toute la boîte englobante) donnait un faux 2,96:1 en confondant des pixels d'anticrénelage du texte lui-même avec du fond ; corrigé en séparant explicitement une bande de fond garantie sans glyphe (au-dessus de la ligne de texte, à l'intérieur du panneau `rgba(0,0,0,0.65)`) du pixel de glyphe le plus lumineux. Le panneau opaque ajouté cette itération (`.about__content` avec fond dédié, `.about__period`/`.about__detail` en opacité 0,85 + `light-shadow-text`) protège efficacement le texte des traînées d'étoiles. |
| **P3 Build** | **PASS** | `npm run build` ✓, `npm run generate` ✓, `npm run lint` ✓ (0 erreur/avertissement). `npx nuxi typecheck` échoue toujours dans ce sandbox pour la même raison d'environnement documentée aux itérations précédentes (`ERR_PACKAGE_PATH_NOT_EXPORTED` sur `typescript/package.json` résolu par npx) — non comptée contre le code ; revérifiée avec `vue-tsc@2.2.0` + `typescript@5.9.2` épinglés hors dépôt contre le `tsconfig.json` du projet : **0 erreur**. Console navigateur : **aucun avertissement Vue observé**, sur chargement initial, navigation dans les 5 sections (desktop 1440×900 et 1920×1080, mobile 375×667, tablette 768×1024), clic « Me contacter » (desktop et mobile), clics « Voir le détail » / « Voir la méthode », et spam de clics sur la navigation. Seul message résiduel : `GL Driver Message ... GPU stall due to ReadPixels`, déjà documenté aux itérations précédentes comme un artefact de l'environnement headless, non lié à l'app (n'apparaît qu'en capture d'écran WebGL automatisée). L'avertissement Vue en boucle de l'itération 1 (`:container="slideRef"` non déclaré sur `SlideMenu`) a bien disparu — confirmé par lecture du diff (`app/pages/index.vue`, l'attribut a été retiré) et par observation live. |
| **P4 Mobile** | **PASS** | À 375×667 : mesure géométrique du H1 (`top:168.5 / bottom:281`) contre le nav mobile (`top:96.5 / bottom:128.5`) → `yOverlap: 0`, gap net de 40px. Confirmé visuellement sur capture d'écran. Les 5 sections parcourues avec un délai d'attente suffisant (1,8s, le temps réel des transitions) ne montrent aucun contenu tronqué ni chevauché : frise Parcours, cartes Méthode, timeline + planète Projet phare (planète bien visible sous le sous-titre, sans chevaucher le texte), cartes Projets + bloc Contact. Le bouton « Me contacter » sur mobile amène bien le bloc Contact entièrement dans le viewport (voir détail dans Functionality ci-dessous). |
| **P5 Effet 3D** | **PASS** | Fond hyperspace animé présent sur toutes les sections et toutes les tailles testées. Planète visible en section Projet phare à 375, 768 et 1920px. Fondu de texture vérifié en comparant Étape 1 (Collecte, texture brun-rouge uniforme) et Étape 3 (Extraction, texture nettement différente : zones orange/bleu-gris contrastées) — capture à l'appui (`roadmap-step3-extraction-v2.png`). Étapes 1 et 2 partagent intentionnellement la même texture (`planet-bake-1`, conforme à `content/portfolio.md`) : pas de changement visuel entre elles, c'est attendu et non un bug. |
| **P6 Périmètre** | **PASS** | `git branch --show-current` → `ia-refonte`. `git diff b428dff..7bd44d3 -- package.json package-lock.json` → vide, aucune nouvelle dépendance. Aucun fichier écrit hors du dépôt (scripts de test Playwright exécutés uniquement dans le scratchpad de l'évaluateur). `.gitignore` couvre désormais `gan-harness/screenshots/` et `.playwright-mcp/`, conforme à la note d'hygiène de l'itération 1. |

**6 portes sur 6 passent → aucun plafond appliqué aux critères notés.**

## Scores

| Critère | Score | Poids | Pondéré |
|---|---|---|---|
| Design Quality | 8/10 | 0.3 | 2.4 |
| Originality | 8/10 | 0.2 | 1.6 |
| Craft | 7/10 | 0.3 | 2.1 |
| Functionality | 9/10 | 0.2 | 1.8 |
| **TOTAL** | | | **7.9/10** |

**Score pondéré total : 7.9 / 10**

## Verdict : PASS (seuil 7.0)

### Justification

- **Design Quality (8/10)** : hiérarchie lisible et cohérente sur les 5
  sections à 375, 768, 1440 et 1920px. La frise Parcours et la timeline
  Projet phare parlent bien le même langage visuel (cercles, ligne qui se
  trace). Le nouveau panneau `.about__content` sur la frise (nécessaire pour
  le contraste) s'intègre proprement sans casser l'alignement ni la lecture.
  À 1920px, les trois colonnes timeline/contenu/planète de la Roadmap ne se
  chevauchent jamais. Le chevauchement H1/nav mobile de l'itération 1 a
  disparu sans effet de bord visible ailleurs. Pas de 9-10 : les flèches
  « Précédent »/« Suivant » de la Roadmap restent des glyphes plats sans
  état visuellement distinct au survol/focus au-delà du contour générique, un
  détail qu'un développeur senior aurait probablement raffiné.
- **Originality (8/10)** : inchangé par rapport à l'itération 1 sur ce plan —
  le concept (planète dont la texture illustre chaque étape du pipeline
  job-search, fond hyperspace, pas de dégradé violet ni de glassmorphism
  générique) reste le point fort du projet et n'a pas régressé.
- **Craft (7/10)** : transitions GSAP fluides, focus visible confirmé
  (`outline: 2px solid white` sur les boutons de nav testés au clavier),
  `prefers-reduced-motion` fonctionnel sans erreur console, défilement
  interne + bascule en butée toujours opérationnels (navigation clavier
  flèches/PageUp/PageDown/Home/End vérifiée section par section, y compris un
  cas limite où un appui rapide pendant une transition en cours est absorbé
  par le verrou d'animation — comportement voulu, pas un bug). Deux points
  retiennent le score sous 8 : (1) le bouton « Me contacter » sur mobile
  prend environ 1,8 à 2 secondes avant que le bloc Contact soit pleinement
  visible (transition de section GSAP puis scroll interne enchaînés) — ça
  fonctionne, mais c'est perceptiblement lent, sans indicateur de progression ;
  (2) le point 4 de la spec (poids des assets 3D, ~29 Mo, textures à
  compresser) reste non traité, ce que le générateur reconnaît explicitement
  et qui est un critère cité nommément dans la grille Craft (« poids des
  assets 3D »).
- **Functionality (9/10)** : **le bug critique de l'itération 1 est
  réellement corrigé**, sur desktop et sur mobile. Vérifié précisément par
  polling du `scrollTop` réel de `.section-scroll-area` : le bloc Contact
  devient pleinement visible dans le viewport (`top: 229.7`, `bottom: 474.7`
  pour un viewport de 667px de haut) après un clic sur « Me contacter » en
  375×667, sans décalage résiduel ni contenu hors écran. Navigation clavier
  complète (flèches, PageUp/PageDown, Home/End), molette avec défilement
  interne puis bascule, tabulation avec focus visible, liens externes
  sécurisés (`rel="noopener noreferrer"`, `target="_blank"`), boutons
  croisés « Voir le détail » → section 4 et « Voir la méthode » → section 3
  vérifiés fonctionnels, masquage correct des éléments à marqueur vide, SEO
  complet dans le HTML généré (`<title>`, meta description, `og:*`,
  `twitter:card`, `lang="fr"`, tous conformes mot pour mot à
  `content/portfolio.md`). Le seul point qui retient ce critère sous 10 est
  la lenteur perçue du scroll « Me contacter » sur mobile, déjà comptée dans
  Craft.

## Confirmation des 4 correctifs annoncés par le générateur

1. **Bouton « Me contacter » cassé** → **corrigé, vérifié desktop et mobile.**
   Le remplacement de `scrollIntoView()` par un calcul manuel du `scrollTop`
   de `.section-scroll-area`, déclenché après la fin de la transition GSAP
   (`section-settled`), fonctionne. Sur desktop l'effet est quasi immédiat ;
   sur mobile il faut compter ~1,8-2s (voir Craft) mais le résultat final est
   correct et stable (pas de flottement, pas de retour en arrière observé sur
   20 frames de polling).
2. **Avertissement Vue en boucle** → **corrigé.** `:container="slideRef"` a
   bien été retiré de `app/pages/index.vue`. Aucun avertissement Vue observé
   sur l'ensemble des scénarios testés cette itération.
3. **Chevauchement H1/nav mobile à 375×667** → **corrigé.** Mesure géométrique
   directe : 0px de chevauchement, gap de 40px entre le bas du nav et le haut
   du H1.
4. **Contraste frise Parcours** → **corrigé.** Contraste mesuré dans le pire
   cas à 6,63:1 (contre ≈1,10:1 avant), au-dessus du seuil AA de 4,5:1, avec
   une méthode de mesure isolant précisément les pixels de glyphe des pixels
   de fond du panneau (la première tentative de mesure, plus naïve, avait
   donné un faux positif à 2,96:1 en confondant l'anticrénelage du texte avec
   du fond — corrigé en cours d'évaluation, détail donné ci-dessus pour
   traçabilité).

Aucune régression détectée sur les points déjà validés à l'itération 1
(défilement interne + bascule en butée, indicateur de navigation actif, clics
rapides/répétés, rendu 768px, rendu 1920px, SEO).

## Critical Issues (must fix)

Aucune. Les 6 portes passent et aucun défaut de gravité critique n'a été
observé cette itération.

## Major Issues (should fix)

1. **Working tree non committé en fin d'itération, à nouveau** :
   `app/composables/useLayoutDimensions.ts` porte une modification non
   committée (diff vérifié : formatage seul — une ligne vide, virgules
   finales, fin de fichier — aucun changement de logique). C'est la même
   négligence que `feedback-1.md` avait déjà signalée en Major Issue #2 ; en
   plus petit cette fois, mais toujours présente. Committer systématiquement
   l'état final avant de clore une itération.
2. **Performance des assets 3D toujours non traitée** (point 4 de la spec,
   conditionnel mais désormais le principal chantier restant) : `Planet-1.glb`
   (5,8 Mo), `Planet-5.glb` non référencé (7,1 Mo) et ~16 Mo de textures non
   compressées. La spec autorise explicitement une dépendance de compression
   d'assets en devDependency pour ce point — à traiter si une itération
   suivante est lancée.
3. **Latence perçue du bouton « Me contacter » sur mobile** (~1,8-2s avant
   que le bloc Contact soit pleinement visible) : fonctionnellement correct,
   mais sans retour visuel intermédiaire (pas d'indicateur de scroll en
   cours), ce qui peut donner l'impression d'un bouton qui ne répond pas
   pendant la première seconde. Envisager de raccourcir la durée de la
   transition de section quand elle est immédiatement suivie d'un scroll
   interne vers une ancre, ou d'ajouter un état visuel transitoire.

## Minor Issues (nice to fix)

1. **`user-select: none` global** (`app/assets/css/main.css`, `html, body`)
   — signalé à l'itération 1, toujours présent, toujours non traité (hors
   périmètre de cette itération de correction ciblée, mais reste gênant pour
   copier l'e-mail de contact).
2. **Flèches Précédent/Suivant de la Roadmap** : glyphes plats sans état
   visuel différencié marqué (au-delà du contour de focus générique) — détail
   mineur de finition.
3. Fichiers d'artefacts de session (`.playwright-mcp/`) correctement ignorés
   cette itération — confirmé, rien à corriger, mentionné pour mémoire.

## Ce qui a été vérifié et confirmé sans anomalie (pour calibrer un futur retour)

- Clics rapides/répétés sur la navigation : verrou d'animation robuste,
  aucune erreur, se stabilise proprement sur la dernière transition en cours.
- Boutons croisés entre sections (« Voir le détail », « Voir la méthode ») :
  fonctionnels, testés par clic réel avec vérification de l'état actif du nav.
- Liens externes (GitHub) : `rel="noopener noreferrer"`, `target="_blank"`
  corrects sur les deux occurrences (carte projet et bloc Contact).
- `prefers-reduced-motion` : testé avec l'option Playwright dédiée, aucune
  erreur, capture d'écran conforme.

## Suggestions concrètes pour une itération suivante éventuelle

1. Committer l'état final du working tree avant de clore l'itération
   (vérifier `git status` systématiquement).
2. Traiter le point 4 de la spec (compression des textures de la planète en
   WebP/KTX2, suppression de `Planet-5.glb` non référencé, chargement 3D
   différé après le premier rendu) — c'est désormais le principal écart
   restant avec la spec.
3. Réduire la latence perçue du scroll « Me contacter » sur mobile, ou ajouter
   un indicateur de progression pendant la transition + le scroll interne
   enchaînés.
4. Traiter `user-select: none` global (restreindre au conteneur de slides
   uniquement) pour permettre la sélection de l'e-mail de contact.

## Screenshots

Sauvegardés dans `gan-harness/screenshots/` (dossier ignoré par git, sélection
pertinente à cette itération) :
- `2-desktop-start.png` — Start desktop 1440px, rendu propre.
- `3-desktop-me-contacter-clicked.png` — bloc Contact visible après clic
  desktop (preuve du correctif #1).
- `4-desktop-parcours.png` — frise Parcours desktop avec le nouveau panneau de
  fond protégeant le contraste.
- `mobile-375-start.png` — Start mobile 375px, plus aucun chevauchement H1/nav.
- `mobile-375-me-contacter-settled.png` — bloc Contact pleinement visible sur
  mobile après règlement de l'animation (~2s après le clic).
- `mobile-v2-1-start.png` à `mobile-v2-5-projets.png` — les 5 sections à
  375px avec un délai d'attente suffisant, aucun contenu coupé ni chevauché.
- `tablet-768-start.png`, `tablet-768-roadmap.png` — 768px, rendu correct.
- `desktop-1920-roadmap.png`, `roadmap-step1-collecte-v2.png`,
  `roadmap-step3-extraction-v2.png` — preuve du fondu de texture planète
  (P5) entre l'étape 1 (Collecte) et l'étape 3 (Extraction) à 1920px.
- `reduced-motion-parcours.png` — rendu sous `prefers-reduced-motion: reduce`,
  aucune erreur.
