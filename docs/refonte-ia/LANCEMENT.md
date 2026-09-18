# Lancer la refonte avec ECC

Préparé le 18 septembre 2026. Contenu, spec et grille sont déjà écrits : `content/portfolio.md`, `gan-harness/spec.md`, `gan-harness/eval-rubric.md`.

## 1. Avant le run (une fois)

```bash
cd ~/Code/portfolio
git switch ia-refonte
npm install
```

Garder la ligne Co-Authored-By dans tous tes dépôts : ECC la coupe globalement sauf si la clé est déjà explicite. Ouvre `~/.claude/settings.json` et ajoute `"includeCoAuthoredBy": true` **avant** l'installation.

Installer ECC en portée locale :

```bash
npx ecc-universal@2.2.1 setup --mode claude-plugin --scope local --hooks standard --yes
```

Si l'installeur échoue sur « Could not verify ecc@ecc as enabled only at local scope » (bug connu quand une install locale existe déjà ailleurs) :

```bash
claude plugin install ecc@ecc --scope local --config hooks_enabled=true --config hook_profile=standard
```

MCP Playwright, sinon l'evaluator ne teste pas le site en vrai :

```bash
claude mcp add playwright --scope local -- npx -y @playwright/mcp --browser chrome
```

## 2. Le run

Lancer `claude` dans `~/Code/portfolio`, **hors auto mode** (depuis le Terminal macOS), puis :

```
/ecc:gan-build "Refonte IA du portfolio : suivre gan-harness/spec.md et gan-harness/eval-rubric.md, contenu dans content/portfolio.md" --skip-planner --pass-threshold 8 --max-iterations 5
```

- `--skip-planner` : le planner ne réécrit pas la spec, il utilise `gan-harness/spec.md` (vérifié dans `commands/gan-build.md` d'ECC, commit `dd6ee53`).
- Seuil 8 au lieu de 7 : au premier essai, l'evaluator a donné 9,8 à un site qui avait deux défauts de contraste qu'il qualifiait lui-même de critiques. La grille ajoute des portes qui plafonnent la note à 5.
- 5 itérations maximum pour borner le coût.

## 3. Après le run

Vérifier que le run n'a rien lu hors du dépôt :

```bash
grep -rhoE '/Users/gregoiremarchand/[A-Za-z0-9._/-]+' ~/.claude/projects/*portfolio*/ | grep -v '/Code/portfolio' | cut -d/ -f1-5 | sort | uniq -c | sort -rn
```

Puis lire `gan-harness/build-report.md` et le dernier `gan-harness/feedback/feedback-NNN.md`, et regarder le site : `npm run dev`.

À remplir dans `content/portfolio.md` quand tu les as : `{{LINKEDIN_URL}}`, `{{CV_URL}}`.
