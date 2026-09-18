# Portfolio · Grégoire MARCHAND

Site vitrine en une page : cinq sections plein écran (Start, Parcours, Méthode,
Projet phare, Projets), fond hyperspace animé et planète 3D à textures
changeantes. Chaque section tient entièrement dans la fenêtre, sans
défilement interne. Méthode et Projets se jouent en plans successifs (fondu
d'un plan à l'autre, flèches, clavier gauche/droite, indicateur « N / M ») ;
sur mobile (< 768px), les autres sections trop denses se découpent aussi en
sous-écrans navigables (glissement horizontal).

Direction artistique « générique de film » (référence : Interstellar) : fond
noir bleuté, titres en capitales espacées en Jost, texte courant en Hanken
Grotesk, un seul accent bleu glacier, mouvement lent (fondus depuis le noir,
interlettrage qui se resserre à la révélation des titres). Aucune teinte
chaude dans l'interface, aucune lueur, aucune carte ni voile derrière le texte :
le contraste est tenu par le fond lui-même, les étoiles du canvas s'éteignent à
l'approche des blocs de texte (`ReadingZones`). Tous les textes
visibles viennent de `content/portfolio.md`, repris à l'identique dans
`app/data/content.ts`.

## Stack

- [Nuxt 4](https://nuxt.com/) / Vue 3 / TypeScript strict
- [Tailwind CSS 4](https://tailwindcss.com/)
- [GSAP](https://gsap.com/) pour les transitions de section et la timeline
- [Three.js](https://threejs.org/) pour le fond étoilé et la planète 3D

## Commandes

```bash
npm install      # installer les dépendances
npm run dev      # serveur de développement, http://localhost:3000
npm run build    # build de production (SSR)
npm run generate # build statique
npm run preview  # prévisualiser le build
npm run lint     # ESLint
npx nuxi typecheck # vérification TypeScript (vue-tsc)
```

### Remarque : `npx nuxi typecheck`

`nuxi typecheck` lance `vue-tsc`, qui n'est pas une dépendance du projet (la
spec interdit d'en ajouter). Sans `vue-tsc` local, nuxi le récupère avec
`npx -p vue-tsc -p typescript`, donc la commande dépend du cache npx
(`~/.npm/_npx/`, hors dépôt) ou du réseau : elle passe quand ce cache est sain,
et peut échouer avec `ERR_PACKAGE_PATH_NOT_EXPORTED` (`./lib/tsc`) quand il
mélange des versions incompatibles (la trace ne contient alors aucun fichier du
projet). Contrôle équivalent en cas d'échec : installer `vue-tsc` et
`typescript` hors du dépôt, puis lancer `vue-tsc --noEmit -p
.nuxt/tsconfig.app.json` (et `server`, `shared`, `node`). Ajouter `vue-tsc` en
devDependency rendrait la commande fiable ; c'est une décision de Grégoire.

## Structure

- `content/portfolio.md` : source unique de tous les textes visibles.
- `app/data/content.ts` : reprise typée de ce contenu, consommée par les composants.
- `app/pages/index.vue` : assemble les cinq sections dans `SlideContainer`.
- `app/components/sections/*` : une section par dossier (Hero, AboutMe, Method, Roadmap, Projects).
- `app/components/subscreen/*` : piste glissante et navigation des sous-écrans mobile (`SubscreenTrack`, `SubscreenNav`).
- `app/composables/useMobileSubscreens.ts`, `useSubscreenNav.ts` : état et registre des sous-écrans (clavier gauche/droite).
- `app/composables/useSplitReveal.ts` : révélation lente de chaque section (fondu, interlettrage, cascade).
- `app/assets/css/main.css` : jetons de couleur et de police, styles de texte.
- `app/graphics/background/*` : fond hyperspace (canvas 2D) ; `ReadingZones.ts` mesure les blocs de texte visibles et éteint les étoiles derrière eux.
- `app/composables/3d/*` : scène Three.js réutilisable (planète, fondu de textures).
