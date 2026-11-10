# Architecture

## Stack

- Next.js 14 App Router, static export (`output: "export"`) for GitHub Pages
- React 18, TypeScript (strict)
- React Three Fiber + Drei for the homepage 3D scene (client-only, loaded with `ssr: false`)
- Framer Motion for reveal animations
- Plain CSS in `src/app/globals.css` (no CSS framework, no new runtime dependencies)
- Lucide icons

## Folder layout

```
src/
  app/                     Routes and global styles (App Router)
    layout.tsx             Root HTML, metadata, skip link
    page.tsx               Homepage (single scrolling page, anchor sections)
    globals.css            Design tokens and component styles
  components/
    Portfolio.tsx          Homepage composition (sections only)
    EngineeringScene.tsx   3D processor scene (error-isolated)
    layout/                Site chrome: BootScreen, SiteHeader, SiteFooter
    ui/                    Reusable primitives: Reveal, LinkOrPending
  data/                    All editable content, one file per topic
    profile.ts             Personal details and links
    navigation.ts          Primary navigation items
    skills.ts              Skill groups
    projects.ts            Project cards
    journey.ts             Timeline milestones
  lib/
    content.ts             Placeholder detection helper
public/                    Static files copied as-is (CV, images, .nojekyll)
docs/                      Project documentation
```

## Conventions

1. **Content lives in `src/data/`.** Components render data; they do not contain personal facts. Editing a project or skill never requires touching a component.
2. **Unfinished values are visible but never broken.** Any link whose address contains `YOUR_` or `example.com` renders as a disabled element through `LinkOrPending`. Missing facts are shown as clearly marked placeholders rather than invented text.
3. **Navigation only points to things that exist.** `src/data/navigation.ts` lists homepage anchors. A route (for example `/projects`) is added to this list in the same change that creates the page.
4. **Client components are marked explicitly** with `"use client"` and only where state, effects or browser APIs are needed.
5. **Motion respects `prefers-reduced-motion`** in CSS, in `Reveal`, and in the 3D chip.
6. **No secrets in frontend code.** Static export has no server, so any credentialed API call must run at build time (GitHub Actions secrets) or in a separate server. See the integration guide once added.

## Status

| Area | State |
|---|---|
| Homepage | Complete; sections preserved; uses shared components and data files |
| Shared layout (header, footer, page shell, page hero, breadcrumbs) | Complete |
| Projects directory `/projects` with search and category filter | Complete (static checks and logic tests; not browser-tested) |
| Project detail `/projects/[slug]` | Complete; statically generated per project |
| Skills `/skills` | Complete; data from README |
| Journey `/journey` | Complete; data from owner details and README |
| Research `/research` (+ detail), Blog `/blog` (+ articles), Resources `/resources` | Complete (Phase 4) |
| Lab `/lab` (+ calculators), Services `/services`, Contact `/contact` | Complete (Phase 5) |
| Integration modules (GitHub, ORCID, Crossref, Dev.to, analytics, contact) and register | Complete (Phase 6); live fetches run only at build when configured |
| Deployment workflow | Written (`.github/workflows/deploy.yml`); not yet run |
| Documentation and final audit | Complete (see root documents) |

## Adding content

- **Project:** append an object to `src/data/projects.ts`. It appears in the directory, on the detail page, and on the homepage when `featured` is true.
- **Skill group:** edit `src/data/skills.ts`.
- **Journey entry:** add an object to `src/data/journey.ts`. Set `featured` to show it on the homepage.
- **Navigation item:** add a route to `src/data/navigation.ts` only in the change that creates its page.
