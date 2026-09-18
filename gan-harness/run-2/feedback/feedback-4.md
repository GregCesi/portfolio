# Évaluation — Run 2, itération 4 (commit `15853e6`)

## Évaluation Mode

**Achevé :** `playwright`. Serveur de dev déjà en écoute sur `http://localhost:3000` (`curl` → 200). Package `playwright` 1.63.0 installé indépendamment dans le scratchpad de session (hors dépôt), chromium résolu automatiquement par playwright depuis le cache `~/Library/Caches/ms-playwright` de la machine — même famille d'outillage que le générateur et l'évaluateur précédent, mais tous les scripts de mesure ont été réécrits pour cette itération, aucune réutilisation de code. `npm run lint`, `npm run build`, `npm run generate`, `npx nuxi typecheck` exécutés en plus pour P3. Captures dans `gan-harness/screenshots/` (préfixe `eval4-`).

## Synthèse

**Toutes les portes bloquantes passent pour la première fois de ce run.** La correction ciblée de P7/P4 (frise « Projet phare » transformée en segments compacts sous 768px, cf. `RoadmapTimeline.vue`) est réelle et vérifiée indépendamment : 25/25 mesures `scrollHeight` vs `clientHeight` sur `.section-inner` (pas `.section-viewport`) à 0 débordement, sur les 5 tailles requises × 5 sections — chiffres identiques à ceux annoncés par le générateur, ce qui n'était pas le cas à l'itération 3. Les 6 étapes de la frise sont toutes atteignables sur mobile via les segments compacts, sans aucune troncature de texte (le titre complet reste affiché par `RoadmapContent`). Le correctif indépendant sur `ProjectsSection.vue` à 768×1024 est également confirmé (0 débordement mesuré). P2 (Contraste) n'a pas régressé : la classe `.panel-inset` est bien présente sur la racine unique `.rt-root` (confirmé par inspection DOM), et les nouveaux segments compacts eux-mêmes passent la mesure de contraste avec de bonnes marges (6,09:1 inactif, 6,84:1 actif, sur pire cas déterministe fond blanc forcé). Aucune régression détectée sur P1, P3, P5, P6, P8, P9.

**Un défaut réel, non bloquant, a été trouvé pendant l'audit fonctionnel** : le bouton « Étape suivante » de `RoadmapContent` (et par extension la flèche clavier droite / `nextStepAnimated`, qui utilise la même fonction `goToStepAnimated` dans `useRoadmapState.ts`) met environ **1,9 à 2,1 secondes** à faire apparaître le contenu de l'étape suivante — le texte est masqué (`fadeOut`, 0,3s) puis reste invisible pendant l'animation de la ligne de progression (1,5s) avant que `currentStep` ne soit mis à jour et que le texte réapparaisse. Ce n'est pas une régression de cette itération (le fichier `useRoadmapState.ts` n'a pas été touché par ce commit, la frise timeline liée à cette animation existait déjà) et ce n'est pas un blocage de porte, mais c'est un vrai défaut de perception de réactivité que je documente en détail plus bas, avec en plus une asymétrie de comportement entre « next » (texte se fige avant de disparaître) et « prev » (le modèle de données change *avant* le fondu, potentiellement visible comme un flash de contenu).

## Portes bloquantes

| Porte | Statut | Preuve |
|---|---|---|
| P1 Contenu | **PASS** | Spot-check indépendant sur plusieurs zones (étape 6 Roadmap « Décision » / « Le système classe, je décide. », cartes Projets, Contact) comparé à `app/data/content.ts` et `content/portfolio.md` — texte identique mot pour mot. Rien n'a été touché dans le texte par ce commit (diff limité à CSS/layout/template de structure). |
| P2 Contraste | **PASS** | Mesure indépendante des nouveaux éléments : `.rt-compact__seg` inactif (fond `rgba(8,7,6,0.96)` composé sur blanc forcé → (18,17,16), texte `rgba(237,232,222,0.6)` → contraste **6,09:1**), actif (fond `rgb(201,138,75)` opaque, texte `#0a0908` → **6,84:1**). Classe `.roadmap__timeline.panel-inset` confirmée présente sur `.rt-root` par inspection DOM (`classList: ["rt-root","roadmap__timeline","panel-inset"]`), donc la régression théorique que le générateur avait identifiée et corrigée (perte de la classe à cause de la double racine de template) n'est pas reproduite dans le commit final. `.panel-inset::before` a bien `background-color: rgba(8, 7, 6, 0.96)` (valeur inchangée par rapport à l'itération 3). |
| P3 Build | **PASS** | `npm run lint` → 0 erreur. `npm run build` → succès. `npm run generate` → succès (mêmes warnings sourcemap Tailwind préexistants, non applicatifs). `npx nuxi typecheck` → échoue toujours avec exactement la même erreur d'environnement documentée depuis l'itération 2 (`ERR_PACKAGE_PATH_NOT_EXPORTED` sur `typescript/package.json` résolu par le cache npx de la machine, aucun fichier du projet référencé) — reproduite à l'identique, non comptée comme bloquante. Console navigateur : uniquement des warnings de performance WebGL du driver (`GPU stall due to ReadPixels`), 0 erreur/warning Vue, sur un parcours complet (navigation clavier avant/arrière, sous-écrans, molette, spam de touches). |
| P4 Mobile 375×667 | **PASS** | Les 6 segments de la frise compacte sont cliquables et atteignables (`aria-label` complet par segment, `aria-current="step"` correctement mis à jour), le titre complet de l'étape active s'affiche en entier sans troncature via `RoadmapContent` pour chacune des 6 étapes (vérifié programmatiquement, capture `eval4-roadmap-mobile-375-clicked-step6.png` : titre « Décision » et les deux paragraphes complets visibles). Les 4 autres sections tiennent et se découpent en sous-écrans (captures `eval4-375x667-*.png`). |
| P5 Effet 3D | **PASS** | Canvas hyperspace présent (1440×900). Planète 3D visible (canvas 460×460), fondu de texture confirmé en comparant deux captures de la planète avant/après changement d'étape (images différentes en octets). |
| P7 Tenue à l'écran | **PASS** | Mesuré indépendamment sur `.section-inner` (pas `.section-viewport`) aux 5 tailles requises × 5 sections = 25 mesures, **0 débordement partout** (`scrollHeight === clientHeight` sur les 25 cas). Chiffres bruts identiques à ceux du `generator-state.md` (925/925, 745/745, 565/565, 869/869, 516/516 pour toutes les sections). Non-chevauchement planète / contenu / frise vérifié à 8 largeurs (375, 480, 767, 768, 1023, 1024, 1440, 1920px) via intersection de rectangles : 0 chevauchement à aucune largeur. |
| P8 Menu | **PASS** | Non modifié par ce commit. Spot-check : libellés « 01 START » à « 05 PROJETS » visibles en mono capitales, section active à l'accent avec trait, comportement inchangé depuis l'itération 3 (déjà validé). |
| P9 Direction artistique | **PASS** | `document.fonts` → uniquement Fraunces, Inter, IBM Plex Mono (aucun Baloo 2). `grep box-shadow` sur `app/` → aucune occurrence. Titre Hero mesuré à **56px** pile à 1920×1080 et 1440×900. Titre de section (Parcours) mesuré à **40px** à 1920×1080. Cohérent avec l'itération 3, aucune régression. |
| P6 Périmètre | **PASS** | `git branch --show-current` → `ia-refonte`. `git diff efb489d..15853e6 -- package.json package-lock.json` → vide. Un seul commit pour cette itération (`15853e6`). |

## Critères notés (aucune porte en échec — pas de plafonnement)

| Critère | Score | Poids | Pondéré |
|---|---|---|---|
| Design Quality | 8/10 | 0.3 | 2.4 |
| Originality | 8/10 | 0.2 | 1.6 |
| Craft | 7/10 | 0.3 | 2.1 |
| Functionality | 8/10 | 0.2 | 1.6 |
| **TOTAL** | | | **7.7/10** |

### Justification des scores

**Design Quality (8/10)** : grille éditoriale cohérente et bien tenue sur les 5 sections, hiérarchie claire (mono/serif/sans respectée partout), la frise compacte mobile reprend le langage visuel existant (cercles pleins/vides devenus segments numérotés) sans rupture de style. Rendu propre à 375, 768, 1280, 1440 et 1920px (captures à l'appui). Pas de 9-10 car la frise compacte à 375px (segments de 25,6px de large, `1.6rem`) est visuellement un peu serrée comparée à l'aisance du reste de la mise en page.

**Originality (8/10)** : la planète + timeline job-search reste le seul vrai effet « wow », sobre et toujours au service du contenu — inchangé et toujours convaincant, direction « instrument de bord » bien tenue, aucun retour de glow/glassmorphism/dégradé violet.

**Craft (7/10)** : la technique `.panel-inset` reste élégante, et la correction P7/P4 est un vrai correctif de fond (racine du problème traitée, pas un contournement — le générateur a même documenté et corrigé lui-même un bug de racine de template Vue avant qu'il ne devienne une régression P2, signe de rigueur). Mais un défaut de craft réel a été trouvé en testant l'app en direct : le bouton « Étape suivante » (et la flèche clavier droite) prend **~1,9 à 2,1 secondes** avant que le nouveau contenu n'apparaisse (texte invisible pendant 1,5s pendant que seule la ligne de progression anime), alors que le chemin « prev » met à jour le modèle de données *avant* même le fondu de sortie — ce qui crée un risque de flash de contenu visible sur `prev` et une lenteur perçue sur `next`, deux comportements asymétriques pour une même interaction. Voir détail plus bas. C'est un défaut pré-existant (fichier `useRoadmapState.ts` non touché par ce commit), pas une régression de cette itération, mais il abaisse la note de craft parce qu'il est présent dans le produit testé aujourd'hui et qu'un développeur senior l'aurait remarqué en testant sa propre fonctionnalité à un rythme réaliste.

**Functionality (8/10)** : boutons Hero vérifiés câblés (« Voir mes projets » → section Projets active confirmée via menu `aria-current`, « Me contacter » → section Projets + bloc Contact visible dans le viewport). Les 3 chemins de navigation Roadmap (segments compacts, boutons ‹ › de `RoadmapContent`, flèches clavier) restent synchronisés et convergent tous vers le bon état final, sans désynchronisation permanente ni crash — mais avec la latence asymétrique décrite en Craft. File d'attente clavier fonctionnelle (accusé de réception « ··· » visible pendant un spam de touches, pas de crash). SEO présent et exact (title, description, OG, `lang="fr"`). Console propre. Non noté à 9-10 à cause de la latence de navigation Roadmap qui dégrade la perception de réactivité d'une fonctionnalité centrale du site (le « Projet phare »).

## Verdict : PASS (seuil : 7.0)

## Détail — le défaut de timing trouvé sur la navigation Roadmap (non bloquant)

`app/composables/useRoadmapState.ts`, fonction `goToStepAnimated` :
- **Direction "next"** (`nextStepAnimated`, utilisée par le bouton `rc__btn` « › » et la flèche clavier droite) : `fadeOut(content)` (0,3s) → `animateLineGrow(line)` (1,5s, pendant lequel le texte reste invisible) → **puis seulement** `currentStep.value = newStep` → `fadeIn(content)` (0,3s) + fondu de texture planète en parallèle. Mesuré en isolation avec un seul clic et lecture de `.rc__step` toutes les 200ms : le texte affiche encore « Étape 1 / 6 » jusqu'à `t≈1934ms`, où il passe à « Étape 2 / 6 ».총 ~2s avant que le contenu ne soit lisible.
- **Direction "prev"** (`prevStepAnimated`, bouton « ‹ » et flèche clavier gauche) : `currentStep.value = newStep` est appliqué **avant** le `fadeOut`, donc le nouveau titre/texte remplace l'ancien dans le DOM alors que l'élément est encore à pleine opacité, avant même que le fondu de sortie ne commence — un utilisateur qui regarde l'écran au moment du clic peut voir le nouveau contenu apparaître instantanément puis se mettre à clignoter (fade out → fade in du contenu déjà à jour), plutôt qu'une transition propre de l'ancien contenu vers le nouveau.

Piste de correction pour une prochaine itération (hors périmètre de cette évaluation, à documenter pour le générateur) : harmoniser les deux branches pour que `currentStep.value` soit mis à jour au même point du cycle d'animation dans les deux directions (par exemple toujours après le `fadeOut`, jamais avant), et envisager de raccourcir `animateLineGrow`/`animateLineShrink` (1,5s) ou de découpler la mise à jour du texte de la durée de l'animation de ligne, pour que le contenu réapparaisse plus vite qu'en ~2s.

## Critical Issues (must fix)

Aucune — toutes les portes bloquantes passent.

## Major Issues (should fix)

1. **Latence et asymétrie de la navigation Roadmap animée** (`app/composables/useRoadmapState.ts`, `goToStepAnimated`) : ~1,9-2,1s avant que le contenu de l'étape suivante ne soit lisible sur le chemin « next » ; le chemin « prev » met à jour le modèle de données avant le fondu de sortie, risque de flash de contenu visible. Voir détail ci-dessus pour la piste de correction. Non bloquant pour aucune porte, mais affecte la perception de réactivité d'une fonctionnalité centrale (Projet phare) et mérite d'être corrigé avant un prochain tour.

## Minor Issues (nice to fix)

1. **Taille des segments compacts de la frise mobile** (`.rt-compact__seg`, `RoadmapTimeline.vue`) : 1,6rem (25,6px) de côté — au-dessus du minimum WCAG 2.5.8 AA (24px) mais net en-dessous des 44px recommandés pour une cible tactile confortable. Fonctionne, mais un peu serré au doigt sur un petit écran.
2. Marge de contraste tendue sur l'accusé de réception clavier (`.queued-hint`, 5,03:1 mesuré à l'itération 3, non retouché cette itération, non re-mesuré ce tour-ci sur consigne explicite de ne pas ré-auditer P2 ailleurs que sur la frise Roadmap) — signalé pour mémoire.
3. `npx nuxi typecheck` reste cassé par le même problème d'environnement (résolution de `typescript/package.json` par npx) indépendant du code, documenté depuis l'itération 2, toujours pas noté dans le README comme suggéré à l'itération 3.
4. Zone vide en bas des sous-écrans mobile (signalée itération 1) — non retouchée, non re-vérifiée en détail ce tour-ci.

## What Improved Since Last Iteration

- **P7/P4 est résolu, avec un vrai correctif de fond** : la frise Roadmap intègre maintenant une version compacte pour mobile plutôt que de continuer à déborder silencieusement ; vérifié indépendamment avec la même méthodologie que celle qui avait révélé le bug à l'itération 3 (`.section-inner`, pas `.section-viewport`), 25/25 mesures à 0 débordement.
- Le générateur a documenté et corrigé lui-même, avant que je ne le trouve, un risque de régression P2 (perte de la classe `panel-inset` à cause d'une double racine de template Vue) — signe d'un auto-contrôle plus rigoureux qu'aux itérations précédentes.
- Le débordement indépendant de 8px sur Projets à 768×1024 est également corrigé et vérifié (0 débordement mesuré).
- Aucune régression détectée sur les portes déjà validées (P1, P2 ailleurs que la frise, P3, P5, P6, P8, P9).
- C'est la première itération de ce run où **toutes** les portes bloquantes passent simultanément.

## What Regressed Since Last Iteration

- Rien n'a régressé parmi ce qui était déjà validé PASS. Le défaut de timing sur la navigation Roadmap découvert cette itération n'est pas une régression (code non touché par ce commit) mais un défaut pré-existant qui n'avait pas été testé à ce niveau de détail (clic isolé + polling every 200ms) aux itérations précédentes.

## Specific Suggestions for Next Iteration

1. Corriger l'asymétrie et la latence de `goToStepAnimated` dans `useRoadmapState.ts` (voir détail ci-dessus) — non bloquant mais recommandé, la fonctionnalité centrale du site mérite une navigation qui se sent réactive.
2. Réévaluer la taille tactile des segments compacts (`.rt-compact__seg`) si un geste de polish est fait sur mobile — actuellement fonctionnel mais serré.
3. Documenter dans le README la limitation connue de `npx nuxi typecheck` en environnement local (erreur `ERR_PACKAGE_PATH_NOT_EXPORTED`, indépendante du code), pour ne pas la re-découvrir à chaque itération.
4. Le site a atteint le seuil de passage — si une itération 5 a lieu, privilégier des corrections de polish (craft) plutôt que de nouveaux gros chantiers, pour ne pas rouvrir de porte déjà fermée.

## Screenshots

Dossier : `gan-harness/screenshots/` (préfixe `eval4-` pour ce run).
- `eval4-{1920x1080,1440x900,1280x720,768x1024,375x667}-{1..5}-{hero,parcours,methode,roadmap,projets}.png` : les 5 sections aux 5 tailles requises, aucun débordement visible, DA cohérente.
- `eval4-roadmap-mobile-375-clicked-step3.png`, `eval4-roadmap-mobile-375-clicked-step6.png` : preuve que les 6 étapes sont atteignables via la frise compacte à 375px, titres complets non tronqués (« Décision » avec ses deux paragraphes entiers visibles à l'étape 6).
- `eval4-roadmap-mobile-375-step4.png` : capture prise en cours de transition warp (artefact de timing de mon script, pas un bug de l'app — la capture propre équivalente est `eval4-roadmap-mobile-375-clicked-step6.png`).

Score pondéré total : 7.7 / 10
