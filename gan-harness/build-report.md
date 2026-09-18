## GAN Harness Build Report · run 3

**Brief :** Refonte IA du portfolio v3 : direction générique de film, suivre gan-harness/spec.md et gan-harness/eval-rubric.md, contenu dans content/portfolio.md
**Configuration :** `--skip-planner`, `--pass-threshold 8`, `--max-iterations 3`, mode playwright
**Résultat :** FAIL (7,8 / 10, seuil 8, écart de 0,25)
**Itérations :** 3 / 3 (plafond atteint, pas de plateau : la note brute passe de 7,3 à 7,2 puis 7,75)
**Score final :** 7,8 / 10, sans plafond de porte (P1 à P9 toutes PASS)

### Progression des scores

`iteration 1: 5.0 (brut 7.3, plafonné P9) → iteration 2: 5.0 (brut 7.2, plafonné P4/P7) → iteration 3: 7.8 (aucune porte en échec)`

| Iter | Commit | Design | Originalité | Craft | Fonctionnalité | Portes en échec | Total |
|------|--------|--------|-------------|-------|----------------|-----------------|-------|
| 1 | 7b14a01 | 5 (brut 7,0) | 5 (brut 7,0) | 5 (brut 7,0) | 5 (brut 8,5) | P9 (scrim jugé « carte à fond ») | 5.0 |
| 2 | c926b71 | 5 (brut 7,5) | 5 (brut 8,0) | 5 (brut 6,5) | 5 (brut 7,0) | P4, P7 (sous-écran Projets 3/5 à 375×667 : débordement de 70 px) | 5.0 |
| 3 | ac54416 | 8,0 | 8,0 | 7,5 | 7,5 | aucune | 7.8 |

Le total brut sans plafond était de 7,3 à l'itération 1 et de 7,2 à l'itération 2. Le plafond de 5 a masqué la progression réelle.

### Ce qui a été livré (portes à l'itération 3)

| Porte | Verdict | Mesure clé |
|---|---|---|
| P1 Contenu | PASS | 94 chaînes uniques, 0 écart mot pour mot |
| P2 Contraste | PASS | pire pixel 5,38 à 5,39:1 aux 5 tailles. Le menu est à 55 % au lieu des 35 % de la spec (35 % donne 2,8:1) : écart accepté, le seuil AA prime |
| P3 Build | PASS | lint 0/0, build 0, generate 0, console propre. `npx nuxi typecheck` : voir ci-dessous |
| P4 Mobile | PASS | 25 sous-écrans à 375×667, 0 problème. Idem à 375×568, 320×568 et 390×844 |
| P5 Effet 3D | PASS | fondu de textures sur tous les déclencheurs, y compris sauts non contigus et clics rapides |
| P6 Périmètre | PASS | `package.json` identique à a9169fd, rien hors dépôt, branche `ia-refonte` uniquement |
| P7 Tenue | PASS | `scrollHeight = clientHeight` aux 4 tailles desktop, par section et par plan |
| P8 Menu | PASS | libellés visibles au repos, section active distincte |
| P9 Direction artistique | PASS | Jost 300/400 et Hanken Grotesk 400 seulement, aucune teinte 10°-60°, aucune ombre, aucun scrim, titres ≤ 34,4 px en graisse 300 |

Texte courant mesuré à 16 / 16 / 16 / 17 / 18 px à 375 / 768 / 1280 / 1440 / 1920.

### Problèmes restants (issus de feedback-3.md)

À corriger pour dépasser 8 :

- **Paysage 667×375 (hors grille de tailles imposée)** : le titre du Hero est coupé par l'en-tête, les boutons du Hero et la frise du Projet phare passent sous la barre mobile, et « Voir le code » est sous la navigation (Projets 4/8). Le découpage automatique ne couvre que Projets. C'est le principal point qui retient Craft et Fonctionnalité.
- **Projet phare mobile** : pas de glissement horizontal, le geste n'est câblé que dans `SubscreenTrack` alors que la spec §2.3 le cite pour les sous-écrans.
- **320 px** : l'en-tête « GRÉGOIRE MARCHAND » touche le repère « 05 / 05 » (2 px) et « PROJET PHARE » est à environ 2 px du bord droit.
- **Densité et composition** : Phare desktop chargé (4 blocs) avec un titre centré alors que frise, texte et planète forment trois colonnes. L'unité « filet + titre + texte centré » se répète sur 10 plans. Le Parcours en grille de six entrées reste plus proche d'un CV que d'un carton de générique.

Mineurs :

- Les polices sont servies par Google Fonts (dépendance réseau tierce, pas d'auto-hébergement).
- 22 avertissements de sourcemap Tailwind au build.
- Une rafale de 10 `ArrowDown` n'avance que de 2 sections (file d'une entrée).
- Les chiffres 1-6 de la frise compacte du Phare ne figurent pas dans la liste des libellés autorisés.
- La molette et PageDown ne montrent pas les plans de Méthode/Projets (invite visuelle seulement, conforme à §2.3).
- Le vide d'étoiles autour du texte reste discrètement perceptible derrière certains cartons.
- La planète en vert/bleu saturé aux étapes 5 et 6 est la partie la moins « Interstellar » (texture imposée par le contenu).
- Le contraste transitoire du fondu d'entrée n'a pas été re-mesuré à l'itération 3. Il était de 1,6 à 2,3:1 pendant le fondu à l'itération 2, et il a été considéré comme voulu par la spec.

### Points à trancher par Grégoire

1. **`npx nuxi typecheck` (CLAUDE.md exige 0 erreur).** Le résultat dépend du cache npx hors dépôt : rouge (`ERR_PACKAGE_PATH_NOT_EXPORTED`) chez le générateur, vert (exit 0, et exit 1 sur une erreur injectée) chez l'evaluateur. `vue-tsc` n'est pas une devDependency, et la spec n'autorise pas de nouvelle dépendance. Le substitut `vue-tsc@3` sur les quatre `.nuxt/tsconfig.*.json` donne 0 erreur. Décision à prendre : autoriser `vue-tsc` en devDependency pour rendre la commande déterministe.
2. **Menu à 55 % au lieu de 35 %** : la spec et la porte P2 se contredisent (35 % donne 2,8:1). Les trois evaluations ont retenu 4,5:1. À confirmer, ou à corriger dans la spec.
3. **Méthode et Projets en plans successifs sur desktop** : l'evaluateur de l'itération 2 a jugé l'écart acceptable (§2.3 bis : « les projets comme des plans successifs », tout reste atteignable, aucun défilement). À confirmer, la spec §2.3 prévoit ce découpage pour le mobile.
4. **Rubrique obsolète** : la ligne « Functionality » de `eval-rubric.md` parle encore de « défilement interne des sections longues », ce que la spec §2.3 interdit. Les evaluators ont appliqué la spec, mais la rubrique reste à mettre à jour.

### Durée et coût

- Départ : 18 septembre 2026, 16:29. Durée cumulée des 6 agents, exécutés en séquence : environ 4 h 56 (générateurs 67 + 65 + 40 min, evaluators 33 + 44 + 47 min).
- Tokens des sous-agents : environ 1,37 M (321 k + 196 k + 253 k + 215 k + 172 k + 213 k). Le coût en dollars n'est pas estimé, aucun outil de coût n'a été utilisé.

### Fichiers

- gan-harness/spec.md, gan-harness/eval-rubric.md (entrées, non modifiées par ce run)
- gan-harness/feedback/feedback-1.md, feedback-2.md, feedback-3.md
- gan-harness/generator-state.md
- gan-harness/build-report.md
- gan-harness/screenshots/ : préfixes `run3-it1-`, `run3-it2-`, `run3-it3-` (non commitées)

Le dépôt est sur `ia-refonte`, rien n'a été poussé, `main` et `develop` sont intacts.
