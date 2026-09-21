# Règles d'architecture — portfolio, Nuxt 4 / Tailwind 4

Treize règles, toutes vérifiables par `grep`, `wc -l` ou inspection d'arborescence.
Chacune porte sa clause d'écart : ce qui la viole se constate sur le code,
jamais au ressenti.

Ce fichier dérive de celui de parcpaysage (21 règles). Les règles propres à ce
site-là en sont sorties ; deux règles génériques n'ont pas été reprises parce que
le code existant les viole (voir *Non reprises*). Une règle que le terrain viole
dès l'entrée ne mesure rien : chaque tour la déclarerait non tenue, ou la
corrigerait hors de son périmètre.

## Arborescence

- **A1** — Tout le code applicatif vit sous `app/`.
  *Écart : un `.vue`, un `.ts` applicatif ou un `app.vue` hors de `app/`.*
- **A2** — Restent à la racine du code, et nulle part ailleurs : `public/`,
  `content/`, `nuxt.config.ts`, `package.json`, `tsconfig.json`,
  `eslint.config.mjs`.
  *Écart : tout autre dossier de code à la racine.*
- **A3** — Aucun de ces fichiers n'existe : `vite.config.*`, `postcss.config.*`,
  `tailwind.config.*`, `src/`, `server/`.
  *Écart : leur présence.*
- **A4** — `tsconfig.json` à la racine du dépôt qui héberge les worktrees reste
  valide quand `.nuxt/` est absent : aucun de ses champs ne désigne un fichier
  précis d'un dossier généré (`.nuxt/`, `.output/`). En build, OXC résout le
  tsconfig depuis la racine du dépôt hôte, jamais depuis le worktree — ce que ce
  fichier exige, tout worktree le subit.
  *Écart : un champ qui désigne un fichier de `.nuxt/` ou `.output/`. Un glob
  `include` qui balaie `.nuxt/**/*` n'en est pas un — sans dossier, il ne matche
  rien et ne casse rien.*

## Composants

- **C1** — `app/components/` est organisé en sous-dossiers par domaine. Un
  fichier, un composant. `SlideContainer.vue`, à plat, est antérieur à la règle.
  *Écart : un nouveau `.vue` à plat dans `app/components/`.*
- **C3** — Props typées par générique : `defineProps<Props>()`.
  *Écart : `defineProps({...})` en objet, ou un `any`.*

## Contenu

- **Ct1** — `content/portfolio.md` est la seule source des textes visibles. Ils
  sont repris mot pour mot dans `app/data/content.ts`, et les composants les
  reçoivent de là.
  *Écart : un texte visible présent dans un `.vue` ou un `.ts` et absent de
  `content/portfolio.md`.*
- **D1** — Aucune donnée n'est chargée à l'exécution.
  *Écart : un `useFetch`, `$fetch` ou `useAsyncData` dans le projet.*

## Styling

- **S1** — Tailwind 4 via `@tailwindcss/vite`, déclaré dans `nuxt.config.ts` sous
  `vite.plugins`.
  *Écart : couvert par A3.*
- **S2** — Un seul CSS global déclaré, `app/assets/css/main.css`, dans `css: []`.
  Il porte le bloc `@theme` ; il peut importer des feuilles de `app/assets/css/`.
  *Écart : un autre `.css` dans `css: []`, ou importé depuis un composant.*
- **S4** — Couleurs, polices et espacements de marque sont des tokens `@theme`.
  *Écart : la syntaxe crochet — `text-[#...]`, `bg-[...]`, `font-[...]`.*

## Rendu et déploiement

- **R1** — Site statique : `nuxt generate`, aucune route serveur.
  *Écart : couvert par A3 (`server/`), ou toute route d'API.*
- **R3** — Aucun secret dans le code. Valeurs variables via `runtimeConfig.public`.
  *Écart : une clé ou un token en dur. Les liens publics de `content/portfolio.md`
  (GitHub, projets) n'en sont pas.*

## Non reprises

- **C2** (aucun `.vue` au-delà de 150 lignes) — au 21 septembre 2026, 7 des 21
  `.vue` la dépassent, jusqu'à 381 lignes.
- **S3** (aucun bloc `<style>` dans un composant) — au 21 septembre 2026, 18 des
  21 `.vue` en portent un.

Les réintroduire est une décision, avec un ticket qui remet le code en règle
d'abord. Jusque-là, un tour n'a pas à les confronter.
