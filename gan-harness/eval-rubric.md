# Grille d'évaluation · Refonte IA du portfolio

Lis d'abord `gan-harness/spec.md` et `content/portfolio.md`.

## Portes bloquantes

Vérifie chaque porte avant de noter. **Si une seule porte échoue, chacun des quatre critères est plafonné à 5/10**, quel que soit le reste. Liste les portes échouées en tête des Critical Issues, avec la preuve (capture, sélecteur, extrait).

- **P1 Contenu.** Tout texte visible est présent mot pour mot dans `content/portfolio.md`, ou fait partie des libellés d'interface autorisés en fin de ce fichier. Compare le texte de chaque section au fichier. Un seul mot ajouté, reformulé ou traduit fait échouer la porte.
- **P2 Contraste.** Texte courant sous 4,5:1 ou texte large sous 3:1 sur le fond réel. Donne la mesure. Un défaut de contraste que tu signales toi-même comme critique fait échouer la porte.
- **P3 Build.** `npm run build`, `npm run generate`, `npm run lint` ou `npx nuxi typecheck` en erreur, ou erreur dans la console du navigateur.
- **P4 Mobile.** À 375 × 667, un contenu de section coupé ou inatteignable (frise, cartes, contact), ou un chevauchement timeline / texte / planète.
- **P5 Effet 3D.** Fond hyperspace ou planète absents, cassés, ou fondu de textures qui ne se déclenche plus entre les étapes.
- **P6 Périmètre.** Fichier créé ou modifié hors du dépôt, nouvelle dépendance non autorisée par la spec, commit sur une autre branche que `ia-refonte`.

## Critères notés

La formule de pondération est celle de l'evaluator (design 0,3, originalité 0,2, craft 0,3, fonctionnalité 0,2). Ce qui suit précise ce que chaque critère mesure ici.

- **Design Quality** : hiérarchie lisible dans chaque section, cohérence entre les cinq sections (la frise Parcours et la timeline Projet phare parlent le même langage), cartes Méthode et Projets équilibrées, rendu à 375, 768 et 1440 px.
- **Originality** : l'effet wow tient et sert le contenu (la planète accompagne le pipeline job-search). Pénalise les motifs génériques de portfolio IA : dégradés violets, cartes glassmorphism standard, icônes de cerveau ou de circuits.
- **Craft** : transitions fluides sans saccade, focus visible, `prefers-reduced-motion` respecté, poids des assets 3D, aucun texte qui déborde.
- **Functionality** : boutons Hero câblés, navigation molette, tactile et clavier, défilement interne des sections longues puis changement de section en butée, liens externes corrects, éléments à marqueur vide masqués, SEO présent dans le HTML généré.

## Calibrage

8 correspond à un travail qu'un développeur front senior livrerait. Ne mets pas 10 à un critère sur lequel tu as toi-même relevé un défaut critique.
