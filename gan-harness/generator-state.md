# Generator State — Iteration 001

## What Was Built

- **Contenu centralisé** (`app/data/content.ts` + `app/types/content.ts`) : reprend `content/portfolio.md` mot pour mot. Tous les composants de section, le `Header`, le `SlideMenu` et `useRoadmapState` lisent leurs textes depuis ce module (plus aucun texte en dur dans les composants).
- **Les cinq sections, ordre et correspondance de la spec** :
  1. `HeroSection` (Start) — boutons câblés : « Voir mes projets » va à la section Projets, « Me contacter » va à la section Projets puis défile jusqu'au bloc `#contact`.
  2. `AboutMeSection` (Parcours, fichier renommé depuis `AbouteMeSection.vue`) — introduction + frise verticale des 6 entrées, même langage visuel que `RoadmapTimeline` (cercles + ligne qui se trace), révélée par `IntersectionObserver` + GSAP à l'arrivée sur la section.
  3. `MethodSection` (Méthode, dossier/fichier renommés depuis `Value/ValueSection.vue`) — introduction + 4 cartes.
  4. `RoadmapSection` (Projet phare) — surtitre/titre/sous-titre ajoutés, timeline + contenu + planète existants réalimentés par les 6 étapes job-search (`content.ts`), mise en page responsive pour éviter tout chevauchement de 375 px à 1920 px (stack vertical en dessous de 1024 px, rangée timeline/contenu/planète au-delà).
  5. `ProjectsSection` (Projets, dossier/fichier renommés depuis `Solutions/SolutionsSection.vue`) — introduction + 3 cartes projet (liens/CTA conditionnels selon `href`/`cta`) + bloc Contact (`id="contact"`), éléments à marqueur `{{...}}` vide masqués (LinkedIn, CV).
- **Navigation** : composable `useAppNavigation` (provide/inject) exposant `goToSection`/`goToAnchor`, fourni par `app/pages/index.vue`.
- **Défilement et accessibilité (§2.3)** :
  - `BaseSection.vue` enveloppe désormais le contenu dans `.section-scroll-area` (overflow interne).
  - `SlideContainer.vue` : la molette et le tactile font défiler le contenu interne en premier, ne changent de section qu'en butée haute/basse ; flèches haut/bas, PageUp/PageDown, Home/End changent toujours de section ; les slides inactives reçoivent `inert` + `aria-hidden` (retirées de la tabulation et des lecteurs d'écran).
  - `usePrefersReducedMotion` (calculé de façon synchrone en `setup()`) réduit le warp du fond hyperspace, raccourcit les transitions GSAP entre sections et désactive l'auto-rotation de la planète.
  - Focus visible global (`:focus-visible`) et raccourcissement CSS générique sous `prefers-reduced-motion` ajoutés dans `app/assets/css/main.css`.
  - Panneaux de fond translucides plats (`.panel`, pas de flou/dégradé) posés derrière les blocs de texte pour garantir le contraste WCAG AA sur le fond hyperspace mouvant.
- **SEO (§2.4)** : `useSeoMeta` dans `app/pages/index.vue` (title, description, Open Graph) depuis `content.ts` ; `lang="fr"` ajouté via `nuxt.config.ts` (`app.head.htmlAttrs`). Vérifié présent dans le HTML généré (`npm run generate`).
- **Hygiène** : README remplacé par un README court (site, stack, commandes). Correction au passage : `BackgroundHyperspace.vue` contenait un `*/` orphelin en fin de fichier (fichier réécrit proprement, comportement inchangé). Lint : tous les avertissements et erreurs préexistants (any implicites, imports type-only, ref-as-operand, self-closing, ordre d'attributs) corrigés — `npm run lint` est à 0 erreur et 0 avertissement.
- **Planète responsive** : `RoadmapPlanet.vue` calcule une taille de planète selon la largeur de fenêtre (5 paliers, 190 px → 460 px) ; `Universal3DModel.vue` réagit désormais aux changements de `width`/`height` (watcher ajouté) pour que le canvas Three.js suive réellement le redimensionnement, pas seulement la boîte CSS.

## What Changed This Iteration

Première itération : pas de feedback évaluateur à traiter. Tout ce qui précède correspond aux points 2.1 à 2.4 et 3 de la spec, dans l'ordre demandé. Le point 4 (performance / compression des assets 3D) n'a pas été traité, comme demandé pour cette itération.

## Known Issues

- **Texte manquant dans `content/portfolio.md`** : `{{LINKEDIN_URL}}` et `{{CV_URL}}` ne sont pas renseignés. Conformément à la spec, les éléments correspondants (lien LinkedIn, bouton « Télécharger mon CV ») restent vides dans `app/data/content.ts` (`linkedin: ''`, `cvUrl: ''`) et donc masqués dans `ProjectsSection.vue`. Rien n'a été inventé.
- **Point 4 (performance)** non traité à cette itération sur consigne explicite (assets 3D ~29 Mo, `Planet-5.glb` non référencé toujours présent) : à faire dans une itération dédiée, avec un outil de compression en devDependency si besoin.
- **Vérification de contraste** faite par lecture de code et par échantillons de couleur (texte blanc + halo `light-shadow-text` + panneaux `.panel` translucides sur fond hyperspace majoritairement noir), pas par mesure automatisée pixel par pixel sur capture d'écran réelle. À confirmer par l'évaluateur avec Playwright.
- **`npx nuxi typecheck`** : l'environnement sandbox ne peut pas résoudre `vue-tsc` par `npx` sans dépendance locale (le registre npm sert `typescript@7.0.2`, incompatible avec `vue-tsc`, dès que `npx -p vue-tsc -p typescript` doit installer les deux à la volée). Aucune dépendance n'a été ajoutée au projet pour contourner ce point (interdit à cette itération). Le typecheck a été vérifié en installant `vue-tsc@2.2.0` + `typescript@5.9.2` dans un dossier temporaire hors dépôt (`/private/tmp/...`) et en l'exécutant contre `tsconfig.json` du projet : **0 erreur**. Si l'évaluateur relance `npx nuxi typecheck` tel quel dans un environnement avec accès réseau standard, la commande devrait fonctionner normalement (le problème vient de la résolution de version dans ce sandbox, pas du code).

## Dev Server

- URL : http://localhost:3000
- Status : en cours d'exécution (arrière-plan)
- Commande : `npm run dev -- --port 3000`

## Vérifications

- `npm run lint` → 0 erreur, 0 avertissement.
- `npm run build` → succès.
- `npm run generate` → succès (avertissements sourcemap Tailwind préexistants, sans rapport avec le code applicatif).
- `npx nuxi typecheck` → voir « Known Issues » ci-dessus ; vérifié 0 erreur via un vue-tsc pinné hors dépôt.
