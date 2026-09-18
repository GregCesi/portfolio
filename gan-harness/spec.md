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

### 2.3 Tout tient dans l'écran, sans défilement interne
Retour de Grégoire le 18 septembre 2026 après le premier run : le défilement interne des sections se superpose aux animations. Il est supprimé.
- Chaque section tient entièrement dans la fenêtre, sans barre de défilement ni `overflow-y: auto`, à 1920 × 1080, 1440 × 900, 1280 × 720 et 768 × 1024. La molette et le tactile ne font que changer de section.
- Mobile (375 × 667) : quand une section ne tient pas, elle se découpe en sous-écrans navigables comme la roadmap (flèches, glissement horizontal, indicateur « 2 / 6 »). Parcours : une entrée de frise par sous-écran ou deux par deux. Méthode : une carte par sous-écran. Projets : un projet par sous-écran, puis le contact. Aucun texte ne se coupe ni ne se raccourcit : on découpe, on ne tronque pas.
- Clavier : flèches haut/bas, PageUp/PageDown, Home/End changent de section ; flèches gauche/droite changent de sous-écran. Focus visible sur tout élément interactif.
- `prefers-reduced-motion` : warp réduit, transitions raccourcies, planète sans rotation automatique.
- Contraste WCAG AA : 4,5:1 pour le texte courant, 3:1 pour le texte large, mesuré sur le fond réel.

### 2.3 bis Direction artistique : instrument de bord
Retour de Grégoire : le titre est trop gros, les ajouts du premier run ne sont « pas super jolis », il veut « quelque chose de plus classe ». La direction ci-dessous est fixée ; la composition de chaque section reste libre à l'intérieur.

Idée directrice : un instrument de navigation spatiale, sobre et précis. L'espace et la planète font le spectacle ; le texte est posé dessus comme des annotations d'observatoire. Références consultées : minhpham.design (WebGL tenu en retrait, GSAP au service du texte), by-kin.com (typographie éditoriale, transitions sans couture), uncommonstudio.com.au (grille assumée).

- **Typographie.** Abandonner Baloo 2 (arrondie, ludique : c'est elle qui fait « pas classe »). Trois familles Google Fonts : une serif de titrage fine (Instrument Serif ou Fraunces), une sans pour le texte (Inter ou Geist), une mono pour les libellés, numéros, dates et tags (JetBrains Mono ou IBM Plex Mono). Titres en `clamp()`, jamais au-delà de 56 px pour le titre du Hero et 40 px pour les titres de section. Texte courant 16 à 18 px, interlignage 1,5 à 1,6, largeur de ligne 60 à 70 caractères.
- **Couleur.** Fond spatial actuel. Texte blanc cassé (#EDEAE3 ou proche), texte secondaire à 60 % d'opacité. Un seul accent, chaud, pris dans les textures de la planète (ambre ou cuivre), réservé à l'élément actif et aux détails. Supprimer toutes les lueurs blanches (`light-shadow`, `light-shadow-text`, `box-shadow` blancs) et la capsule arrondie du header.
- **Composition.** Texte aligné à gauche sur une grille, pas centré. Filets de 1 px à faible opacité pour structurer. Chaque section porte un repère mono « 01 / 05 ». Les cartes à fond et bordure arrondie deviennent des lignes éditoriales séparées par des filets : numéro en mono, titre en serif, texte en sans, tags en mono.
- **Menu latéral.** Libellés toujours visibles, horizontaux, en mono capitales petites, précédés du numéro (« 01 Start »). La section active est à pleine opacité avec l'accent et un trait ; les autres sont à 40 % et passent à 70 % au survol. Sur mobile, une barre compacte en bas : numéros visibles, libellé de l'actif seul.
- **Mouvement.** À l'arrivée sur une section, les lignes de texte apparaissent en cascade (GSAP, SplitText est inclus dans GSAP 3.13). Le warp entre sections reste, plus bref et plus discret. Aucune animation qui ne serve pas la lecture.
- **Liberté.** Tu choisis la composition exacte de chaque section, les familles précises dans la liste ci-dessus et la teinte d'accent. Tu ne réintroduis pas de glow, de glassmorphism, de dégradé violet ni d'élément décoratif sans rôle.

### 2.4 SEO et partage
`useHead` / `useSeoMeta` : title, description, Open Graph, `lang="fr"`. Valeurs dans le fichier de contenu.

## 3. Hygiène
- Supprimer l'avertissement console `GSAP target .planet-container not found` (code mort dans `useRoadmapState.ts`).
- L'étape 6 référence `planet-bake-5` : fournir une texture WebP dédiée, ou pointer explicitement l'étape 6 sur `planet-bake-4` dans `app/data/content.ts`.
- Remplacer le README par défaut par un README court : ce qu'est le site, stack, commandes.
- `npm run build`, `npm run generate`, `npm run lint` et `npx nuxi typecheck` passent à 0 erreur. Console du navigateur sans erreur ni warning Vue.

## 4. Performance (si le reste est au vert)
Les assets 3D pèsent environ 29 Mo (`Planet-1.glb` 5,8 Mo, `Planet-5.glb` 7,1 Mo non référencé, textures 16 Mo). Supprimer ce qui n'est pas référencé, compresser les textures (WebP ou KTX2), charger la 3D après le premier rendu. Ne pas dégrader le rendu visible de la planète.

## 5. Hors périmètre
Backend, formulaire de contact, chat IA, internationalisation, déploiement, nouvelles pages ou routes.
