# Portfolio · Grégoire MARCHAND

Site vitrine en Nuxt 4, Tailwind 4, GSAP et Three.js. Une page, cinq sections
plein écran, fond hyperspace et planète 3D.

## Stack

- Nuxt 4, rendu statique par `nuxt generate`. Aucune route serveur.
- Tailwind 4 via `@tailwindcss/vite`.
- Textes : `content/portfolio.md` est la seule source, repris mot pour mot dans
  `app/data/content.ts`. Aucun texte visible ne s'écrit ailleurs ni autrement.
- Aucune nouvelle dépendance npm sans que le ticket la demande.

## Où sont les règles

- `.claude/rules/quality-gate.md` — la barre de fin de ticket.
- `.claude/rules/archi-nuxt.md` — les règles de forme, chacune avec sa clause d'écart.
- `.claude/rules/workflow.md` — le régime d'exécution.

Les outils ECC (skills, agents, commandes) sont des moyens. Ils ne remplacent
aucune de ces trois règles, et une note d'évaluation ECC n'est pas un verdict.

## Ce que tu ne décides pas

Tu décides *comment*, jamais *quoi*. Le périmètre d'un ticket vient du ticket.

Tu n'écris jamais dans `.claude/rules/`, `.claude/settings.json`, `.claude/agents/`,
`.claude/skills/`, `scripts/`, ni dans ce fichier. Ce sont la barre contre laquelle
tu es jugé et le périmètre dans lequel tu travailles.

Tu t'arrêtes et tu le dis dans trois cas :
- un objet nommé par ton ticket est absent du terrain ;
- il est présent mais n'est pas de la nature supposée ;
- une prémisse explicite de ton prompt est fausse sur le terrain.
