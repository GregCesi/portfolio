# Contenu du portfolio · source unique

Ce fichier est la seule source de texte du site. Chaque texte visible vient d'ici, mot pour mot.
Les libellés d'interface autorisés en plus sont listés en fin de fichier.
Un marqueur `{{...}}` est une valeur que Grégoire remplira : l'élément qui le porte est masqué tant que la valeur est vide.

---

## Global

- Nom : Grégoire MARCHAND
- Titre (header) : Ingénieur logiciel · IA
- Balise title : Grégoire MARCHAND · Ingénieur logiciel, IA
- Meta description : Ingénieur en informatique, développeur full-stack de formation, je construis mes propres systèmes à base de LLM : extraction de données, bancs d'évaluation, boucles d'exécution avec des agents de code.
- Menu latéral (ordre des sections) : Start · Parcours · Méthode · Projet phare · Projets

---

## Section 1 · Start (Hero)

Titre :
> Je construis des outils qui mettent les modèles de langage au travail

Texte :
> Ingénieur en informatique diplômé du CESI en 2024, développeur full-stack de formation.
> Je construis mes propres systèmes à base de LLM : extraction de données, bancs d'évaluation, boucles d'exécution avec des agents de code.

Boutons :
- « Voir mes projets » → section 5
- « Me contacter » → bloc Contact de la section 5

---

## Section 2 · Parcours

Titre :
> Parcours

Introduction :
> J'ai appris le métier en entreprise, au fil de quatre stages, puis en indépendant. Je me spécialise aujourd'hui en ingénierie IA en autodidacte, en construisant mes propres projets.

Frise (du plus ancien au plus récent) :

| Période | Lieu | Rôle | Détail |
|---|---|---|---|
| 2019 – 2024 | CESI École d'ingénieurs, Lingolsheim | Diplôme d'ingénieur en informatique | Deux ans de prépa intégrée, trois ans de cycle ingénieur |
| Avr. – août 2021 | Agile Business, Geudertheim | Intégrateur web · stage | |
| Janv. – avr. 2022 | Europe Tech Group, Haguenau | Développeur back-end · stage | |
| Sept. 2022 – janv. 2023 | IT Selecta, Cracovie (Pologne) | Développeur full-stack · stage | |
| Févr. – août 2024 | Ippon Technologies, Strasbourg | Développeur full-stack · stage | L'équipe produit est passée de 4 à 11 personnes pendant le stage |
| Déc. 2024 – aujourd'hui | Indépendant | Développeur | Sites et applications pour des clients, dont CATRA et P.A.R.C |

---

## Section 3 · Méthode

Titre :
> Travailler avec des agents de code

Introduction :
> Je fais exécuter mon code par Claude Code, dans un cadre que je construis moi-même : des tickets, des règles, des contrôles automatiques et un journal. Le terrain d'essai est la refonte en Nuxt 4 du site d'une association de jardins, parcpaysage.com.

Quatre cartes :

1. **Un ticket, un espace isolé**
   > Chaque ticket s'exécute dans son propre worktree git. Les tickets s'enchaînent en mode non interactif, sans que j'aie à rester devant.

2. **Vérifier l'environnement avant de lire le ticket**
   > Un script de preflight contrôle l'environnement avant que l'agent commence. Un environnement cassé s'arrête en quelques secondes, au lieu de 31 minutes de travail perdu constatées avant sa mise en place.

3. **La barre vient de l'extérieur**
   > Un agent qui écrit ses propres critères d'acceptation ne peut pas échouer. Les critères viennent donc d'une source que l'agent ne contrôle pas, et ses règles comme ses réglages sont protégés en écriture.

4. **Tout finit au journal**
   > Je planifie et je spécifie dans Notion avec un modèle de chat, Claude Code exécute et écrit ce qu'il a fait. Chaque échec devient une règle datée, avec le motif qui l'a fait naître.

---

## Section 4 · Projet phare (Roadmap + planète)

Surtitre :
> Projet phare

Titre :
> job-search : trier des milliers d'offres avec un LLM local

Sous-titre :
> Plus de 2 500 offres en base en septembre 2026. Python, FastAPI, SQLite, Ollama, Nuxt, TypeScript.

Étapes (titre, puis deux paragraphes ; texture de planète entre parenthèses, pour le code seulement) :

1. **Collecte** (planet-bake-1)
   > Les offres arrivent de quatre sources.
   > France Travail, Indeed, Remotive et EURES, récupérées en une passe par une commande que je lance à la main. Pas de tâche planifiée, pas d'API payante.

2. **Tri amont** (planet-bake-1)
   > Ce qui n'est pas prenable sort avant le modèle.
   > Une offre publiée sur deux sources n'est gardée qu'une fois. Les stages et les alternances sont écartés avant tout appel au LLM.

3. **Extraction** (planet-bake-2)
   > Un modèle local lit chaque offre, une seule fois.
   > Il tourne avec Ollama et ne répond que dans un vocabulaire fermé : séniorité sur quatre valeurs, domaine sur huit, technos avec trois niveaux d'importance, langues exigées. Chaque appel est tracé : prompts, réponse, modèle.

4. **Scoring** (planet-bake-3)
   > Deux axes indépendants, calculés en Python.
   > Désirabilité et atteignabilité, au regard de mon profil. Aucun score n'est stocké : changer le profil recalcule tout sans rappeler le modèle.

5. **Catégories** (planet-bake-4)
   > Quatre catégories, et rien ne se perd.
   > Offre parfaite, offre de rêve, atteignable, hors périmètre. Une offre écartée garde ses données : si une règle se révèle fausse, l'offre revient à sa place sans repasser par le modèle.

6. **Décision** (planet-bake-5)
   > Le système classe, je décide.
   > Je lis les offres qui remontent et je retiens celles qui m'intéressent. Une vue opérateur me sert à vérifier que les filtres ne coupent pas ce qu'ils ne devraient pas.

---

## Section 5 · Projets

Titre :
> Projets

Introduction :
> Des projets personnels, construits pour apprendre en produisant quelque chose qui tourne.

Trois cartes :

1. **job-search**
   - Accroche : Récupérer, lire et classer des offres d'emploi avec un LLM local.
   - Texte : Collecte sur quatre sources, extraction par un modèle local en vocabulaire fermé, scoring Python sur deux axes, traces de chaque appel au modèle.
   - Tags : Python · FastAPI · SQLite · Ollama · Nuxt
   - Lien : aucun (dépôt privé). Bouton « Voir le détail » → section 4.

2. **rag-eval-scifact**
   - Accroche : Un banc d'évaluation pour un moteur de recherche sémantique.
   - Texte : Embeddings sentence-transformers et base ChromaDB, testés sur le jeu SciFact. Métriques codées à la main à partir du rang du document attendu : premier, top 5, top 100, non retrouvé. Runs nommés et versionnés sur le jeu complet. Les échecs sont classés en quatre familles : retrieval, saturation, inférence, troncature. Cause principale identifiée : la fenêtre de 256 tokens du modèle d'embedding, qui tronque les documents longs.
   - Tags : Python · sentence-transformers · ChromaDB · évaluation
   - Lien : https://github.com/GregCesi/rag-eval-scifact

3. **agent-codeloop**
   - Accroche : Une boucle d'exécution de tickets par Claude Code.
   - Texte : Worktrees isolés, preflight, règles protégées, critères d'acceptation externes et journal d'exécution. Appliquée à la refonte en Nuxt 4 de parcpaysage.com.
   - Tags : Claude Code · git worktrees · Nuxt 4
   - Lien : aucun (dépôt privé). Bouton « Voir la méthode » → section 3.

Bloc Contact :
- Titre : Contact
- Texte : Je cherche un poste d'ingénieur IA, en Belgique ou à Strasbourg.
- E-mail : gmarchand.pro1@gmail.com
- GitHub : https://github.com/GregCesi
- LinkedIn : {{LINKEDIN_URL}}
- CV : {{CV_URL}} (bouton « Télécharger mon CV »)

---

## Libellés d'interface autorisés

Seuls textes visibles autorisés en dehors de ce qui précède : « Étape N » dans la frise, flèches ou libellés « Précédent » / « Suivant », « Voir le détail », « Voir la méthode », « Voir le code », « Télécharger mon CV », « E-mail », « GitHub », « LinkedIn », attributs aria et textes alternatifs descriptifs.
