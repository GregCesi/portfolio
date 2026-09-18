# Generator State — Iteration 003

## What Was Built

Voir l'historique git (itérations 001 et 002) pour l'implémentation initiale
des cinq sections, de la navigation et de l'accessibilité, puis les quatre
correctifs bloquants de l'itération 002 (bouton « Me contacter », warning
Vue, chevauchement H1/nav mobile, contraste frise Parcours — les 6 portes
bloquantes passent depuis, score 7,9/10). Cette itération traite les points
Major/Minor de `gan-harness/feedback/feedback-2.md` pour franchir le seuil
de 8/10.

## What Changed This Iteration

- **Hygiène git** : `app/composables/useLayoutDimensions.ts` (diff de
  formatage seul, signalé non committé à 2 itérations de suite) est inclus
  dans le commit de cette itération. `git status` vérifié propre en fin
  d'itération.

- **Performance des assets 3D (spec §4)** — poids total `public/3d` : **28
  Mo → 6,6 Mo** :
  - `public/3d/models/Planet-5.glb` (7,1 Mo) supprimé : confirmé non
    référencé par `grep` dans tout `app/` et `content/` avant suppression
    (`git rm`, récupérable depuis l'historique si besoin).
  - Les 5 textures PNG sources (`planet-bake-1..4.png` + `planet-roughness.png`,
    ~15,8 Mo) supprimées et remplacées par des `.webp` générés avec `cwebp`
    (binaire système `/opt/homebrew/bin/cwebp`, **aucune dépendance npm
    ajoutée** — c'était l'option la plus simple qui ne casse rien, testée en
    premier). Qualité 85, alpha préservé. Résultat : ~15,8 Mo → ~1,1 Mo
    (`planet-bake-1.webp` 161 Ko, `-2` 187 Ko, `-3` 261 Ko, `-4` 257 Ko).
    Comparaison visuelle pixel par pixel (Read tool) avant/après : motif de
    texture identique, aucune dégradation perceptible. `planet-roughness.png`
    était en réalité un fichier orphelin (jamais chargé par le code — le GLB
    embarque ses propres textures dans ses `bufferView`, vérifié en
    inspectant le chunk JSON du `.glb` en Python) : supprimé sans
    remplacement, pas de `.webp` correspondant nécessaire.
  - `app/components/sections/Roadmap/RoadmapPlanet.vue` : chemins de
    chargement des textures mis à jour (`.png` → `.webp`). Le champ
    `planet-bake-5` (sans fichier dédié, la texture d'origine embarquée dans
    le GLB sert pour cette étape, conforme à `content/portfolio.md`) est
    simplifié : suppression du fallback mort vers un chemin
    `/planet-5/planet-bake-5.png` qui n'a jamais existé.
  - Chargement différé après le premier rendu : `RoadmapPlanet.vue` ne monte
    plus `Universal3DModel` (et ne démarre donc le fetch du GLB + textures)
    qu'après `requestIdleCallback` (repli `setTimeout(200ms)` si non
    supporté), déclenché dans `onMounted`. Un espace réservé de la même
    taille (`planetSize`) évite tout décalage de mise en page (CLS) pendant
    ce court délai. Le fond hyperspace (`app/graphics/background/*`) est
    procédural, sans texture lourde : non concerné par ce point.
  - Vérifié par script Playwright indépendant (scratchpad, hors dépôt) :
    uniquement des requêtes `.webp` observées au chargement de la section
    Roadmap, zéro requête `.png` vers les anciens chemins, planète bien
    rendue (canvas présent, texture visible), aucune erreur console.

- **Latence perçue du scroll « Me contacter » sur mobile** (~1,8-2s →
  **~1,05s** mesuré) :
  - `app/components/SlideContainer.vue` (`goTo()`) : le fondu de sortie et le
    fondu d'entrée des sections sont désormais superposés au déplacement du
    wrapper (timeline GSAP avec positions explicites) au lieu d'être
    enchaînés en série. Durée totale de la transition de section : ~1,4s →
    `transitionDuration` (0,8s en temps normal, inchangé en valeur), sans
    raccourcir le déplacement lui-même ni son rendu visuel — seul
    l'enchaînement temporel change.
  - `app/pages/index.vue` (`scrollToAnchor()`) : remplacement de
    `Element.scrollTo({ behavior: 'smooth' })` (durée non contrôlable,
    variable notamment sur mobile) par `gsap.to(scrollArea, { scrollTop:
    targetTop, duration: 0.45, ease: 'power2.out' })`. `scrollTop` est une
    propriété DOM ordinaire, animable nativement par le cœur de GSAP (déjà
    une dépendance du projet) — aucun plugin GSAP supplémentaire nécessaire.
    La logique corrigée à l'itération 2 est préservée à l'identique :
    toujours calculée sur `.section-scroll-area` via `closest()`, toujours
    déclenchée après `section-settled` (transition GSAP totalement
    terminée), jamais de `scrollIntoView()`.
  - Mesuré par polling Playwright (scratchpad, hors dépôt) sur mobile
    375×667 : clic → bloc Contact pleinement visible en **1056 ms** (contre
    ~1,8-2s avant), sans erreur console, sans flottement observé.

- **`user-select: none` global** (`app/assets/css/main.css`) : exception
  ciblée ajoutée sur `#contact` et ses descendants (`user-select: text`), le
  reste du site garde la sélection désactivée (nécessaire au défilement
  tactile propre sur les slides). Vérifié : le texte de l'e-mail de contact
  est désormais sélectionnable (`getComputedStyle(...).userSelect ===
  'text'`), sans changement visuel.

- **Flèches Précédent/Suivant de la Roadmap** (`app/components/sections/Roadmap/RoadmapContent.vue`)
  : remplacement des glyphes plats par un vrai bouton circulaire (fond et
  bordure plats, pas de dégradé, cohérent avec le langage visuel du site) :
  état survol (fond blanc translucide, bordure plus visible), état appui
  (légère réduction d'échelle), état focus clavier (contour blanc, en plus
  du contour générique du site), état désactivé nettement distinct (fond et
  bordure très atténués, `cursor: not-allowed`). Vérifié par script
  Playwright : bouton « précédent » désactivé à l'étape 1 avec le bon style,
  survol du bouton « suivant » change bien le fond, navigation par clic
  fonctionnelle (déblocage du bouton « précédent » après passage à l'étape 2).

## Known Issues

- `npx nuxi typecheck` échoue toujours dans ce sandbox pour la même raison
  d'environnement documentée depuis l'itération 1
  (`ERR_PACKAGE_PATH_NOT_EXPORTED` sur `typescript/package.json` résolu par
  npx) — non liée au code. Revérifié cette itération avec le même
  `vue-tsc`/`typescript` épinglés hors dépôt utilisés à l'itération 2
  (`/private/tmp/claude-501/.../typecheck-tool`) : **0 erreur**.
- `{{LINKEDIN_URL}}` / `{{CV_URL}}` toujours vides dans
  `content/portfolio.md` → lien LinkedIn et bouton CV toujours absents du
  DOM (masquage conforme à la spec, inchangé depuis l'itération 1).
- Le GLB `Planet-1.glb` (5,8 Mo) embarque encore ses propres textures PNG en
  interne (`bufferView`), non recompressées : les réencoder proprement
  demanderait un outil de réécriture GLB (type `gltf-transform`), plus
  risqué et hors du périmètre « ne rien casser » de cette itération pour un
  gain marginal (ces textures embarquées ne sont pas celles utilisées pour
  l'affichage — les textures affichées viennent des fichiers `.webp`
  externes chargés manuellement dans `RoadmapPlanet.vue`).

## Dev Server

- URL : http://localhost:3000
- Status : en cours d'exécution (arrière-plan, `npm run dev -- --port 3000`,
  process déjà actif depuis le début de cette itération, aucun redémarrage
  nécessaire)
- Commande : `npm run dev -- --port 3000`

## Vérifications

- `npm run lint` → 0 erreur, 0 avertissement.
- `npm run build` → succès.
- `npm run generate` → succès (avertissements sourcemap Tailwind
  préexistants, sans rapport avec le code applicatif, documentés depuis
  l'itération 1).
- `npx nuxi typecheck` → échec d'environnement documenté ci-dessus ; 0 erreur
  confirmée via `vue-tsc` pinné hors dépôt (même toolchain qu'à l'itération 2).
- Poids de `public/3d` : **28 Mo → 6,6 Mo** (mesuré par `du -sh`), et **7,1 Mo**
  dans `.output/public/3d` après `npm run generate` (confirmé par inspection
  directe du dossier généré).
- Vérification Playwright indépendante (scratchpad, hors dépôt, package
  `playwright` installé de façon isolée) : aucun warning/erreur console sur
  chargement initial (mobile 375×667) et navigation clavier jusqu'à la
  section Roadmap (desktop 1280×900 et 1440×900) ; requêtes réseau vers les
  textures confirmées en `.webp` uniquement (zéro requête `.png` résiduelle) ;
  planète rendue visuellement identique aux captures de l'itération 2 ;
  bouton « Me contacter » sur mobile : bloc Contact pleinement visible en
  1056 ms après clic ; boutons Précédent/Suivant de la Roadmap : états
  disabled/hover/actif vérifiés par lecture de `getComputedStyle` et clic
  réel ; sélection de texte du bloc Contact confirmée (`user-select: text`).
