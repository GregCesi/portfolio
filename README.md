# Portfolio · Grégoire MARCHAND

Site vitrine en une page : cinq sections plein écran (Start, Parcours, Méthode,
Projet phare, Projets), fond hyperspace animé et planète 3D à textures
changeantes. Tous les textes visibles viennent de `content/portfolio.md`,
repris à l'identique dans `app/data/content.ts`.

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

## Structure

- `content/portfolio.md` : source unique de tous les textes visibles.
- `app/data/content.ts` : reprise typée de ce contenu, consommée par les composants.
- `app/pages/index.vue` : assemble les cinq sections dans `SlideContainer`.
- `app/components/sections/*` : une section par dossier (Hero, AboutMe, Method, Roadmap, Projects).
- `app/graphics/background/*` : fond hyperspace (canvas 2D).
- `app/composables/3d/*` : scène Three.js réutilisable (planète, fondu de textures).
