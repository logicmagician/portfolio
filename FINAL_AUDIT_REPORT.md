# Final Audit Report

Project: MD. Rakebul Hassan engineering portfolio
Scope: the uploaded project (`Rakebul_Engineering_Portfolio_Final.zip`), reviewed in full.

## Summary

The project is complete across all planned pages and integrations. It has not been built or viewed in a browser in this environment, because the sandbox has no network access and the application's packages are not installed. The first `npm run build` on your Mac is the most important remaining check.

## What was verified in this round

- The uploaded project matches the previous working copy file for file.
- The unit test suite runs: **138 of 138 tests pass**.
- Static checks pass: syntax, imports and exports, navigation targets, CSS class names, client/server boundaries, external-link hygiene, unused imports, and a secret scan.
- The GitHub Actions workflow parses and its steps are in the intended order.

## Defects found and status

| # | Finding | Status |
|---|---|---|
| R1 | Test runner reported success for failing suites (pipeline exit status) | FIXED. Verified with a forced failure: exit code 1 |
| R2 | No `test` script in `package.json`; the tests ran only via a shell script | FIXED. `npm test` runs `tests/run-all.sh` |
| R3 | Tests depended on `npx` downloading esbuild at run time | FIXED. `esbuild` added as a devDependency, used when installed |
| R4 | Workflow always ran `npm install`, even when a lockfile exists | FIXED. Uses `npm ci` when `package-lock.json` is present |
| R5 | Workflow had no type-check or test gate before deploying | FIXED. Type check and tests run before the build |
| R6 | Required documents missing: DEPLOYMENT_GUIDE, ENVIRONMENT_VARIABLES, SECURITY_AUDIT_REPORT | FIXED. Created; README, DEVELOPMENT_GUIDE and TEST_REPORT updated to match |
| R7 | README listed commands that were incomplete | FIXED. Full command table added |
| R8 | Visitor-facing developer instructions (research, blog, skills) | FIXED in round 4 |
| R9 | Async test checks not awaited | FIXED in round 4 |

## Open defects and risks

| # | Finding | Status | Action |
|---|---|---|---|
| O1 | No `package-lock.json`; versions not fixed | OPEN | Run `npm install` once, commit the lockfile |
| O2 | `npm audit` reports 3 vulnerabilities (1 critical, 1 high, 1 moderate); details not yet supplied | OPEN | Send `audit.txt` and `package-lock.json`; see SECURITY_AUDIT_REPORT.md |
| O3 | Brief refers to Next.js 15.5.29 and nested PostCSS; this project has Next.js `^14.2.21` and no PostCSS entry | NOTED | Confirm which version is on GitHub; see SECURITY_AUDIT_REPORT.md |
| O4 | Autoprefixer warnings for `start`/`end` in flex containers | FIXED: two values changed to `flex-start`/`flex-end`. Confirm on the next build |
| O5 | Build failed: `/research/[slug]` has no static params while no research entries exist | FIXED: route moved to a component; activation steps in DEVELOPMENT_GUIDE.md. Confirm on the next build |
| O6 | `body { overflow-x: hidden }` may hide horizontal overflow rather than fixing it | OPEN | Check at the seven viewport widths |
| O7 | `lucide-react` brand icon names | Build reached the static-page stage without an icon error, so icon names are not the cause of any failure seen so far |
| O8 | Build and type check | Typecheck PASS and tests PASS on the owner's Mac. Build failed once (O5), now fixed; re-run pending |
| O9 | Owner content still missing: CV file, publications, research entries, ORCID iD, hardware project links | OPEN | Supply and set `hasResume`, ORCID variable and project links |
| O10 | No ESLint configuration | NOTED | Not required for the current checks; add later if wanted |
| O11 | `three-mesh-bvh` deprecated (via Drei) | OPEN | Upgrade Drei and check the 3D scene; not done without a visual test |

## Scope of deliverables

- Source: unchanged except for `package.json`, `tests/run-all.sh` and `.github/workflows/deploy.yml`.
- Documentation: README, DEVELOPMENT_GUIDE, FUTURE_INTEGRATIONS, TEST_REPORT, FINAL_AUDIT_REPORT, DEPLOYMENT_GUIDE, ENVIRONMENT_VARIABLES, SECURITY_AUDIT_REPORT.
- Not included: `package-lock.json` (cannot be generated offline), `node_modules`, `out/`, `.next/`.

## Deployment instructions

See DEPLOYMENT_GUIDE.md. In short:

1. Set `repoName` in `next.config.mjs`.
2. Push to GitHub on `main`. Settings → Pages → Source: GitHub Actions.
3. Optional repository variables: see ENVIRONMENT_VARIABLES.md.
4. Run the commands below on your Mac before pushing:

```bash
npm install
npm audit
npm run typecheck
npm test
npm run build
```

Send back the output of `npm audit` and `npm run build`, along with any error. Commit `package-lock.json` after `npm install` succeeds.
