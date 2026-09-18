# Portfolio · Grégoire MARCHAND

Site vitrine en une page : cinq sections plein écran (Start, Parcours, Méthode,
Projet phare, Projets), fond hyperspace animé et planète 3D à textures
changeantes. Chaque section tient entièrement dans la fenêtre, sans
défilement interne ; sur mobile (< 768px), une section trop dense se
découpe en sous-écrans navigables (flèches, glissement horizontal, indicateur
« N / M »).

Direction artistique « générique de film » (référence : Interstellar) : fond
noir bleuté, titres en capitales espacées en Jost, texte courant en Hanken
Grotesk, un seul accent bleu glacier, mouvement lent (fondus depuis le noir,
interlettrage qui se resserre à la révélation des titres). Aucune teinte
chaude dans l'interface, aucune lueur, aucune carte à fond. Tous les textes
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

### Limitation connue : `npx nuxi typecheck` en local

Sur certains environnements de développement locaux, `npx nuxi typecheck`
échoue avec :

```
Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './lib/tsc' is not
defined by "exports" in
~/.npm/_npx/<hash>/node_modules/typescript/package.json
    at resolveTscPath (.../vue-tsc/index.js:73:43)
```

C'est un problème de résolution de module entre la version de `typescript`
mise en cache par `npx` (hors de ce dépôt, sous `~/.npm/_npx/`) et
`vue-tsc` — aucun fichier de ce projet n'apparaît dans la trace. Reproduit
à l'identique sur plusieurs itérations et par plusieurs agents indépendants
sans qu'aucune modification de code n'y change quoi que ce soit. Le build
(`npm run build`, `npm run generate`) et le lint (`npm run lint`) ne sont
pas affectés. Si ce problème apparaît, vider le cache npx
(`npx clear-npx-cache` ou suppression manuelle de `~/.npm/_npx/`) avant de
relancer la commande le résout généralement.

## Structure

- `content/portfolio.md` : source unique de tous les textes visibles.
- `app/data/content.ts` : reprise typée de ce contenu, consommée par les composants.
- `app/pages/index.vue` : assemble les cinq sections dans `SlideContainer`.
- `app/components/sections/*` : une section par dossier (Hero, AboutMe, Method, Roadmap, Projects).
- `app/components/subscreen/*` : piste glissante et navigation des sous-écrans mobile (`SubscreenTrack`, `SubscreenNav`).
- `app/composables/useMobileSubscreens.ts`, `useSubscreenNav.ts` : état et registre des sous-écrans (clavier gauche/droite).
- `app/composables/useSplitReveal.ts` : révélation lente de chaque section (fondu, interlettrage, cascade).
- `app/assets/css/main.css` : jetons de couleur et de police, voile `.scrim`, styles de texte.
- `app/graphics/background/*` : fond hyperspace (canvas 2D).
- `app/composables/3d/*` : scène Three.js réutilisable (planète, fondu de textures).
