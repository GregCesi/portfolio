import type { Step } from './method'

/** Identifiant stable de chacune des cinq sections plein écran. */
export type SectionId = 'hero' | 'about' | 'method' | 'projects' | 'contact'

export interface TimelineEntry {
  period: string
  place: string
  role: string
  detail: string
}

export interface SectionLink {
  label: string
  section: SectionId
}

export interface ProjectCard {
  id: string
  title: string
  tagline: string
  text: string
  tags: string[]
  href: string | null
  cta: SectionLink | null
}

export interface ContactBlock {
  title: string
  text: string
  email: string
  github: string
  /** Vide tant que Grégoire n'a pas fourni l'URL : l'élément qui la porte reste masqué. */
  linkedin: string
  /** Vide tant que Grégoire n'a pas fourni l'URL : l'élément qui la porte reste masqué. */
  cvUrl: string
  cvLabel: string
  emailLabel: string
  githubLabel: string
  linkedinLabel: string
}

export interface SiteContent {
  global: {
    name: string
    headerTitle: string
    pageTitle: string
    metaDescription: string
    menuLabels: string[]
    lang: string
  }
  hero: {
    title: string
    paragraphs: string[]
    hook: string
    ctaProjects: string
    ctaContact: string
  }
  about: {
    title: string
    intro: string
    timeline: TimelineEntry[]
  }
  method: {
    kicker: string
    title: string
    subtitle: string
    steps: Step[]
  }
  projects: {
    title: string
    intro: string
    cards: ProjectCard[]
  }
  contact: ContactBlock
}
