# Évaluation — Itération 3

Commit évalué : `6adf0c9` (« iteration-003: performance des assets 3D, latence
scroll mobile, finitions »), branche `ia-refonte`. `git status` : working
tree propre au moment de l'évaluation (l'oubli de commit signalé en Major
Issue #1 de `feedback-2.md` est corrigé — le diff résiduel sur
`useLayoutDimensions.ts` est désormais inclus dans ce commit).

## Mode d'évaluation

**Atteint : `playwright`.** Navigation complète des 5 sections via Playwright
MCP sur `http://localhost:3000`, complétée par des scripts Playwright
autonomes (Node, package `playwright` déjà installé de façon isolée dans le
scratchpad, hors dépôt) pour : mesure géométrique précise (chevauchements,
latence de scroll par sondage de visibilité réelle de l'e-mail), inspection
réseau (requêtes `.webp`/`.png`/`.glb`), test de robustesse au clic rapide,
navigation croisée entre sections, et captures à 375×667, 768×1024, 1440×900
et 1920×1080. Build/generate/lint relancés en CLI ; typecheck revérifié avec
`vue-tsc@2.2.0` + `typescript@5.9.2` épinglés hors dépôt.

## Portes bloquantes

| Porte | Statut | Preuve |
|---|---|---|
| **P1 Contenu** | **PASS** | `git diff 7bd44d3..6adf0c9 -- app/data/content.ts content/portfolio.md` → vide, aucun texte modifié cette itération. Snapshots d'accessibilité des 5 sections (Start, Parcours, Méthode, Projet phare avec ses 6 étapes, Projets + Contact) comparés mot pour mot à `content/portfolio.md` : identiques. `{{LINKEDIN_URL}}`/`{{CV_URL}}` toujours vides → éléments absents du DOM, conforme. |
| **P2 Contraste** | **PASS** | `git diff 7bd44d3..6adf0c9 -- app/assets/css/main.css` : seul ajout est l'exception ciblée `user-select: text` sur `#contact`, aucune modification des couleurs/opacités de `.about__content` ni des composants Parcours. Le contraste mesuré à l'itération 2 (6,63:1 dans le pire cas, méthode par échantillonnage de pixels) reste donc valable, largement au-dessus du seuil 4,5:1. Computed styles revérifiés : texte `rgba(255,255,255,0.85)` sur panneau `rgba(0,0,0,0.65)`, inchangé. |
| **P3 Build** | **PASS** | `npm run build` ✓, `npm run generate` ✓ (mêmes warnings sourcemap Tailwind préexistants, non applicatifs), `npm run lint` ✓ (0 erreur/avertissement, hors warning Node sur `.eslintignore` sans rapport avec le code). `npx nuxi typecheck` échoue toujours pour la raison d'environnement documentée depuis l'itération 1 (`ERR_PACKAGE_PATH_NOT_EXPORTED`) — non comptée contre le code ; revérifiée avec `vue-tsc@2.2.0`/`typescript@5.9.2` épinglés hors dépôt contre le `tsconfig.json` du projet : **0 erreur**. Console navigateur : **aucun avertissement Vue observé**, sur les 5 sections, la navigation clavier, les clics croisés (« Voir le détail », « Voir la méthode »), le clic rapide répété (8 clics) sur les flèches Roadmap, et le scroll mobile. Un avertissement non-Vue est présent et documenté en Major Issue ci-dessous (n'invalide pas la porte au sens strict de la grille, qui ne cite que les « erreurs »). |
| **P4 Mobile** | **PASS** | À 375×667 : H1 (`top:168.5/bottom:281`) vs nav mobile (`top:96.5/bottom:128.5`) → 0px de chevauchement. Roadmap à 375px : planète (`bottom:635.2`), contenu (`top:675.2`), timeline (`top:999.2`) → aucun chevauchement entre les trois blocs. Bloc Contact pleinement visible en 946 ms après clic sur « Me contacter » (mesuré par sondage direct de la visibilité réelle du nœud texte de l'e-mail, pas d'estimation). Les 5 sections parcourues sans contenu tronqué ni inatteignable. |
| **P5 Effet 3D** | **PASS** | Fond hyperspace animé présent sur toutes les sections/tailles. Planète rendue visuellement correcte après compression WebP, à 375, 768, 1440 et 1920px (aucun artefact de compression visible, aucune dégradation par rapport aux captures de l'itération 2). Fondu de texture toujours fonctionnel : capture Étape 1 (Collecte, texture brun-rouge uniforme) vs Étape 3 (Extraction, texture orange/gris-bleu contrastée) confirmée visuellement, et confirmée dans l'autre sens (retour à l'Étape 1 → texture rouge d'origine restaurée). Requêtes réseau confirmées : uniquement `.webp` (`planet-bake-1` à `-4`) + `Planet-1.glb`, **zéro requête `.png`**. Chargement différé confirmé : les requêtes 3D démarrent ~200-300ms après l'évènement `load` (pas de blocage du premier rendu), conforme à la spec §4. |
| **P6 Périmètre** | **PASS** | `git branch --show-current` → `ia-refonte`. `git diff 7bd44d3..6adf0c9 -- package.json package-lock.json` → vide, aucune nouvelle dépendance (conversion WebP faite via le binaire système `cwebp`, confirmé). Aucun fichier écrit hors du dépôt par le générateur. `planet-roughness.png` supprimé (7,1 Mo→0) confirmé non référencé dans le code (`grep -rn roughness app/` → vide) avant suppression, suppression donc sans risque. |

**6 portes sur 6 passent → aucun plafond appliqué aux critères notés.**

## Scores

| Critère | Score | Poids | Pondéré |
|---|---|---|---|
| Design Quality | 8/10 | 0.3 | 2.4 |
| Originality | 8/10 | 0.2 | 1.6 |
| Craft | 8/10 | 0.3 | 2.4 |
| Functionality | 9/10 | 0.2 | 1.8 |
| **TOTAL** | | | **8.2/10** |

**Score pondéré total : 8.2 / 10**

## Verdict : PASS (seuil de ce run : 8.0)

Le score franchit le seuil de 8,0 fixé pour ce run (8,2/10), au-dessus du
seuil générique de la grille (7,0). Marge faible (+0,2) : voir Major Issue #1
ci-dessous, qui aurait pu faire basculer le résultat si elle avait été jugée
plus sévèrement.

### Justification

- **Design Quality (8/10)** : la critique précise de l'itération 2 (« les
  flèches Précédent/Suivant restent des glyphes plats sans état visuel
  distinct ») est corrigée — vrais boutons circulaires avec contour, fond
  translucide au survol, réduction d'échelle à l'appui, et état désactivé
  nettement estompé (`border-color`/`background-color`/`color` tous atténués,
  `cursor: not-allowed`), vérifié visuellement (`it3-arrows-disabled-state.png`)
  et par lecture du CSS. Reste stable par ailleurs : hiérarchie lisible,
  cohérence frise Parcours / timeline Roadmap, rendu propre à 375/768/1440/1920px
  sans changement depuis l'itération 2. Pas de 9/10 : au-delà de ce correctif
  ciblé, aucune autre amélioration de polish n'a été apportée cette itération
  (le reste du design est identique à l'itération 2, déjà noté 8/10) — un
  score de 9 exigerait un niveau de raffinement supplémentaire non observé
  ailleurs (espacements, micro-interactions sur les cartes Méthode/Projets,
  etc., inchangés).
- **Originality (8/10)** : inchangé. Cette itération portait sur la
  performance et les finitions, pas sur le concept visuel. Le point fort
  reste le même (planète à textures illustrant le pipeline job-search, fond
  hyperspace, absence de dégradé violet ou de glassmorphism générique).
- **Craft (8/10, en hausse depuis 7/10)** : les deux points cités
  explicitement par `feedback-2.md` sont désormais traités et vérifiés
  indépendamment :
  - **Poids des assets 3D** : `public/3d` passe de 28 Mo à 6,6 Mo (mesuré),
    `.output/public/3d` à 7,1 Mo après `npm run generate` (mesuré). `Planet-5.glb`
    (non référencé, 7,1 Mo) supprimé. Textures recompressées en WebP
    (`planet-bake-1` à `-4`, 164-267 Ko chacune contre 2,7-4,2 Mo en PNG).
    Chargement 3D différé confirmé (`requestIdleCallback`, requêtes
    observées ~200-300ms après `load`, pas de blocage du premier rendu).
  - **Latence « Me contacter » sur mobile** : mesurée à **946 ms** (contre
    ~1,8-2s à l'itération 2), par sondage direct de la visibilité réelle du
    nœud contenant l'e-mail — proche de la mesure du générateur (1056 ms).
    Le mécanisme (fondus de section GSAP superposés au lieu d'enchaînés +
    `gsap.to(scrollTop)` à durée fixe 0,45s au lieu de `scrollTo({behavior:'smooth'})`)
    est propre, commenté, et respecte toujours `prefers-reduced-motion`
    (vérifié : bascule immédiate sans animation si l'utilisateur le demande).
  - Ce qui retient le score sous 9/10 : **un avertissement console GSAP
    reproductible et non détecté par le générateur**, `GSAP target
    .planet-container not found`, qui se déclenche deux fois à **chaque**
    changement d'étape de la Roadmap (avant et arrière), y compris lors des
    clics rapides répétés. La classe `.planet-container` n'existe nulle part
    dans le code (`grep -rn planet-container app/` ne la trouve que dans
    `useRoadmapState.ts`, jamais dans un template) — c'est un appel GSAP mort,
    sans effet, présent depuis au moins l'itération 2 (vérifié : le
    diff `7bd44d3..6adf0c9` ne touche pas ces lignes). Le fondu de texture
    réel fonctionne quand même, car il passe par un mécanisme séparé
    (`useCrossfadeTexture`, opacité de matériau WebGL), donc ce n'est pas un
    bug visuel — mais c'est du code mort qui pollue la console à chaque
    interaction avec la fonctionnalité la plus mise en avant du site. Le
    générateur affirme dans `generator-state.md` avoir vérifié « aucun
    warning/erreur console... navigation clavier jusqu'à la section Roadmap »
    — un examen attentif montre que cette vérification s'arrête à l'arrivée
    sur la section et ne couvre pas le clic effectif sur les flèches
    Précédent/Suivant, qui est précisément ce qui déclenche l'avertissement.
    Étant donné que cette itération affirme avoir spécifiquement fiabilisé
    ces flèches, c'est un angle mort de vérification notable.
- **Functionality (9/10, inchangé)** : tout ce qui fonctionnait à
  l'itération 2 fonctionne toujours, sans régression détectée. Navigation
  croisée vérifiée par clic réel avec lecture de l'état actif du menu
  (« Voir la méthode » → section Méthode active, « Voir le détail » →
  section Projet phare active). Liens externes corrects (`target="_blank"`,
  `rel="noopener noreferrer"`). Masquage des marqueurs vides confirmé
  (LinkedIn/CV absents). SEO complet et identique au contenu source
  (`<title>`, meta description, `og:*`, `twitter:card`, `lang="fr"`). Clic
  rapide répété (8 clics) sur les flèches Roadmap : aucune erreur JS, le
  verrou d'animation absorbe proprement les clics surnuméraires (avance
  seulement d'une étape après règlement, comportement voulu). Sélection de
  texte de l'e-mail de contact confirmée (`user-select: text`), sans
  changement visuel, portée correctement restreinte à `#contact` (le reste
  du site garde `user-select: none`, nécessaire au défilement tactile). Pas
  de 10/10 : l'avertissement console GSAP relevé en Craft touche aussi,
  marginalement, la robustesse perçue de cette fonctionnalité.

## Confirmation des 4 points annoncés par le générateur pour cette itération

1. **Hygiène git** → **confirmée.** `git status` propre. Le diff de
   formatage sur `useLayoutDimensions.ts`, resté non committé à l'itération 2
   (Major Issue #1 de `feedback-2.md`), est désormais inclus dans le commit
   `6adf0c9`.
2. **Performance des assets 3D** → **confirmée, mesurée indépendamment.**
   28 Mo → 6,6 Mo (`du -sh public/3d`), `Planet-5.glb` supprimé et confirmé
   non référencé avant suppression, textures en WebP confirmées par
   inspection réseau (zéro `.png`), chargement différé confirmé par mesure de
   timing des requêtes. Rendu visuel de la planète non dégradé, vérifié à 4
   tailles de viewport.
3. **Latence « Me contacter » sur mobile** → **confirmée, mesurée
   indépendamment à 946 ms** (le générateur annonçait ~1056 ms — même ordre
   de grandeur, écart normal de méthode de mesure). Amélioration réelle et
   significative par rapport aux ~1,8-2s de l'itération 2.
4. **`user-select` + flèches Roadmap** → **confirmées.** E-mail sélectionnable
   (`user-select: text` scoped à `#contact`), flèches avec états
   hover/active/focus-visible/disabled visuellement distincts et fonctionnels
   (vérifié par clic réel : bouton précédent désactivé et grisé à l'étape 1,
   activé et fonctionnel dès l'étape 2). Fonctionnellement correctes, mais
   voir l'avertissement console associé documenté en Craft ci-dessus.

## Régressions détectées

**Aucune régression fonctionnelle ou de contenu.** L'avertissement console
GSAP (`'.planet-container' not found`) documenté ci-dessus n'est **pas** une
régression introduite par cette itération : il existait déjà dans le code de
l'itération 2 (même ligne, diff vérifié). Il n'avait simplement jamais été
détecté par les évaluations précédentes ni par le générateur, car aucune
n'avait testé un clic réel sur les flèches Précédent/Suivant en observant la
console — un angle mort qui persiste malgré l'attention portée à ces flèches
cette itération.

## Critical Issues (must fix)

Aucune. Les 6 portes passent.

## Major Issues (should fix)

1. **Avertissement console GSAP répété sur chaque navigation de la
   Roadmap** : `app/composables/useRoadmapState.ts` (lignes ~91 et ~102)
   cible `.planet-container` avec `gsap.to(...)`, une classe absente de tout
   template (`RoadmapSection.vue`, `RoadmapPlanet.vue`). Le fondu de texture
   réel fonctionne via un autre mécanisme (`useCrossfadeTexture`, opacité de
   matériau WebGL dans `RoadmapPlanet.vue`), donc ce n'est pas un bug visuel,
   mais c'est du code mort qui déclenche `GSAP target .planet-container not
   found` deux fois à chaque changement d'étape (avant et arrière), sur la
   fonctionnalité la plus visible du site. À corriger soit en supprimant ces
   deux appels `gsap.to('.planet-container', ...)` devenus inutiles (le
   crossfade réel est déjà géré ailleurs), soit en ajoutant réellement la
   classe `planet-container` sur le conteneur de `RoadmapPlanet.vue` si un
   fondu DOM supplémentaire était réellement voulu en plus du crossfade
   WebGL.
2. **Étape 6 (« Décision ») de la Roadmap sans texture dédiée** : `content/portfolio.md`
   assigne `planet-bake-5` à l'étape 6, mais aucun fichier
   `planet-bake-5.webp` n'existe (seuls `-1` à `-4` sont présents,
   confirmé par `find public -type f`). `RoadmapPlanet.vue` retombe sur la
   texture d'origine embarquée dans le GLB pour cette étape
   (`'planet-bake-5': originalTexture`, avec un commentaire l'assumant
   explicitement). Ce n'est pas une régression de cette itération (même
   logique de fallback présente à l'itération 2, avec un chemin PNG mort en
   plus qui a disparu), et ce n'est pas un bug visuel cassé, mais c'est un
   écart discret avec l'intention du contenu source (une texture distincte
   par étape) qu'un développeur senior aurait probablement comblé en
   profitant du passage en revue des assets cette itération.

## Minor Issues (nice to fix)

1. Fichiers `RoadmapContent.vue` et `useLayoutDimensions.ts` toujours sans
   retour à la ligne final (`\ No newline at end of file`) — sans impact sur
   le lint configuré, mais un détail que Prettier corrigerait normalement.
2. Les warnings de sourcemap Tailwind sur `npm run generate` (déjà
   documentés depuis l'itération 1, environnementaux, non applicatifs) sont
   toujours présents — pour mémoire, rien à corriger côté code applicatif.

## Ce qui a été vérifié et confirmé sans anomalie

- Rendu à 375, 768, 1440 et 1920px sur les 5 sections : aucun chevauchement,
  aucun texte débordant.
- `prefers-reduced-motion` : testé avec l'option Playwright dédiée sur
  navigation complète (Parcours puis Projet phare) — aucune erreur, le
  scroll « Me contacter » bascule en `behavior: 'auto'` instantané au lieu du
  tween GSAP quand actif.
- Focus clavier visible sur tous les éléments interactifs testés (`outline:
  2px solid white`, confirmé par `getComputedStyle`).
- SEO généré conforme mot pour mot à `content/portfolio.md` dans le HTML
  statique (`npm run generate`).
- Navigation croisée entre sections (« Voir le détail », « Voir la
  méthode ») fonctionnelle, testée par clic réel avec vérification de l'état
  actif du menu, aucune régression.
- Clic rapide répété (8 clics en rafale) sur les flèches Roadmap : aucune
  erreur JS, verrou d'animation robuste.

## Suggestions concrètes pour une itération suivante éventuelle

1. Supprimer ou corriger les deux appels `gsap.to('.planet-container', ...)`
   morts dans `useRoadmapState.ts` (Major Issue #1) — gain rapide, quelques
   lignes, résout un défaut de console reproductible à 100% sur la
   fonctionnalité phare du site.
2. Si le temps le permet, générer une texture WebP dédiée pour l'étape 6
   (« Décision », `planet-bake-5`) plutôt que de retomber sur la texture GLB
   d'origine, pour une cohérence complète des 6 étapes.
3. Passer une fois Prettier sur l'ensemble du dépôt pour éliminer les
   dernières fins de fichier sans retour à la ligne.

## Screenshots

Sauvegardés dans `gan-harness/screenshots/` (dossier ignoré par git),
captures pertinentes à cette itération (préfixe `it3-`) :
- `it3-desktop-start.png` — Start desktop 1440px.
- `it3-desktop-roadmap-step1.png` / `it3-desktop-roadmap-step3.png` — preuve
  du fondu de texture planète (P5) entre Collecte et Extraction, planète
  visuellement intacte après compression WebP.
- `it3-arrows-disabled-state.png` — flèche Précédente visiblement désactivée
  (estompée) vs flèche Suivante active, à l'étape 1.
- `it3-mobile-375-start.png` / `it3-mobile-375-contact-settled.png` —
  aucun chevauchement H1/nav, bloc Contact pleinement visible après clic
  (946 ms mesurés).
- `it3-mobile-375-roadmap.png` — planète/contenu/timeline sans chevauchement
  à 375px.
- `it3-tablet-768-start.png`, `it3-tablet-768-roadmap.png` — rendu 768px.
- `it3-desktop-1920-roadmap.png` — rendu 1920px, trois colonnes alignées.
- `it3-desktop-parcours-1440.png` — frise Parcours, contraste inchangé.
- `it3-reduced-motion.png` — rendu sous `prefers-reduced-motion: reduce`,
  aucune erreur.
- `it3-rapid-click-result.png` — état après 8 clics rapides sur « Étape
  suivante », aucun crash, avance d'une seule étape après règlement.
