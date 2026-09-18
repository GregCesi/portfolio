# Portfolio · Grégoire MARCHAND

Site vitrine en Nuxt 4, Tailwind 4, GSAP et Three.js. Une page, cinq sections plein écran, fond hyperspace et planète 3D.

## Refonte en cours (branche `ia-refonte`)

- Textes : `content/portfolio.md` est la seule source. Aucun texte visible ne s'écrit ailleurs ni autrement.
- Ce qu'il faut construire : `gan-harness/spec.md`. Grille de contrôle : `gan-harness/eval-rubric.md`.
- Lancement et vérifications : `docs/refonte-ia/LANCEMENT.md`.

## Règles

- Ne lire et n'écrire que dans ce dépôt. Aucun dossier voisin, même pour s'inspirer.
- Travailler sur `ia-refonte` uniquement. Ne pas pousser, ne pas toucher `main` ni `develop`.
- Aucune nouvelle dépendance npm sans que la spec l'autorise.
- Avant de déclarer un travail fini : `npm run build`, `npm run generate`, `npm run lint`, `npx nuxi typecheck` à 0 erreur.
