# Integrations

Each integration has a status. The register is in `src/data/integrations.ts`.

| Integration | Status | Where it appears |
|---|---|---|
| GitHub repositories | Live at build (when configured) | `/projects` |
| ORCID works | Live at build (when configured) | `/research` |
| Crossref (DOI metadata) | Module ready, not wired | Available for checking publication records |
| Dev.to articles | Module ready, not wired | Available for future listing on `/blog` |
| Google Scholar | Reference link only | `/research` |
| IEEE Xplore | Reference link only | `/research` |
| Contact form (Formspree or similar) | Works when configured | `/contact` |
| Analytics (GA4) | Off by default | Root layout, when configured |
| YouTube | Future | Not implemented |
| Hashnode | Future | Not implemented |
| AI engineering tools | Future | Needs a backend |

## Hosting constraints

The site is static. It runs no code when a visitor loads it, so it cannot call an API with a secret key at runtime. Two patterns are used:

1. **Build-time fetch.** A server component calls the API during `next build`. The result is written into the static HTML. The API key stays in the build environment (GitHub Actions secrets). The data is as fresh as the last build.
2. **Browser-side call to a public endpoint.** Used only for the contact form, which posts to a service's public endpoint. No secret is involved.

Anything needing a secret at visit time (AI tools, a private API) needs a server you host yourself. GitHub Pages cannot provide one.

## GitHub repositories

- **Status:** live at build when configured.
- **Variables:** `GITHUB_USERNAME` (required to show anything), `GITHUB_TOKEN` (optional; `github.token` in Actions is enough for public repositories and raises the rate limit).
- **Data flow:** build calls `GET /users/{user}/repos` → validates each item → drops forks, archived and private repos → renders cards on `/projects`.
- **Failure handling:** rate limits, timeouts and bad responses produce an "unavailable" result and no section. The page never shows stale or placeholder repositories.
- **Limitations:** public repositories only, 30 most recently updated. Updates appear after the next build.

## ORCID

- **Status:** live at build when configured.
- **Variables:** `ORCID_ID`, or set `researchProfile.externalProfiles.orcid` in `src/data/research.ts`. The ORCID public record needs no key.
- **Data flow:** build calls `pub.orcid.org/v3.0/{id}/works` → reads title, year and type → renders on `/research`.
- **Limitations:** lists what ORCID holds. Records are not checked against publishers. Malformed entries are skipped.

## Crossref (DOI metadata)

- **Status:** module ready, not wired into a page.
- **Variables:** `CROSSREF_MAILTO` (optional; sent in the User-Agent header, as Crossref requests).
- **Use:** `fetchDoiMetadata(doi)` returns the title, authors, year and container for a valid DOI. Use it to check a record before you add it to `publications`.
- **Limitations:** the record can be incomplete for some publishers. Nothing is written automatically.

## Dev.to

- **Status:** module ready, not wired.
- **Variables:** `DEVTO_USERNAME`.
- **To wire it:** call `fetchDevtoArticles` in `src/app/blog/page.tsx` and render the `ok` results with external links, labelled as Dev.to articles.

## Google Scholar and IEEE Xplore

- **Status:** reference links only.
- **Configuration:** paste the full profile URL into `researchProfile.externalProfiles` in `src/data/research.ts`.
- **Important:** neither service has an official public API for this use. The site does not scrape them, and it does not show citation counts.

## Contact form

- **Status:** works when configured.
- **Variables:** `NEXT_PUBLIC_FORMSPREE_ENDPOINT` (an https URL, for example `https://formspree.io/f/your-form-id`). The endpoint is public by design.
- **Setup:** create a form with the provider, copy its endpoint, and set the variable at build time.
- **Behaviour:** validates name, email, inquiry type and message length. A honeypot field catches simple bots. The form reports "sent" only on a success response.
- **Without the variable:** the form is hidden and an email button is shown.

## Analytics (GA4)

- **Status:** off by default.
- **Variables:** `NEXT_PUBLIC_ANALYTICS_ID` in the form `G-XXXXXXXXXX`.
- **Before enabling:** add a privacy notice to the site and confirm your obligations in your country. Analytics scripts load third-party code in visitors' browsers.
- **Behaviour:** invalid IDs are ignored; no script is loaded.

## YouTube, Hashnode, AI tools

- **Status:** future. No code calls these services.
- **YouTube:** needs a Data API key kept as a build secret, and a channel ID. Build-time listing would work the same way as GitHub.
- **Hashnode:** can use its public GraphQL endpoint at build time, following the Dev.to pattern.
- **AI tools:** need a server, because a model key cannot be kept safe in a static site. Host the backend separately and call it from the page with a public, rate-limited endpoint.

## Adding a new build-time integration

1. Write a normalizer that validates the response shape and drops malformed items. Test it with fixtures in `tests/`.
2. Write a fetch function that returns `IntegrationResult<T>` (`ok` or `unavailable`) and uses the timeout helper in `src/lib/integrations/types.ts`.
3. Call it from a server component. Render nothing when the result is not `ok`.
4. Add the variables to `.env.example` and the register in `src/data/integrations.ts`.
5. Make sure the variables that hold keys are not prefixed `NEXT_PUBLIC_`. The register test checks this.
