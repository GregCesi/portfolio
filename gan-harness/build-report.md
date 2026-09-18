# GAN Harness Build Report — run 2

**Brief :** Refonte IA du portfolio v2 : suivre `gan-harness/spec.md` et `gan-harness/eval-rubric.md`, contenu dans `content/portfolio.md`.
**Mode :** `--skip-planner` (spec v2 déjà écrite avant ce run, suite au retour de Grégoire après le run 1 archivé dans `gan-harness/run-1/`).
**Résultat : PASS**
**Itérations : 5 / 5 (max atteint au moment du PASS)**
**Score final : 8.2 / 10** (seuil : 8.0)
**Mode d'évaluation : playwright** (site live testé à chaque itération, mesures indépendantes sur pixels réellement rendus)

## Score Progression

| Iter | Commit | Design | Originality | Craft | Functionality | Total | Verdict |
|------|--------|--------|-------------|-------|----------------|-------|---------|
| 1 | `efb489d` | 5,0 (plaf.) | 5,0 (plaf.) | 4,0 | 5,0 (plaf.) | **4.70** | FAIL |
| 2 | `6628d83` | 5,0 (plaf.) | 5,0 (plaf.) | 4,5 | 5,0 (plaf.) | **4.85** | FAIL |
| 3 | `5f75ab1` | 5,0 (plaf.) | 5,0 (plaf.) | 5,0 (plaf.) | 5,0 (plaf.) | **5.00** | FAIL |
| 4 | `15853e6` | 8,0 | 8,0 | 7,0 | 8,0 | **7.70** | FAIL (< 8.0) |
| 5 | `74f04f2` | 8,0 | 8,0 | 8,0 | 9,0 | **8.20** | **PASS** |

Progression : 4.7 → 4.85 → 5.0 → 7.7 → 8.2.

## Fil des itérations

- **Itération 1** — implémentation de la spec v2 (suppression du scroll interne, découpage mobile en sous-écrans, direction artistique « instrument de bord »). Porte **P2 Contraste** en échec : menu latéral (3,2–3,75:1) et Hero sans fond (chute à ~1:1 quand une étoile blanche traverse le texte). Plafonnement à 5/10.
- **Itération 2** — correctif du Hero (scrim, confirmé PASS) et de l'opacité du menu, mais correctif partiel : le même défaut structurel (texte sur canvas sans fond opaque) réapparaît sur le Header et la colonne du menu, non audités. P2 échoue encore.
- **Itération 3** — audit systématique de toute la surface (Header, menu, marqueur de section, accusé clavier, 4 sections restantes via une classe `.panel-inset` commune). P2 passe enfin, solidement (45 zones, méthode de pire cas déterministe). Mais nouvelle porte en échec découverte : **P4/P7**, la frise Roadmap déborde de 129px à 375×667 et coupe 4 étapes sur 6 (le generator n'avait vérifié que le conteneur extérieur, pas `.section-inner`).
- **Itération 4** — frise Roadmap transformée en version compacte cliquable sous 768px (aucune troncature de texte), correctif d'un débordement indépendant de 8px sur Projets à 768×1024. Les **9 portes bloquantes passent pour la première fois**. Score 7,7/10 — sous le seuil réel de 8,0 (l'évaluateur a utilisé son défaut interne de 7,0, corrigé par l'orchestrateur).
- **Itération 5 (finale)** — correctif du Major Issue relevé à l'itération 4 : asymétrie et latence (~2s) de la navigation Roadmap next/prev, harmonisées et ramenées à ~330–450ms sans flash de contenu. Aucune régression sur les 9 portes. **PASS à 8,2/10.**

## Portes bloquantes — état final (itération 5)

Toutes PASS : P1 Contenu, P2 Contraste, P3 Build, P4 Mobile, P5 Effet 3D, P6 Périmètre, P7 Tenue à l'écran, P8 Menu, P9 Direction artistique.

## Remaining Issues (mineures, aucune majeure)

1. Zone tactile des segments compacts de la frise mobile Roadmap : 25,6px (au-dessus du minimum WCAG 24px, sous les 44px recommandés). Un agrandissement a été testé et annulé itération 5 (régression P7 d'1px) — piste : réduire un espacement voisin plutôt qu'agrandir directement.
2. Sous spam de clics extrême (5 clics à 100ms), un clic pendant une transition de texture planète en cours est silencieusement absorbé (`useCrossfadeTexture.ts`, warning console non bloquant) plutôt que mis en file d'attente comme le changement de section — piste : appliquer le même principe de file d'attente qu'à `SlideContainer.vue`.
3. `npx nuxi typecheck` échoue systématiquement pour une raison d'environnement local (`ERR_PACKAGE_PATH_NOT_EXPORTED`, résolution npx de la machine), indépendante du code, reproduite à l'identique itérations 2 à 5, désormais documentée dans le README.
4. Contraste de l'accusé de réception clavier (`.queued-hint`) : 5,03:1, marge la plus faible du site (non re-mesuré depuis l'itération 3, jamais tombé en dessous du seuil).
5. Zone vide en bas des sous-écrans mobile, signalée itération 1, non retouchée (non bloquante).

## Fichiers

- `gan-harness/spec.md`, `gan-harness/eval-rubric.md` (v2)
- `gan-harness/feedback/feedback-1.md` à `feedback-5.md`
- `gan-harness/generator-state.md`
- `gan-harness/screenshots/` (captures des 5 itérations)
- `gan-harness/run-1/` (run 1 archivé : build-report.md, feedback/, generator-state.md, screenshots/)
- `gan-harness/build-report.md` (ce fichier)

## Commits (branche `ia-refonte`, rien poussé)

`efb489d` · `6628d83` · `5f75ab1` · `15853e6` · `74f04f2`

## Incident de sécurité signalé pendant le run

Pendant l'itération 2, le generator a rencontré dans une sortie d'outil bash un texte imitant une « porte » de permission système (exigeant liste de fichiers, procédure de rollback, citation mot pour mot de l'instruction utilisateur avant de continuer). Le generator a correctement identifié que ce n'était pas le format réel du système de permission de l'environnement, ne s'y est pas conformé, et a abandonné sans impact la voie annexe (contournement de `npx nuxi typecheck`) qui l'avait déclenché. Aucune action à entreprendre, signalé ici pour traçabilité.
