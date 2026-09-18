# Spec · Refonte IA du portfolio de Grégoire MARCHAND

## 0. Cadre, à lire avant tout

- **Projet existant.** Dépôt Nuxt 4 déjà en place, branche `ia-refonte`. Ne rien scaffolder, ne pas recréer de projet, ne pas changer de framework. Stack imposée : Nuxt 4, Vue 3, TypeScript strict, Tailwind 4, GSAP, Three.js. Aucune nouvelle dépendance npm, sauf un outil de compression d'assets en devDependency si tu traites le point 6.
- **Périmètre disque.** Ne lis et n'écris que dans ce dépôt. Aucun fichier hors du dossier du projet, aucun autre dépôt, aucun dossier voisin, même pour t'inspirer.
- **Contenu.** Tout texte visible vient de `content/portfolio.md`, mot pour mot. Tu n'écris, ne reformules, ne traduis et n'ajoutes aucun texte. Les seules exceptions sont listées en fin de ce fichier de contenu. Si un texte te semble manquer, laisse l'emplacement vide et note-le dans `gan-harness/generator-state.md`.
- **Objectif.** Un portfolio vitrine qui montre ce que Grégoire sait faire. L'effet « wow » 3D est voulu et doit rester : fond hyperspace, planète 3D à textures changeantes, transitions GSAP entre sections.
- **Git.** Un commit par itération, sur `ia-refonte`. Ne jamais toucher `main` ni `develop`, ne jamais pousser.

## 1. Ce qui existe et se garde

Lu dans le code le 18 septembre 2026.

- `app/layouts/default.vue` : `BackgroundHyperspace` (canvas, `app/graphics/background/*`) + `Header`.
- `app/pages/index.vue` : 5 sections plein écran dans `SlideContainer` (navigation molette et tactile par GSAP, défilement natif bloqué), `SlideMenu` latéral, bus d'événements `$emitter` (`accelerate-stars` à chaque changement de section).
- `app/components/sections/BaseSection.vue` : gabarit 100vh qui tient compte du header et du menu (`useLayoutDimensions`).
- Roadmap : `RoadmapTimeline` (cercles et ligne animée GSAP), `RoadmapContent` (titre, deux paragraphes, flèches), `RoadmapPlanet` (GLB `Planet-1.glb`, fondu de textures `useCrossfadeTexture`), état partagé `useRoadmapState` (steps en dur, type `Step` dans `app/types/roadmap.ts`).
- Composables 3D réutilisables : `app/composables/3d/*`, composants `Universal3DModel`, `Simple3DModel`.

À garder et à réutiliser : fond hyperspace, SlideContainer, SlideMenu, Header, planète et fondu de textures, mécanique de la timeline. Tu peux les corriger et les améliorer, pas les remplacer par autre chose.

## 2. Ce qui doit changer

### 2.1 Contenu centralisé
- Crée `app/data/content.ts`, typé, qui reprend `content/portfolio.md` à l'identique. Tous les composants lisent leurs textes depuis ce module. `useRoadmapState` prend ses steps depuis ce module (6 étapes job-search, textures indiquées dans le fichier de contenu).
- Header : sous-titre « Ingénieur logiciel · IA ». Libellés du SlideMenu : ceux du fichier de contenu.

### 2.2 Les cinq sections (ordre et correspondance)
1. **Start** (`HeroSection`) : titre, texte, deux boutons câblés (`goTo` vers la section 5, et vers le bloc Contact). Les boutons actuels ne font rien : corriger.
2. **Parcours** (`AboutMe`, renommer le fichier en `AboutMeSection.vue`) : introduction + frise verticale de 6 entrées, dans le même langage visuel que `RoadmapTimeline` (cercles, ligne qui se trace à l'arrivée sur la section).
3. **Méthode** (`ValueSection`, renommer en `MethodSection` si utile) : introduction + 4 cartes.
4. **Projet phare** (`RoadmapSection`) : surtitre, titre, sous-titre, puis la timeline 6 étapes + contenu + planète existants, alimentés par les nouvelles étapes. Mettre en page timeline, contenu et planète pour qu'ils ne se chevauchent pas, de 375 px à 1920 px.
5. **Projets** (`SolutionsSection`, renommer en `ProjectsSection` si utile) : introduction + 3 cartes projet + bloc Contact. Les éléments portant un marqueur `{{...}}` vide sont masqués.

### 2.3 Défilement et accessibilité
- Une section dont le contenu dépasse la hauteur de l'écran (frise, cartes, surtout sur mobile) doit défiler en interne : la molette et le tactile font d'abord défiler le contenu, et ne changent de section qu'arrivés en butée haute ou basse. Aucun contenu ne doit être inatteignable.
- Clavier : flèches haut/bas, PageUp/PageDown, Home/End changent de section. Tous les boutons et liens sont atteignables à la tabulation avec un focus visible.
- `prefers-reduced-motion` : warp réduit, transitions raccourcies, planète sans rotation automatique.
- Contraste WCAG AA : 4,5:1 pour le texte courant, 3:1 pour le texte large, mesuré sur le fond réel (étoiles, planète).

### 2.4 SEO et partage
`useHead` / `useSeoMeta` : title, description, Open Graph, `lang="fr"`. Valeurs dans le fichier de contenu.

## 3. Hygiène
- Remplacer le README par défaut par un README court : ce qu'est le site, stack, commandes.
- `npm run build`, `npm run generate`, `npm run lint` et `npx nuxi typecheck` passent à 0 erreur. Console du navigateur sans erreur ni warning Vue.

## 4. Performance (si le reste est au vert)
Les assets 3D pèsent environ 29 Mo (`Planet-1.glb` 5,8 Mo, `Planet-5.glb` 7,1 Mo non référencé, textures 16 Mo). Supprimer ce qui n'est pas référencé, compresser les textures (WebP ou KTX2), charger la 3D après le premier rendu. Ne pas dégrader le rendu visible de la planète.

## 5. Hors périmètre
Backend, formulaire de contact, chat IA, internationalisation, déploiement, nouvelles pages ou routes.
