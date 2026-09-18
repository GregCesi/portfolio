# Évaluation — Run 2, itération 3 (commit `5f75ab1`)

## Évaluation Mode

**Achevé :** `playwright`. Serveur de dev déjà en écoute sur `http://localhost:3000` (`curl` → 200). Navigation, snapshots et captures via Playwright MCP pour la première passe visuelle, puis scripts Node **indépendants** (package `playwright` 1.63.0 + `pngjs`, installés dans un dossier scratchpad hors dépôt, chromium pris directement dans le cache `~/Library/Caches/ms-playwright` de la machine — même famille d'outillage que le générateur, mais code entièrement réécrit par moi, aucune réutilisation de son script) pour toutes les mesures programmatiques : contraste par échantillonnage de pixels réellement rendus, `scrollHeight`/`clientHeight`, `getComputedStyle`, simulation clavier. `npm run lint`, `npm run build`, `npm run generate`, `npx nuxi typecheck` exécutés en plus pour P3.

**Transparence méthodologique (dans le même esprit que le générateur et l'évaluateur précédent) :** mon propre harnais m'a donné plusieurs faux positifs pendant cet audit, tous identifiés et corrigés avant de conclure — détaillés dans la section P2 ci-dessous, parce qu'ils changent la lecture d'un des résultats.

## Synthèse

**P2 (Contraste) passe enfin**, et de façon solide : j'ai remesuré indépendamment, sur pixels réellement rendus, un pire cas **déterministe** (pas juste "espéré" comme aux itérations précédentes) — un fond blanc pur forcé sur tout le viewport juste au-dessus du canvas (entre le canvas à `z-index:-10` et le contenu réel), qui simule littéralement "une étoile blanche pleine derrière chaque glyphe, partout, en même temps", plutôt que d'attendre qu'une vraie étoile passe par hasard au bon endroit pendant la fenêtre de capture. 37 zones desktop (1440×900) + 8 zones mobile (375×667) — Header, menu desktop, barre mobile, repère "01/05", Hero, et les têtes/grilles/frises des 4 sections restantes via `.panel-inset` — passent toutes avec une marge confortable (6,1:1 à 16,5:1). L'accusé de réception clavier (`.queued-hint`) passe aussi, mais avec la marge la plus faible du site : **5,03:1** au creux de sa pulsation avec étoile blanche forcée derrière — je détaille pourquoi il m'a fallu trois correctifs sur mon propre script pour arriver à ce chiffre fiable, deux d'entre eux ayant produit des faux "FAIL" trompeurs en cours de route.

**Mais une porte bloquante différente échoue : P7 (Tenue à l'écran).** À 375×667, la frise de la timeline "Projet phare" (`.roadmap__timeline`, 6 étapes) déborde de son conteneur de 129 px et ce débordement est **coupé par `overflow: hidden`** plutôt que d'être inclus dans la pagination en sous-écrans — sur les 6 étapes, seules les deux premières ("Étape 1 Collecte", "Étape 2 Tri amont") sont visibles ; "Extraction", "Scoring", "Catégories" et "Décision" sont invisibles et inatteignables sur mobile, quel que soit l'sous-écran actif du panneau de contenu (qui, lui, est bien paginé par les flèches ‹ ›). C'est exactement le cas que la porte P7 décrit : *« à 375×667, un texte coupé... au lieu d'être découpé en sous-écrans »*. Le `generator-state.md` de cette itération affirme pourtant : *« Vérifié : les 5 tailles requises... tiennent toujours exactement »* — cette affirmation est fausse pour cette section à cette taille, contredite par une mesure directe (`scrollHeight` 645 vs `clientHeight` 516 sur `.section-inner`). C'est le même type de défaut structurel que P2 aux itérations 1 et 2 : une vérification annoncée comme faite et exhaustive qui ne l'était pas en réalité pour un cas précis.

Conformément à la grille, cette porte échouée plafonne de nouveau les quatre critères à 5/10 chacun — mais pour une raison entièrement différente de celle des itérations précédentes, ce qui est important pour la suite : ne pas re-auditer le contraste, corriger le débordement de la frise.

## Portes bloquantes

| Porte | Statut | Preuve |
|---|---|---|
| P1 Contenu | **PASS** | Texte extrait par script (pas juste lu visuellement) pour Hero, Parcours (frise 6 entrées), Méthode (4 cartes), Projet phare (kicker/titre/sous-titre + étape 1), Projets (3 cartes + tags + Contact), comparé mot pour mot à `content/portfolio.md`. LinkedIn et CV, marqueurs vides dans le contenu, correctement masqués (`contact__list` ne contient que 2 `<li>` : E-mail, GitHub ; pas de bouton CV dans le DOM). |
| P2 Contraste | **PASS** | Voir Synthèse et détail ci-dessous. 45 zones desktop+mobile mesurées sur pire cas déterministe (fond blanc forcé), 0 échec ; 1 zone (accusé clavier) mesurée séparément avec sa propre méthodologie, passe à 5,03:1. |
| P3 Build | **PASS** | `npm run lint` → 0 erreur. `npm run build` → succès. `npm run generate` → succès (warnings sourcemap Tailwind préexistants, non applicatifs). `npx nuxi typecheck` → échoue toujours avec exactement la même erreur d'environnement déjà documentée aux itérations précédentes (`ERR_PACKAGE_PATH_NOT_EXPORTED` sur `typescript/package.json` résolu par le cache npx de la machine, aucun fichier du projet référencé) — reproduite à l'identique, pas un nouvel échec, pas comptée comme bloquante. Console navigateur : 0 erreur, 0 warning sur l'ensemble des parcours de test (mesures de contraste, navigation clavier complète, clics rapides répétés). |
| P4 Mobile 375×667 | **FAIL** | Même cause que P7 : la frise de Projet phare a 4 de ses 6 entrées invisibles et inatteignables (`gan-harness/screenshots/eval3-BUG-roadmap-timeline-clipped-375.png`). Les 4 autres sections (Start, Parcours, Méthode, Projets) tiennent parfaitement et se découpent proprement en sous-écrans, vérifié par capture (`eval3-mobile-375-*.png`) et par mesure (`scrollHeight === clientHeight` sur leur `.section-inner`). |
| P5 Effet 3D | **PASS** | Canvas hyperspace présent et animé (étoiles à positions variables sur les échantillonnages successifs). Planète 3D texturée visible sur Projet phare (sphère brun/orangé avec relief), non re-testée étape par étape pour le fondu de texture (mécanique héritée, non touchée par ce commit). |
| P7 Tenue à l'écran | **FAIL** | Mesuré aux 5 tailles × 5 sections (25 mesures) : `.section-viewport` (l'élément 100vh) tient exactement partout (`scrollHeight === clientHeight`, confirmé à 1920×1080, 1440×900, 1280×720, 768×1024, 375×667). Mais `.section-inner` de Projet phare déborde : **645 vs 516 à 375×667** (débordement de 129 px, coupé par `overflow:hidden`, cf. P4) et **877 vs 869 à 768×1024** (8 px, mineur — la 6ᵉ étiquette "Étape 6 Décision" reste entièrement lisible sur capture, aucune perte de contenu à cette taille, mais techniquement hors de la contrainte "aucune section ne déborde"). |
| P8 Menu | **PASS** | Libellés toujours visibles en mono capitales, précédés du numéro. Item actif : pleine opacité + accent + trait (mesuré 6,49:1). Item inactif : mesuré 6,42:1 (largement lisible, pas juste "présent dans le DOM"). Barre mobile : numéros + libellé de l'actif, contraste mesuré 6,08–6,49:1. |
| P9 Direction artistique | **PASS** | `document.fonts` → uniquement Fraunces, Inter, IBM Plex Mono (aucune trace de Baloo 2). `grep box-shadow` sur les sources du dépôt → aucune occurrence ; le seul `box-shadow` détecté à l'exécution appartient au panneau flottant Nuxt DevTools (outil de dev, absent d'un build réel), pas à l'application. Titre Hero : 56 px pile au plafond à 1440×900 **et** à 1920×1080 (`clamp()` correctement borné). Titres de section : `clamp(1.5rem, …, 2.5rem)` = 40 px max, cohérent avec la spec. Texte aligné à gauche sur grille dans les 5 sections, aucun bloc centré hors Hero. Filets 1 px à faible opacité utilisés pour structurer partout. |
| P6 Périmètre | **PASS** | `git branch --show-current` → `ia-refonte`. `git diff efb489d..5f75ab1 -- package.json package-lock.json` → vide, aucune dépendance ajoutée. Un seul commit pour cette itération (`5f75ab1`). |

### Détail P2 — pourquoi ça passe, et la transparence que je dois sur mon propre harnais

**Méthodologie retenue.** Plutôt que d'échantillonner le canvas en espérant capturer une étoile claire au bon endroit (méthode des itérations précédentes, dépendante de la chance), j'ai inséré un calque blanc opaque plein écran entre le canvas (`z-index:-10`) et le contenu réel (`z-index:auto`/positif), ce qui force déterministiquement "une étoile blanche pleine derrière chaque glyphe, partout" — le pire cas exact que la consigne demande, sans dépendre du hasard. Texte masqué (`color: transparent !important`) pour révéler ce qu'il y a réellement derrière, sur plusieurs points de chaque zone, avec la couleur CSS réelle recomposée dessus ensuite.

**Résultat, 37 zones desktop + 8 zones mobile, 0 échec**, marges généralement confortables (6,08:1 à 16,48:1) : Header (nom 15,45:1, sous-titre 6,08:1), menu desktop (item inactif 6,42:1, actif 6,49:1), barre mobile, repère "01/05", Hero (titre 15,45:1, texte 6,08:1, boutons 6,49:1), et les têtes/grilles/frises des 4 sections restantes via `.panel-inset` (Parcours, Méthode, Projet phare, Projets — titres, intros, accents, textes de carte, tags, bloc Contact). La classe `--panel-bg` à 96 % d'opacité, appliquée uniformément, tient sa promesse : composée sur un fond blanc pur forcé, elle donne (18,17,16) — quasiment opaque — ce qui explique la marge confortable partout où elle s'applique en fond réel non affecté par une opacité de groupe.

**L'accusé de réception clavier (`.queued-hint`) est le seul cas à part**, parce que son `opacity` CSS (0,85 au creux de la pulsation) s'applique au groupe entier (fond du panneau + bordure + texte), pas seulement au texte — ce qui dilue aussi la protection du panneau, pas seulement la lisibilité du texte. Panel-bg composé sur blanc forcé, puis l'ensemble composé à 0,85 sur le canvas réel, donne un fond de secours à (54,53,52) (pas (18,17,16)) au pire moment de la pulsation. Texte accent composé dans les mêmes conditions : (209,156,102). Contraste final : **5,03:1** — au-dessus du seuil 4,5:1, mais avec une marge nettement plus faible que partout ailleurs sur le site (le prochain zone la plus proche du seuil est à 6,08:1). Ce n'est pas un échec, mais je le signale au générateur comme le point le plus fragile du site si `--panel-bg` ou l'opacité de la pulsation devaient encore bouger.

**Faux positifs rencontrés sur mon propre script, corrigés avant de conclure (transparence, même exigence que celle appliquée au générateur) :**
1. *Artefact de transition CSS.* En posant `color: transparent` sur `.menu-item` ou `.hero__btn--primary` (qui ont `transition: color 0.2s`), une capture immédiate lisait une couleur **en cours de fondu**, pas la valeur finale — mesuré une fois `rgb(156,164,58)`, un mélange exact entre l'ancienne couleur et transparent à 25 % de la transition. Corrigé en désactivant globalement `transition`/`animation` avant la mesure (sauf pour le test dédié à l'accusé clavier, où l'animation est justement ce qu'on veut capturer).
2. *Artefact de bordure.* Sur les éléments à bordure pleine (`.hero__btn--primary`, bordure 1 px ; `.menu-item.is-active`, bordure gauche 2 px), `color: transparent` ne masque pas `border-color` (propriété distincte) — échantillonner trop près du bord captait la bordure, pas le fond réel. Corrigé en excluant la largeur de bordure + 1 px de la zone échantillonnée.
3. *Contamination par le panneau flottant Nuxt DevTools.* Le plus coûteux en temps : l'accusé de réception clavier se trouve exactement sous le panneau flottant Nuxt DevTools par défaut (`nuxt-devtools-panel`, dans un shadow DOM, donc invisible à une recherche DOM classique — `x:659,y:861,w:121,h:30`, chevauchement direct avec `.queued-hint` à `x:690,y:838,w:59,h:33`). Une première mesure donnait 2,43:1 (FAIL) à cause de pixels du panneau DevTools (blanc/clair) capturés à la place du fond réel de l'app. Confirmé par comparaison d'images (ASCII des pixels), par un clone statique de l'élément reproduisant le même artefact, et enfin par recherche des hosts de shadow DOM (`nuxt-devtools-frame`, `nuxt-devtools-inspect-panel`). Supprimé avant remesure → fond réel (54,53,52) au lieu de (255,255,255), cohérent avec le calcul analytique. C'est le même type de faux positif que l'évaluateur de l'itération 2 avait déjà rencontré et documenté pour la barre mobile — je le retrouve ici sur une zone différente, confirmant que c'est un risque systématique de ce type de test en environnement `npm run dev`, pas un hasard isolé.

### Détail P7/P4 — le nouveau défaut trouvé

`app/components/sections/Roadmap/RoadmapSection.vue` : sur mobile, la mise en page empile planète → contenu (sous-écrans, paginé par `useRoadmapState`) → **frise complète des 6 étapes** (`RoadmapTimeline.vue`, liste statique, jamais paginée). À 375×667, l'espace disponible dans `.section-inner` (516 px) ne suffit pas pour planète + carte de contenu + liste complète de 6 étapes ; la frise déborde de 129 px et ce débordement est simplement coupé par `overflow: hidden` sur `.section-inner`, sans avertissement ni scroll. Capture à l'appui : `gan-harness/screenshots/eval3-BUG-roadmap-timeline-clipped-375.png` montre "Étape 1 Collecte" et "Étape 2 Tri amont" seuls visibles, rien n'indique à l'utilisateur qu'il existe 4 étapes de plus dans cette liste (même si le panneau de contenu, lui, affiche bien "Étape 1 / 6").

Pistes de correction, au choix du générateur :
- Inclure la frise dans le même mécanisme de sous-écran que le contenu (n'afficher que l'entrée active de la frise sur mobile, ou une version compacte à une seule ligne qui suit l'étape active).
- Remplacer la frise verticale complète par un indicateur compact sur mobile uniquement (ex. une barre de progression à 6 segments, déjà dans l'esprit "instrument de bord" de la DA), et garder la frise verticale complète à partir de 768px où elle tient.
- Réduire la hauteur de la planète ou du bloc contenu sur mobile pour faire de la place — risque de re-casser l'équilibre déjà trouvé pour les autres contraintes.

## Critères notés (plafonnés à 5/10 — porte P7 en échec)

| Critère | Score | Poids | Pondéré |
|---|---|---|---|
| Design Quality | 5/10 (plafonné ; ≈8,5 hors plafond — grille éditoriale cohérente, hiérarchie claire dans les 5 sections, DA "instrument de bord" bien tenue) | 0.3 | 1.5 |
| Originality | 5/10 (plafonné ; ≈8 hors plafond — planète + timeline job-search restent le seul vrai "wow", sobre, au service du contenu) | 0.2 | 1.0 |
| Craft | 5/10 (plafonné ; ≈7 hors plafond — technique `.panel-inset` élégante et bien pensée pour P2, mais une affirmation de vérification P7 "tient toujours exactement" s'avère fausse pour un cas réel, non détectée par le propre script du générateur) | 0.3 | 1.5 |
| Functionality | 5/10 (plafonné ; ≈7,5 hors plafond — boutons Hero, clavier, file d'attente, aria-labels, SEO tous fonctionnels et vérifiés en direct, mais 4 des 6 étapes du Projet phare sont un contenu réel rendu inatteignable sur mobile) | 0.2 | 1.0 |
| **TOTAL** | | | **5.0/10** |

## Verdict : FAIL (seuil : 7.0)

## Critical Issues (must fix)

1. **P7/P4 — Frise "Projet phare" coupée sur mobile (375×667) : 4 des 6 étapes invisibles et inatteignables** : `app/components/sections/Roadmap/RoadmapTimeline.vue` rendu dans `.roadmap__timeline` (`RoadmapSection.vue`), à l'intérieur de `.section-inner` qui a `overflow: hidden`. Mesuré : `scrollHeight` 645 px contre `clientHeight` 516 px. Preuve visuelle : `gan-harness/screenshots/eval3-BUG-roadmap-timeline-clipped-375.png`. Corriger en intégrant la frise à la pagination mobile existante (comme le panneau de contenu) ou en la remplaçant par un indicateur compact sur mobile. Revérifier avec la même mesure (`scrollHeight` vs `clientHeight` de `.section-inner`, pas seulement de `.section-viewport`) aux 5 tailles requises — mon script a testé les deux niveaux, celui du générateur ne semble avoir testé que le niveau extérieur (qui, lui, tient toujours grâce à `overflow: hidden`, ce qui masque le problème sans le résoudre).

## Major Issues (should fix)

1. **P7 — débordement mineur à 768×1024 (8 px, Projet phare)** : `.section-inner` mesuré à 877 px de `scrollHeight` contre 869 px de `clientHeight`. Aucun texte perdu sur capture (`Étape 6 Décision` entièrement lisible), mais techniquement hors de la contrainte "aucune section ne déborde". Probablement résolu par la même correction que le point critique ci-dessus.
2. **Marge de contraste tendue sur l'accusé de réception clavier (5,03:1, la plus faible du site)** : `SlideContainer.vue`, `.queued-hint`. Passe la porte AA, mais avec beaucoup moins de marge que le reste (6,08:1 à 16,48:1 ailleurs) à cause de l'opacité de groupe (0,85) qui dilue aussi la protection du panneau, pas seulement le texte. Si `--panel-bg` doit encore baisser un jour, cette zone cassera en premier. Piste : soit remonter encore le creux de la pulsation (0,85 → 0,9), soit séparer l'opacité du texte de celle du fond (fond toujours à pleine opacité, seul le texte pulse).

## Minor Issues (nice to fix)

1. Zone vide en bas des sous-écrans mobile (signalée itération 1, toujours non retouchée) — non bloquant, non re-vérifié en détail ce tour-ci.
2. `npx nuxi typecheck` reste cassé par un problème d'environnement (résolution de `typescript/package.json` par npx) indépendant du code — vaudrait la peine de documenter cette limitation dans le README pour ne pas la re-découvrir à chaque itération.

## What Improved Since Last Iteration

- **P2 est résolu, et de façon rigoureuse** : contrairement aux itérations 1 et 2 où seules les zones explicitement signalées avaient été corrigées, cette itération a bien fait l'audit systématique demandé depuis le début — 45 zones vérifiées indépendamment sur un pire cas déterministe, 0 échec réel (les 2-3 "échecs" rencontrés en cours de route étaient tous des artefacts de mon propre script, pas du site).
- La technique `.panel-inset` (fond en pseudo-élément absolu, `inset` négatif, `isolation: isolate`) est une solution élégante et bien documentée au vrai problème (protéger le texte sans risquer la contrainte "tient dans l'écran") — meilleure que d'ajouter du vrai padding comme suggéré comme option de repli à l'itération précédente.
- Le partage d'une seule custom property `--panel-bg` au lieu de valeurs dispersées (reproché explicitement à l'itération 2) est fait.
- Aucune régression détectée sur les boutons Hero, la navigation clavier (y compris la file d'attente et son accusé de réception), les aria-labels, le SEO, ou la console.

## What Regressed Since Last Iteration

- Rien n'a régressé au sens strict parmi ce qui était déjà vérifié PASS. Mais un défaut **préexistant et non détecté** (le débordement de la frise Projet phare sur mobile) a été mis au jour par cet audit — il n'est pas certain qu'il soit apparu avec ce commit précis ou qu'il existait déjà avant (la frise n'a pas été modifiée par ce commit d'après le diff), mais il n'avait jamais été signalé comme vérifié à tort jusqu'à maintenant, exactement comme le Header ne l'avait pas été avant l'itération 2 pour P2.

## Specific Suggestions for Next Iteration

1. Corriger le débordement de la frise Projet phare sur mobile (voir Critical Issues) — c'est la seule porte bloquante restante.
2. Une fois corrigé, revérifier **spécifiquement** `.section-inner` (pas seulement `.section-viewport`) aux 5 tailles requises : mon script a mesuré les deux niveaux et c'est le niveau intérieur qui a révélé le problème, le niveau extérieur restant toujours conforme grâce à `overflow: hidden` qui masque plutôt que résout.
3. Ne pas ré-auditer le contraste : P2 est solide, vérifié indépendamment avec un pire cas déterministe plutôt qu'un échantillonnage optimiste. Le seul point à surveiller si `--panel-bg` bouge encore est l'accusé de réception clavier (marge 5,03:1, la plus faible du site).
4. Envisager, à root cause, un geste plus général : chaque fois qu'un `generator-state.md` affirme "vérifié aux N tailles requises", envisager de faire tester ce script de vérification sur un cas volontairement dégradé (ex. forcer temporairement un débordement) pour confirmer qu'il détecterait bien un vrai échec — ça aurait ici révélé que le script ne regardait que `.section-viewport`, pas `.section-inner`.

## Screenshots

Dossier : `gan-harness/screenshots/` (préfixe `eval3-` pour ce run).
- `eval3-desktop-1440-1-hero.png` à `eval3-desktop-1440-5-projets.png` : vue d'ensemble des 5 sections à 1440×900, DA "instrument de bord" cohérente, aucune trace de fond transparent sur le texte.
- `eval3-mobile-375-1-hero.png` à `eval3-mobile-375-5-projets.png` : parcours mobile section par section. Toutes correctes sauf Projet phare.
- `eval3-BUG-roadmap-timeline-clipped-375.png` : preuve du défaut P7/P4 — seules 2 des 6 étapes de la frise sont visibles, le reste est coupé sans indication.

Score pondéré total : 5.0 / 10
