# Évaluation — Itération 1

Commit évalué : `b428dff` (branche `ia-refonte`). Note : au moment du test, `git status`
montrait des modifications non committées, formatage seul (virgules finales,
indentation Prettier) sur 8 fichiers (`useRoadmapState.ts`, `content.ts`,
`WarpEffect.ts`, `nuxt.config.ts`, etc.), sans changement de logique vérifié par
diff. Ce n'est pas une violation de périmètre (rien hors dépôt, aucune dépendance),
mais c'est une négligence d'hygiène : committer ou ne pas laisser traîner un
working tree sale en fin d'itération.

## Mode d'évaluation

**Atteint : `playwright`.** Navigation complète des 5 sections via Playwright MCP
sur `http://localhost:3000`, complétée par des scripts Playwright autonomes
(Node, package `playwright` installé de façon isolée dans le scratchpad, hors
dépôt) pour : mesure de contraste par échantillonnage de pixels réels, test à
375×667 sans outil de resize MCP disponible, inspection de la géométrie DOM
(`getBoundingClientRect`, transform GSAP) pour diagnostiquer un bug de
navigation. Build/generate/lint/typecheck relancés en CLI.

## Portes bloquantes

| Porte | Statut | Preuve |
|---|---|---|
| **P1 Contenu** | **PASS** | Comparaison mot pour mot via snapshots d'accessibilité sur Start, Parcours, Méthode, Projet phare, Projets : titres, paragraphes, 6 entrées de frise, 4 cartes Méthode, 6 étapes de roadmap, 3 cartes projet et bloc Contact identiques à `content/portfolio.md`. `{{LINKEDIN_URL}}` et `{{CV_URL}}` vides → lien LinkedIn et bouton CV absents du DOM (liste Contact ne contient que E-mail et GitHub), rien inventé à la place. Conforme. |
| **P2 Contraste** | **FAIL** | `.about__detail` et `.about__period` (frise Parcours, `app/components/sections/AboutMe/AboutMeSection.vue`) sont en `rgba(255,255,255,0.65)` posés directement sur le fond hyperspace, sans `.panel`. Mesure automatisée (25 frames, texte masqué pour isoler le fond réel derrière la zone de texte, formule de contraste WCAG) : fond moyen quasi noir → contraste ≈ 8,6:1 (bon), mais **pic mesuré à un pixel de fond (238,238,238) lors du passage d'une traînée d'étoile → contraste ≈ 1,10:1**, très en dessous du seuil de 4,5:1. Ce n'est pas un cas rare et isolé : les traînées d'étoiles balaient continuellement l'écran et cette zone de texte n'a aucune protection (pas de `.panel`, pas de `light-shadow-text` sur ces classes). |
| **P3 Build** | **FAIL** | `npm run build` ✓, `npm run generate` ✓, `npm run lint` ✓ (0 erreur/avertissement). Mais la **console navigateur affiche un avertissement Vue reproductible à chaque montage et à chaque changement de section** : `[Vue warn]: Extraneous non-props attributes (container) were passed to component but could not be automatically inherited...` sur `<NavigationSlideMenu>`. Cause : `app/pages/index.vue` passe `:container="slideRef"` à `<SlideMenu>` (`app/components/navigation/SlideMenu.vue`), qui ne déclare pas de prop `container` et rend un fragment (deux `<nav>` racines) — Vue ne peut pas hériter l'attribut automatiquement. Observé en dev (`localhost:3000`) et reproduit avec un script Playwright indépendant. `npx nuxi typecheck` échoue dans cet environnement pour une raison d'installation npx (résolution de `vue-tsc`/`typescript`, non liée au code) — vérifié séparément avec `vue-tsc@2.2.0` + `typescript@5.9.2` épinglés : **0 erreur de type**. Je ne compte donc pas cet échec de commande contre la porte, mais l'avertissement Vue en console, lui, est réel, reproductible et suffit à faire échouer P3 tel que formulé dans la spec (§3 : « Console du navigateur sans erreur ni warning Vue »). |
| **P4 Mobile** | **FAIL** | À 375×667, sur la section Start, le H1 (« Je construis des outils… ») chevauche le menu horizontal mobile. Mesure : nav `y: 96–128px` (largeur 311px), H1 `y: 85–198px` (largeur 343px) — chevauchement total sur toute la largeur du nav pendant 32px de hauteur, visible aussi à l'œil sur capture d'écran. Cause identifiée dans le code : `app/components/navigation/SlideMenu.vue` ligne 15 porte le commentaire `<!-- Mobile: horizontal under header (TODO : modifier top-24 par la taille du Header) -->` — la classe `top-24` est une valeur fixe qui ne suit pas la hauteur réelle du Header, connue et non corrigée par le générateur lui-même. |
| **P5 Effet 3D** | **PASS** | Fond hyperspace animé présent et fonctionnel sur toutes les sections. Planète visible en section Projet phare, fondu de texture vérifié visuellement en comparant Étape 1 (Collecte, texture rougeâtre attendue `planet-bake-1`) et Étape 3 (Extraction, texture orange/bleue nettement différente, `planet-bake-2`) — la transition fonctionne. |
| **P6 Périmètre** | **PASS** | `git branch --show-current` → `ia-refonte`. `git diff --stat package.json package-lock.json` → vide, aucune nouvelle dépendance. Aucun fichier écrit hors du dépôt (les scripts de test Playwright/pngjs utilisés pour l'évaluation ont été installés et exécutés dans le scratchpad de l'évaluateur, jamais dans le dépôt). |

**3 portes sur 6 échouent → les quatre critères notés sont plafonnés à 5/10.**

## Scores

| Critère | Score | Poids | Pondéré |
|---|---|---|---|
| Design Quality | 5/10 | 0.3 | 1.5 |
| Originality | 5/10 | 0.2 | 1.0 |
| Craft | 4/10 | 0.3 | 1.2 |
| Functionality | 4/10 | 0.2 | 0.8 |
| **TOTAL** | | | **4.5/10** |

### Justification

- **Design Quality (5/10, plafonné)** : à 768, 1440 et 1920px le rendu est net et
  hiérarchisé (frise Parcours et timeline Projet phare partagent bien le même
  langage visuel — cercles, ligne qui se trace ; cartes Méthode et Projets bien
  équilibrées ; à 1920px les trois colonnes timeline/contenu/planète de la
  Roadmap ne se chevauchent jamais). Sans les défauts relevés, ce travail viserait
  un 8. Mais le chevauchement H1/nav à 375px est un défaut de premier écran sur
  mobile, et le texte de la frise Parcours souffre du problème de contraste — deux
  défauts que j'ai moi-même mesurés comme critiques, donc pas de score au-dessus
  du plafond.
- **Originality (5/10, plafonné)** : le concept (planète 3D dont la texture
  illustre chaque étape du pipeline job-search, fond hyperspace) est réellement
  original et sert le contenu — aucun dégradé violet, aucun glassmorphism
  générique, aucune icône cerveau/circuit. C'est le point fort de cette
  itération ; sans le plafond ce critère viserait 8.
- **Craft (4/10)** : transitions GSAP fluides, focus visible global
  (`:focus-visible`), `prefers-reduced-motion` implémenté (warp réduit,
  transitions à 0,2s, pas de rotation planète), défilement interne + bascule en
  butée fonctionnent correctement une fois testés avec la bonne cible DOM (voir
  « Retiré » ci-dessous). Mais l'avertissement Vue en boucle, un commentaire TODO
  livré tel quel en production, un bouton CTA cassé (voir Functionality) et le
  défaut de contraste non anticipé sur une zone de texte entière tirent ce
  critère sous le plafond.
- **Functionality (4/10)** : navigation clavier (flèches, PageUp/PageDown),
  molette avec défilement interne puis bascule en butée, tabulation avec focus
  visible, liens externes sécurisés (`rel="noopener noreferrer"`), masquage
  correct des éléments à marqueur vide, SEO complet dans le HTML généré (title,
  description, og:*, twitter:card, `lang="fr"`) — tout cela fonctionne. Mais
  **« Me contacter » est cassé** (détail ci-dessous), et c'est l'un des deux
  boutons Hero explicitement demandés par la spec. Un bug de cette gravité sur
  une fonctionnalité nommément spécifiée justifie ce score même indépendamment
  du plafond de porte.

## Critical Issues (à corriger en priorité)

1. **Bouton « Me contacter » cassé, sur desktop et mobile, en dev et en build de
   production.** Cliquer « Me contacter » depuis Start amène bien sur la section
   Projets (le nav marque « Projets » actif) mais l'écran affiche seulement le
   fond étoilé vide — aucun titre, aucune carte, aucun bloc Contact visible.
   Cause diagnostiquée précisément : `scrollToAnchor()` dans `app/pages/index.vue`
   appelle `el.scrollIntoView({behavior:'smooth', block:'start'})` sur `#contact`.
   Le navigateur retient comme conteneur de défilement le `<div class="overflow-hidden">`
   de `SlideContainer.vue` (qui a `overflow: hidden` mais reste un conteneur de
   scroll valide pour `scrollIntoView`), et lui assigne un `scrollTop` natif
   (mesuré : `container.scrollTop = 3600` après le clic) — **en plus** de la
   translation GSAP (`transform: translateY(-3600px)`) que le composant applique
   déjà pour positionner les sections. Les deux décalages s'additionnent et
   poussent tout le contenu visible hors de l'écran. À corriger : ne pas utiliser
   `Element.scrollIntoView()` sur un élément vivant dans le conteneur piloté par
   GSAP ; calculer et animer soi-même le `scrollTop` de `.section-scroll-area`
   (la vraie zone défilante interne) vers `contact.offsetTop`, après la fin de la
   transition GSAP de section (`onComplete`, pas au milieu du timeline comme
   c'est fait actuellement dans `SlideContainer.goTo()` avec `.add(() => emit(...))`
   placé avant la fin du fondu).
2. **Avertissement Vue reproductible en boucle dans la console** (porte P3) :
   `SlideMenu.vue` reçoit une prop `container` non déclarée depuis
   `app/pages/index.vue` (`:container="slideRef"`) et n'en fait rien — à
   supprimer du template `index.vue`, ou à déclarer proprement dans les props de
   `SlideMenu` si elle a un usage prévu qui manque.
3. **Contraste insuffisant sur la frise Parcours** (porte P2) : `.about__detail`
   et `.about__period` dans `AboutMeSection.vue` passent sous 4,5:1 dès qu'une
   traînée d'étoile brillante croise le texte (mesuré ≈ 1,10:1 au pire moment). À
   corriger en appliquant le même traitement `.panel` (fond translucide plat)
   déjà utilisé ailleurs dans le projet, ou en renforçant `light-shadow-text`
   (ombre portée sombre) sur ces deux classes spécifiquement — elles en sont
   actuellement dépourvues alors que le reste du texte en est protégé.
4. **Chevauchement H1 / nav mobile à 375px** (porte P4) : sur Start, le titre
   déborde derrière le menu horizontal fixé à `top-24`. Le générateur a
   lui-même noté le problème dans un commentaire TODO non résolu
   (`SlideMenu.vue` ligne 15) — il faut soit calculer dynamiquement la hauteur du
   Header (`useLayoutDimensions`, déjà utilisé par `BaseSection.vue`, est
   probablement réutilisable ici) pour positionner le nav mobile, soit réserver
   un espace fixe suffisant sous le Header dans le padding-top de `HeroSection`.

## Major Issues (should fix)

1. **TODO laissé dans le code livré** : `SlideMenu.vue` ligne 15 contient un
   commentaire `TODO` non résolu en prod — à traiter avant de considérer
   l'itération terminée, pas seulement noté.
2. **Working tree non committé en fin d'itération** : 8 fichiers modifiés
   (formatage seulement, vérifié par diff) sont restés hors du commit `b428dff`.
   Committer systématiquement l'état final avant de clore une itération, sinon
   l'évaluateur ne peut pas garantir que ce qu'il teste correspond exactement au
   commit annoncé.
3. **`user-select: none` posé globalement** (`app/assets/css/main.css`, règle
   `html, body`) empêche la sélection/copie de texte partout sur le site, y
   compris l'adresse e-mail dans le bloc Contact — gênant pour un visiteur qui
   veut copier l'e-mail plutôt que cliquer le lien `mailto:`. À restreindre aux
   seuls éléments où un geste de swipe/molette doit primer (le conteneur de
   slides), pas au document entier.

## Minor Issues (nice to fix)

1. Le fichier `.playwright-mcp/` généré pendant cette session de test est resté
   à la racine du dépôt (non ignoré) — vérifier que `.gitignore` le couvre pour
   ne pas polluer un futur commit.
2. Le message d'avertissement GPU répété (`GL Driver Message ... GPU stall due
   to ReadPixels`) observé pendant les captures d'écran WebGL est probablement
   lié à l'environnement de test headless plus qu'à l'app ; à surveiller si des
   utilisateurs réels signalent des saccades sur la planète, mais non
   bloquant ici.

## Ce qui a été vérifié et retiré des soupçons initiaux (pour calibrer le prochain retour)

- **Défilement interne + bascule de section en butée** : fonctionne
  correctement. Un premier test automatisé donnait un faux positif
  (« contenu inatteignable ») à cause d'un sélecteur DOM qui ciblait la
  mauvaise section inactive (`document.querySelector` retourne le premier
  match, y compris parmi les sections `inert`) — une fois corrigé, molette et
  clavier révèlent bien les 6 entrées de la frise Parcours puis basculent
  proprement vers Méthode en butée basse, sans watchdog(rien à corriger ici).
- **Désynchronisation apparente de l'indicateur de navigation actif** :
  également un faux positif de lecture visuelle sur une capture basse
  résolution ; `aria-pressed` correspond bien au contenu affiché à chaque
  clic, vérifié par script sur les 5 boutons.
- **Clics répétés/rapides sur la navigation** : aucune erreur JS, le verrou
  `state.isAnimating` dans `SlideContainer.goTo()` absorbe proprement les
  clics pendant une transition en cours.

## Screenshots

Sauvegardés dans `gan-harness/screenshots/` (sélection) :
- `1-start-desktop.png`, `2-projects-desktop.png` — desktop 1440px, rendu propre.
- `mobile-375-start.png` — chevauchement H1/nav mobile (Critical #4).
- `mobile-375-parcours.png`, `mobile-375-methode.png`, `mobile-375-projet-phare.png`, `mobile-375-projets.png` — pas de débordement horizontal, mais Projet phare montre planète + intro seulement au premier écran (contenu de la timeline atteignable par scroll, vérifié).
- `desktop-1920-roadmap.png` — très bonne mise en page 3 colonnes à grande largeur.
- `4-etape3-extraction.png` vs `3-voir-detail-click.png` — preuve visuelle du fondu de texture planète (P5).
- `mc-4000ms.png`, `static-me-contacter.png`, `mobile-me-contacter-bug.png` — le bug « Me contacter » (Critical #1), reproduit en dev, en build statique de production, et sur mobile.
- `tablet-768-start.png`, `tablet-768-roadmap.png`, `tablet-768-methode.png` — 768px correct, pas de chevauchement.
