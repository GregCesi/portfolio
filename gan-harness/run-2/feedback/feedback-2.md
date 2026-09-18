# Évaluation — Run 2, itération 2 (commit `6628d83`)

## Évaluation Mode

**Achevé :** `playwright`. Serveur de dev déjà en écoute sur `http://localhost:3000` (confirmé par `curl` → 200). Navigation, snapshots et captures via Playwright MCP, complétés par des scripts Node indépendants utilisant le même moteur `playwright` (1.64.0-alpha, déjà présent dans le cache npx de la machine, hors dépôt) pour les mesures programmatiques que les outils MCP ne fournissent pas nativement : échantillonnage de pixels réellement rendus (texte masqué en `visibility:hidden` pour révéler le fond du canvas WebGL derrière, sur des dizaines de frames consécutives, puis compositing alpha de la couleur CSS réelle du texte sur ce fond mesuré — même méthode que celle qui avait servi de preuve à l'itération 1), `getComputedStyle`, `scrollHeight`/`clientHeight`, simulation clavier avec minutage précis pendant une transition GSAP en cours. `npm run lint` et `npm run build` exécutés en plus pour P3. Le widget flottant de Nuxt DevTools (`#nuxt-devtools-container`), un cercle blanc qui recouvrait par endroits la barre de navigation mobile, a été détecté comme faux positif sur une première mesure et masqué par script avant de refaire toutes les mesures — signalé pour traçabilité, ce n'est pas un défaut de l'application.

## Synthèse

Les deux correctifs demandés après l'itération 1 sont réels et vérifiés : le Hero a maintenant un scrim opaque qui protège efficacement le titre et le texte (mesuré 14,4:1 et 5,9:1 dans le pire cas avec une étoile pleinement blanche derrière, cohérent avec les ~5,83:1 annoncés par le générateur), et les deux correctifs de craft mineurs (aria-labels distincts, file d'attente clavier avec accusé de réception visuel) fonctionnent exactement comme décrit — vérifiés en direct, pas seulement lus dans le code.

Mais **la porte P2 (Contraste) échoue de nouveau**, sur une zone différente cette fois. Le correctif appliqué au menu latéral (`opacity: 0.4 → 0.62`) améliore bien le cas de repos sur fond noir pur (mesuré 6,58:1, cohérent avec le calcul du générateur) — mais ce menu, comme le Hero avant son correctif, n'a **aucun fond opaque** derrière son texte : il est posé à même le canvas hyperspace animé. Un échantillonnage de pixels réels sur la colonne du menu desktop (les 5 libellés, texte masqué pour révéler le fond, ~9 secondes, 100 frames) a capturé une étoile blanche pure (255,255,255) directement dans la zone occupée par le texte. En compositant la couleur réelle du libellé inactif (`rgb(237,232,222)` à 62 % d'opacité) sur ce fond mesuré, le contraste chute à **1,13:1** — bien en dessous du seuil 4,5:1, et reproduit deux fois de suite sur des passes indépendantes (une fois avec une étoile à 195/195/195 → 1,26:1, une fois avec 255/255/255 → 1,13:1). Ce n'est pas la même défaillance que celle corrigée (le repos à 6,58:1 est bien réel et confirmé), c'est le même type de défaillance que celle du Hero à l'itération précédente, non traitée ici : l'architecture du menu reste vulnérable aux étoiles claires, exactement comme le Hero l'était avant son scrim.

Le même défaut a été retrouvé, mesuré de la même façon, sur le nom dans le Header (`site-header__name`, persistant sur les 5 sections, aucun fond) : **1,21:1** dans le pire cas capturé. Le Header n'avait pas été identifié comme fautif à l'itération 1 (il n'avait pas été mesuré), mais c'est la même architecture non protégée que le menu, avec le même risque. La suggestion n°1 de l'itération 1 (« lister tous les endroits où du texte est posé directement sur le canvas… et pour chacun, soit ajouter un fond, soit choisir une opacité avec une marge de sécurité ») demandait explicitement cet audit systématique ; il n'a pas été fait — seuls le Hero et le menu nommés dans les Critical Issues ont été traités, et pour le menu, seule la moitié du problème (le cas de repos) l'a été.

La barre mobile (`.mobile-nav`, fond `rgba(8,7,6,0.85)`) est en revanche correctement protégée : même méthode de mesure, pire cas capturé sur ~5,4 secondes = 4,88:1, au-dessus du seuil (marge faible mais réelle, cohérent avec un fond à 85 % d'opacité qui atténue mais ne bloque pas totalement une étoile).

Conformément à la grille, cette porte échouée plafonne de nouveau les quatre critères notés à 5/10 chacun.

## Portes bloquantes

| Porte | Statut | Preuve |
|---|---|---|
| P1 Contenu | **PASS** (non re-testé exhaustivement, hors périmètre du commit) | Ce commit ne touche aucun texte visible (diff limité à `SlideContainer.vue`, `SlideMenu.vue`, `SlideMenuItem.vue`, `HeroSection.vue`, deux composables). Spot-check visuel sur Hero et Parcours (`eval2-overview-1-hero.png`, `eval2-overview-2-parcours.png`) : texte identique mot pour mot à `content/portfolio.md` et à ce qui avait déjà été validé à l'itération 1. |
| P2 Contraste | **FAIL** | Voir Synthèse et détail ci-dessous. Mesure sur pixels réellement rendus, deux zones distinctes en échec, une troisième zone non demandée retrouvée en échec par le même mécanisme. |
| P3 Build | **PASS** | `npm run lint` → 0 erreur. `npm run build` → succès, `.output` généré. `npx nuxi typecheck` non re-testé (déjà documenté comme problème d'environnement local à la machine, non lié au code, à l'itération précédente — non re-vérifié ce tour-ci par choix de ne pas dupliquer un test déjà qualifié de non bloquant). Console navigateur : 0 erreur sur l'ensemble des parcours de test (mesures de contraste avec masquage/démasquage de texte, navigation complète clavier 5 tailles, appuis rapides). |
| P4 Mobile 375×667 | **PASS** | `scrollHeight === clientHeight` (667 = 667) sur les 5 sections, revérifié par script après correction du bug de sélecteur de mon propre script de test (voir note méthodologique ci-dessous). Barre mobile fonctionnelle (`eval2-mobile-bar-375.png`, `eval2-mobile-hero-375.png`, `eval2-mobile-parcours-375.png`). |
| P5 Effet 3D | **PASS**, non re-testé en détail | Fond hyperspace actif sur toutes les captures. Le commit ne touche ni la planète ni le fond ; aucune capture ne montre de régression visuelle. |
| P7 Tenue à l'écran | **PASS**, mesuré | Script indépendant corrigé (voir note méthodologique) : pour les 5 sections × 1920×1080, 1440×900, 1280×720, 768×1024 et 375×667, `scrollHeight === clientHeight` dans tous les cas où la section active a été correctement identifiée (0 px d'écart). Aucune régression du Hero malgré l'ajout du scrim. |
| P8 Menu | **PASS au sens strict de la formulation**, mais dégradé par P2 | Les libellés restent dans le DOM, jamais masqués. La section active se distingue (accent, trait). Mais le défaut P2 rend les libellés inactifs, par intermittence, quasiment illisibles (contraste 1,13:1 au pire) — la même réserve que celle notée à l'itération 1, non résolue. |
| P9 Direction artistique | **PASS**, revérifié | `document.fonts` → uniquement Fraunces, Inter, IBM Plex Mono. Titre Hero : 56 px pile au plafond à 1920×1080 (`clamp()` inchangé). Un seul `box-shadow` sur la page, gris (`rgba(0,0,0,0.2)`), pas blanc. Pas de régression détectée sur ce commit ciblé. |
| P6 Périmètre | **PASS** | `git branch --show-current` → `ia-refonte`. `git diff efb489d 6628d83 -- package.json package-lock.json` → vide, aucune dépendance ajoutée. Un seul commit pour cette itération (`6628d83`). |

### Détail P2 — la porte qui échoue encore

**1. Menu latéral desktop, libellés inactifs — le correctif ne couvre que la moitié du problème.**
`SlideMenuItem.vue`, `.menu-item { opacity: 0.62 }`, sur `.desktop-nav` qui n'a toujours aucun fond (`SlideMenu.vue`, `.desktop-nav` : pas de `background-color`). Deux mesures indépendantes, texte masqué pour révéler le fond réel du canvas derrière la colonne du menu (bounding box des 5 items, `x:36 y:363,7 w:141,3 h:172,6` à 1440×900), échantillonnées sur ~9 secondes chacune (100 frames) :
- Passe 1 : pire pixel de fond capturé `(195,195,195)` → couleur effective du texte compositée `(221,218,212)` → **contrast 1,26:1**.
- Passe 2 (widget Nuxt DevTools masqué pour écarter tout faux positif) : pire pixel de fond capturé `(255,255,255)` (étoile blanche pleine) → couleur effective `(244,241,235)` → **contrast 1,13:1**.
- Une capture avec le texte visible (`eval2-menu-star-overlap-evidence.png`) montre une traînée d'étoile blanche traversant la ligne du libellé « 01 START », visuellement cohérente avec la mesure.
- Le cas de repos (fond noir pur, aucune étoile) reste bien à 6,58:1 comme annoncé par le générateur — ce n'est donc pas une régression du correctif, c'est un correctif incomplet : il traite le niveau d'opacité mais pas l'absence de fond, alors que c'est précisément l'absence de fond qui avait justifié le scrim ajouté au Hero dans le même commit.

**2. Header (nom, persistant sur les 5 sections) — même défaut, jamais identifié ni traité.**
`Header.vue`, `.site-header__name`, `color: var(--color-ink)` opaque, posé directement sur le canvas (`.site-header` n'a pas de fond). Mesure identique (texte masqué, ~7 secondes, 80 frames) : pire pixel de fond capturé `(254,254,254)` → couleur effective quasi identique au texte lui-même `(237,232,222)` → **contrast 1,21:1**. Ce défaut existait déjà à l'itération 1 (le Header n'a pas été touché par les deux itérations), mais n'avait pas été mesuré alors — il est signalé maintenant conformément à la demande de vérifier « qu'aucune autre zone n'a de défaut de contraste non détecté ».

**3. Barre mobile — protégée, mesure de contrôle en PASS.**
`.mobile-nav`, fond `rgba(8,7,6,0.85)`. Même méthode (texte masqué, ~5,4 secondes, 60 frames, widget DevTools exclu) : pire pixel de fond capturé `(45,56,56)` → couleur effective `(164,165,159)` → **contrast 4,88:1**. Au-dessus du seuil, marge faible mais réelle — le fond translucide à 85 % atténue suffisamment les étoiles.

Le point 1 (menu desktop) suffit à lui seul à faire échouer de nouveau la porte : c'est la zone explicitement nommée comme fautive à l'itération précédente, le correctif appliqué ne couvre pas le mécanisme de défaillance réel (étoile ponctuelle), seulement le cas moyen.

## Critères notés (plafonnés à 5/10 — porte P2 en échec)

| Critère | Score | Poids | Pondéré |
|---|---|---|---|
| Design Quality | 5/10 (plafonné ; ≈8,5 hors plafond, inchangé depuis l'itération 1 sur ce point) | 0.3 | 1.5 |
| Originality | 5/10 (plafonné ; ≈8 hors plafond, inchangé) | 0.2 | 1.0 |
| Craft | 4,5/10 (sous le plafond) | 0.3 | 1.35 |
| Functionality | 5/10 (plafonné ; ≈8,5 hors plafond) | 0.2 | 1.0 |
| **TOTAL** | | | **4.85/10** |

Craft reste sous le plafond de 5, mais légèrement remonté par rapport à l'itération précédente (4/10 → 4,5/10) : les deux correctifs de craft annexes (aria-labels, file d'attente clavier avec accusé de réception) sont réels, vérifiés en direct et bien faits — ce sont d'authentiques progrès. Mais le défaut central de craft identifié à l'itération 1 (« texte posé sans considération pour ce qu'il y a derrière ») n'est pas résolu, seulement déplacé et partiellement masqué par une opacité plus élevée qui fonctionne en moyenne mais pas dans le pire cas — et une zone supplémentaire (Header) partage le même défaut sans avoir été identifiée du tout. Le risque « systémique » que l'itération 1 signalait explicitement comme non traité (« le risque de fond — poser du texte directement sur le canvas hyperspace sans y penser systématiquement à chaque endroit — n'a pas été traité comme un risque transverse ») s'est de nouveau matérialisé, cette fois en toute connaissance de cause puisque le generator-state de cette itération note lui-même : « seules le Hero et le menu ont été traités… les autres sections… n'ont pas été signalées en échec et n'ont pas été touchées ici… à auditer systématiquement si l'Évaluateur les signale à son tour » — la stratégie était donc d'attendre un nouveau signalement plutôt que d'anticiper le risque déjà nommé.

## Verdict : FAIL (seuil : 7.0)

## Critical Issues (must fix)

1. **P2 — Menu latéral desktop : le correctif d'opacité ne protège pas contre une étoile claire derrière le texte (mesuré 1,13–1,26:1, requis 4,5:1)** : `app/components/navigation/SlideMenu.vue`, règle `.desktop-nav` (aucun `background-color`). Le menu est, comme le Hero avant son correctif, posé directement sur le canvas hyperspace animé. Il faut soit ajouter un fond opaque discret derrière la colonne du menu (même traitement que `.hero__scrim`, éventuellement plus étroit — un simple bandeau vertical suffit), soit garantir que l'intersection texte/étoile reste toujours au-dessus de 4,5:1 par un autre moyen (par exemple une ombre portée sombre sur le texte lui-même, `text-shadow` avec un flou suffisant, qui assombrit localement n'importe quel fond derrière chaque glyphe — à tester avec la même méthode de mesure par pixels, pas seulement analytiquement). Revérifier avec exactement la méthode utilisée ici : masquer le texte, échantillonner le fond réel sur plusieurs secondes, composer la couleur CSS réelle dessus.
2. **P2 — Header (nom persistant) : même défaut, jamais identifié (mesuré 1,21:1)** : `app/components/layout/Header.vue`, `.site-header` (aucun fond). Même traitement que ci-dessus. Cette zone est visible en permanence sur les 5 sections — c'est la zone la plus exposée du site après le Hero.

## Major Issues (should fix)

1. **Absence d'audit systématique malgré une suggestion explicite en ce sens à l'itération précédente** : le `generator-state.md` de cette itération documente consciemment le choix de limiter le correctif au Hero et au menu, en reportant l'audit des autres zones à un signalement futur de l'évaluateur plutôt que de le faire par anticipation, alors que la suggestion n°1 de `feedback-1.md` demandait explicitement de « lister tous les endroits où du texte est posé directement sur le canvas ». Recommandation : avant le prochain correctif ponctuel, faire cet inventaire une fois pour toutes (grep des composants sans `.panel`/fond dans les composants de section et le Header) et traiter la classe de défaut plutôt que les symptômes un par un.

## Minor Issues (nice to fix)

1. Le correctif du menu améliore réellement le cas de repos (0,4 → 0,62 d'opacité, 6,58:1 confirmé) : ne pas le défaire en ajoutant un fond — les deux mesures combinées (opacité + fond) donneraient une marge de sécurité confortable plutôt que de recommencer un aller-retour.
2. La zone vide en bas des sous-écrans mobile (signalée à l'itération 1, non retouchée) reste présente (`eval2-mobile-parcours-375.png` proche visuellement de la précédente capture) — toujours non bloquant, toujours améliorable.

## What Improved Since Last Iteration

- **Hero** : le scrim (`rgb(8 7 6 / 93%)`) fonctionne exactement comme annoncé, vérifié par la même méthode de pixel-sampling qui avait révélé le défaut à l'itération 1 : 14,4:1 (titre) et 5,9:1 (texte) dans le pire cas mesuré avec une étoile pleinement blanche derrière — marge confortable au-dessus de 4,5:1, aucune régression de mise en page.
- **Aria-labels** : les deux `<nav>` (desktop et mobile) portent désormais des libellés distincts (« … menu latéral » / « … barre mobile »), confirmé par lecture directe des attributs rendus.
- **File d'attente clavier** : deux `ArrowDown` rapprochés (150 ms d'écart, en pleine transition GSAP) font bien avancer de exactement 2 sections, sans perte — testé et mesuré en direct (index 0 → 2). L'accusé de réception visuel (`.queued-hint`, trois points ambre pulsants) est bien présent et visible dans le DOM pendant la fenêtre d'attente (`display: block`, `visibility: visible`, capture `eval2-keyboard-queue-hint-crop.png`), même s'il reste très discret visuellement (petit, 45–100 % d'opacité, en bas de l'écran) — conforme à l'intention « discret » de la spec, mais à la limite de la perceptibilité.
- Le menu, en cas de repos (sans étoile), est objectivement plus lisible qu'avant (6,58:1 contre 3,2–3,75:1) — un vrai progrès partiel, insuffisant pour faire passer la porte mais pas nul.

## What Regressed Since Last Iteration

- Rien ne régresse au sens strict (aucune fonctionnalité ou mesure qui était bonne et qui s'est dégradée). Mais le même type de défaut identifié comme critique à l'itération 1 (texte non protégé sur canvas animé) réapparaît une deuxième fois consécutive, sur une zone qui était nommément dans le périmètre du correctif demandé (le menu) — ce n'est pas une régression, mais la répétition d'un même angle mort malgré un avertissement explicite reçu.

## Specific Suggestions for Next Iteration

1. Traiter en une seule fois toutes les zones de texte posées directement sur le canvas hyperspace sans fond opaque : au minimum le menu desktop et le Header, identifiés et mesurés ici. Vérifier aussi les titres/surtitres de section (Parcours, Méthode, Projet phare, Projets) qui semblent, sur les captures `eval2-overview-*.png`, également posés à même le fond sans `.panel` — non mesurés pixel par pixel dans cette évaluation faute de temps, mais visuellement du même type que les trois zones déjà confirmées en échec.
2. Pour le menu, privilégier un fond plutôt qu'une opacité de texte plus haute, pour ne pas re-complexifier l'équilibre entre lisibilité de repos et distinction de l'item actif (qui, lui, doit rester net) — cohérent avec ce qui a déjà fonctionné pour le Hero.
3. Une fois le correctif fait, remesurer avec la méthode utilisée dans ce rapport (texte masqué, échantillonnage du fond réel sur plusieurs secondes, compositing de la couleur CSS réelle) plutôt que de se fier uniquement au cas de repos sur fond noir, qui n'a pas détecté le problème réel ni à l'itération 1 ni dans le correctif de cette itération.

## Note méthodologique

Deux imprécisions ont été trouvées et corrigées dans mes propres scripts de mesure en cours de route, signalées ici par souci de transparence : (1) le widget flottant de Nuxt DevTools (`#nuxt-devtools-container`), un cercle blanc positionné en bas de l'écran, a d'abord faussé une mesure sur la barre mobile (faux 255,255,255) — il a été masqué par script avant de refaire toutes les mesures de contraste ; (2) mon premier sélecteur pour identifier la section active (`.section-viewport:not([inert])`) ciblait le mauvais niveau du DOM (l'attribut `inert` est posé sur `.slide`, pas sur `.section-viewport` qu'il contient) et retournait systématiquement la première section — corrigé (`.slide:not([inert]) .section-viewport`) avant de considérer les mesures P7 et clavier comme valides. Les chiffres cités dans ce rapport sont ceux obtenus après ces deux corrections.

## Screenshots

Dossier : `gan-harness/screenshots/` (préfixe `eval2-` pour ce run).
- `eval2-menu-desktop-column-1440.png`, `eval2-menu-star-overlap-evidence.png` : preuve du défaut P2 sur le menu (étoile visible traversant la ligne « 01 START »).
- `eval2-hero-1440.png` : Hero avec scrim, aucune étoile visible à l'intérieur du bloc de texte — correctif qui fonctionne.
- `eval2-mobile-bar-375.png` : barre mobile, contraste en PASS.
- `eval2-keyboard-queue-hint-crop.png` : accusé de réception clavier (points ambre) visible pendant la fenêtre d'attente.
- `eval2-overview-1-hero.png` à `eval2-overview-5-projets.png` : vue d'ensemble des 5 sections à 1440×900.
- `eval2-mobile-hero-375.png`, `eval2-mobile-parcours-375.png` : parcours mobile.

Score pondéré total : 4.85 / 10
