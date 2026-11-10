# Phase 3 Report — Projects, Skills and Journey

## Scope

Phase 3 covers the Projects directory and detail pages, the Skills page, and the Journey page, plus the data and shared layout they depend on. Research, Blog, Resources, Lab, Services and the contact page are Phases 4–5. Integration modules and the final audit are Phase 6.

## Content sources

- Projects, skills and the RoutineNest, MCQ Studio and hardware project descriptions come from the GitHub profile README.
- University (American International University of Bangladesh), stage (third-year student) and expected graduation (June 2028) come from the owner's direct statement.
- Journey entries use only dates the owner supplied. Undated entries read "Date to be added".

## Changes

- Removed the template project cards (ESP32 OLED, Solar DC microgrid, PV fault detection) and template skills that were not in the README. These were placeholders, not owner content.
- Homepage research band: removed the template-written topics ("PV systems", "risk analysis") and replaced the paragraph with a neutral line, since the README lists no research.
- Homepage about text: now describes a third-year student and points to real project types.
- `src/types/content.ts`: shared types for Project, SkillGroup and JourneyEntry.
- `src/lib/`: `projects.ts` (filtering, categories, related items), `navigation.ts` (anchor and route resolution), `site.ts` (GitHub Pages base path helper).
- `src/components/`: `PageLayout`, `PageHero`, `Breadcrumbs`, `ProjectCard`, `ProjectDirectory`.
- Routes: `/projects`, `/projects/[slug]`, `/skills`, `/journey`, plus `not-found`, `error` and `loading` states.
- Navigation: Skills, Projects and Journey are now route links. Research and Writing stay as homepage anchors until their pages exist.
- `next.config.mjs`: exposes the base path to client code so internal asset URLs work on project sites.

## Verification

| Check | Method | Result |
|---|---|---|
| Syntax of all TypeScript and TSX files and config | esbuild parse | PASS |
| Every import resolves and every named import is exported | Static script | PASS |
| Every navigation route has a page file; every anchor has a section | Static script | PASS |
| Every className used is defined in CSS | Static script | PASS |
| Project search, category filter, combined filter, empty result | Executed (tests/run-content-tests.cjs) | PASS |
| Project slugs unique and URL-safe; required fields present | Executed | PASS |
| Only README demo links present; no placeholder URLs in project links | Executed | PASS |
| Featured homepage projects, category order, related projects | Executed | PASS |
| Link resolution: anchors on homepage and subpages, route activity | Executed | PASS |
| Journey dates and profile values match owner details | Executed | PASS |
| Skills contain no proficiency fields and no template-only entries | Executed | PASS |
| `npm install`, `npm run build`, `npm run typecheck` | — | NOT EXECUTED (no network) |
| Static export generates `/projects/[slug]` pages | — | NOT EXECUTED |
| Browser rendering, search typing, mobile menu, layouts at eight viewports | — | NOT VERIFIED |
| Icon exports from lucide-react | — | NOT VERIFIED |

29 of 29 executed tests passed. Those tests cover the pure logic and data only, not the rendered pages.

## Open items for the owner

1. Confirm the university name. You wrote "American International University of Bangladesh"; the official name is commonly given as "American International University-Bangladesh (AIUB)". The site uses your wording.
2. Repository links for RoutineNest and MCQ Studio are not added, because the README gives only the live Pages links. Add `repo` in `src/data/projects.ts` when confirmed.
3. Hardware projects have no links or screenshots. Their pages say so.
4. CV: add `public/resume.pdf` and set `hasResume` to true.
5. Journey dates for learning and roles are "Date to be added".
6. Skill groups follow the README exactly. Add more groups (electronics platforms, for example) only with your confirmation.
