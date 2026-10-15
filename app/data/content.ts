import type { SiteContent, SectionId } from '~/types/content'

/**
 * Source unique des textes visibles du site.
 * Reprend `content/portfolio.md` mot pour mot : ne pas reformuler, ne pas traduire,
 * ne pas ajouter de texte ici. Toute correction de texte se fait dans le fichier
 * `content/portfolio.md`, puis se répercute ici à l'identique.
 */

/** Ordre des cinq sections plein écran, index correspondant dans SlideContainer. */
export const SECTION_ORDER: SectionId[] = ['hero', 'about', 'method', 'projects', 'contact']

export const SECTION_INDEX: Record<SectionId, number> = {
  hero: 0,
  about: 1,
  method: 2,
  projects: 3,
  contact: 4,
}

export const siteContent: SiteContent = {
  global: {
    name: 'Grégoire MARCHAND',
    headerTitle: 'Développeur full-stack · AI Engineer',
    pageTitle: 'Grégoire MARCHAND · Développeur full-stack, AI Engineer',
    metaDescription:
      "Développeur full-stack et AI engineer. J'élimine les frictions en automatisant les process avec des LLM, mesurés pour qu'on puisse s'y fier.",
    menuLabels: ['Start', 'Parcours', 'Méthode', 'Projets', 'Contact'],
    lang: 'fr',
  },

  entryGate: {
    log: [
      'Mise sous tension des systèmes',
      'Chargement des polices de titre',
      'Chargement des polices de texte',
      'Calibrage des propulseurs',
      'Chargement de la planète',
      'Application des textures',
      'Mise en orbite du satellite',
      'Ouverture du sas',
    ],
  },

  hero: {
    title: "J'élimine les frictions en automatisant les process avec des LLM.",
    paragraphs: [
      "Ingénieur en informatique, développeur full-stack de formation. Je construis des systèmes à base de LLM : extraction de données, RAG, agents de code, et les évaluations qui montrent s'ils tiennent.",
    ],
    hook: 'Quatre escales vous attendent avant de repartir : mon parcours, ma méthode, mes projets, et une fréquence pour me joindre.',
    ctaProjects: 'Voir mes projets',
    ctaContact: 'Me contacter',
  },

  about: {
    title: 'Parcours',
    intro:
      "Cinq ans d'école d'ingénieur, quatre stages en entreprise dont un à l'étranger, puis développeur indépendant depuis fin 2024. En parallèle, je me spécialise en ingénierie IA en construisant mes propres systèmes.",
    timeline: [
      {
        period: '2019 – 2024',
        place: "CESI École d'ingénieurs, Lingolsheim",
        role: "Diplôme d'ingénieur en informatique",
        detail: 'Deux ans de prépa intégrée, trois ans de cycle ingénieur',
      },
      {
        period: 'Avr. – août 2021',
        place: 'Agile Business, Geudertheim',
        role: 'Intégrateur web · stage',
        detail: 'Sites WordPress : intégration, thèmes, mise en production',
      },
      {
        period: 'Janv. – avr. 2022',
        place: 'Europe Tech Group, Haguenau',
        role: 'Développeur back-end · stage',
        detail:
          "API C# .NET pour une application de portage salarial, maintenance de l'ERP Microsoft Dynamics NAV",
      },
      {
        period: 'Sept. 2022 – janv. 2023',
        place: 'IT Selecta, Cracovie (Pologne)',
        role: 'Développeur full-stack · stage',
        detail: "CRM et workflows d'automatisation sur mesure pour une startup, en anglais",
      },
      {
        period: 'Févr. – août 2024',
        place: 'Ippon Technologies, Strasbourg',
        role: 'Développeur full-stack · stage',
        detail:
          "Calculateur d'empreinte carbone en Java Spring Boot et Nuxt. L'équipe produit est passée de 4 à 11 personnes pendant le stage",
      },
      {
        period: "Déc. 2024 – aujourd'hui",
        place: 'Indépendant, Strasbourg',
        role: 'Développeur freelance',
        detail:
          "Sites et applications pour des clients, dont CATRA et P.A.R.C, puis une application B2B conçue à deux, menée jusqu'au prototype",
      },
    ],
  },

  method: {
    kicker: 'Méthode',
    title: 'De la friction au système qui tient',
    subtitle:
      'Six étapes que je suis sur chaque projet, du premier constat à la surveillance après livraison.',
    // Les textures vont du rouge-brun (étape 1) au vert (étapes 5 et 6) : il n'y a que
    // quatre textures bakées, deux étapes voisines en partagent une.
    steps: [
      {
        title: 'Repérer',
        descriptions: [
          "Tout part d'une friction.",
          "Une tâche répétée, lente ou pénible. Je la décris avant de choisir un modèle, et je vérifie qu'un LLM est la bonne réponse.",
        ],
        planetTexture: 'planet-bake-1',
      },
      {
        title: 'Observer',
        descriptions: [
          'Avant de corriger, je mesure.',
          'Je trace chaque appel au modèle et je classe les erreurs, pour savoir où le système casse.',
        ],
        planetTexture: 'planet-bake-1',
        scansPlanet: true,
      },
      {
        title: 'Corriger',
        descriptions: [
          'Une cause à la fois.',
          "Je traite la famille d'erreurs la plus fréquente, puis je remesure. Prompt, modèle ou règles autour : je choisis le levier d'après la mesure.",
        ],
        planetTexture: 'planet-bake-2',
      },
      {
        title: 'Vérifier',
        descriptions: [
          'Des critères que le modèle ne contrôle pas.',
          "Je les écris avant de commencer, et les contrôles tournent sans lui : tests, build, jeux d'évaluation.",
        ],
        planetTexture: 'planet-bake-3',
      },
      {
        title: 'Livrer',
        descriptions: [
          'Le process est automatisé.',
          'Le temps que coûtait la friction est rendu, et ce que fait le système reste lisible dans ses traces.',
        ],
        planetTexture: 'planet-bake-4',
      },
      {
        title: 'Surveiller',
        descriptions: [
          'La mesure continue après la livraison.',
          "Un modèle change, les données aussi. Je garde les traces et les évaluations en place pour voir une dérive avant qu'elle coûte.",
        ],
        planetTexture: 'planet-bake-4',
        scansPlanet: true,
      },
    ],
  },

  projects: {
    title: 'Projets',
    intro:
      "Des systèmes construits pour mes propres besoins, et mesurés pour savoir s'ils tiennent.",
    cards: [
      {
        id: 'job-search',
        title: 'job-search',
        tagline:
          "Un outil qui trie les offres d'emploi à ma place, pour ne lire que celles qui valent la peine.",
        text: "Un LLM local lit chaque offre une seule fois et répond dans un vocabulaire fermé. Des règles Python classent ensuite les offres sur deux axes, ce qui m'attire et ce qui m'est accessible. Le système classe, je décide. Chaque appel au modèle est tracé, et c'est en lisant ces traces que je l'ai refondu plusieurs fois.",
        tags: ['Python', 'FastAPI', 'SQLite', 'Ollama', 'Nuxt'],
        href: 'https://github.com/GregCesi/job-search',
        cta: null,
      },
      {
        id: 'rag-eval-scifact',
        title: 'rag-eval-scifact',
        tagline: "Construire un bon RAG en partant d'un bon banc d'évaluation.",
        text: "Le banc est posé : corpus public SciFact, métriques codées à la main à partir du rang du document attendu, runs versionnés, échecs classés en quatre familles. L'étape suivante est d'améliorer le RAG en mesurant chaque changement sur ce banc.",
        tags: ['Python', 'sentence-transformers', 'ChromaDB', 'évaluation'],
        href: 'https://github.com/GregCesi/rag-eval-scifact',
        cta: null,
      },
      {
        id: 'cockpit',
        title: 'Cockpit',
        tagline:
          "Un poste de pilotage pour travailler avec l'IA sans jamais réexpliquer le contexte.",
        text: "Plusieurs projets menés de front avec des agents. Dans Notion, un modèle de chat et moi tenons le backlog, un journal daté et les règles du jeu, relues à chaque session. Les tickets partent ensuite dans une boucle où Claude Code les exécute seul, dans un espace isolé, contre des critères qu'il ne peut pas réécrire. Je relis le résultat avant de l'intégrer. L'orchestration des agents repose sur une boîte à outils open source écrite par un tiers. Le site que vous parcourez est passé par cette boucle.",
        tags: ['Claude Code', 'MCP Notion', 'git worktrees'],
        href: null,
        cta: { label: 'Voir la méthode', section: 'method' },
      },
    ],
  },

  contact: {
    title: 'Ouvrir une fréquence',
    badge: 'Disponible dès maintenant',
    text: "Je cherche un poste d'AI engineer en Belgique ou à Strasbourg, et je suis disponible dès maintenant.",
    email: 'gmarchand.pro1@gmail.com',
    github: 'https://github.com/GregCesi',
    linkedin: 'https://www.linkedin.com/in/gr%C3%A9goire-marchand-5b8279203/',
    // {{CV_URL}} : valeur non fournie dans content/portfolio.md, laissée vide (élément masqué).
    cvUrl: '',
    cvLabel: 'Télécharger mon CV',
    emailLabel: 'E-mail',
    githubLabel: 'GitHub',
    linkedinLabel: 'LinkedIn',
    githubName: 'GregCesi',
    linkedinName: 'Grégoire Marchand',
    channelEmailLabel: 'Canal 01',
    channelLinkedinLabel: 'Canal 02',
    channelGithubLabel: 'Canal 03',
    copyLabel: 'Copier',
    copiedLabel: 'Copié',
  },

  wip: {
    title: 'Work in progress',
  },

  notFound: {
    code: '404',
    text: "Cette page n'existe pas.",
    backLabel: "Retour à l'accueil",
  },
}
