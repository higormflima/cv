# Higor Lima — Personal CV

A lightweight, static CV website built with Astro and configured for GitHub Pages at `https://higormflima.github.io/cv/`.

## Requirements

- Node.js 22.23.4 or newer
- pnpm 11

## Local development

```sh
pnpm install
pnpm dev
```

## Production build

```sh
pnpm exec playwright install chromium   # first time only
pnpm build
pnpm preview
```

`pnpm build` runs `astro build` and then `scripts/generate-assets.mjs`, which uses Playwright to render `/resume/` to `dist/documents/higor-lima-cv.pdf` and the social card to `dist/og.png`. Use `pnpm build:site` to skip that step. Behind a TLS-intercepting proxy, set `NODE_OPTIONS=--use-system-ca` before installing packages.

Astro writes the static site to `dist/`. The GitHub Actions workflow in `.github/workflows/deploy.yml` builds and deploys this directory when changes are pushed to `main`, and rebuilds monthly so the career timeline's "now" marker stays current. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

## Features

- Dark theme by default with a light toggle (`src/lib/theme.ts`).
- Animated "raw data → structured value" hero canvas (`src/components/HeroCanvas.astro`); all motion respects `prefers-reduced-motion`.
- KPI strip (`src/data/metrics.ts`): every number must be traceable to the CV data.
- Career Gantt chart (`src/components/CareerGantt.astro`) built from `start`/`end`/`track` in `src/data/experience.ts` and `src/data/education.ts`.
- Skills knowledge graph (`src/components/SkillGraph.astro`): the layout is computed at build time in `src/lib/graph.ts`, and edges come from each role's `stack`.
- Machine-readable CV at `/api/profile.json` (`src/data/cv.ts`, JSON Resume–style, no phone number).
- Command palette and terminal (`Ctrl/⌘ K`, `/` or `` ` ``) in `src/components/CommandPalette.astro`.
- "Ask my CV": in-browser BM25 retrieval over `src/data/knowledge.ts` (`src/lib/ask.ts`). It uses no external AI service and answers only from CV content.
- Data-lineage diagrams on project pages (`src/components/LineageDiagram.astro`).

## Updating the site

- Edit the profile summary in `src/data/profile.ts`.
- Update work history in `src/data/experience.ts`, education in `src/data/education.ts`, and skills, certifications, and languages in `src/data/skills.ts`. Role `stack` entries must match skill names in `skills.ts` to appear in the skills graph.
- Bayer missions, stats, golden-query test, decisions (ADRs), proposals (RFCs), changelog and talks are in `src/data/contributions.ts`, the structured and public-safe version of `docs/bayer-contributions-report.md`. Keep internal names generic.
- The Story page narrative is in `src/data/story.ts`.
- The PDF CV is generated from the same data via `src/pages/resume.astro`. The Markdown CV at `public/documents/higor-lima-cv.md` is maintained by hand; keep it aligned with the structured site data.
- The repository owner and Pages URL are configured in `astro.config.mjs`.
- The optimized portrait is in `public/images/profile/`. It is generated from `assets/originals/higor-lima-original.webp` by `python scripts/enhance-portrait.py` (deterministic adjustments only: background darkening, temperature, skin tone, highlight roll-off, fill light, contrast and sharpening; requires Pillow and NumPy). Add `--compare out.png` to write a before/after image.

All site copy and project documentation are written in English. Personal and professional details currently shown are based on the supplied CV.
