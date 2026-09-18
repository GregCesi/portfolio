# Évaluation — Run 2, itération 1 (commit `efb489d`)

## Évaluation Mode

**Achevé :** `playwright`. Navigation live sur `http://localhost:3000` (serveur déjà en écoute, confirmé par `curl` → 200) via Playwright MCP pour l'exploration/snapshots/captures, complété par des scripts Node utilisant le même moteur `playwright` (déjà installé dans le cache npx de la machine, hors dépôt) pour les mesures programmatiques que les outils MCP fournis ne permettent pas nativement (lecture de `scrollHeight`/`clientHeight`, styles calculés, échantillonnage de pixels réels, `document.fonts`, simulation clavier, `prefers-reduced-motion`). Aucun repli en mode `screenshot` ou `code-only` n'a été nécessaire. `npm run build`, `npm run generate`, `npm run lint` exécutés en plus pour vérifier P3.

## Synthèse

Le travail visuel et structurel de cette itération est réel et solide : la direction « instrument de bord » est bien exécutée (typographie, filets, grille éditoriale, palette ambre unique), les cinq sections tiennent effectivement à l'écran aux quatre tailles requises (mesuré, 0 px d'écart), le découpage en sous-écrans mobile fonctionne, la planète et son fondu de texture marchent, la navigation clavier/molette/tactile est câblée correctement, et la console reste propre sur l'ensemble des parcours testés (spam de clics, spam de touches, navigation complète). C'est du travail net.

Mais **la porte P2 (Contraste) échoue**, avec une mesure réelle et non un calcul théorique : les quatre libellés inactifs du menu latéral desktop (`.menu-item`, `opacity: 0.4`, 11,52 px, donc « texte courant » au sens WCAG) affichent un contraste mesuré de **~3,2–3,75:1** contre un fond réellement noir (le cas le plus favorable possible), alors que 4,5:1 est requis. Ce n'est pas un cas limite ponctuel provoqué par une étoile qui passe derrière le texte à un instant donné : c'est l'état de repos, permanent, de 4 des 5 entrées du menu, sur toutes les tailles ≥ 768 px, en toutes circonstances. Le calcul analytique du générateur (`generator-state.md`, section Vérifications) ne portait que sur les panneaux de texte (`.panel` à 85 % d'opacité) — il n'a pas couvert le menu latéral ni le Hero (qui n'a pas de panneau). Conformément à la grille, cette seule porte échouée plafonne les quatre critères notés à 5/10 chacun.

## Portes bloquantes

| Porte | Statut | Preuve |
|---|---|---|
| P1 Contenu | **PASS** | Texte vérifié mot pour mot sur Hero, frise Parcours (6 entrées), 4 cartes Méthode, 6 étapes Roadmap, 3 cartes Projets + Contact contre `content/portfolio.md`. `{{LINKEDIN_URL}}` et `{{CV_URL}}` correctement masqués (aucune trace dans le DOM). Libellés d'interface conformes à la liste autorisée (« Étape 1 / 6 », « Voir le détail », « Voir la méthode », « Voir le code », « E-mail », « GitHub », « 04 / 05 »). Un point noir dans `08-voir-detail-nav.png` entre « septembre » et « 2026 » a été vérifié : c'est une étoile du fond animé superposée au texte au moment de la capture, pas un caractère ajouté (`app/data/content.ts:114` confirme le texte source exact, avec un simple espace). |
| P2 Contraste | **FAIL** | Voir détail ci-dessous. Mesure réelle sur pixels rendus, pas seulement calcul. |
| P3 Build | **PASS** (avec réserve d'environnement) | `npm run build` → succès. `npm run generate` → succès (warnings sourcemap Tailwind préexistants, non applicatifs). `npm run lint` → 0 erreur. `npx nuxi typecheck`, y compris en épinglant `vue-tsc@2.2.0`/`typescript@5.9.2` comme le générateur l'a fait : échoue avec `ERR_PACKAGE_PATH_NOT_EXPORTED` sur `typescript/package.json`, reproduit indépendamment dans mon propre environnement — c'est un problème de résolution de paquet npx local à la machine, pas une erreur de code (le message ne référence aucun fichier du projet). Console navigateur : 0 erreur, 0 warning Vue sur l'ensemble des parcours testés (navigation complète 5 sections × 4 tailles, spam de clics, spam de touches clavier, navigation mobile, `prefers-reduced-motion`). |
| P4 Mobile 375×667 | **PASS** | `sectionViewport.scrollHeight === clientHeight` (667=667) sur les 5 sections en vue initiale. Aucun texte tronqué observé sur les captures (`mobile-01-hero.png`, `mobile-section-2.png` à `mobile-section-5.png`). Timeline Parcours et Roadmap ne chevauchent ni le texte ni la planète (planète et texte sont empilés verticalement, jamais superposés — `mobile-section-4.png`). Bouton « Me contacter » depuis Start atterrit bien sur le sous-écran Contact de Projets (« 4 / 4 », vérifié par script et capture `mobile-after-contact-click.png`). Flèches gauche/droite testées sur Parcours : avancent bien d'une entrée (`mobile-parcours-subscreen2.png`, sous-écran 2/6 puis 3/6). |
| P5 Effet 3D | **PASS** | Fond hyperspace actif en continu (particules radiales visibles sur toutes les captures). Planète GLB rendue et texture changée entre les étapes de la Roadmap, vérifié visuellement étape 1 (rouge/brun, `planet-bake-1`) → étape 4 (jaune/bleu, `planet-bake-3`) → étape 6 (vert/violet, `planet-bake-4`, repli documenté et sans accroc visuel). Aucune régression, aucun avertissement `.planet-container` dans la console. |
| P7 Tenue à l'écran | **PASS**, mesuré | Script indépendant : pour chacune des 5 sections × les 4 tailles requises (1920×1080, 1440×900, 1280×720, 768×1024), `scrollHeight` de l'élément `.section-viewport` actif (celui qui n'a pas l'attribut `inert`) a été comparé à son `clientHeight`. **Écart = 0 px dans les 20 cas** (ex. 1920×1080 : 1080/1080 sur les 5 sections ; 768×1024 : 1024/1024 sur les 5 sections). Aucun élément interne (`.section-inner`, cartes, timeline) ne dépasse sa boîte ; les seuls écarts trouvés (3 à 10 px sur `h1`/`p` avec `overflow: visible`) sont des artefacts normaux de métrique de police (ascendantes/descendantes), sans clip ni barre de défilement. |
| P8 Menu | **PASS au sens strict**, à surveiller | Les libellés inactifs restent dans le DOM et sont visuellement rendus (pas de `display: none`, pas de `visibility: hidden`) — la porte telle que formulée (« libellé invisible ») ne peut pas être déclarée en échec sur ce seul critère. La section active se distingue bien (couleur accent, trait à gauche, opacité pleine). Cela dit, le défaut mesuré en P2 rend ces libellés à peine lisibles en pratique (`02-menu-inactive-1440.png`) ; voir P2. |
| P9 Direction artistique | **PASS** | `document.fonts` : uniquement Fraunces, Inter, IBM Plex Mono chargées ; aucune référence à « Baloo » dans les feuilles de style (vérifié par balayage de `document.styleSheets`). Un seul `box-shadow` trouvé sur toute la page : `rgba(0,0,0,0.2) 0 0 2px 0` (gris/noir, pas blanc — et vraisemblablement issu de l'UI Nuxt DevTools, pas de l'app). Titre Hero : 56 px pile au plafond à 1440 et 1920 (jamais au-delà, `clamp()` vérifié). Titres de section : 40 px (Parcours, Méthode, Projets) ou 32 px (Roadmap) — jamais au-delà du plafond. Composition : texte aligné à gauche sur toutes les sections hors Hero (confirmé visuellement sur Parcours, Méthode, Projets). |
| P6 Périmètre | **PASS** | `git branch --show-current` → `ia-refonte`. `git diff HEAD~1 HEAD -- package.json` → vide (aucune dépendance ajoutée). Un seul commit pour cette itération (`efb489d`), pas de commit sur `main`/`develop`. |

### Détail P2 — la porte qui échoue

Deux problèmes de nature différente, mesurés séparément :

**1. Menu latéral desktop, libellés inactifs (défaut systématique, sévère).**
`SlideMenuItem.vue` applique `opacity: 0.4` à un texte `color: var(--color-ink)` (`#EDE8DE`), en `font-size: 0.72rem` (11,52 px, poids normal — donc « texte courant », seuil 4,5:1, pas 3:1) directement sur le fond hyperspace (`.desktop-nav` n'a aucun fond, confirmé dans `SlideMenu.vue`). Mesure :
- Capture réelle (`02-menu-inactive-1440.png`), recadrage du libellé « 02 PARCOURS » (`crop-parcours-label.png`) : fond échantillonné = `(0,0,0)` (noir pur, le cas le plus favorable). Pixel de trait de glyphe le plus clair échantillonné = `(99,105,104)` à `(95,93,89)`.
- Ratio WCAG calculé sur ces pixels réels : **3,2:1 à 3,75:1**. Sous 4,5:1.
- Calcul de confirmation indépendant (couleur effective par compositing alpha 40 % sur noir : `rgb(95,93,89)`) : **3,19:1**, cohérent avec la mesure pixel.
- Ce n'est pas un pic transitoire : c'est la valeur de repos, tout le temps, pour 4 des 5 entrées du menu (Start, Parcours, Méthode, Projets ou Roadmap selon la section active), à chaque taille ≥ 768 px pendant toute la visite.

**2. Titre et texte du Hero, sans panneau de fond (défaut réel mais intermittent).**
`HeroSection.vue` n'utilise pas `.panel` : le titre (`color: var(--color-ink)`, opaque) et le texte (`color: var(--color-ink-dim)`, 60 % d'opacité) sont posés à même le canvas WebGL animé. En régime « fond noir » (~99,99 % des pixels de la zone, mesuré par seuillage sur 20 images capturées) le contraste est confortable (≈17:1 pour le titre, ≈6,2:1 pour le texte, calcul sur couleur effective compositée). Mais des pixels quasi blancs (jusqu'à 255) apparaissent dans la zone de texte à chaque image capturée (étoiles `#ffffff` à 40 % de poids dans `StarsField.ts`) : quand un tel pixel s'aligne avec un trait de lettre, le contraste local chute à ≈1,0–1,6:1 le temps que l'étoile traverse. C'est ponctuel, localisé à quelques pixels, et se déplace en continu — mais c'est un vrai défaut de lisibilité directement causé par l'absence de tout fond opaque derrière le texte le plus important de la page (le titre du Hero).

Le premier point (menu) suffit à lui seul à faire échouer la porte : il est mesuré, sévère (sous le seuil même dans le meilleur cas), et permanent — exactement le type de défaut que la grille demande de ne pas minimiser.

## Critères notés (plafonnés à 5/10 — porte P2 en échec)

| Critère | Score | Poids | Pondéré |
|---|---|---|---|
| Design Quality | 5/10 (plafonné ; ≈8,5 hors plafond) | 0.3 | 1.5 |
| Originality | 5/10 (plafonné ; ≈8 hors plafond) | 0.2 | 1.0 |
| Craft | 4/10 (sous le plafond) | 0.3 | 1.2 |
| Functionality | 5/10 (plafonné ; ≈8,5 hors plafond) | 0.2 | 1.0 |
| **TOTAL** | | | **4.7/10** |

Craft est noté sous le plafond de 5, pas au plafond : le défaut de P2 est structurellement un défaut de craft (texte posé sans considération pour ce qu'il y a derrière), et il s'accompagne de deux défauts mineurs supplémentaires du même ordre (voir Issues). Les trois autres critères sont notés exactement au plafond parce que, dans les limites qu'il impose, le travail sous-jacent (mise en page, absence de motifs génériques, câblage fonctionnel) est nettement au-dessus de la moyenne — ce qui doit se lire dans le rapport texte même si le chiffre est contraint à 5.

## Verdict : FAIL (seuil : 7.0)

## Critical Issues (must fix)

1. **P2 — Contraste des libellés inactifs du menu latéral (3,2–3,75:1 mesuré, requis 4,5:1)** : `app/components/navigation/SlideMenuItem.vue`, règle `.menu-item { opacity: 0.4; }`. Corriger en augmentant l'opacité effective (ex. ne pas descendre sous ~0,65 avec cette taille de police sur fond noir, ou passer par une couleur `--color-ink-dim` à opacité fixe recalculée plutôt qu'un `opacity` d'élément qui multiplie aussi la couleur de fond éventuelle), ou en ajoutant un fond sombre discret derrière la colonne de nav (`.desktop-nav`) pour stabiliser le contraste indépendamment du canvas. Revérifier avec un échantillonnage de pixels réel comme celui utilisé ici, pas seulement un calcul sur couleur nominale.
2. **P2 — Hero sans panneau de fond, contraste local jusqu'à ~1:1 sous une étoile** : `app/components/sections/Hero/HeroSection.vue`. Le Hero est la seule section sans un fond `.panel` (ou équivalent) sous son texte. Ajouter un fond translucide (même très discret, ou un dégradé radial sombre centré sur le bloc de texte) pour empêcher les pixels d'étoile de traverser directement les glyphes. Toutes les autres sections avec texte important devraient être auditées de la même façon (Roadmap step content, cartes Méthode/Projets semblent utiliser `.panel` ou des filets sur fond suffisamment sombre, mais vérifier explicitement au run suivant).

## Major Issues (should fix)

1. **Deux éléments `<nav>` avec le même `aria-label`** : `SlideMenu.vue` a `data-desktop-nav` et `data-mobile-bar` qui portent tous deux `aria-label="Navigation entre les sections"`. Un lecteur d'écran annonce deux repères identiques (l'un normalement masqué en CSS pour l'autre taille d'écran, mais les deux restent dans l'arborescence d'accessibilité). Donner un libellé distinct à chacun, ou masquer celui qui n'est pas actif avec `aria-hidden`/`hidden` plutôt que du CSS seul.
2. **Entrée clavier silencieusement perdue pendant une transition** : `SlideContainer.vue`, `onKeydown` retourne sans effet (`if (state.isAnimating) return`) si une touche est pressée pendant les ~0,65 s de transition GSAP, sans file d'attente ni retour visuel. Reproduit par script (`rapid.cjs`) : aucun crash, mais des appuis répétés rapides (utilisateur qui martèle une flèche) perdent des étapes sans qu'aucun signal (ex. léger flash sur le bouton, désactivation visible du menu pendant l'anim) ne l'indique. Pas bloquant, mais nuit à la sensation de réactivité qu'« instrument de bord » est censé transmettre.

## Minor Issues (nice to fix)

1. Les sous-écrans mobile (Parcours, Méthode, Projets) laissent une grande zone vide en bas de l'écran (`mobile-section-3.png`, `mobile-parcours-subscreen2.png` : le contenu tient dans le tiers supérieur, le reste est du fond étoilé nu). Rien d'interdit par la spec, mais l'équilibre vertical pourrait être amélioré (contenu centré verticalement dans le sous-écran plutôt que collé en haut) pour une sensation plus soignée sur mobile.
2. `crop-zoom.png` (dans les captures de cette évaluation) montre qu'une étoile blanche peut, par coïncidence, atterrir exactement entre deux mots et ressembler à un signe de ponctuation parasite. Effet secondaire du point Critical #2 ci-dessus ; se résorbera avec le fond derrière le Hero.

## What Improved Since Last Iteration

- Défilement interne supprimé comme demandé : plus aucune section ne porte de `overflow-y: auto`, confirmé par mesure `scrollHeight`/`clientHeight` aux 4 tailles (0 écart partout, contre le retour explicite de Grégoire sur le run 1).
- Nouvelle direction artistique bien posée : Baloo 2 entièrement retirée, plus aucune lueur blanche détectée, palette ambre unique cohérente entre Parcours (frise) et Projet phare (timeline), grille éditoriale à filets fins sur Méthode/Projets — visuellement, c'est un saut de qualité net par rapport à la description du run 1 dans le générateur.
- Mécanique de sous-écrans mobile entièrement nouvelle et fonctionnelle (flèches, indicateur N/M, deep-link « Me contacter » → sous-écran Contact), sans duplication de DOM entre desktop et mobile (`display: contents`), et sans régression de la Roadmap existante.
- Aucune erreur console détectée sur un parcours de test nettement plus poussé que ce qu'un calcul analytique seul aurait couvert (spam clics/clavier, reduced-motion, navigation complète 4 tailles).

## What Regressed Since Last Iteration

- Rien d'identifié qui régresse par rapport au run 1 — mais le run 1 avait déjà un problème de contraste que son propre évaluateur avait qualifié de critique sans que la note finale (9,8/10) le reflète. Cette itération reproduit un problème de la même famille (contraste insuffisant sur fond animé), sur une surface différente (menu au lieu du panneau principal). Le risque de fond — poser du texte directement sur le canvas hyperspace sans y penser système
atiquement à chaque endroit — n'a pas été traité comme un risque transverse malgré le précédent.

## Specific Suggestions for Next Iteration

1. Traiter le contraste comme un audit systématique, pas section par section : lister tous les endroits où du texte est posé directement sur le canvas (sans `.panel` ni fond opaque) — au minimum le Hero et le menu desktop identifiés ici — et pour chacun, soit ajouter un fond, soit choisir une opacité de texte dont le contraste minimal (sur fond noir, le cas le plus favorable pour du texte clair) dépasse largement 4,5:1 avec une marge de sécurité pour absorber les pixels d'étoile.
2. Remesurer avec un échantillonnage de pixels réel après correction (méthode utilisée dans cette évaluation : capturer le fond avec le texte temporairement rendu transparent, puis calculer le ratio WCAG sur la couleur CSS réelle du texte contre ce fond mesuré) plutôt qu'un calcul analytique sur une hypothèse de fond blanc pur, qui n'a pas détecté le problème réel du menu.
3. Donner un libellé `aria-label` distinct aux deux `<nav>` (desktop/mobile) du menu.
4. Envisager un signal visuel léger pendant les transitions de section (ex. désactivation visible du menu, ou file d'attente d'une seule entrée clavier) pour que les appuis rapides ne semblent pas silencieusement ignorés.

## Screenshots

Dossier : `gan-harness/screenshots/` (ce run).
- `01-hero-1280.png` : Hero à 1280×720, DA instrument de bord bien posée.
- `02-menu-inactive-1440.png` + `crop-parcours-label.png` : preuve du défaut P2 sur le menu (source de la mesure 3,2–3,75:1).
- `03-roadmap-1440.png`, `04-roadmap-step4-1440.png`, `05-roadmap-step6-1440.png` : Projet phare, crossfade de texture de la planète entre étapes 1, 4 et 6 (avec repli bake-5→bake-4).
- `06-method-1280.png` : grille éditoriale 2×2, cohérente avec Projets.
- `07-projects-1280.png` : 3 cartes + Contact tenant dans 1280×720, liens et tags conformes.
- `08-voir-detail-nav.png` + `crop-zoom.png` : vérification du texte « Plus de 2 500 offres… » (étoile superposée, pas un ajout de texte).
- `09-parcours-1280.png` : frise horizontale à 6 entrées, aucun débordement.
- `mobile-*.png` : parcours mobile 375×667 (Hero, sections 2/4/5, sous-écrans Parcours, deep-link Contact).

Score pondéré total : 4.7 / 10
