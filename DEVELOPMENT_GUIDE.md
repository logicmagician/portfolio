# Development Guide

Most content is in data files. Pages render that data, so a typical update touches one file.

## Adding a project

Edit `src/data/projects.ts` and append an object:

```ts
{
  slug: "my-project",              // URL segment: lowercase letters, digits, hyphens; must be unique
  title: "My Project",
  category: "Software",            // any text; new categories appear automatically in filters
  summary: "One-line card text.",
  description: "Longer text for the detail page.",
  features: ["Feature from a verified source"],  // may be []
  tags: ["TypeScript", "React"],
  status: "Live demo",             // short label on cards
  featured: false,                 // true shows it on the homepage (keep to about three)
  links: {
    repo: "https://github.com/USERNAME/REPO",  // omit until verified
    demo: "https://example.com/",             // omit until verified
  },
  images: [],                      // { src: "/images/projects/my-project/home.png", alt: "Description" }
}
```

Only use links and facts you can verify. Empty `links` and `images` show neutral states.

## Adding a blog article

Create `content/blog/<slug>.md`. The file name becomes the URL, so use lowercase letters, digits and hyphens.

```markdown
---
title: "Article title"
description: "One-sentence summary shown on cards."
date: "2026-11-10"
category: "Engineering"
tags: ["Topic", "Another topic"]
published: true
---

Article body. Supported: # ## ### headings, paragraphs, - lists, 1. lists,
> quotes, ``` code blocks, ---, `inline code`, **bold**, *italic*, [links](https://example.com).
```

Rules:
- `date` must be `YYYY-MM-DD` and a real date.
- `published` is `false` unless set to `true`. Drafts are not built.
- Invalid frontmatter stops the build and names the file.
- Images and tables are not supported yet.

## Adding a research entry or publication

Edit `src/data/research.ts`.

- `researchEntries`: an object with `slug`, `title`, `description`, `category`, `status` (`"ongoing" | "completed" | "planned"`), `technologies`, `methodology`, and `publicationIds` linking to publications.
- `publications`: an object with `id`, `title`, `authors`, `type`, `publicationDate` (`YYYY-MM` or `YYYY-MM-DD`), and optionally `venue`, `doi`, `url`.

DOIs are checked for format (`10.xxxx/...`). Links must be https. Only add publications you can verify; DOIs and links are not validated against the publisher.

Research detail pages are **not active** while `researchEntries` is empty. Next.js's static export refuses a dynamic route whose `generateStaticParams` returns no entries, so the route is kept as a component in `src/components/research/ResearchDetail.tsx` instead of `src/app/research/[slug]/`.

**Activate it with the first research entry:**

1. Add the entry to `researchEntries` in `src/data/research.ts`.
2. Create `src/app/research/[slug]/page.tsx` with the content given in the comment at the top of `src/components/research/ResearchDetail.tsx`.
3. Run `npm run build` and check that `out/research/<slug>/index.html` exists.

Also, the research listing links to a detail page only for entries with status `ongoing`. Do not add an ongoing entry before step 2, or its link will be broken.

## Updating skills

Edit `src/data/skills.ts`. Each group has a `title`, an optional `description`, and an `items` list. Do not add proficiency levels or certifications without evidence.

## Updating the journey

Edit `src/data/journey.ts`. Each entry has `id`, `kind` (`education | learning | experience | milestone`), `title`, `organization`, `period`, `detail`, optional `upcoming: true`, and `featured` (shown on the homepage). Use "Date to be added" when a date is unknown.

## Adding a resource

Edit `src/data/resources.ts`.

- File resource: `{ id, title, description, category, fileType: "PDF", file: "/your-file.pdf" }`. Place the file in `public/`. It is offered as a download only when the file exists at build time.
- Link resource: `{ ..., fileType: "LINK", externalUrl: "https://..." }`.

Run `validateResources` (see tests) after editing to catch missing fields.

## Adding a lab tool

1. In `src/lib/lab/calculators.ts`, add a `CalculatorSpec` with `slug`, `fields` and a pure `compute(values)` function. Validate inputs with `parse.ts` helpers and return `{ ok: false, error }` for invalid input.
2. Add the function to the `calculatorSpecs` array.
3. In `src/data/lab.ts`, add a `LabTool` with the same slug, `status: "available"`, assumptions and limitations.
4. Add tests in `tests/phase5-tests.cjs` for the formulas and invalid inputs.

Planned tools stay `status: "planned"` with no calculator. They appear as non-link cards.

## Updating services

Edit `src/data/services.ts`. Keep wording to areas of work. Do not add prices, certifications or guarantees; the tests reject those words.

## Adding a page

1. Create `src/app/<route>/page.tsx`. Use `PageLayout` and `PageHero` so the header, footer and heading style match.
2. Set `metadata` with a title and description.
3. For dynamic routes (`[slug]`), export `generateStaticParams` and call `notFound()` for unknown slugs.
4. Add the route to `src/data/navigation.ts` (header) or `footerNav` only after the page exists.
5. Check that links use `next/link` for internal routes. Plain `<a>` tags bypass the GitHub Pages base path.

## Configuring an integration

See `FUTURE_INTEGRATIONS.md`. Add variables to `.env.local` for local builds, and to repository variables or secrets for deployment. Never prefix a secret with `NEXT_PUBLIC_`.

## Conventions

- Pure logic lives in `src/lib` and has tests. Components render it.
- Server-only modules (`blog-source`, `file-status`, `integrations/github`, `orcid`, `crossref`, `devto`) must not be imported from files with `"use client"`. The audit script checks this.
- Visitor-facing text is neutral. Do not put maintenance instructions in page copy.
- Missing information shows an empty or "not yet added" state, never invented content.

## Checks before publishing

```bash
npm ci               # or npm install if there is no lockfile yet
npm run typecheck
npm test
npm run build
```

See `README.md` for the full command list and `ENVIRONMENT_VARIABLES.md` for configuration.
