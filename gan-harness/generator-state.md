# Generator State — Run 2, itération 4

## Contexte

Feedback de l'itération 3 (`gan-harness/feedback/feedback-3.md`, 5.0/10,
FAIL) : **P2 Contraste passe enfin**, solidement (45 zones remesurées
indépendamment sur un pire cas déterministe) — consigne explicite de ne pas
y retoucher cette fois. Mais une porte différente échoue : **P7 (Tenue à
l'écran)**, avec P4 (Mobile 375×667) en cascade. À 375×667, la frise des 6
étapes de « Projet phare » (`RoadmapTimeline.vue`, rendue dans
`.roadmap__timeline`) débordait de son conteneur `.section-inner` de
129 px, coupée silencieusement par `overflow: hidden` sur ce conteneur —
seules les étapes 1 et 2 restaient visibles, les étapes 3 à 6 invisibles et
inatteignables. Un débordement mineur (8 px) existait aussi à 768×1024.
L'itération précédente avait vérifié `.section-viewport` (qui tenait
toujours, masquant le problème) plutôt que `.section-inner` (le vrai
conteneur de contenu) — c'est l'erreur exacte à ne pas reproduire.

## Ce qui a été corrigé cette itération

### 1. Frise « Projet phare » intégrée à la logique de sous-écrans mobile

`RoadmapTimeline.vue` a maintenant deux rendus, sous une racine unique
(voir point important ci-dessous) :
- **`.rt-list`** (>= 768px) : la frise verticale complète existante,
  6 entrées avec libellé complet, inchangée dans son principe.
- **`.rt-compact`** (< 768px) : une frise compacte de 6 segments
  numérotés (même logique que la barre mobile du menu, §2.3 bis : « numéros
  visibles, libellé de l'actif seul »). Chaque segment est un vrai bouton
  de navigation directe (`goToStep`), avec le titre complet de l'étape en
  `aria-label` (`"Étape 3 : Extraction"`) et `aria-current="step"` sur
  l'actif — accessible aux lecteurs d'écran même si le libellé visuel est
  absent. Fond `--panel-bg` par défaut (même protection AA que les boutons
  `SubscreenNav`), accent plein + texte `#0a0908` (~6,8:1, même patron que
  `.hero__btn--primary:hover` et `.contact__cv:hover`) pour les étapes
  passées/actives.

**Aucun texte n'est perdu** (§2.3 : « on découpe, on ne tronque pas ») :
le titre complet de l'étape active reste affiché en entier par
`RoadmapContent` (« Étape X / 6 » + titre + texte descriptif), qui n'est
jamais coupé ; c'est la liste récapitulative des 6 titres qui devient un
indicateur compact sur mobile, exactement comme le suggérait le feedback
(piste 2 : « barre de progression à 6 segments »).

**Point important, trouvé et corrigé pendant cette itération** : la
première version avait deux racines de template (`<ol class="rt-list">`
et `<ol class="rt-compact">` comme frères). Or Vue n'hérite `class`/
`$attrs` automatiquement que sur un composant à racine unique — la classe
`roadmap__timeline panel-inset` posée par `RoadmapSection.vue` sur
`<RoadmapTimeline>` ne s'appliquait donc plus nulle part, ce qui aurait
supprimé silencieusement la protection de contraste P2 sur cette zone
(régression non détectée par un simple rendu visuel, seulement visible en
inspectant le DOM). Corrigé en enveloppant les deux listes dans une racine
unique `<div class="rt-root">`, qui reçoit la classe du parent normalement.
Vérifié : `.roadmap__timeline.panel-inset` est bien présent dans le DOM
rendu, quelle que soit la frise affichée à l'intérieur.

### 2. Budget vertical resserré en dessous de 1024px (Roadmap)

En dessous de 1024px, planète + contenu + frise sont empilés en colonne
(§2.2 point 4) — beaucoup moins de hauteur libre qu'à partir de 1024px
(rangée horizontale). Resserré, sans jamais couper de texte :
- `RoadmapPlanet.vue` : tailles de planète réduites sous 1024px
  (`< 480px` : 190px → 130px ; `< 768px` : 240px → 190px ;
  `< 1024px` : 300px → 260px). Tailles 1024px+ inchangées (380px/460px).
- `RoadmapSection.vue` : gaps (`«.roadmap»`, `.roadmap__grid`) et marges du
  bloc titre (`.roadmap__kicker`, `.roadmap__title`) resserrés en dessous
  de 1024px ; inchangés à partir de 1024px (règle dédiée qui remonte le gap
  du grid à 2rem une fois en rangée horizontale).
- `RoadmapContent.vue` : marges internes resserrées (`.rc__step`,
  `.rc__title`, `.rc__nav`) — aucune réduction de `font-size` ni de
  `line-height`, donc aucun risque de texte qui se chevauche ou perd en
  lisibilité, seulement moins de blanc entre les blocs.

### 3. Débordement de 8 px à 768×1024 trouvé sur **Projets**, pas Roadmap

En revérifiant moi-même avec un script Playwright indépendant (voir
méthodologie ci-dessous) **les 5 tailles × 5 sections**, et pas seulement
la section signalée, j'ai découvert que le débordement mineur de 8 px à
768×1024 rapporté par le feedback-3 comme concernant « Projet phare » était
en réalité déjà résolu pour Roadmap une fois le point 2 ci-dessus appliqué
— mais un débordement **indépendant, de 8 px lui aussi**, existait sur
**`ProjectsSection.vue`** à cette même taille (empilement colonne des 3
cartes + bloc Contact, `@media (min-width: 768px)`). Corrigé en resserrant
le gap du conteneur (`clamp(0.75rem, 1.8vh, 1.75rem)` →
`clamp(0.6rem, 0.75vh, 1.5rem)`) et le gap entre cartes
(`0.55rem` → `0.3rem`) dans cette plage. Aucun texte de carte ni de contact
raccourci ou coupé.

## Méthodologie de vérification — indépendante, sur `.section-inner`

Consigne explicite du feedback-3 : revérifier `.section-inner` (le
conteneur réel du contenu), **pas seulement** `.section-viewport`
(conteneur extérieur, toujours `overflow: hidden`, qui peut masquer un
vrai débordement). Script Playwright indépendant (`playwright` 1.63.0,
installé hors dépôt dans le scratchpad de session, chromium du cache
`~/Library/Caches/ms-playwright` de la machine — même outillage que
l'Évaluateur, code écrit pour cette itération) :

- Mesure `scrollHeight` vs `clientHeight` de `.section-inner` (pas de
  `.section-viewport`) aux **5 tailles requises** (1920×1080, 1440×900,
  1280×720, 768×1024, 375×667) sur **les 5 sections** (pas seulement
  Roadmap) : **25/25 mesures, 0 débordement** après correctif.
- Un premier tour a confirmé la présence du bug rapporté (129 px sur
  Roadmap à 375×667, 8 px sur *deux* sections à 768×1024 une fois les
  index correctement identifiés par leur `<h2>` réel plutôt que supposés
  par position — la confusion initiale entre « Projet phare » (index 3,
  0-based) et « Projets » (index 4) explique pourquoi le feedback-3 a pu
  attribuer les deux 8 px mesurés au même endroit).
- Contrôle de non-chevauchement planète/contenu/frise (§2.2 point 4) à
  11 largeurs (375 à 1920px, dont les points de rupture 480, 768, 1024) :
  0 chevauchement à aucune largeur, frise compacte < 768px / frise complète
  >= 768px confirmé par lecture directe du `display` calculé.
- Test fonctionnel (rythme réaliste, pas de clics enchaînés plus vite que
  les transitions GSAP existantes) : clic direct sur un segment compact
  (saute à l'étape voulue, `aria-current` mis à jour), boutons ‹ › de
  `RoadmapContent` toujours synchronisés avec la frise compacte, flèche
  clavier droite change bien d'étape, bouton Hero toujours fonctionnel.
  0 erreur console Vue (seuls des warnings de performance WebGL du driver,
  déjà présents avant cette itération, sans rapport avec le code).

### Détail des mesures finales (`.section-inner`, scrollH/clientH, px)

| Taille | Hero | Parcours | Méthode | Projet phare | Projets |
|---|---|---|---|---|---|
| 1920×1080 | 925/925 | 925/925 | 925/925 | 925/925 | 925/925 |
| 1440×900 | 745/745 | 745/745 | 745/745 | 745/745 | 745/745 |
| 1280×720 | 565/565 | 565/565 | 565/565 | 565/565 | 565/565 |
| 768×1024 | 869/869 | 869/869 | 869/869 | 869/869 | 869/869 |
| 375×667 | 516/516 | 516/516 | 516/516 | 516/516 | 516/516 |

0 débordement partout. Marge de sécurité vérifiée sur Projet phare à
375×667 (~14 px, via somme des rectangles des éléments de texte) et à
768×1024 (~96 px) ainsi que sur Projets à 768×1024 (~20 px) : aucune des
corrections n'est un cas limite à 0 px pile, il reste une marge contre les
petites variations de rendu (police, sous-pixels) entre environnements.

## Ce qui n'a pas été retouché (conforme à la consigne)

- **P2 Contraste** : aucune valeur de `--panel-bg`, d'opacité ou de couleur
  modifiée. Seul risque théorique identifié et corrigé : la classe
  `.panel-inset` qui ne s'appliquait plus sur la frise Roadmap à cause du
  bug de racine multiple (voir plus haut) — corrigé, la protection est de
  nouveau effective, revérifiable par inspection du DOM
  (`.roadmap__timeline.panel-inset` présent).
- Aucune dépendance npm ajoutée (`git diff` sur `package.json` /
  `package-lock.json` vide).
- Aucun fichier hors de ce dépôt lu ni écrit.

## Vérifications faites

- `npm run lint` → 0 erreur.
- `npm run build` → succès.
- `npm run generate` → succès (mêmes warnings sourcemap Tailwind
  préexistants, non applicatifs, déjà documentés aux itérations
  précédentes).
- `npx nuxi typecheck` → échoue toujours pour la même raison
  d'environnement déjà documentée et reproduite à l'identique aux
  itérations 2 et 3 (`ERR_PACKAGE_PATH_NOT_EXPORTED` sur
  `typescript/package.json` résolu par le cache npx de la machine, message
  ne référençant aucun fichier du projet) — pas un nouvel échec.
- Tenue à l'écran (`.section-inner`, pas `.section-viewport`) : 25/25
  mesures (5 tailles × 5 sections), 0 débordement, détaillé ci-dessus.
- Non-chevauchement planète/contenu/frise (§2.2 point 4) : 0 à 11 largeurs
  testées entre 375 et 1920px.
- Non-régression fonctionnelle : boutons Hero, navigation clavier
  (flèches de section + flèches de sous-écran), synchronisation entre les
  trois façons de changer d'étape Roadmap (segments compacts, boutons ‹ ›
  du contenu, clavier), 0 erreur console Vue.

## Connu, non fait / risques résiduels

- La marge de contraste la plus faible du site reste l'accusé de réception
  clavier (`.queued-hint`, 5,03:1 mesuré à l'itération 3) — non retouché
  cette itération, signalé pour mémoire uniquement.
- Zone vide en bas des sous-écrans mobile (signalée itération 1) : toujours
  non retouchée, hors périmètre de cette itération.
- La frise compacte mobile de Roadmap (`.rt-compact`) est un nouvel
  élément interactif ajouté à la surface de test : ses 6 segments sont
  cliquables et changent l'étape active directement, en plus des boutons
  ‹ › de `RoadmapContent` et des flèches clavier gauche/droite déjà
  existantes — trois chemins désormais synchronisés sur le même état
  (`useRoadmapState`, singleton), vérifié fonctionnel dans les trois cas.

## Dev Server

- URL : http://localhost:3000
- Status : en cours d'exécution (arrière-plan, `nuxt dev --port 3000`)
- Commande : `npm run dev`
