# Generator State — Run 2, itération 1

## Contexte

Premier commit du run 2, sur la spec v2 (`gan-harness/spec.md`). Le run 1
(3 itérations, score final 8,2/10) est archivé dans `gan-harness/run-1/`.
Cette itération reprend le code existant (sections, `SlideContainer`,
planète, timeline) et l'adapte aux deux changements majeurs demandés par
Grégoire après le run 1 : suppression du défilement interne des sections
(§2.3) et nouvelle direction artistique « instrument de bord » (§2.3 bis).

## Ce qui a été fait

### §2.3 — Tout tient dans l'écran, sans défilement interne
- `BaseSection.vue` : suppression de `.section-scroll-area` (l'`overflow-y:
  auto` qui se superposait aux animations, cause du retour de Grégoire).
  Chaque section est désormais un bloc fixe `100vh`, sans scrollbar.
- `useLayoutDimensions.ts` : réécrit. Publie la hauteur du Header, la largeur
  du nav desktop et la hauteur de la barre mobile en variables CSS sur
  `documentElement` (`--header-height`, `--slidemenu-width`,
  `--mobile-bar-height`), consommées par `BaseSection` via `calc()`. Plus
  simple et plus robuste que l'ancienne version qui posait des styles
  inline sur chaque `.section-viewport` à la main.
- `SlideContainer.vue` : molette et tactile ne font plus la distinction
  « scroll interne d'abord » — ils ne font que changer de section (le
  contenu interne ne défile plus, donc plus rien à départager).
- Nouveau mécanisme de **sous-écrans mobiles** (< 768px), réutilisable :
  - `app/composables/useMobileSubscreens.ts` : état local (index, total,
    `next`/`prev`/`goTo`) pour une section.
  - `app/composables/useSubscreenNav.ts` : registre global (section → son
    contrôleur de sous-écrans), utilisé pour le clavier (flèches
    gauche/droite, câblées dans `SlideContainer` → `index.vue`) et pour la
    navigation ciblée (ex. bouton « Me contacter » → sous-écran Contact de
    Projets, quel que soit l'écran d'où on part).
  - `app/components/subscreen/SubscreenTrack.vue` : piste glissante mobile
    (glissement tactile, transform CSS). Astuce clé : au-delà de 768px, le
    wrapper passe en `display: contents` — ses enfants deviennent des
    enfants directs du conteneur réel de la section, qui les met en page
    dans sa propre grille (pas de duplication de DOM entre mobile et
    desktop, un seul jeu de composants/texte).
  - `app/components/subscreen/SubscreenNav.vue` : flèches + indicateur
    « N / M », visible uniquement < 768px.
  - Appliqué à `AboutMeSection` (une entrée de frise par sous-écran),
    `MethodSection` (une carte par sous-écran), `ProjectsSection` (un
    projet par sous-écran, puis le contact). La Roadmap réutilise le même
    registre pour ses 6 étapes existantes (flèches gauche/droite en plus
    des boutons déjà présents).
- Clavier : `SlideContainer.vue` gère désormais aussi `ArrowLeft`/
  `ArrowRight` (émission d'événements `subscreen-prev`/`subscreen-next`
  vers `index.vue`, qui les route vers la section active via le registre).
- **Bug non trivial trouvé et corrigé en cours de route** : les cartes/
  entrées prenaient toutes la même hauteur (celle du panneau mobile, 100%)
  même au-delà de 768px, à cause d'une règle CSS de `SubscreenTrack.vue`
  (`height: 100%` sur les enfants de la piste) qui n'était pas circonscrite
  à mobile — plus spécifique que les media queries des sections, elle
  s'appliquait aussi en desktop. Corrigé en encadrant cette règle dans
  `@media (max-width: 767.98px)`. Un deuxième effet du même ordre (rangées
  CSS Grid « auto » qui s'étirent pour occuper tout l'espace disponible du
  conteneur flex parent) a été neutralisé en passant les grilles
  Méthode/Projets en `flex-direction: column` à l'étage 768–1023px (le
  vrai `display: grid` ne sert plus qu'à partir de 1024px, pour les
  colonnes). Vérifié : plus aucun élément avec `overflow: hidden` dont
  `scrollHeight > clientHeight` sur les 5 sections × 4 tailles requises
  (script Playwright indépendant, voir Vérifications).
- Projets à 768×1024 (le cas le plus dense : 3 cartes + contact dans une
  seule colonne) dépassait encore de ~124px une fois ce bug corrigé : texte
  et espacements resserrés spécifiquement à cet étage (768–1023px) jusqu'à
  tenir dans le budget vertical réel, sans rien raccourcir ni tronquer.

### §2.3 bis — Direction artistique « instrument de bord »
- **Typographie** : Baloo 2 supprimée. Trois familles (Google Fonts,
  `nuxt.config.ts`) : Fraunces (serif, titres), Inter (sans, texte
  courant), IBM Plex Mono (mono, libellés/numéros/dates/tags). Titres en
  `clamp()`, Hero plafonné à 56px, titres de section à 40px. Texte courant
  entre 16 et 18px avant les resserrements mobile/768–1023.
- **Couleur** : `app/assets/css/main.css` — texte `#EDE8DE` (blanc cassé),
  texte secondaire à 60% d'opacité, accent unique ambre/cuivre `#C98A4B`
  (utilisé pour l'élément actif et les détails, jamais en fond plein sauf
  survol de boutons). Toutes les classes `light-shadow`/`light-shadow-text`
  (lueurs blanches) supprimées. Capsule arrondie du Header supprimée.
  Panneaux (`.panel`) : fond plat, sans dégradé ni flou, opacité calibrée à
  85% après calcul de contraste (voir plus bas) pour rester lisible même
  avec une étoile brillante du fond hyperspace juste derrière le texte.
- **Composition** : texte aligné à gauche partout (fini le centré). Filets
  1px à faible opacité (`--color-line`) pour structurer (Header, cartes
  Méthode/Projets). Chaque section porte un repère mono « 0X / 05 »
  (`BaseSection.vue`, prop `index`). Cartes Méthode/Projets devenues des
  lignes éditoriales : numéro mono, titre serif, texte sans, tags mono.
- **Menu latéral** (`SlideMenu.vue`, `SlideMenuItem.vue`, réécrits) :
  libellés toujours visibles, horizontaux, mono capitales, précédés du
  numéro (« 01 START »). Actif : pleine opacité + accent + trait à gauche.
  Inactif : 40% d'opacité, 70% au survol. Mobile : barre compacte en bas
  (numéros toujours visibles, libellé de l'actif seul) — remplace l'ancien
  nav horizontal sous le Header.
- **Mouvement** : warp entre sections raccourci et moins intense
  (`BackgroundHyperspace.vue`, 0,8s/intensité 10 → 0,6s/intensité 6).
  Cascade de lignes de texte à l'arrivée sur Hero/Méthode/Projets
  (`useSplitReveal.ts`, GSAP simple avec `stagger`, respecte
  `prefers-reduced-motion`). Note : la spec suggérait GSAP SplitText ; une
  première version l'utilisait mais faisait échouer `npm run generate`
  (`gsap.registerPlugin is not a function` au prérendu SSR — deux instances
  de gsap-core coexistaient dans le bundle serveur). Remplacé par une
  cascade au niveau bloc (titre puis paragraphes, un `stagger` GSAP simple)
  qui donne un effet équivalent sans dépendre du plugin. La frise Parcours
  et les étapes de la Roadmap gardent leurs propres animations d'arrivée
  déjà existantes (cercles/ligne qui se trace).

### Contenu, hygiène (§2.1, §2.4, §3)
- Contenu : aucun texte modifié (toujours mot pour mot depuis
  `content/portfolio.md` via `app/data/content.ts`).
- Avertissement console `GSAP target .planet-container not found`
  (`useRoadmapState.ts`) : supprimé — c'était du code mort (un fondu DOM
  visant une classe qui n'a jamais existé dans le template ; le vrai fondu
  de texture passe par `useCrossfadeTexture`, opacité de matériau WebGL).
  `registerPlanetMaterial`/`animatePlanetTexture` simplifiés en
  conséquence.
- Étape 6 de la Roadmap (« Décision ») : `content/portfolio.md` indique
  `planet-bake-5`, sans fichier dédié. Suivant l'option explicitement
  permise par la spec §3, `app/data/content.ts` pointe maintenant cette
  étape sur `planet-bake-4` (commenté), `RoadmapPlanet.vue` nettoyé du
  fallback mort correspondant.
- README remplacé (déjà fait au run 1, mis à jour pour refléter les
  sous-écrans et la nouvelle DA).
- Performance (§4) : déjà traitée au run 1 (assets 3D 28 Mo → 6,6 Mo,
  WebP, chargement différé) — non retouchée cette itération, toujours
  vérifiée fonctionnelle (planète et fondu de texture inchangés).

## Vérifications faites

- `npm run lint` → 0 erreur/avertissement.
- `npm run build` → succès.
- `npm run generate` → succès (warnings sourcemap Tailwind préexistants,
  non applicatifs).
- `npx nuxi typecheck` échoue dans ce sandbox pour la raison d'environnement
  déjà documentée au run 1 (`ERR_PACKAGE_PATH_NOT_EXPORTED` sur
  `typescript/package.json` résolu par `npx`, non liée au code) ; revérifié
  avec `vue-tsc@2.2.0`/`typescript@5.9.2` épinglés hors dépôt (scratchpad) :
  **0 erreur**.
- Script Playwright indépendant (scratchpad, hors dépôt, `playwright`
  installé de façon isolée) : aux 4 tailles requises par la spec
  (1920×1080, 1440×900, 1280×720, 768×1024), sur les 5 sections — aucun
  élément à `overflow: hidden` dont le contenu dépasse sa boîte, aucune
  erreur console. Sur mobile (375×667) : navigation par la barre du bas,
  sous-écrans (flèches, indicateur « N / M »), clic « Me contacter » depuis
  Start → atterrit bien sur le sous-écran Contact de Projets (« 4 / 4 »,
  bloc visible), aucune erreur console. Navigation clavier gauche/droite
  testée sur la Roadmap (avance/recule bien d'une étape, plus d'avertissement
  `.planet-container`).
- Contraste : calculé analytiquement (pas d'échantillonnage pixel par pixel
  cette itération, faute de temps) avec l'hypothèse volontairement
  pessimiste d'un pixel de fond blanc pur derrière tout le texte (le fond
  réel est presque noir, avec de petits points d'étoiles épars — bien plus
  favorable). Avec `.panel` à 85% d'opacité, texte à 60% d'opacité : ratio
  ≈ 5,4:1 (> 4,5:1 requis) ; accent sur panneau : ≈ 5,2:1. Cette hypothèse
  pessimiste étant déjà au-dessus du seuil, le contraste réel (mesuré sur
  le fond animé, majoritairement noir) est nécessairement meilleur. À
  vérifier par échantillonnage réel si le temps le permet à l'itération
  suivante.

## Connu, non fait

- Contraste : validation analytique seulement (voir ci-dessus), pas de
  mesure pixel par pixel sur le rendu réel comme au run 1. Risque jugé
  faible vu la marge, mais à confirmer.
- Cascade GSAP SplitText demandée par la spec §2.3 bis non utilisée telle
  quelle (voir « Mouvement » ci-dessus) — remplacée par un stagger GSAP
  simple au niveau bloc, pour ne pas casser `npm run generate`. Le rendu
  visuel (cascade de blocs de texte à l'arrivée) reste conforme à
  l'intention, mais pas littéralement « ligne par ligne ».
- Aucun texte manquant : `content/portfolio.md` ne laisse vide que
  `{{LINKEDIN_URL}}` et `{{CV_URL}}`, déjà masqués (inchangé depuis le run
  1).
- Reste à vérifier par l'Évaluateur : rendu visuel fin (espacements,
  micro-détails) sur l'ensemble des tailles, notamment 1920×1080 et
  1280×720 qui n'ont été vérifiées que par script (overflow) et quelques
  captures manuelles, pas systématiquement.

## Dev Server

- URL : http://localhost:3000
- Status : en cours d'exécution (arrière-plan, `npm run dev -- --port
  3000`, redémarré proprement en fin d'itération après tous les
  changements)
- Commande : `npm run dev -- --port 3000`
