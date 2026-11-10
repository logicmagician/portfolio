# Environment Variables

Copy `.env.example` to `.env.local` for local builds. `.env.local` is git-ignored.

## Two kinds of variable

- **`NEXT_PUBLIC_*`** are compiled into the website and visible to every visitor. Use them only for public identifiers, such as an endpoint URL or a measurement ID.
- **All other variables** are read only during `npm run build`, on the server. They are never included in browser code. Put secret values in GitHub Actions secrets.

## Reference

| Variable | Kind | Required | Used by | Where to set it |
|---|---|---|---|---|
| `GITHUB_USERNAME` | Build-time | No | `/projects` repository list | `.env.local`, or Actions variable |
| `GITHUB_TOKEN` | Build-time, secret | No | Raises GitHub API rate limit (public read only) | `.env.local`, or Actions automatic `github.token` |
| `ORCID_ID` | Build-time | No | `/research` works list | `.env.local`, or Actions variable |
| `CROSSREF_MAILTO` | Build-time | No | Crossref User-Agent (module ready, not wired to a page) | `.env.local`, or Actions variable |
| `DEVTO_USERNAME` | Build-time | No | Dev.to module (ready, not wired to a page) | `.env.local`, or Actions variable |
| `NEXT_PUBLIC_FORMSPREE_ENDPOINT` | Public | No | Contact form. Empty shows the email fallback. Must be an `https://` URL. | Actions variable |
| `NEXT_PUBLIC_ANALYTICS_ID` | Public | No | Google Analytics 4. Must match `G-XXXXXXXXXX`. Empty keeps analytics off. | Actions variable |
| `NEXT_PUBLIC_BASE_PATH` | Set by config | No (do not set) | Written by `next.config.mjs` from `repoName` | Not set manually |

## Behaviour when a variable is missing

Nothing breaks. Each optional integration shows nothing, or a neutral message. The build continues.

- No `GITHUB_USERNAME`: no repository section on `/projects`.
- No `ORCID_ID`: no works section on `/research`.
- No `NEXT_PUBLIC_FORMSPREE_ENDPOINT`: the contact form is hidden and an email button appears.
- No `NEXT_PUBLIC_ANALYTICS_ID`: no analytics script is loaded.

## Where to set values for GitHub Pages

Repository → **Settings → Secrets and variables → Actions**:

- **Variables** tab: `GITHUB_USERNAME`, `ORCID_ID`, `NEXT_PUBLIC_FORMSPREE_ENDPOINT`, `NEXT_PUBLIC_ANALYTICS_ID`.
- **Secrets** tab: only if you later add a truly secret value. `GITHUB_TOKEN` does not need to be added; the workflow passes the built-in token.

Changing a variable takes effect at the next build, so push a commit or run the workflow manually.

## Rules

- Never prefix a secret with `NEXT_PUBLIC_`.
- Never commit `.env.local`.
- `NEXT_PUBLIC_` values appear in the built JavaScript. Anyone can read them.
- The register of integrations, with statuses, is in `src/data/integrations.ts`. Tests check that no key-like variable uses the public prefix.
