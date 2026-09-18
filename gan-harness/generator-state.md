# Generator State — Run 3, itération 3 (dernière)

## Ce qui change (réponse au feedback-2 : P4/P7 en échec, P5 conditionnel)

- **P4/P7, sous-écran Projets 3/5 (rag-eval-scifact).** Cause : le grand chiffre
  « 02 » et son filet. Décision P1 : les chiffres 01-04 (Méthode) et 01-03
  (Projets) ne figurent pas dans la liste des libellés d'interface autorisés,
  ils sont **supprimés partout** (mobile et desktop). Un filet de 1 px (ornement,
  aucun texte) ouvre chaque carton à la place. `align-items: safe center` sur les
  plans (un contenu trop haut s'aligne en haut, jamais coupé des deux côtés),
  interlignes et espacements resserrés sur mobile (texte toujours à 16 px).
  RAG à 375x667 : contenu y=107..545 dans un cadre y=90..562 (marge 17 px),
  « Voir le code » cliquable (`elementFromPoint` renvoie le lien).
- **Découpage automatique des petits écrans (Projets).** Un projet dont le
  contenu dépasse le cadre moins 28 px est découpé en deux plans (titre, accroche,
  tags, lien / puis le texte), mesuré au montage, au chargement des polices et au
  redimensionnement. À 360x640 et 375x568, 320x568 : RAG en deux plans (« N / 6 »),
  rien n'est réduit ni tronqué. « Me contacter » vise le dernier plan
  (`goTo` borne l'index ; `Number.POSITIVE_INFINITY` côté Hero). Le nombre de
  plans peut donc varier, l'index reste borné.
- **Projet phare sur écran < 620 px de haut.** La planète est masquée pendant
  les étapes (elle reste sur l'introduction) : sinon le texte de l'étape 3
  passait sous la barre de menu à 375x568 et 320x568.
- **P5, fondu au clic.** `useRoadmapState.selectStep` (jalon desktop, segment
  mobile, flèches gauche/droite en sous-écran) appelle `goToStepAnimated` : fondu
  du texte, de la ligne et de la texture de la planète. Verrou pendant le fade-out
  (~0,45 s) avec file d'une entrée (la dernière demande gagne, texte laissé masqué
  entre les deux). Un saut de plusieurs étapes recale toutes les lignes de la
  frise (cascade). Depuis l'introduction mobile, le texte est masqué avant
  l'étape (aucun flash de l'ancienne). `RoadmapPlanet` : une demande reçue pendant
  un fondu de 2 s est retenue et enchaînée (avant : ignorée avec un
  `console.warn` et nom de texture désynchronisé).
- **Plans découvrables (desktop).** Choix le plus sûr : molette, PageDown et
  flèches haut/bas continuent de changer de section (spec §2.3, tests). Ajouts :
  indicateur « N / M » en pleine lumière et flèches plus grandes, flèche suivante
  qui respire lentement (opacité 1 à 0,7, coupée en mouvement réduit), glissement
  horizontal de la molette / du pavé tactile = plan suivant/précédent (délai 0,8 s).
  Aucun texte ajouté.
- **P6.** `ReadingZones.ts` (reformatage Prettier) et `feedback-2.md` commités.
- **Autres.** Lien Google Fonts : Hanken Grotesk 500 retiré (inutilisé).
  « Étape N » de la frise 11 -> 12 px. README : `nuxi typecheck` documenté comme
  dépendant du cache npx (fragile), pas comme cassé.
- Non fait : auto-hébergement des polices (hors dépôt, réseau), ajustement de
  `FADE` / `MIN_LIGHT` de ReadingZones (marge de contraste trop faible : menu à
  0,55 mesure 5,41:1, monter `MIN_LIGHT` le ferait passer sous 4,5:1).

## Vérifications (résultats)

- `npm run lint` 0 erreur, 0 avertissement ; `npm run build` 0 ; `npm run generate` 0
  (relancés après le dernier changement de code).
- `npx nuxi typecheck` : **rouge dans cet environnement** (`ERR_PACKAGE_PATH_NOT_EXPORTED`,
  cache `~/.npm/_npx/cb6709e40eb1fb08`, hors dépôt, vue-tsc/typescript non déclarés).
  Substitut : `vue-tsc@3` + `typescript@5.9` hors dépôt sur `.nuxt/tsconfig.{app,server,shared,node}.json` :
  0 erreur x 4 (il a détecté un vrai type en cours de route dans SlideContainer, corrigé).
- Console : 0 erreur, 0 warning Vue (1440 clavier, roadmap, molette latérale,
  375 tactile, tous les sous-écrans). Un warning d'hydratation vu une fois venait
  d'un serveur de dev périmé après édition de gabarit : disparu après relance.
- Sous-écrans mobiles vérifiés un par un (script : chaque élément textuel contre le
  cadre `.subtrack`, le haut de la navigation, l'en-tête, la fenêtre, et
  `elementFromPoint`) : 375x667 (25 sous-écrans : Hero 1, Parcours 7, Méthode 5,
  Projet phare 7, Projets 5), puis 375x568, 360x640, 320x568 (Projets à 6 plans) :
  0 débordement, 0 élément recouvert, 0 coupé. Marge basse minimale du RAG
  à 375x667 : 17 px au-dessus, 17 px au-dessous.
- Tenue à l'écran (`section-viewport` / `section-inner`, scrollHeight/clientHeight) :
  1920x1080 1080/1080, 963/963 ; 1440x900 900/900, 783/783 ; 1280x720 720/720,
  603/603 ; 768x1024 1024/1024, 915/915 ; 375x667 667/667, 516/516 ; largeur
  identique, chaque plan Méthode/Projets aux 4 tailles desktop, aucun bloc hors
  fenêtre, aucun recouvert. Plan RAG à 1280x720 : 83 px libres avant la navigation
  (65 avant).
- Contraste au pire pixel (texte transparent, fond échantillonné) : 1920, 1440,
  1280, 768, 375 : **5,41:1** minimum sur les cinq (libellés de menu à 55 % et
  flèche désactivée), 0 rectangle sous le seuil.
- Roadmap (1440x900 et 375x667) : clic jalon/segment 1->4->2->6->1, clics rapides
  3 puis 5, trois flèches gauche rapides : à chaque fois le texte et la texture
  suivent (couleur moyenne du disque : rouge 54,25,11 / ocre 58,41,19 / vert
  50,56,25 / vert-bleu 30,55,21), lignes de la frise recalées.

## Points de doute

1. Le `nuxi typecheck` littéral reste rouge chez le générateur (vert chez
   l'evaluator, cache npx différent).
2. Découpage dynamique : un contenu dont la hauteur est mesurée dépend des polices ;
   remesuré au chargement des polices.
3. Plans desktop : la molette ne change pas de plan, seulement de section
   (invite visuelle plutôt que comportement, conforme à §2.3).

## Dev Server

- URL : http://localhost:3000, en cours d'exécution (relancé après build/generate).
- Commande : `npm run dev -- --port 3000`

---

# Generator State — Run 3, itération 2

## Ce qui change (réponse au feedback-1, P9 à 5,0/10)

- **P9, suppression de tout voile.** `.scrim` (classe, CSS, `--scrim-x` renommé
  `--pad-x`) et les trois voiles fixes du layout (`veil--top/menu/bar`) sont
  supprimés. Le fond est un noir continu. Le contraste AA est obtenu par le
  canvas : `app/graphics/background/ReadingZones.ts` mesure dans le DOM les
  boîtes des blocs de texte visibles (`h1, h2, h3, p, li, a, button,
  .subnav__indicator`, toutes les 40 ms, à chaque image pendant les 3 s qui
  suivent un warp) et `StarsField` éteint chaque étoile et chaque tronçon de
  traînée (24 px, luminosité de l'extrémité la plus sombre) selon sa distance
  au texte : luminosité 0,07 contre le texte, retour à 1 sur 130 px (smoothstep,
  aucune arête). Aucun rectangle : le noir de fond est partout identique, les
  étoiles s'éclaircissent seulement quand on s'éloigne du texte.
- **Bug mobile du voisin.** Disparu avec le scrim (plus de `::before` qui
  déborde). Contrôle : plus aucun mot grisé en bout de ligne.
- **Tailles.** `--fs-body` plancher 16 px (18 px à 1080 de haut, 17 px à 900).
  Parcours (lieu, rôle, détail) passe à `--fs-body` (16 px et plus, y compris
  à 375 et 768). Étiquettes Jost (période, tags, liens) 12 à 13 px, ce sont des
  repères. Mesuré : 16/17/18 px partout sur le texte courant.
- **Mise en scène (spec §2.3 bis).**
  - Méthode et Projets sont joués en plans successifs sur desktop aussi :
    `SubscreenTrack` a un mode `stage` (>= 768 px : un plan à la fois, fondu
    0,9 s + léger glissement vertical, plans non actifs `visibility: hidden`
    et `aria-hidden`), `SubscreenNav` a un mode `persistent` (flèches et
    « N / M » visibles sur desktop pour ces deux sections ; clavier gauche/droite
    déjà câblé). Méthode : titre + introduction, puis un carton par plan
    (grand chiffre Jost 300, filet 1 px, titre, texte centré, 27 rem). Projets :
    titre + introduction, un plan par projet (chiffre, nom, accroche, texte,
    tags, lien), puis le contact. Colonnes déséquilibrées : sans objet (plus de
    colonnes). Les plans ne se recouvrent jamais : rien ne défile, rien ne
    se coupe (tenue vérifiée, voir plus bas). Les plans se remettent au premier
    plan 1,3 s après avoir quitté la section (retour comme au début d'un film) ;
    une arrivée ciblée (« Me contacter » va au plan Contact) annule le retour.
  - Parcours : carton de dates sur 3 colonnes x 2 rangées (>= 1024 px), 2 x 3
    à 768 px, chaque entrée porte son point et son filet qui se trace (plus de
    six colonnes de 160 px). Frise complète en ~4 s au lieu de ~6,5 s.
  - Menu : 55 % au repos au lieu de 60 % (le seuil AA le permet maintenant :
    pire pixel 5,38:1 avec étoile éteinte). 35 % reste impossible (2,8:1 même
    sur noir pur). À 768 px le menu est compact (sans chiffres, trait court,
    marge 16 px) : la colonne de contenu gagne 70 px (510 -> 580 px).
- **Rythme.** Délai de départ des révélations 0,55 -> 0,4 s, cascade resserrée.
- **Timeline Projet phare.** Chaque jalon (point + « Étape N » + titre) est un
  vrai `<button>` : clic ou clavier va à l'étape.
- **Hygiène.** `.eslintignore` (obsolète, provoquait l'avertissement ESLint)
  remplacé par `ignores: ['.history']` dans `eslint.config.mjs`. README mis à jour
  (plus de mention de voile ; « aucune carte ni voile » est désormais vrai).
- **Typecheck littéral.** `npx nuxi typecheck` reste rouge : nuxi ne trouve pas
  `vue-tsc` dans le dépôt (ce n'est pas une dépendance, `resolveModulePath` de
  `vue-tsc/bin/vue-tsc.js` échoue) et retombe sur `npx -p vue-tsc -p typescript`
  dont le cache `~/.npm/_npx` (hors dépôt) contient un `typescript` incompatible
  (`ERR_PACKAGE_PATH_NOT_EXPORTED`). `typescript` 5.9 est présent dans le dépôt
  (dépendance transitive), pas `vue-tsc`. Seule issue propre : ajouter `vue-tsc`
  en devDependency, ce que la spec n'autorise pas ; non fait, à trancher par
  Grégoire. Substitut équivalent : `vue-tsc@3` + `typescript@5.9` installés dans
  le dossier temporaire de session (hors dépôt), lancés sur
  `.nuxt/tsconfig.{app,server,shared,node}.json` : 0 erreur sur les quatre.

## Choix et points de doute

1. **Plans successifs sur desktop.** Choix de mise en scène assumé pour tenir
   « une idée par écran » et 16 px partout ; le contenu reste tout dans le DOM.
   Doute : un évaluateur qui compte la lecture « d'un coup » pourrait juger que
   Méthode et Projets ne « tiennent » plus dans l'écran (ils tiennent, plan par
   plan, comme la roadmap).
2. **Texte en cours de fondu.** Pendant le warp, le texte qui apparaît a une
   opacité < 1 (fondu depuis le noir voulu par la spec) : sa mesure de contraste
   instantanée est basse (0,07 à 0,6 d'opacité) avant de converger. Menu et
   repères, eux, restent >= 5,4:1 à +350 ms et +800 ms.
3. **Étoiles éteintes autour du texte.** Effet visible seulement comme une
   absence progressive d'étoiles (halo de 130 px), sans arête. Sur Parcours à
   768 px, une bonne part du centre est vide d'étoiles.
4. Planète : inchangée (étape 6 = texture 4, autorisé).

## Vérifications (résultats)

- `npm run build` : 0 ; `npm run generate` : 0 ; `npm run lint` : 0 erreur, 0
  avertissement ; vue-tsc (substitut) : 0 erreur x 4 ; `npx nuxi typecheck`
  littéral : rouge (cf. plus haut).
- Console (Chrome headless, 1440, 375 tactile, mouvement réduit, parcours de
  toutes les sections et sous-écrans) : aucune erreur, aucun warning Vue.
- Tenue à l'écran (`section.section-viewport` scrollHeight/clientHeight ;
  `.section-inner` idem ; largeur idem) : 1920x1080 1080/1080, 963/963 ;
  1440x900 900/900, 783/783 ; 1280x720 720/720, 603/603 ; 768x1024 1024/1024,
  915/915 ; 375x667 667/667, 516/516 ; identique sur les 5 sections, aucun
  débord horizontal. Chaque plan Méthode/Projets aux 4 tailles desktop et
  chaque sous-écran mobile (Parcours 7, Méthode 5, Projet phare 7, Projets 5) :
  aucun bloc de texte hors fenêtre ou sous la barre mobile.
- Contraste au pire pixel réel (texte rendu transparent, fond échantillonné sous
  chaque nœud de texte, mélangé à son opacité effective, transitions CSS
  neutralisées, 3 échantillons par écran, toutes sections et tous les plans) :
  1920x1080 5,38:1 ; 1440x900 5,39:1 ; 1280x720 5,38:1 ; 768x1024 5,38:1 ;
  375x667 5,38:1 ; 0 nœud sous 4,5:1 (3:1 pour le texte large). Le minimum est
  toujours un libellé de menu à 55 % derrière un pixel d'étoile éteinte (18/255).
- Warp (1440, +350 ms et +800 ms, `warp-*.png` dans le dossier de session) :
  aucun rectangle ni bord, stars éteintes autour du texte ; menu 5,4:1 ou plus.
- Fonctionnel : « Me contacter » -> plan Contact (5 / 5) ; « Voir mes projets »
  -> plan 1 / 5 ; « Voir le détail » -> section 4 ; « Voir la méthode » ->
  section 3 ; clic sur un jalon de la timeline -> étape ; flèches gauche/droite,
  Home/End, molette ; swipe tactile (haut = section, gauche/droite = sous-écran).
- Polices chargées : Hanken Grotesk 400, Jost 300, Jost 400. Aucune teinte 10 à
  60 degrés, aucun `box-shadow`/`text-shadow`/`filter`, seuls éléments arrondis :
  les points de frise. Titres 25 à 34 px, graisse 300.

## Known Issues

- `npx nuxi typecheck` littéral (voir plus haut).
- Marge verticale de Projets/Méthode à 1280x720 : plan RAG à ~65 px de la
  navigation ; correct mais serré.
- Les libellés « E-MAIL » et tags Jost font 12-13 px (repères, pas du texte courant).

## Dev Server

- URL : http://localhost:3000
- Status : en cours d'exécution (relancé après `build` et `generate`)
- Commande : `npm run dev -- --port 3000`

---

# Generator State — Run 3, itération 1 (archive)

## Contexte

Spec v3 « direction générique de film (Interstellar) », §2.3 bis. Elle remplace
toute la direction « instrument de bord » du run 2 (Fraunces, Inter, IBM Plex
Mono, cuivre `#c98a4b`). Le défilement interne reste supprimé (§2.3) : la
mention « défilement interne des sections longues » de la rubrique est obsolète.

## What Was Built

- **Typographie.** Jost 300/400 (titres, menu, repères, chiffres, capitales,
  interlettrage 0,2 à 0,32 em) et Hanken Grotesk 400 (texte courant, 16 à
  18 px sur desktop). Chargées par le `<link>` Google Fonts déjà présent dans
  `nuxt.config.ts` (aucune dépendance ajoutée). Fraunces, Inter, IBM Plex Mono
  et Baloo 2 : retirés de la config, du CSS et du runtime (`document.fonts`
  ne liste que Hanken Grotesk 400, Jost 300, Jost 400).
- **Couleurs.** `#05070A` (fond, aussi la couleur de fond du canvas
  hyperspace), `#E6ECEF` (texte), `#8C98A3` (secondaire), `#A9CBDD` (seul
  accent). Aucune teinte chaude dans l'interface (audit sur les couleurs
  calculées : 0 valeur entre 10° et 60°). Les textures de la planète sont
  exemptées.
- **Composition.** Plus aucune carte, aucun cadre, aucune bordure arrondie,
  aucune ombre. Hero en carton centré ; Parcours en carton de dates (six
  colonnes ≥ 1024 px, frise verticale à 768 px) avec la ligne qui se trace ;
  Méthode en deux colonnes de deux plans ; Projet phare : frise en compte à
  rebours, texte de l'étape, planète ; Projets en trois plans côte à côte puis
  le contact.
- **Voile de contraste.** Sans carte, le contraste AA passe par des voiles noirs
  à bords fondus (`.scrim` dans `app/assets/css/main.css`, plus trois voiles
  fixes dans `app/layouts/default.vue` pour le Header, le repère de section, le
  menu et la barre mobile). Pas de bordure, pas de coin, le bord se dissout.
- **Mouvement lent.** `useSplitReveal` est réécrit : fondu depuis le noir de
  1,2 à 1,6 s, interlettrage des titres qui se resserre (hauteur figée pendant
  l'animation pour éviter tout décalage), lignes en cascade, frise Parcours qui
  se trace point par point, la scène Projet phare qui émerge du noir. Rejoué à
  chaque arrivée sur une section (événement `section-enter`). Transition entre
  sections 1,1 s (au lieu de 0,65 s), warp plus lent (1 s, vitesse 4 au lieu de
  0,6 s, vitesse 6). Aucun rebond (`back.out` supprimé). Mouvement réduit :
  tout apparaît directement.
- **Menu.** Libellés toujours visibles en Jost capitales espacées, actif à pleine
  opacité en accent avec un trait fin qui s'allonge, autres à 60 % (voir choix
  1), 85 % au survol. La barre mobile garde ce style.
- **Sous-écrans mobile (375 × 667).** Parcours : titre + introduction, puis une
  entrée par sous-écran (7). Méthode : titre + introduction, puis une carte
  (5). Projets : titre + introduction, un projet, un projet, un projet, le
  contact (5). Projet phare : un sous-écran d'introduction (surtitre, titre,
  sous-titre, planète, frise compacte, flèche suivante), puis les six étapes.
  `‹` à l'étape 1 revient à l'introduction. Le bouton Hero « Me contacter »
  vise le dernier sous-écran de Projets (index `cards.length + 1`).
- Conservé : hyperspace, planète et fondu de textures, SlideContainer, clavier
  (flèches, PageUp/Down, Home/End, gauche/droite), `prefers-reduced-motion`,
  focus visible (2 px, accent), SEO, marqueurs `{{...}}` vides masqués.

## Choix à connaître

1. **Menu à 60 % et non 35 %.** À 35 %, `#E6ECEF` sur `#05070A` donne environ
   2,8:1, sous le seuil AA de la porte P2 pour du petit texte. 55 % descendait
   à 4,47:1 sur le pire pixel (étoile derrière un libellé) ; 60 % garde une
   marge. L'écart de 25 points avec la spec est volontaire ; P2 est bloquante.
2. **Voile `.scrim`.** Seule façon de garantir AA sur un champ d'étoiles mobile
   sans carte à fond ni cadre. Voile à 86 % d'opacité, fondu sur 1,25 à 2 rem
   en horizontal et 0,5 rem en vertical (un débord vertical plus grand ferait
   monter `scrollHeight`).
3. **Taille de texte.** `--fs-body` : 16 px à 720 de haut, 18 px à 1080, 15 px
   sous ~800 px de large (768 × 1024 et mobile). Le 15 px sur tablette et
   mobile est le prix de la porte P7 (rien ne défile, rien ne se coupe) avec la
   colonne étroite laissée par le menu latéral.
4. **Reset CSS.** `app/assets/css/reset.css` est le preflight de Tailwind 4
   copié à l'identique, sauf `font-family` (police du site) et le bloc `code`
   (plus de pile à chasse fixe). `main.css` importe `tailwindcss/theme.css` et
   `tailwindcss/utilities.css` séparément pour ne pas embarquer le preflight
   d'origine. Ainsi le CSS livré ne contient ni `monospace` ni `serif`.
5. **Dossier renommé** `app/components/3d` en `app/components/models3d` : Nuxt
   générait `export const 3dSimple3DModel` (identifiant invalide) dans
   `.nuxt/components.d.ts`, ce qui casse `vue-tsc`. Une erreur de type latente
   dans `Universal3DModel.vue` (`string | undefined`) est corrigée.
6. `devtools: { enabled: false }` dans `nuxt.config.ts` : le badge du devtools
   recouvrait la barre mobile sur les captures.
7. Étoiles du canvas inchangées (blanc, cyan, un rose rare, teinte 336°) ; seul
   le fond du canvas passe de `#000` à `#05070A`.

## Textes manquants

Aucun. `LinkedIn` et `CV` restent vides (`{{LINKEDIN_URL}}`, `{{CV_URL}}`) : les
éléments sont masqués. La flèche « ↗ » ajoutée après « GitHub » au run 2 est
supprimée (aucune icône).

## Vérifications (résultats)

- `npm run build` : succès.
- `npm run generate` : succès (seuls les avertissements de sourcemap Tailwind
  préexistants).
- `npm run lint` : 0 erreur.
- `npx nuxi typecheck` : échoue toujours sur `ERR_PACKAGE_PATH_NOT_EXPORTED`
  (`typescript` mis en cache par npx hors du dépôt, sans rapport avec le code,
  documenté dans le README). Contrôle équivalent fait à la main : `vue-tsc@3`
  + `typescript@5.9` (installés hors dépôt) sur les quatre `.nuxt/tsconfig.*.json`
  (app, server, shared, node) : **0 erreur**.
- Console navigateur : 0 erreur, 0 warning Vue (à 1440 × 900, 375 × 667 et en
  mouvement réduit). Seuls restent les messages de pilote GPU
  « GPU stall due to ReadPixels » du Chrome headless logiciel (SwiftShader),
  sans lien avec le code.
- Tenue à l'écran (`.section-inner`, scrollHeight / clientHeight, et largeur) :
  1920 × 1080 : 963/963 ; 1440 × 900 : 783/783 ; 1280 × 720 : 603/603 ;
  768 × 1024 : 915/915 ; 375 × 667 : 516/516 ; identique sur les 5 sections,
  aucun débord horizontal non plus. Marge la plus faible : Projets à 768 × 1024
  (28 px libres).
- Mobile 375 × 667 : chaque sous-écran contrôlé, aucun texte coupé.
- Contraste (pire pixel réel : texte rendu transparent, puis fond échantillonné
  sous chaque nœud de texte visible, texte mélangé à l'opacité effective) :
  1920 × 1080 : plus faible 4,89:1 ; 1440 × 900 : 4,68:1 (menu, avant de passer
  de 55 % à 60 %) ; 1280 × 720 : 4,67:1 (idem) ; 768 × 1024 : 4,92:1 (menu à
  60 %) ; 375 × 667 : aucun texte visible sous 4,5:1 après avoir posé le voile
  sur l'indicateur `N / M` (le script signale encore quelques nœuds à
  x = 355 ou x < 0 : ce sont les sous-écrans voisins, coupés par
  `overflow: hidden`, donc invisibles). Contrôle de contraste refait après le
  passage à 60 %/voile de l'indicateur seulement à 768 et 375.
- Polices : `document.fonts` = Hanken Grotesk 400, Jost 300, Jost 400.
- Couleurs calculées : 0 teinte entre 10° et 60°. Aucun `box-shadow` ni
  `text-shadow`. Seuls éléments avec `border-radius` : les points de frise
  (cercles de la timeline, spec §2.2).
- Titres : h1 34 px max, h2 25 à 30 px, poids 300 ; h3 15 à 24 px.
- Contenu (P1) : chaque nœud de texte visible du DOM est retrouvé mot pour mot
  dans `content/portfolio.md` ou fait partie des libellés d'interface autorisés.

## Known Issues

- Le voile `.scrim` laisse deviner, sur un champ d'étoiles dense pendant le
  warp, un rectangle très légèrement plus sombre autour des blocs de texte
  (bords fondus, sans cadre). Il disparaît une fois le warp terminé.
- Marge verticale faible à 768 × 1024 sur Projets (28 px) : une police de
  rendu différente peut la consommer.

## Dev Server

- URL : http://localhost:3000
- Status : en cours d'exécution (relancé proprement après `build` et `generate` ;
  le serveur lancé avant mes changements servait un rendu SSR périmé du layout
  et de `SubscreenNav`, d'où deux relances)
- Commande : `npm run dev -- --port 3000`
