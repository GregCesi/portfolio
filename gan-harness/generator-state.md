# Generator State — Run 3, itération 1

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
