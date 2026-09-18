# Generator State — Iteration 002

## What Was Built

Voir `gan-harness/generator-state.md` (historique, itération 001, conservé dans
git log) pour l'implémentation initiale des cinq sections, de la navigation,
de l'accessibilité et du SEO. Cette itération corrige les quatre points
bloquants relevés par `gan-harness/feedback/feedback-1.md` (note 4,5/10).

## What Changed This Iteration

- **Fixed — bouton « Me contacter » cassé** (`app/pages/index.vue`,
  `app/components/SlideContainer.vue`) : `scrollToAnchor()` n'utilise plus
  `Element.scrollIntoView()` (qui remontait aussi `.overflow-hidden`, piloté
  par transform GSAP, et additionnait les deux décalages). Il calcule
  désormais lui-même le `scrollTop` cible de la zone défilante interne
  (`.section-scroll-area`, via `closest()` + différence de
  `getBoundingClientRect()`) et l'anime avec `Element.scrollTo()`. Cet appel
  est déclenché par un nouvel événement `section-settled`, émis par
  `SlideContainer.goTo()` dans le `onComplete` du timeline GSAP (donc une fois
  la transition de section totalement terminée), et non plus au milieu de
  l'animation comme le faisait l'ancien `section-change` utilisé à double
  usage. `section-change` (mise à jour de l'index actif, accélération des
  étoiles) garde son timing d'origine, inchangé, pour ne pas régresser ce qui
  fonctionnait déjà.
- **Fixed — avertissement Vue en boucle** (`app/pages/index.vue`) : suppression
  de `:container="slideRef"` passé à `<SlideMenu>`, prop jamais déclarée ni
  utilisée par le composant.
- **Fixed — chevauchement H1/nav mobile à 375×667** :
  - `app/composables/useLayoutDimensions.ts` : le nav mobile horizontal
    (`[data-mobile-nav]`, ajouté dans `SlideMenu.vue`) est désormais positionné
    dynamiquement juste sous le Header réel (`headerRect.bottom + 16px`) au
    lieu du `top-24` fixe codé en dur (TODO historique résolu). Le
    `padding-top` appliqué à `.section-viewport` sur mobile inclut maintenant
    la hauteur réelle de ce nav en plus du Header, pas seulement le Header.
  - `app/components/sections/BaseSection.vue` : repli CSS (`padding-top: 150px`
    sous 768px) pour la fenêtre avant hydratation, en plus de la valeur
    précise calculée en JS.
  - `app/components/sections/Hero/HeroSection.vue` : cause plus profonde
    trouvée en testant — le conteneur de contenu utilisait `h-full` +
    `justify-center` à l'intérieur d'un ancêtre `overflow-y:auto`
    (`.section-scroll-area`). Sur les petits écrans, le contenu (H1 + texte +
    boutons) dépassait la hauteur disponible ; le centrage flex le faisait
    déborder symétriquement au-dessus **et** en dessous de la zone visible, et
    la portion du haut était tronquée par l'`overflow` (visible dans une
    capture d'écran de vérification : le haut du H1 était coupé net contre le
    nav, alors même que le padding-top calculé était correct). Remplacé
    `h-full` par `min-h-full` (+ `py-6`) : le conteneur peut désormais
    grandir au-delà de la hauteur disponible plutôt que de se centrer en
    débordant, donc plus de troncature, contenu pleinement scrollable et
    visible du début à la fin.
  - Vérifié par script Playwright indépendant (scratchpad, hors dépôt) : plus
    aucun chevauchement de zones géométriques ni de troncature visuelle à
    375×667, capture d'écran à l'appui.
- **Fixed — contraste frise Parcours** (`app/components/sections/AboutMe/AboutMeSection.vue`) :
  `.about__content` (bloc period/place/role/detail par entrée de frise) a
  désormais un fond translucide dédié `rgba(0,0,0,0.65)` (plus opaque que le
  `.panel` générique à 0.4, car ce texte est en opacité réduite) ;
  `.about__period` et `.about__detail` passent de 0.65 à 0.85 d'opacité et
  reçoivent `light-shadow-text`. Calcul vérifié à la main (formule de
  contraste WCAG) pour tenir ≥ 4,5:1 même face à un pixel de fond proche du
  blanc pur (255,255,255) balayé par une traînée d'étoile, pas seulement face
  à la moyenne sombre du fond hyperspace.
- **Cleanup (P6)** : les 8 fichiers de reformatage Prettier laissés en working
  tree par l'itération précédente (diffs vérifiés — virgules finales,
  indentation, aucun changement de logique) sont inclus dans le commit de
  cette itération. `.playwright-mcp/` et `gan-harness/screenshots/` (artefacts
  d'évaluation, captures d'écran) ajoutés à `.gitignore` : ce sont des preuves
  de session de test, pas du code ni des rapports durables.
  `gan-harness/feedback/feedback-1.md`, lui, est committé (rapport texte,
  petit, fait partie de l'historique du processus GAN).

## Known Issues

- Inchangé depuis l'itération 1 : `{{LINKEDIN_URL}}` / `{{CV_URL}}` vides dans
  `content/portfolio.md` → lien LinkedIn et bouton CV toujours absents du DOM
  (masquage conforme à la spec, rien inventé). Point 4 de la spec
  (performance / compression des assets 3D) toujours non traité, hors
  périmètre de cette itération de correction ciblée.
- `npx nuxi typecheck` échoue dans ce sandbox pour une raison d'environnement
  (résolution `vue-tsc`/`typescript` par npx, `ERR_PACKAGE_PATH_NOT_EXPORTED`
  sur `typescript/package.json`), non liée au code — déjà documenté à
  l'itération 1. Revérifié cette itération avec `vue-tsc@2.2.0` +
  `typescript@5.9.2` épinglés hors dépôt (`/private/tmp/...`) contre le
  `tsconfig.json` du projet : **0 erreur**.
- Issues « Major »/« Minor » de `feedback-1.md` non explicitement demandées
  pour cette itération (ex. `user-select: none` global empêchant la
  sélection de texte, y compris l'e-mail de contact) : non traitées ici,
  volontairement, pour rester strictement dans le périmètre des 4 points
  bloquants + hygiène demandés.

## Dev Server

- URL : http://localhost:3000
- Status : en cours d'exécution (arrière-plan, `nohup npm run dev -- --port 3000`)
- Commande : `npm run dev -- --port 3000`

## Vérifications

- `npm run lint` → 0 erreur, 0 avertissement.
- `npm run build` → succès.
- `npm run generate` → succès (avertissements sourcemap Tailwind préexistants,
  sans rapport avec le code applicatif).
- `npx nuxi typecheck` → échec d'environnement documenté ci-dessus ; 0 erreur
  confirmée via `vue-tsc` pinné hors dépôt.
- Vérification Playwright indépendante (scratchpad, hors dépôt, package
  `playwright` installé de façon isolée) : aucun warning/erreur console (dev,
  desktop 1440×900 et mobile 375×667, chargement initial + navigation dans
  les 5 sections) hormis le message GPU `GL Driver Message ... ReadPixels`
  déjà documenté comme non bloquant (environnement headless) ; bouton
  « Me contacter » fonctionnel desktop et mobile (bloc Contact visible dans
  le viewport après clic) ; aucun chevauchement H1/nav à 375×667.
