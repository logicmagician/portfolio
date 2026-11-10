# Phase 4 Report — Research, Blog and Resources

## Scope

Phase 4 completes `/research` (with detail pages), `/blog` (with article pages), and `/resources`. Engineering Lab, Services and the contact page are Phase 5. Integration modules, full documentation and the final audit are Phase 6.

## What was built

**Blog.** Articles are Markdown files in `content/blog/`, each with frontmatter (title, description, date, category, tags, published). Only files with `published: true` are built. Invalid frontmatter fails the build with the file name and the problem. The directory has search, category filters, reading time, related articles and older/newer navigation.

**Markdown.** A small parser in `src/lib/markdown.ts` (no dependency) turns Markdown into a token tree rendered as React elements. Raw HTML in article files is shown as text, never inserted. Link targets are limited to https, http, mailto, site paths and anchors.

**Research.** `/research` has sections for interests, ongoing work, publications, external researcher profiles and methodology. Each has an empty state, because no publications, DOIs, research entries or researcher profile details have been supplied. Publication records take a DOI, a publisher URL, authors, venue and date. DOIs and ORCID iDs are format-checked before display. Google Scholar and IEEE Xplore are shown only as external profile links, not as API integrations.

**Resources.** `/resources` lists downloads and links with search and category filters. File availability is checked at build time: a missing file shows "File not yet added" and is never offered as a download. The CV entry will show as unavailable until `public/resume.pdf` is added.

**Navigation.** Blog, Research and Resources are linked from the header or footer. The homepage research and writing sections now link to their pages.

**Sample content.** One article, `building-this-portfolio.md`, describes how the site is built. It is a factual overview of this codebase, not a claim about your work. Please review or replace it.

## Verification

| Check | Method | Result |
|---|---|---|
| Syntax of all TypeScript, TSX and config files | esbuild parse | PASS |
| Imports resolve and named exports exist | Static script | PASS |
| Every navigation and footer target has a page or section | Static script | PASS |
| Every hard-coded route in code has a page | Static script | PASS |
| Every className is defined in CSS | Static script | PASS |
| Phase 3 logic and data tests | Executed, 29 tests | PASS 29/29 |
| Phase 4 logic: frontmatter, Markdown, safe links, validation, blog ordering, related posts, DOI/ORCID formats, resources, dates | Executed, 38 tests | PASS 38/38 |
| Real content folder: valid sample loads, unpublished draft excluded, invalid file fails the build, sort order, file check | Executed, 5 tests | PASS 5/5 |
| Test failures found during the run | Three expectations were wrong in the test file, not in the code. Corrected; the code was unchanged. | FIXED |
| `npm install`, `npm run build`, `npm run typecheck` | — | NOT EXECUTED (no network) |
| Static export generates `/blog/[slug]` pages | — | NOT EXECUTED |
| `/research/[slug]` with no entries: the route has zero static pages | — | NOT VERIFIED — Next.js may reject an empty `generateStaticParams` under `output: "export"`. If the build fails here, remove the detail route until an entry exists. |
| Browser rendering, search, filters, mobile menu, eight viewports | — | NOT VERIFIED |

## Open items for the owner

1. Add `public/resume.pdf` and set `hasResume: true` in `src/data/profile.ts`.
2. Add research interests, entries and publications only when they can be verified. Nothing has been invented.
3. Review the sample article and publish your own articles by adding Markdown files.
4. Confirm whether the research detail route should stay until the first research entry exists (see the build note above).
