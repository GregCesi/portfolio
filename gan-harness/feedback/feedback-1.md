# Évaluation · Run 3, itération 1 (commit 7b14a01, branche ia-refonte)

## Mode d'évaluation

**Atteint : `playwright` (script Playwright piloté par nœud, pas les outils MCP).** Les outils `mcp__playwright__*` ont refusé de démarrer (« Browser is already in use » : un Chrome lancé à 13:10 par une autre session tenait le profil MCP). Je ne l'ai pas tué. J'ai utilisé `playwright-core` (cache npx) avec un Chromium headless isolé, sur http://localhost:3000. Le rendu était à jour (SSR, `lang="fr"`, polices Jost/Hanken, aucune trace de l'ancien rendu Fraunces/cuivre). Interactions réelles (clics, molette, clavier, tactile CDP), captures, mesures de pixels. Les scripts sont dans le scratchpad de session. `npm run build` et `npm run generate` ont été lancés sur une copie du dépôt dans le scratchpad (clone APFS de `node_modules`), le serveur de dev n'a pas été touché (HTTP 200 vérifié à la fin).

Captures : `gan-harness/screenshots/run3-it1-*.png` (72 fichiers : 5 sections aux 5 tailles, montages mobiles par section, warp, crossfade, focus, recadrages x3).

## Portes bloquantes

| Porte | Verdict | Preuve chiffrée |
|---|---|---|
| P1 Contenu | PASS | Blocs de texte de chaque section comparés à `content/portfolio.md` (sensible à la casse) à 1920, 1440, 1280, 768 et sur les 29 sous-écrans de 375 : 0 écart. Seuls les libellés d'interface autorisés sortent du fichier : `NN / 05`, `Étape N`, `Étape N / 6`, `N / M`, `‹ ›`, `E-mail`, numéros 01-04. LinkedIn et CV absents du DOM (`{{` : 0 occurrence). Header et menu identiques au fichier. |
| P2 Contraste | PASS (avec réserves ci-dessous) | Mesure au pixel : texte rendu transparent, fond réel échantillonné, texte mélangé à son opacité effective. Médiane texte courant 6,85:1, secondaire `#8C98A3` 5,4-6,85:1, menu au repos (60 %) 6,29:1. Pire pixel (une étoile derrière une lettre) : 1920 = 4,89 ; 1440 = 3,93 ; 1280 = 4,29 ; 768 = 3,84 ; 375 = 5,02. Pendant le warp : menu 5,2-6,3:1, libellés actifs 11,6:1. |
| P3 Build | PASS conditionnel | `npm run lint` : 0 erreur (un avertissement de dépréciation `.eslintignore`). `npm run build` : exit 0 ; `npm run generate` : exit 0 (copie du dépôt). Console : 0 erreur, 0 warning Vue à 1440, 375 tactile, mouvement réduit (seuls les « GPU stall ReadPixels »). `npx nuxi typecheck` : **échoue toujours** (`ERR_PACKAGE_PATH_NOT_EXPORTED`, vue-tsc de `~/.npm/_npx/…` avec un typescript incompatible ; `package.json` inchangé par rapport à HEAD~1, donc antérieur à cette itération et non corrigeable sans ajouter une devDependency interdite). Substitut : `vue-tsc --noEmit -p .nuxt/tsconfig.{app,server,shared,node}.json` = 0 erreur sur les quatre. Substitut raisonnable pour juger le code, mais la commande littérale de CLAUDE.md reste rouge. |
| P4 Mobile | PASS (réserve Major n°2) | 375 × 667 : Parcours 7 sous-écrans, Méthode 5, Projet phare 1 + 6, Projets 5, tous parcourus. 0 chevauchement, 0 bloc hors cadre, contact atteignable (dernier sous-écran, « Me contacter » y mène). |
| P5 Effet 3D | PASS | Hyperspace présent et animé, planète visible aux 5 tailles, 5 textures distinctes (rouge, ocre/gris, jaune/vert, vert/bleu, vert/bleu), fondu observé en cours de route (capture `run3-it1-1440-roadmap-crossfade-mid.png` : texture mixte 1↔3 à +350 ms). L'étape 6 réutilise volontairement la texture 4 (autorisé par la spec). |
| P6 Périmètre | PASS | `git status` propre au départ, branche `ia-refonte`, `git diff HEAD~1 -- package.json` vide, aucune nouvelle dépendance. Le générateur a installé vue-tsc/typescript hors dépôt (scratchpad de session) : toléré, à ne pas répéter dans un autre dossier. |
| P7 Tenue à l'écran | PASS | `scrollHeight/clientHeight` de `section.slide` : 1080/1080 (1920), 900/900 (1440), 720/720 (1280), 1024/1024 (768), 667 (375). `.section-inner` : 963/963, 783/783, 603/603, 915/915, 516/516, identique sur les 5 sections. Aucun bloc de texte hors fenêtre ni chevauchant (contrôle géométrique bloc à bloc aux 4 tailles desktop). Marge basse la plus faible : Projets à 768 (contenu jusqu'à y=990 sur 1024). |
| P8 Menu | PASS | Les 5 libellés sont visibles au repos à 1920/1440/1280/768. Actif : `#A9CBDD`, opacité 1, trait de 24 px ; les autres 60 %. Barre compacte sur mobile. |
| P9 Direction artistique | **FAIL** (carte à fond, voir ci-dessous) | Le reste est propre : polices chargées = Hanken Grotesk 400, Jost 300, Jost 400 ; aucune police interdite dans le CSS livré ; couleurs calculées : `#E6ECEF`, `#8C98A3`, `#A9CBDD`, `#05070A`, noir, 0 teinte 10°-60° ; 0 `box-shadow`/`text-shadow`/`filter` ; seuls éléments arrondis : les points de frise (cercles 8-9 px, spec §2.2) ; titres de section 25-34 px, graisse 300, capitales, interlettrage 0,22-0,26 em. |

### Ruling P9 sur le `.scrim` : c'est une carte à fond

Le `.scrim` est un rectangle rempli à 86 % de la couleur du fond (`rgba(5,7,10,.86)`) derrière chaque bloc de texte. Ses bords se dissolvent sur 20-32 px en horizontal mais seulement 8 px en vertical (`--fade-y`), ce qui laisse une arête nette en haut et en bas. Le résultat se lit comme un panneau sombre, pas comme l'absence de carte :
- Warp : `run3-it1-1440-warp-b-800ms.png` montre un rectangle d'environ 1100 × 330 px nettement plus sombre que les traînées d'étoiles autour des 4 plans Méthode, avec arêtes visibles, et un autre autour de l'introduction.
- Repos : `run3-it1-1440-roadmap-crossfade-mid.png` et `run3-it1-1920-4-projet-phare.png` montrent les rectangles du titre (~720 × 170) et du carton d'étape (~460 × 280) avec leur arête haute.
- Mobile : `run3-it1-375-edge-projets-s1-x3.png` montre un panneau de 335 px de large avec un bord gauche net.
La spec §2.3 bis dit « sans cadre ni carte à fond ». Le générateur reconnaît lui-même que le voile est le moyen de contourner l'absence de carte pour tenir P2. Le README affirme « aucune carte à fond » : c'est inexact. Je compte donc P9 en échec ; c'est le seul défaut qui plafonne la note. Le correctif est faisable (voir liste).

### Arbitrage menu 60 % contre 35 %

À 35 %, `#E6ECEF` sur `#05070A` donne 2,8:1 (calcul : 0,35 × 230 + 0,65 × 5 ≈ 84 de luminance de canal, L ≈ 0,095, fond L ≈ 0,0024). C'est sous le seuil AA de 4,5:1 pour du texte de 12 px. À 60 % : 6,29:1 en médiane (mesuré), 3,8-4,5 uniquement sur des pixels d'étoile isolés. **Écart de spec accepté** : le seuil AA prime sur l'opacité littérale (§2.3 exige explicitement 4,5:1, §2.3 bis donne une valeur « proche de »). Ne pas descendre sous ~55 %.

### Taille du texte courant (16-18 px)

Mesuré : 18 px à 1920 ; 17 px à 1440 ; 16 px à 1280 ; **15 px à 768 et à 375** ; **Parcours : détail 14 px et rôle 15 px à toutes les tailles, y compris 1920** ; étiquettes Jost 11-13 px (repères, acceptable). Ma décision : 15 px à 768 est un écart d'un pixel que la contrainte de tenue à l'écran explique à peu près ; **15 px sur mobile n'est pas justifié** (sous-écran RAG le plus haut : contenu jusqu'à y=535 sur 667, à 16 px il gagne ~17 px et tient) ; **14 px sur Parcours à 1920/1440 n'est pas justifié** (marge verticale de 270 px en dessous de la frise à 1920). Major.

## Scores

Plafond appliqué : P9 échoue, chaque critère ≤ 5. Scores bruts (sans plafond) entre parenthèses, pour que tu voies où en est le travail.

| Critère | Score noté | Brut | Poids | Pondéré |
|---|---|---|---|---|
| Design Quality | 5/10 | 7,0 | 0,3 | 1,5 |
| Originality | 5/10 | 7,0 | 0,2 | 1,0 |
| Craft | 5/10 | 7,0 | 0,3 | 1,5 |
| Functionality | 5/10 | 8,5 | 0,2 | 1,0 |

Total brut sans plafond : 7,3 / 10. Total plafonné : 5,0 / 10. Seuil : 8. **Verdict : FAIL** (même sans plafond, 7,3 < 8).

**Weighted Total: 5.0 / 10**

### Justification

**Design (brut 7,0).** La hiérarchie est lisible et le langage est cohérent : la frise Parcours (point + filet) et le compte à rebours du Projet phare parlent la même langue, les titres Jost en capitales espacées sont tenus (25-34 px, 300). Le hero est le meilleur écran. Points qui retiennent la note : colonnes Projets déséquilibrées à 1440 (262 / 499 / 262 px, la carte RAG plus large parce que son texte est plus long) ; Parcours à 14-15 px, petit ; Méthode et Projets sont des murs de texte de 50-90 mots par bloc ; à 768 le contenu est décalé à droite par la colonne du menu ; les panneaux du scrim.

**Originalité (brut 7,0).** Ça ne se lit ni comme la charte d'Anthropic ni comme un portfolio à dégradé violet : noir bleuté, Jost 300 espacé, un seul accent glacier, aucune ombre, aucune icône, titre qui se resserre de 15 à 7,9 px d'interlettrage en ~1,5 s. Hero, Parcours à 1440/1920 et Projet phare ont un vrai air de carton de générique. Ce qui casse l'effet : « peu de texte à la fois / une idée par écran » n'est tenu que sur le hero. Méthode (titre + intro + 4 blocs), Projets (3 colonnes de 60-90 mots + contact) et le Parcours 6 colonnes se lisent comme une grille de portfolio à filets. La planète passe à un vert/bleu saturé aux étapes 4 à 6, qui fait moins « Interstellar » que « texture de démo » (autorisé, mais ça pèse sur l'impression). Les rectangles sombres du scrim, visibles au warp, contredisent aussi le noir continu.

**Craft (brut 7,0).** Positif : 0 débordement, 0 chevauchement aux 5 tailles, console propre, focus 2 px `#A9CBDD` offset 4 px sur menu et boutons, `prefers-reduced-motion` respecté (section active en ~0,4 s contre ~1,1 s+, titre déjà à son interlettrage final), planète en `auto-rotate` coupé, lint et vue-tsc à 0. Négatif : bug réel de recouvrement de sous-écrans sur mobile (Major n°1), panneaux du scrim visibles, tailles de police sous la spec, contenu invisible ~2 s après chaque changement de section puis frise Parcours complète à ~6,5 s (lent voulu, mais l'écran est vide pendant 2 s sous SwiftShader), `nuxi typecheck` littéral rouge.

**Fonctionnalité (brut 8,5).** Tout marche : « Voir mes projets » → 05/05 ; « Me contacter » → 05/05 (bloc Contact visible) ; molette ±300 → sections 2, 3, retour 2 ; PageDown/PageUp/End/Home/ArrowUp/ArrowDown ; 6 ArrowDown rapides → la file d'une entrée absorbe sans casser (arrivée en 03/05) ; flèches gauche/droite sur les 6 étapes puis butée ; tactile (CDP) swipe haut/bas = section, gauche/droite = sous-écran (2/7 → 3/7 → 2/7) ; liens : mailto correct, GitHub et « Voir le code » en `target=_blank rel="noopener noreferrer"` ; « Voir le détail » et « Voir la méthode » présents ; LinkedIn/CV masqués ; SEO dans le HTML (`<title>`, description, og:title/description/type, twitter:card, `lang="fr"`). Retenu : les libellés de la timeline desktop ne sont pas cliquables (seules flèches et clavier changent d'étape), pas d'`og:image`/`og:url` (non exigés).

## Critical Issues (portes échouées en tête)

1. **P9 : le `.scrim` est une carte à fond.** Rectangle à 86 % de `#05070A`, arête verticale de 8 px seulement, visible au warp (`run3-it1-1440-warp-b-800ms.png`), à `run3-it1-1440-roadmap-crossfade-mid.png`, `run3-it1-1920-4-projet-phare.png` et sur mobile (`run3-it1-375-edge-projets-s1-x3.png`). → Supprimer les rectangles derrière le texte. Options, dans l'ordre que je recommande : (a) atténuer le champ d'étoiles lui-même dans la zone de texte (le canvas connaît la zone : baisser l'alpha et la luminosité des traînées dans un masque radial global, pas un rectangle par bloc), pour que le noir soit continu ; (b) si un voile reste, un seul dégradé radial très large centré sur le contenu de la section, opacité maximale ≤ 60 % au centre, sans arête nette, et re-mesurer P2 (le pire pixel doit rester ≥ 4,5 sur les blocs de texte courant) ; (c) réduire la luminosité et la longueur des traînées derrière le texte pendant le warp. Corriger aussi la phrase « aucune carte à fond » du README tant que ce n'est pas vrai.

## Major Issues

1. **Mobile : les derniers caractères de chaque ligne sont voilés par le scrim du sous-écran voisin.** `.subtrack` est à 20-355 px ; le `::before` du sous-écran suivant déborde de `--scrim-x` (20 px) vers la gauche et se peint par-dessus le texte du sous-écran courant. Mesuré à 3x : luminance max du texte 152 au milieu de la ligne, 123-130 sur les 15 derniers pixels (« avec », « au », « NUXT » visiblement grisés, le « c » de « avec » semble rogné ; Parcours intro « quatre », Méthode « et », Projets/RAG « Cause »). Contraste encore ≈ 4,8:1 donc pas un échec P2, mais c'est un défaut visible de « texte qui se coupe ». → Mettre `visibility: hidden` ou `opacity: 0` sur les sous-écrans non actifs hors transition, ou `overflow: clip` par sous-écran, ou `contain: paint` sur chaque `.subscreen`. Vérifier avec `run3-it1-375-edge-*-x3.png`.
2. **Texte courant sous la spec.** 15 px sur mobile (tient à 16 px, voir plus haut), 14 px (détail) et 15 px (rôle) sur Parcours à toutes les tailles. → `--fs-body` ≥ 16 px sur mobile ; détail Parcours à 16 px (6 colonnes de ~161 px à 1440 : passer à 3 × 2 colonnes ou élargir la frise plutôt que rétrécir la police).
3. **Densité contraire à la spec §2.3 bis (« peu de texte à la fois, une idée par écran »).** Projets à 1440 : 3 blocs de 262 / 499 / 262 px avec 60-90 mots chacun + contact ; Méthode : intro + 4 blocs ; ce sont des grilles de contenu. Le contenu est imposé, donc la marge de manœuvre est la mise en scène : voir la liste de corrections n°4.
4. **Colonnes Projets déséquilibrées (262 / 499 / 262 px à 1440, 224 / 425 / 224 à 1280 et 279 / 530 / 279 à 1920).** → `grid-template-columns: repeat(3, minmax(0, 1fr))` et laisser le texte long s'étendre en hauteur (il y a de la place : 730 sur 900 à 1440).
5. **P3 littéral : `npx nuxi typecheck` reste rouge.** Non causé par cette itération (`package.json` inchangé) mais CLAUDE.md exige 0 erreur. → Le documenter dans le README est fait ; demander à Grégoire s'il autorise `typescript` et `vue-tsc` en devDependencies, sinon laisser le substitut `vue-tsc -p .nuxt/tsconfig.*.json`.

## Minor Issues

1. Écran vide ~2 s après chaque changement de section (transition 1,1 s + départ du fondu), et frise Parcours complète à ~6,5 s (points à 0,55 s d'écart + 0,9 s de tracé). Le rythme lent est voulu ; raccourcir le délai de départ (le titre est à opacité 0 jusqu'à ~2 s) et resserrer les points à 0,35 s.
2. Les libellés de la timeline desktop (Étape 1-6) ne sont pas cliquables. Le clic sur un jalon est le geste naturel ; en faire des boutons (mobile : segments cliquables déjà présents).
3. Tab depuis le hero : ordre menu → boutons Hero, correct ; pas de lien d'évitement. Non exigé.
4. Polices Google Fonts en `<link>` bloquant dans le `<head>` (pas de `font-display` maîtrisé, pas d'hébergement local) : risque de FOUT, dépendance réseau tierce. Auto-héberger (sans nouvelle dépendance npm, fichiers WOFF2 dans `public/`).
5. `Planet-1.glb` : 6,0 Mo servis, textures 0,9 Mo (le total `public` est passé à 6,6 Mo contre 29 Mo avant : bon). Compression Draco/meshopt possible, non exigée tant que le reste n'est pas au vert.
6. Hero à 375 : titre à 18,4 px, lisible mais discret ; boutons « Voir mes projets » / « Me contacter » empilés, corrects.
7. Barre mobile : seuls les numéros sont visibles, le libellé actif est à droite ; acceptable pour la barre compacte.
8. Avertissement ESLint sur `.eslintignore` obsolète (pas une erreur).

## What Improved Since Last Iteration

- Refonte artistique réelle : plus de Fraunces/Inter/Plex/Baloo, plus de cuivre, aucune teinte 10°-60°, aucune ombre ni lueur, aucun cadre arrondi. Titres et menu en Jost capitales espacées, mouvement lent, aucun rebond.
- Tenue à l'écran exacte aux 5 tailles (scrollHeight = clientHeight partout) et sous-écrans mobiles complets (29 écrans contrôlés), console propre.
- Menu : libellés toujours visibles, actif bien distinct, 6,29:1 mesuré.
- Contenu : 0 écart mot pour mot, marqueurs `{{}}` masqués, SEO complet.
- Poids des assets 3D ramené à 6,6 Mo dans `public`.

## What Regressed Since Last Iteration

- Rien de fonctionnel. Nouveau défaut visuel introduit par la solution de contraste : panneaux du scrim (P9) et recouvrement des sous-écrans sur mobile.

## Liste priorisée de corrections pour le générateur

1. **P9 (bloquant) : supprimer l'effet « rectangle sombre »** du `.scrim` (options a/b/c ci-dessus), puis refaire la mesure de contraste au pire pixel sur les 5 tailles (script : texte transparent, échantillonnage du fond, cibles 4,5:1). Refaire les captures warp à +350 ms et +800 ms pour le prouver.
2. **Mobile : masquer les sous-écrans voisins** (`visibility`/`opacity`/`contain: paint`) pour que le dernier mot de chaque ligne ne soit plus voilé ; recontrôler « avec », « au », « NUXT », « quatre », « Cause » à 3x.
3. **Tailles** : 16 px minimum pour le texte courant sur mobile et à 768 si la marge le permet (Projets à 768 : 34 px de marge, donc chercher ~30 px ailleurs, par exemple en réduisant l'interligne ou l'espace entre les blocs) ; Parcours détail et rôle à 16 px.
4. **Composition (originalité)** : laisser plus de noir et n'afficher qu'une idée à la fois, sans toucher au contenu : Projets à 3 colonnes égales (`minmax(0,1fr)`) ; Méthode en 2 × 2 avec un interligne et un espace vertical plus larges ; alléger les filets ; éventuellement Parcours en carton centré à 3 × 2. Objectif : chaque écran lu en moins de 10 secondes.
5. **Rythme** : ramener le délai avant le premier fondu à ≤ 0,8 s après la fin du warp, frise Parcours complète en ≤ 4,5 s.
6. Rendre les jalons de la timeline desktop cliquables (boutons), au minimum au clavier.
7. Corriger le README (« aucune carte à fond ») une fois le point 1 fait ; auto-héberger Jost et Hanken Grotesk si Grégoire l'autorise.
8. Décider avec Grégoire du typecheck littéral (devDependencies) ou garder le substitut documenté.

## Captures (`gan-harness/screenshots/`)

- `run3-it1-1440-{1-hero,2-parcours,3-methode,4-projet-phare,5-projets}.png`, idem `1920`, `1280`, `768` : les 5 sections aux 4 tailles desktop/tablette.
- `run3-it1-375-{2-parcours,3-methode,4-projet-phare,5-projets}-s0..s7.png` et `run3-it1-375-montage-{parcours,methode,phare,projets}.png` : tous les sous-écrans mobiles.
- `run3-it1-1440-warp-{a-350ms,b-800ms,c-settled-methode}.png` : preuve du panneau pendant le warp.
- `run3-it1-1440-roadmap-{crossfade-mid,step2..step6}.png`, `run3-it1-1440-planet-steps-montage.png` : fondu de textures.
- `run3-it1-375-edge-parcours-intro-x3.png`, `run3-it1-375-edge-projets-s1-x3.png` : voilage du dernier mot à 3x.
- `run3-it1-1440-focus-tab4.png`, `run3-it1-1440-reduced-motion-phare.png`, `run3-it1-1440-parcours-after15s.png`, `run3-it1-1440-func-me-contacter.png`.
