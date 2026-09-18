import type { SiteContent, SectionId } from '~/types/content'

/**
 * Source unique des textes visibles du site.
 * Reprend `content/portfolio.md` mot pour mot : ne pas reformuler, ne pas traduire,
 * ne pas ajouter de texte ici. Toute correction de texte se fait dans le fichier
 * `content/portfolio.md`, puis se répercute ici à l'identique.
 */

/** Ordre des cinq sections plein écran, index correspondant dans SlideContainer. */
export const SECTION_ORDER: SectionId[] = ['hero', 'about', 'method', 'roadmap', 'projects']

export const SECTION_INDEX: Record<SectionId, number> = {
  hero: 0,
  about: 1,
  method: 2,
  roadmap: 3,
  projects: 4
}

export const siteContent: SiteContent = {
  global: {
    name: 'Grégoire MARCHAND',
    headerTitle: 'Ingénieur logiciel · IA',
    pageTitle: 'Grégoire MARCHAND · Ingénieur logiciel, IA',
    metaDescription:
      "Ingénieur en informatique, développeur full-stack de formation, je construis mes propres systèmes à base de LLM : extraction de données, bancs d'évaluation, boucles d'exécution avec des agents de code.",
    menuLabels: ['Start', 'Parcours', 'Méthode', 'Projet phare', 'Projets'],
    lang: 'fr'
  },

  hero: {
    title: 'Je construis des outils qui mettent les modèles de langage au travail',
    paragraphs: [
      'Ingénieur en informatique diplômé du CESI en 2024, développeur full-stack de formation.',
      "Je construis mes propres systèmes à base de LLM : extraction de données, bancs d'évaluation, boucles d'exécution avec des agents de code."
    ],
    ctaProjects: 'Voir mes projets',
    ctaContact: 'Me contacter'
  },

  about: {
    title: 'Parcours',
    intro:
      "J'ai appris le métier en entreprise, au fil de quatre stages, puis en indépendant. Je me spécialise aujourd'hui en ingénierie IA en autodidacte, en construisant mes propres projets.",
    timeline: [
      {
        period: '2019 – 2024',
        place: "CESI École d'ingénieurs, Lingolsheim",
        role: "Diplôme d'ingénieur en informatique",
        detail: 'Deux ans de prépa intégrée, trois ans de cycle ingénieur'
      },
      {
        period: 'Avr. – août 2021',
        place: 'Agile Business, Geudertheim',
        role: 'Intégrateur web · stage',
        detail: ''
      },
      {
        period: 'Janv. – avr. 2022',
        place: 'Europe Tech Group, Haguenau',
        role: 'Développeur back-end · stage',
        detail: ''
      },
      {
        period: 'Sept. 2022 – janv. 2023',
        place: 'IT Selecta, Cracovie (Pologne)',
        role: 'Développeur full-stack · stage',
        detail: ''
      },
      {
        period: 'Févr. – août 2024',
        place: 'Ippon Technologies, Strasbourg',
        role: 'Développeur full-stack · stage',
        detail: "L'équipe produit est passée de 4 à 11 personnes pendant le stage"
      },
      {
        period: "Déc. 2024 – aujourd'hui",
        place: 'Indépendant',
        role: 'Développeur',
        detail: 'Sites et applications pour des clients, dont CATRA et P.A.R.C'
      }
    ]
  },

  method: {
    title: 'Travailler avec des agents de code',
    intro:
      "Je fais exécuter mon code par Claude Code, dans un cadre que je construis moi-même : des tickets, des règles, des contrôles automatiques et un journal. Le terrain d'essai est la refonte en Nuxt 4 du site d'une association de jardins, parcpaysage.com.",
    cards: [
      {
        title: 'Un ticket, un espace isolé',
        text: "Chaque ticket s'exécute dans son propre worktree git. Les tickets s'enchaînent en mode non interactif, sans que j'aie à rester devant."
      },
      {
        title: "Vérifier l'environnement avant de lire le ticket",
        text: "Un script de preflight contrôle l'environnement avant que l'agent commence. Un environnement cassé s'arrête en quelques secondes, au lieu de 31 minutes de travail perdu constatées avant sa mise en place."
      },
      {
        title: "La barre vient de l'extérieur",
        text: "Un agent qui écrit ses propres critères d'acceptation ne peut pas échouer. Les critères viennent donc d'une source que l'agent ne contrôle pas, et ses règles comme ses réglages sont protégés en écriture."
      },
      {
        title: 'Tout finit au journal',
        text: "Je planifie et je spécifie dans Notion avec un modèle de chat, Claude Code exécute et écrit ce qu'il a fait. Chaque échec devient une règle datée, avec le motif qui l'a fait naître."
      }
    ]
  },

  roadmap: {
    kicker: 'Projet phare',
    title: "job-search : trier des milliers d'offres avec un LLM local",
    subtitle: 'Plus de 2 500 offres en base en septembre 2026. Python, FastAPI, SQLite, Ollama, Nuxt, TypeScript.',
    steps: [
      {
        title: 'Collecte',
        descriptions: [
          'Les offres arrivent de quatre sources.',
          "France Travail, Indeed, Remotive et EURES, récupérées en une passe par une commande que je lance à la main. Pas de tâche planifiée, pas d'API payante."
        ],
        planetTexture: 'planet-bake-1'
      },
      {
        title: 'Tri amont',
        descriptions: [
          "Ce qui n'est pas prenable sort avant le modèle.",
          "Une offre publiée sur deux sources n'est gardée qu'une fois. Les stages et les alternances sont écartés avant tout appel au LLM."
        ],
        planetTexture: 'planet-bake-1'
      },
      {
        title: 'Extraction',
        descriptions: [
          'Un modèle local lit chaque offre, une seule fois.',
          "Il tourne avec Ollama et ne répond que dans un vocabulaire fermé : séniorité sur quatre valeurs, domaine sur huit, technos avec trois niveaux d'importance, langues exigées. Chaque appel est tracé : prompts, réponse, modèle."
        ],
        planetTexture: 'planet-bake-2'
      },
      {
        title: 'Scoring',
        descriptions: [
          'Deux axes indépendants, calculés en Python.',
          "Désirabilité et atteignabilité, au regard de mon profil. Aucun score n'est stocké : changer le profil recalcule tout sans rappeler le modèle."
        ],
        planetTexture: 'planet-bake-3'
      },
      {
        title: 'Catégories',
        descriptions: [
          'Quatre catégories, et rien ne se perd.',
          "Offre parfaite, offre de rêve, atteignable, hors périmètre. Une offre écartée garde ses données : si une règle se révèle fausse, l'offre revient à sa place sans repasser par le modèle."
        ],
        planetTexture: 'planet-bake-4'
      },
      {
        title: 'Décision',
        descriptions: [
          'Le système classe, je décide.',
          "Je lis les offres qui remontent et je retiens celles qui m'intéressent. Une vue opérateur me sert à vérifier que les filtres ne coupent pas ce qu'ils ne devraient pas."
        ],
        planetTexture: 'planet-bake-5'
      }
    ]
  },

  projects: {
    title: 'Projets',
    intro: 'Des projets personnels, construits pour apprendre en produisant quelque chose qui tourne.',
    cards: [
      {
        id: 'job-search',
        title: 'job-search',
        tagline: "Récupérer, lire et classer des offres d'emploi avec un LLM local.",
        text: 'Collecte sur quatre sources, extraction par un modèle local en vocabulaire fermé, scoring Python sur deux axes, traces de chaque appel au modèle.',
        tags: ['Python', 'FastAPI', 'SQLite', 'Ollama', 'Nuxt'],
        href: null,
        cta: { label: 'Voir le détail', section: 'roadmap' }
      },
      {
        id: 'rag-eval-scifact',
        title: 'rag-eval-scifact',
        tagline: "Un banc d'évaluation pour un moteur de recherche sémantique.",
        text: "Embeddings sentence-transformers et base ChromaDB, testés sur le jeu SciFact. Métriques codées à la main à partir du rang du document attendu : premier, top 5, top 100, non retrouvé. Runs nommés et versionnés sur le jeu complet. Les échecs sont classés en quatre familles : retrieval, saturation, inférence, troncature. Cause principale identifiée : la fenêtre de 256 tokens du modèle d'embedding, qui tronque les documents longs.",
        tags: ['Python', 'sentence-transformers', 'ChromaDB', 'évaluation'],
        href: 'https://github.com/GregCesi/rag-eval-scifact',
        cta: null
      },
      {
        id: 'agent-codeloop',
        title: 'agent-codeloop',
        tagline: "Une boucle d'exécution de tickets par Claude Code.",
        text: "Worktrees isolés, preflight, règles protégées, critères d'acceptation externes et journal d'exécution. Appliquée à la refonte en Nuxt 4 de parcpaysage.com.",
        tags: ['Claude Code', 'git worktrees', 'Nuxt 4'],
        href: null,
        cta: { label: 'Voir la méthode', section: 'method' }
      }
    ],
    contact: {
      title: 'Contact',
      text: "Je cherche un poste d'ingénieur IA, en Belgique ou à Strasbourg.",
      email: 'gmarchand.pro1@gmail.com',
      github: 'https://github.com/GregCesi',
      // {{LINKEDIN_URL}} : valeur non fournie dans content/portfolio.md, laissée vide (élément masqué).
      linkedin: '',
      // {{CV_URL}} : valeur non fournie dans content/portfolio.md, laissée vide (élément masqué).
      cvUrl: '',
      cvLabel: 'Télécharger mon CV',
      emailLabel: 'E-mail',
      githubLabel: 'GitHub',
      linkedinLabel: 'LinkedIn'
    }
  }
}
