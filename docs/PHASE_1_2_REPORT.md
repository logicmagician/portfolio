# Phase 1–2 Report — Architecture and Homepage Foundation

## Scope

Phase 1 audited the project and set the shared architecture. Phase 2 improved the homepage, navigation, footer and reusable components. The homepage sections were kept. No route pages were created yet; those are Phases 3–5.

## Phase 1 — Audit findings

| Finding | Action |
|---|---|
| All homepage content in one 298-line component | Split into `components/layout`, `components/ui` and per-topic data files |
| One data file (`portfolio.ts`) for every topic | Split into `profile`, `navigation`, `skills`, `projects`, `journey`; old file removed |
| Placeholder email, GitHub and LinkedIn although the README contains real values | Replaced with values from the README |
| RoutineNest card described features not in the README ("budgeting", "concept") | Rewritten from the README with its real Pages link |
| Header/footer duplicated logic inline | Extracted to `SiteHeader` and `SiteFooter` |
| No skip link, no visible focus style, no current-section indicator | Added skip link, `:focus-visible`, scroll-tracked `aria-current` |
| Mobile menu accessibility | `aria-expanded`, `aria-controls`, Escape closes and returns focus |
| Navigation missing Journey and Writing | Added (both sections exist) |
| Metadata minimal | Added Open Graph title and description |

## Phase 2 — Changes

- `src/lib/content.ts`: placeholder detection, used by all link rendering.
- `src/components/ui/LinkOrPending.tsx`: real link, or disabled element while a URL is unfinished.
- `src/components/ui/Reveal.tsx`: moved from the monolithic component; behaviour unchanged.
- `src/components/layout/BootScreen.tsx`: loading screen, now hidden from assistive technology.
- `src/components/layout/SiteHeader.tsx`: navigation, mobile menu, scroll tracking.
- `src/components/layout/SiteFooter.tsx`: footer with social links (GitHub, LinkedIn, X, Instagram).
- `src/components/Portfolio.tsx`: homepage composition; same sections and markup.
- `src/app/layout.tsx`: skip link, Open Graph metadata.
- `src/app/globals.css`: appended focus, skip-link, current-link and footer styles. Existing rules untouched.
- `src/data/*`: five content files.
- `docs/ARCHITECTURE.md`: structure, conventions and status.

## Verification

| Check | Method | Result |
|---|---|---|
| Syntax of all TypeScript, TSX and config files | esbuild parse | PASS |
| Every import resolves to a file and every named import is exported | Static script | PASS |
| Every nav anchor has a matching section id | Static script | PASS (7 of 7) |
| No references to removed module or removed field | Search | PASS |
| Every className used is defined in CSS | Static script | PASS |
| `npm install`, `npm run build`, `npm run typecheck` | — | NOT EXECUTED (no network, dependencies unavailable) |
| Browser rendering, responsive layout, focus order, mobile menu behaviour | — | NOT EXECUTED |
| Footer layout with four social links | — | NOT VERIFIED visually |

## Open items for the owner

1. Resolved: the owner confirmed "Computer Engineering student, third year". The hero, about text, metadata and milestone now use this wording.
2. Homepage skills were written as template defaults. Confirm each against what you can actually do before publishing.
3. Institution, graduation status and milestone details are still placeholders.
4. Hardware project cards still link to placeholders. Phase 3 will use the README descriptions; links are needed for any that have repositories.
5. CV: add `public/resume.pdf` and set `hasResume` to true.
