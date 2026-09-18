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

### 2.3 bis Direction artistique : générique de film (v3)
Retour de Grégoire le 18 septembre 2026 sur le run 2 : les tailles sont bonnes, mais le rendu fait « site généré par l'IA ». Fraunces, Inter, IBM Plex Mono et l'accent cuivre `#c98a4b` reproduisent la charte d'Anthropic, et c'est la v2 de cette spec qui les avait demandés. Tout ce qui suit remplace la direction « instrument de bord ».

Référence choisie par Grégoire : le film *Interstellar*. Le site doit se vivre comme un générique de film de science-fiction : beaucoup de noir, peu de texte à la fois, un rythme lent, une typographie géométrique en capitales très espacées. La planète et les étoiles sont les seules sources de couleur.

- **Typographie.** Les titres, le menu et les repères utilisent une géométrique de la famille Futura : **Jost** (Google Fonts), en capitales, graisse 300 à 400, interlettrage large (0,2 à 0,5 em selon la taille). Les affiches du film utilisent Futura et News Gothic (source : Fonts In Use). Pour le texte courant : une grotesque neutre dans l'esprit de News Gothic, **Hanken Grotesk** ou **Libre Franklin**, en bas de casse, 16 à 18 px. **Interdits** : Fraunces et toute serif, Inter, IBM Plex Mono et toute mono, Baloo 2. Les chiffres (repères « 01 / 05 », dates) sont en Jost.
- **Couleur.** Fond noir bleuté (proche de `#05070A`). Texte blanc froid (proche de `#E6ECEF`), secondaire gris acier (proche de `#8C98A3`). Si un accent est nécessaire, un seul, froid : bleu glacier pâle (proche de `#A9CBDD`). **Interdit** : toute teinte chaude (orange, cuivre, ambre, or, teinte entre 10° et 60° sur le cercle chromatique) dans l'interface. Le chaud n'existe que dans les textures de la planète.
- **Composition.** Beaucoup d'espace vide. Une idée par écran. Les titres de section en capitales espacées, petits (24 à 40 px), jamais en gras. Le texte courant tient dans une colonne étroite (45 à 60 caractères). Le texte peut être placé comme un sous-titre, dans le tiers bas de l'écran, ou comme un carton de générique, centré, quand la section s'y prête. Filets de 1 px autorisés, sans cadre ni carte à fond. Pas d'icônes.
- **Mouvement.** Lent et assumé : apparitions en fondu depuis le noir de 0,8 à 1,6 s, titres qui se révèlent en resserrant ou en élargissant leur interlettrage (effet de générique), lignes de texte en cascade. Le warp entre sections reste, plus lent. Aucun rebond, aucun effet élastique, aucun survol spectaculaire.
- **Menu latéral.** Libellés toujours visibles, en Jost capitales espacées, petits. Actif à pleine opacité avec un trait fin ; les autres à 35 %, 70 % au survol. Sur mobile, la barre compacte actuelle garde ce style.
- **Liberté.** Tu choisis la mise en scène de chaque section à l'intérieur de ces règles. Cherche ce qu'un générique de film ferait de chaque contenu : la frise Parcours comme un carton de dates, les projets comme des plans successifs, la timeline job-search comme un compte à rebours de mission. Rien ne doit rappeler un template de portfolio ni un site de produit IA.

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
