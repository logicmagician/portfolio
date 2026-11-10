# Test Report

Each result is marked PASS, FAIL, FIXED, NOT RUN or NOT VERIFIED. "NOT RUN" means the check was not executed in the environment that produced this report. "NOT VERIFIED" means it was attempted but could not be confirmed.

## Environment for this round

Claude Web sandbox. No network access, so no `npm install`, no npm registry, and no `npm audit`. No Next.js, React, React Three Fiber, Drei or Lucide packages are installed, so the application cannot be built or served. A Chromium binary exists in the sandbox, but there is no served application to test against.

## Test commands

```bash
npm test                     # all unit test suites (tests/run-all.sh)
npm run typecheck            # TypeScript check
npm run build                # production static export
```

`npm test` uses the project's esbuild devDependency after `npm install`, or downloads esbuild with npx if it is not installed. Set `ESBUILD=/path/to/esbuild` to use a specific binary.

## Executed unit tests

| Suite | Scope | Result |
|---|---|---|
| Phase 3 logic (`run-content-tests.cjs`) | Project search, filters, related items, link resolution, route activity, journey dates, profile values, skill data | PASS 29/29 |
| Phase 4 logic (`phase4-tests.cjs`) | Frontmatter, Markdown tokens, safe link rules, post validation, blog ordering and related posts, DOI/ORCID formats, resource validation, date formatting | PASS 38/38 |
| Phase 4 files (`phase4-fs-tests.cjs`) | Real `content/blog` folder: valid sample loads; unpublished draft excluded; invalid file raises a named error; sort order; public file check | PASS 5/5 |
| Phase 5 logic (`phase5-tests.cjs`) | Input parsing; Ohm's law (all six solution pairs); resistor combinations; voltage divider; LED resistor; solar PV; registry consistency; contact validation; honeypot; mailto encoding; endpoint rules; services wording | PASS 45/45 |
| Phase 6 integrations (`phase6-tests.cjs`) | GitHub, ORCID, Crossref, Dev.to normalizers on fixtures; unavailable paths for unset or invalid configuration (no network); GA4 ID validation; integration register rules | PASS 21/21 |

**Total: 138 executed, 138 passing.** Run in this round with the runner fixed (see below).

The asynchronous Phase 6 checks exercise only paths that return before any network request. No live API was called.

## Test-runner defect fixed this round

- **Defect:** `tests/run-all.sh` used `node … | tail -1 || status=1`. The pipeline's exit status is that of `tail`, which is always 0, so a failing suite did not fail the run. Reproduced: a failing test reported status 0.
- **Fix:** the output is captured, the exit code of `node` is checked, and a failing suite sets a non-zero exit code.
- **Verified:** a forced failing suite injected into a temporary copy produced exit code 1 and the message "ONE OR MORE SUITES FAILED". The temporary files were removed.
- **Status:** FIXED.

## Static checks (executed this round)

| Check | Method | Result |
|---|---|---|
| TypeScript, TSX and config files parse | esbuild parse, all files | PASS, 0 failures |
| Local imports resolve; named imports are exported | Static script | PASS |
| Unused imports | Static script | PASS, none |
| Navigation and footer targets exist | Static script | PASS |
| Hard-coded internal routes have pages | Static script | PASS |
| Every `className` is defined in CSS | Static script | PASS |
| No raw HTML insertion | Pattern search | PASS |
| `target="_blank"` links carry `rel` | Static script | PASS |
| Server-only modules not imported from client components | Static script | PASS |
| Non-public variables read only on the server | Static script | PASS |
| Token-shaped strings in the project | Pattern search | PASS, none found |
| Committed `.env` files | File search | PASS, only `.env.example` |
| Workflow YAML parses; steps are in the intended order | PyYAML | PASS |
| `package.json` scripts | JSON read | PASS: `test` and `esbuild` devDependency added this round |

## Results from the owner's Mac (first full run)

Run on macOS by the owner after `npm install` (Next.js resolved to 14.2.35):

| Command | Result |
|---|---|
| `npm install` | Completed: 155 packages. Warning: `three-mesh-bvh@0.7.8` is deprecated (a dependency of Drei; a fix requires a Drei upgrade, not done). Warning: `esbuild@0.24.2` install script not yet approved under npm's script policy; harmless for this project |
| `npm audit` | 3 vulnerabilities: 1 moderate, 1 high, 1 critical. Details are in `audit.txt`, which was not supplied |
| `npm run typecheck` | PASS: no type errors |
| `npm test` | PASS: 138 of 138 |
| `npm run build` | FAIL, then fixed (see below). The first run stopped at "Collecting page data" with `Page "/research/[slug]" is missing "generateStaticParams()"` |
| Autoprefixer warnings | `globals.css` line 36: `start` value has mixed support; line 37: `end` value has mixed support. Fixed: `align-items` set to `flex-start` and `flex-end` in the two flex containers. Grid `start` values were not flagged and are unchanged |

### Fixes made after that build

- **Research detail route:** the route folder was removed and its logic moved to `src/components/research/ResearchDetail.tsx`, with activation steps in DEVELOPMENT_GUIDE.md. Other dynamic routes (`/projects/[slug]`, `/blog/[slug]`, `/lab/[slug]`) have non-empty static params and are unaffected.
- **Autoprefixer:** two flex-container values corrected. Verified by a script that no flex container still uses `start` or `end`.

The build has **not yet been re-run** after these fixes. The next run on your Mac is the check that matters.

## Not run or not verified

| Check | Status | Reason and command |
|---|---|---|
| `npm install` | NOT RUN | No network. `npm install` |
| `npm ci` (after lockfile exists) | NOT RUN | No lockfile. `npm ci` |
| `npm audit` | NOT RUN | No network. `npm audit` |
| `npm run typecheck` | NOT RUN | No TypeScript type definitions installed. `npm run typecheck` |
| ESLint | NOT APPLICABLE | Not configured in this project |
| `npm run build` | NOT RUN | Dependencies unavailable. `npm run build` — watch for `/research/[slug]` with no entries |
| Static export output (`out/`) contents | NOT RUN | Needs a successful build. `ls out`, `find out -name "*.html"` |
| Lucide icon names, including brand icons | NOT VERIFIED | Package unavailable; build would fail if a name is missing |
| Browser rendering, navigation, mobile menu, search and filters | NOT RUN | No served application |
| Layouts at 320×568, 375×812, 390×844, 768×1024, 1024×768, 1440×900, 1920×1080 | NOT RUN | No served application. Manual checklist below |
| Horizontal overflow at those sizes | NOT VERIFIED | The body-level `overflow-x: hidden` rule remains and may hide the source of overflow |
| Keyboard navigation, focus order, screen-reader behaviour | NOT RUN | Manual checklist below |
| Automated accessibility scan (axe or similar) | NOT RUN | Requires a served page and an accessibility engine |
| Reduced-motion behaviour | NOT RUN | Manual checklist below |
| Live GitHub, ORCID, Crossref, Dev.to requests | NOT RUN | No network |
| Contact form submission to a real endpoint | NOT RUN | No endpoint configured |
| GitHub Actions workflow run | NOT RUN | Requires pushing to GitHub |
| CSS warnings from Autoprefixer (`align-items: start`, `justify-content: end`) | NOT VERIFIED | Only the build log shows the warning text. These values are valid standard CSS. Send `build.log` to diagnose |
| Performance measurements (Lighthouse, bundle size) | NOT RUN | Requires a build and a browser |

## Manual checklist (macOS, after `npm run build`)

1. `npx --yes serve out` and open the printed URL.
2. Load `/`, `/projects/`, `/projects/routinenest/`, `/research/`, `/blog/`, `/blog/building-this-portfolio/`, `/lab/`, `/lab/ohm-law/`, `/services/`, `/contact/`, `/resources/`, `/skills/`, `/journey/`. Each should load without a console error.
3. Load an unknown URL such as `/nope/`. The 404 page should appear.
4. At each of the seven widths (320, 375, 390, 768, 1024, 1440, 1920 by 568–1080 px), check for horizontal scrolling, clipped text and overlapping navigation.
5. Use the keyboard only: Tab through the header, open and close the mobile menu with Escape, and check that focus outlines are visible.
6. In macOS System Settings → Accessibility → Display, turn on Reduce Motion. The 3D scene should hold still and reveals should not animate.
7. Run `npm test` and check that it prints "ALL SUITES PASSED".
