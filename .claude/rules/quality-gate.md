# Quality gate

Barre générique, identique pour tous les tickets. Elle dit _est-ce bien fait_.
Elle ne dit jamais _est-ce ce qui était demandé_ — c'est le rôle des critères
d'acceptation du ticket. Une quality gate sans eux donne du code impeccable
qui fait la mauvaise chose.

Un ticket n'est fini que si les six rendent vert :

1. `npm run lint` — zéro erreur, zéro avertissement.
2. `npm run typecheck` — zéro erreur.
3. `npm run build`, puis `npm run generate` — succès des deux. Le portfolio est
   publié en statique : un `build` vert avec un `generate` rouge n'est pas livrable.
4. Tests — **vide dans ce dépôt.** Il n'a aucun lanceur de tests, et en ajouter
   un est une dépendance que seul un ticket peut demander. Ce critère est vide,
   pas contourné. Il redevient actif le jour où `npm run test` existe.
5. Aucun `TODO`, `FIXME` ou `XXX` introduit par le ticket.
6. **Reconstructibilité** — si le diff du ticket touche `package.json`, le
   lockfile ou `.npmrc` : `bash scripts/reconstruct.sh` — rendu 0. Le script
   clone le worktree dans un répertoire temporaire, y lance `npm ci`, et supprime
   le répertoire. Ne fais pas ces gestes toi-même : le script est autorisé, les
   commandes qu'il enveloppe ne le sont pas. Si le diff ne touche aucun de ces
   trois fichiers, ce critère est vide, pas contourné.

Pourquoi le critère 6 existe alors que `npm ci` tourne déjà au démarrage : là il
s'exécute à **l'entrée** du ticket, sur l'état de la branche d'intégration. Les
cinq premiers critères s'exécutent ensuite dans un répertoire où `node_modules`
est déjà posé. Aucun ne revérifie la sortie. Un ticket qui casse le lockfile
rend donc vert, et c'est le ticket suivant qui explose au démarrage.

Le clone part du **worktree**, pas d'`origin` : la branche n'est jamais poussée,
et un clone d'`origin` ne verrait pas le travail du ticket.

La condition se constate sur les fichiers modifiés depuis la création de ta
branche — 0 ou 1, aucun jugement :

```bash
git diff --name-only "$(git reflog show --format=%H "$(git rev-parse --abbrev-ref HEAD)" | tail -1)"
```

Ce dépôt n'a pas d'`origin/HEAD` : ne t'en sers pas comme point de comparaison.

Chacun rend 0 ou 1 sans œil humain. Un critère qui demande un jugement n'est pas
encore un critère : c'est une intuition, et elle ramène un humain dans la boucle
à chaque tour. Elle ne s'ajoute pas ici. L'évaluation d'ECC (`gan-evaluator`,
notes sur 10) n'est pas un critère de cette barre, pour la même raison.

La propreté n'est pas un bonus : ce dépôt est aussi un livrable de positionnement.
Elle est un critère de fin.

Contrainte de nommage : aucun script de `package.json` ne porte de deux-points
dans son nom. Le deux-points est le séparateur de motif des règles de permission ;
un script `lint:fix` rendrait la règle qui l'autorise beaucoup plus large que voulu.
