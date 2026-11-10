# MD. Rakebul Hassan — Engineering Portfolio

Personal portfolio for MD. Rakebul Hassan, a third-year Computer Engineering student at the American International University of Bangladesh (expected graduation June 2028). The site presents projects, skills, research, technical writing, engineering calculators, services and contact details.

It is a static Next.js site. It builds to plain files and deploys to GitHub Pages, so it has no server of its own.

## Features

- **Homepage:** hero with an interactive 3D processor scene, skills, featured projects, research, journey and contact sections.
- **Projects:** searchable directory with category filters, detail pages, and public GitHub repositories fetched at build time.
- **Skills:** categorised tools and technologies from the owner's GitHub profile. No proficiency levels.
- **Journey:** education, learning and professional timeline.
- **Research:** interests, ongoing work, publications, researcher profiles (ORCID, Google Scholar, IEEE Xplore) and methodology. Publications show DOIs and links after format checks.
- **Blog:** Markdown articles with frontmatter, search, category filters, reading time, related articles and previous/next navigation. Unpublished drafts are never built.
- **Resources:** downloads and external links with search and filters. Missing files are labelled, never offered as downloads.
- **Engineering Lab:** five working calculators with validated input, plus planned tools listed for transparency.
- **Services:** areas of work with a clear scope note and enquiry links.
- **Contact:** email and social links. A contact form appears only when an external form endpoint is configured.
- **Accessibility and motion:** skip link, labelled forms, keyboard-accessible menus, reduced-motion support.

## Technology

- Next.js 14 (App Router, static export) and React 18, with TypeScript
- React Three Fiber and Drei for the 3D scene (client-only)
- Framer Motion for reveal animations
- Plain CSS in `src/app/globals.css`
- Lucide icons
- No Markdown library, no CMS, no database

## Requirements

- Node.js 20 LTS
- npm
- A GitHub account for deployment

## Install and run locally

```bash
npm ci               # reproducible install (after package-lock.json is committed); use npm install if there is no lockfile yet
npm run dev          # http://localhost:3000
```

All commands:

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production static export to `out/` |
| `npm run export` | Same as `npm run build` (kept for compatibility) |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) without writing files |
| `npm test` | Runs all 138 executed unit tests (`tests/run-all.sh`); exits non-zero on any failure |
| `npm run deploy` | Manual alternative: builds and pushes `out/` to the `gh-pages` branch |

ESLint is not configured in this project, so there is no lint command.

## Project structure

```
src/
  app/            Routes (App Router): pages, dynamic routes, 404, error and loading states
  components/     Reusable UI, layout, and page-specific components
  data/           Editable content: profile, projects, skills, journey, research, resources, lab, services, navigation, integrations
  lib/            Pure logic (filtering, validation, Markdown, calculators) and server-only build-time loaders
  types/          Shared content types
content/blog/     Markdown articles
public/           Static files served as-is (CV, images, .nojekyll)
tests/            Executed test suites and runner
docs/             Architecture and phase reports
.github/workflows/deploy.yml   GitHub Pages deployment
```

## Available pages

| Route | Purpose |
|---|---|
| `/` | Homepage |
| `/projects`, `/projects/<slug>` | Project directory and details |
| `/skills` | Technical skills |
| `/journey` | Education and professional timeline |
| `/research`, `/research/<slug>` | Research overview and entries |
| `/blog`, `/blog/<slug>` | Articles |
| `/resources` | Downloads and reference links |
| `/lab`, `/lab/<slug>` | Engineering calculators |
| `/services` | Areas of work and enquiries |
| `/contact` | Contact details and form (when configured) |

## Configuration

Content is edited in `src/data/` and `content/blog/`. See `DEVELOPMENT_GUIDE.md` for step-by-step instructions.

Environment variables are documented in `.env.example`. Variables starting with `NEXT_PUBLIC_` are visible to visitors and hold only public identifiers. Other variables are read at build time on the server only.

Before deploying, set `repoName` in `next.config.mjs`:
- Project site (`USERNAME.github.io/REPOSITORY`): `const repoName = "REPOSITORY";`
- User site (`USERNAME.github.io`): `const repoName = "";`

## Deploy to GitHub Pages

1. Push the project to a GitHub repository, with the default branch named `main`.
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Optional: under **Settings → Secrets and variables → Actions → Variables**, add `GITHUB_USERNAME`, `ORCID_ID`, `NEXT_PUBLIC_FORMSPREE_ENDPOINT` and `NEXT_PUBLIC_ANALYTICS_ID` as needed.
4. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds the site and publishes it.
5. Open the URL shown in the workflow run.

The workflow runs `npm install`. After your first local `npm install`, commit `package-lock.json` and change that step to `npm ci` for reproducible builds.

An alternative manual route exists: `npm run deploy` builds and pushes `out/` to a `gh-pages` branch. Use either this or the workflow, not both.

## Known limitations

- The contact form needs an external form service (not included).
- Live GitHub and ORCID data are fetched only during builds, so they update when the site is rebuilt.
- No server-side features: no login, no database, no runtime API calls.
- Some content is intentionally incomplete: the CV file, institution-level details, repository links for some projects, and publications. These appear as clearly labelled empty or pending states.

See `FINAL_AUDIT_REPORT.md` for the full list of verified and unverified items.
