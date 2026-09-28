# Contenu du portfolio · source unique

Ce fichier est la seule source de texte du site. Chaque texte visible vient d'ici, mot pour mot.
Les libellés d'interface autorisés en plus sont listés en fin de fichier.
Un marqueur `{{...}}` est une valeur que Grégoire remplira : l'élément qui le porte est masqué tant que la valeur est vide.

---

## Global

- Nom : Grégoire MARCHAND
- Titre (header) : Développeur full-stack · AI Engineer
- Balise title : Grégoire MARCHAND · Développeur full-stack, AI Engineer
- Meta description : Développeur full-stack et AI engineer. J'élimine les frictions en automatisant les process avec des LLM, mesurés pour qu'on puisse s'y fier.
- Menu latéral (ordre des sections) : Start · Parcours · Méthode · Projets · Contact

---

## Sas d'entrée

Journal de chargement, affiché dans cet ordre, une ligne à la fois :
1. Mise sous tension des systèmes
2. Chargement des polices de titre
3. Chargement des polices de texte
4. Calibrage des propulseurs
5. Chargement de la planète
6. Application des textures
7. Mise en orbite du satellite
8. Ouverture du sas

---

## Section 1 · Start (Hero)

Titre :
> J'élimine les frictions en automatisant les process avec des LLM.

Texte :
> Ingénieur en informatique, développeur full-stack de formation. Je construis des systèmes à base de LLM : extraction de données, RAG, agents de code, et les évaluations qui montrent s'ils tiennent.

Accroche :
> Quatre escales vous attendent avant de repartir : mon parcours, ma méthode, mes projets, et une fréquence pour me joindre.

Boutons :
- « Voir mes projets » → section 4
- « Me contacter » → section 5

---

## Section 2 · Parcours

Titre :
> Parcours

Introduction :
> Cinq ans d'école d'ingénieur, quatre stages en entreprise dont un à l'étranger, puis développeur indépendant depuis fin 2024. En parallèle, je me spécialise en ingénierie IA en construisant mes propres systèmes.

Frise (du plus ancien au plus récent) :

| Période | Lieu | Rôle | Détail |
|---|---|---|---|
| 2019 – 2024 | CESI École d'ingénieurs, Lingolsheim | Diplôme d'ingénieur en informatique | Deux ans de prépa intégrée, trois ans de cycle ingénieur |
| Avr. – août 2021 | Agile Business, Geudertheim | Intégrateur web · stage | Sites WordPress : intégration, thèmes, mise en production |
| Janv. – avr. 2022 | Europe Tech Group, Haguenau | Développeur back-end · stage | API C# .NET pour une application de portage salarial, maintenance de l'ERP Microsoft Dynamics NAV |
| Sept. 2022 – janv. 2023 | IT Selecta, Cracovie (Pologne) | Développeur full-stack · stage | CRM et workflows d'automatisation sur mesure pour une startup, en anglais |
| Févr. – août 2024 | Ippon Technologies, Strasbourg | Développeur full-stack · stage | Calculateur d'empreinte carbone en Java Spring Boot et Nuxt. L'équipe produit est passée de 4 à 11 personnes pendant le stage |
| Déc. 2024 – aujourd'hui | Indépendant, Strasbourg | Développeur freelance | Sites et applications pour des clients, dont CATRA et P.A.R.C, puis une application B2B conçue à deux, menée jusqu'au prototype |

---

## Section 3 · Méthode (étapes + planète)

Surtitre :
> Méthode

Titre :
> De la friction au système qui tient

Sous-titre :
> Six étapes que je suis sur chaque projet, du premier constat à la surveillance après livraison.

Étapes (titre, phrase, détail ; état de la planète entre parenthèses, pour le code seulement) :

1. **Repérer** (planète rouge)
   > Tout part d'une friction.
   > Une tâche répétée, lente ou pénible. Je la décris avant de choisir un modèle, et je vérifie qu'un LLM est la bonne réponse.

2. **Observer** (planète rouge, satellite en observation)
   > Avant de corriger, je mesure.
   > Je trace chaque appel au modèle et je classe les erreurs, pour savoir où le système casse.

3. **Corriger** (planète moins rouge)
   > Une cause à la fois.
   > Je traite la famille d'erreurs la plus fréquente, puis je remesure. Prompt, modèle ou règles autour : je choisis le levier d'après la mesure.

4. **Vérifier** (planète un peu verte)
   > Des critères que le modèle ne contrôle pas.
   > Je les écris avant de commencer, et les contrôles tournent sans lui : tests, build, jeux d'évaluation.

5. **Livrer** (planète verte)
   > Le process est automatisé.
   > Le temps que coûtait la friction est rendu, et ce que fait le système reste lisible dans ses traces.

6. **Surveiller** (planète verte, satellite en observation)
   > La mesure continue après la livraison.
   > Un modèle change, les données aussi. Je garde les traces et les évaluations en place pour voir une dérive avant qu'elle coûte.

---

## Section 4 · Projets

Titre :
> Projets

Introduction :
> Des systèmes construits pour mes propres besoins, et mesurés pour savoir s'ils tiennent.

Trois cartes :

1. **job-search**
   - Accroche : Un outil qui trie les offres d'emploi à ma place, pour ne lire que celles qui valent la peine.
   - Texte : Un LLM local lit chaque offre une seule fois et répond dans un vocabulaire fermé. Des règles Python classent ensuite les offres sur deux axes, ce qui m'attire et ce qui m'est accessible. Le système classe, je décide. Chaque appel au modèle est tracé, et c'est en lisant ces traces que je l'ai refondu plusieurs fois.
   - Tags : Python · FastAPI · SQLite · Ollama · Nuxt
   - Lien : https://github.com/GregCesi/job-search (bouton « Voir le code »)

2. **rag-eval-scifact**
   - Accroche : Construire un bon RAG en partant d'un bon banc d'évaluation.
   - Texte : Le banc est posé : corpus public SciFact, métriques codées à la main à partir du rang du document attendu, runs versionnés, échecs classés en quatre familles. L'étape suivante est d'améliorer le RAG en mesurant chaque changement sur ce banc.
   - Tags : Python · sentence-transformers · ChromaDB · évaluation
   - Lien : https://github.com/GregCesi/rag-eval-scifact (bouton « Voir le code »)

3. **Cockpit**
   - Accroche : Un poste de pilotage pour travailler avec l'IA sans jamais réexpliquer le contexte.
   - Texte : Plusieurs projets menés de front avec des agents. Dans Notion, un modèle de chat et moi tenons le backlog, un journal daté et les règles du jeu, relues à chaque session. Les tickets partent ensuite dans une boucle où Claude Code les exécute seul, dans un espace isolé, contre des critères qu'il ne peut pas réécrire. Je relis le résultat avant de l'intégrer. L'orchestration des agents repose sur une boîte à outils open source écrite par un tiers. Le site que vous parcourez est passé par cette boucle.
   - Tags : Claude Code · MCP Notion · git worktrees
   - Lien : aucun (dépôt privé). Bouton « Voir la méthode » → section 3.

---

## Section 5 · Contact

Titre :
> Ouvrir une fréquence

Badge de disponibilité :
> Disponible dès maintenant

Texte :
> Je cherche un poste d'AI engineer en Belgique ou à Strasbourg, et je suis disponible dès maintenant.

Canaux, en cartes, e-mail en avant :
- Canal 01 : E-mail — gmarchand.pro1@gmail.com
- Canal 02 : LinkedIn — Grégoire Marchand
- Canal 03 : GitHub — GregCesi

Bouton de copie de l'e-mail :
> Copier
> Copié

Liens :
- E-mail : gmarchand.pro1@gmail.com
- GitHub : https://github.com/GregCesi
- LinkedIn : https://www.linkedin.com/in/gr%C3%A9goire-marchand-5b8279203/
- CV : {{CV_URL}} (bouton « Télécharger mon CV »)

---

## Libellés d'interface autorisés

Seuls textes visibles autorisés en dehors de ce qui précède : repères de section « 01 / 05 » et numéros du menu, indicateurs de sous-écran « 2 / 6 », « Étape N » dans la frise, flèches ou libellés « Précédent » / « Suivant », « Voir la méthode », « Voir le code », « Télécharger mon CV », « E-mail », « GitHub », « LinkedIn », « OK », « % », attributs aria et textes alternatifs descriptifs.
