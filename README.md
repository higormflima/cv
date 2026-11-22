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
pnpm build
pnpm preview
```

Astro writes the static site to `dist/`. The GitHub Actions workflow in `.github/workflows/deploy.yml` builds and deploys this directory when changes are pushed to `main`. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

## Updating the site

- Edit the profile summary in `src/data/profile.ts`.
- Update work history in `src/data/experience.ts`, education in `src/data/education.ts`, and skills, certifications, and languages in `src/data/skills.ts`.
- The full Markdown CV is available at `public/documents/higor-lima-cv.md` and as a download from the home page. Keep it aligned with the structured site data when updating the CV.
- Replace clearly marked placeholder copy on the Story and Projects pages when source material is ready.
- The repository owner and Pages URL are configured in `astro.config.mjs`.
- The optimized portrait is in `public/images/profile/`. Keep the original photo separately when replacing it.

All site copy and project documentation are written in English. Personal and professional details currently shown are based on the supplied CV.
