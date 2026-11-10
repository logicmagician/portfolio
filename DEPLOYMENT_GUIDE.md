# Deployment Guide (GitHub Pages)

The site is a static export. `npm run build` writes plain HTML, CSS and JavaScript to `out/`. GitHub Pages serves those files. No Node.js server runs in production.

## Choose your URL type

| Site type | Example URL | `repoName` in `next.config.mjs` |
|---|---|---|
| Project site | `https://USERNAME.github.io/REPOSITORY/` | `"REPOSITORY"` (the repository name) |
| User site | `https://USERNAME.github.io/` | `""` (empty string) |

The repository for a **user site** must be named `USERNAME.github.io`.

Set it in `next.config.mjs`:

```js
const repoName = "REPOSITORY";   // project site
// const repoName = "";           // user site
```

The placeholder value `"YOUR_GITHUB_REPOSITORY"` means "not configured". In that state the build uses no base path, which is correct only for a user site at the root.

## One-time setup on GitHub

1. Create the repository, or use an existing one. Push the project with `main` as the default branch.
2. Settings → **Pages** → Build and deployment → **Source: GitHub Actions**.
3. Optional: add repository variables (see `ENVIRONMENT_VARIABLES.md`).
4. Push to `main`, or open **Actions → Deploy to GitHub Pages → Run workflow**.

The workflow in `.github/workflows/deploy.yml` runs these steps in order:
1. Install dependencies (`npm ci` if `package-lock.json` is committed, otherwise `npm install`).
2. Type check (`npm run typecheck`).
3. Tests (`npm test`).
4. Static build (`npm run build`), which writes `out/`.
5. Upload `out/` as the Pages artifact, then deploy it.

If any step fails, the deployment does not happen and the log names the failing file or step.

## Checking the deployment

- The workflow run summary shows the page URL in the `github-pages` environment.
- Open the homepage, then a deep link such as `/projects/routinenest/`, and reload it. Both should load.
- Check the browser console for 404 errors on `_next/` files. These usually mean `repoName` does not match the repository name.

## Local production check (macOS)

```bash
npm ci                          # or npm install if there is no lockfile yet
npm run typecheck
npm test
npm run build
npx --yes serve out             # optional: view the static site at the printed URL
```

`npm run build` must succeed before pushing. The build output is in `out/`, which is git-ignored.

## Why `.nojekyll` exists

GitHub Pages runs Jekyll by default, and Jekyll ignores folders that begin with an underscore. Next.js writes its assets to `_next/`. The empty `public/.nojekyll` file is copied into `out/` and turns Jekyll off.

## Manual alternative: `npm run deploy`

`npm run deploy` builds the site and pushes `out/` to a `gh-pages` branch, using the `gh-pages` package. Use this **or** the workflow, not both. The workflow is the recommended path because it runs the type check and tests first.

Before the first `npm run deploy`, set Settings → Pages → Source to **Deploy from a branch**, branch `gh-pages`, folder `/ (root)`.

## Not supported on GitHub Pages

- Server routes, API routes, middleware, server actions
- Runtime API calls that need a secret key
- Next.js image optimisation (the site uses `unoptimized` images)
- Pages added after the build without a rebuild

Anything in this list needs a separate server you host yourself.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Unstyled page, 404s for `_next/…` | `repoName` does not match the repository | Correct `repoName`, commit, redeploy |
| Deep links return 404 after refresh | Missing trailing-slash output | Keep `trailingSlash: true` in `next.config.mjs` |
| Workflow fails at `configure-pages` | Pages source not set to GitHub Actions | Settings → Pages → Source: GitHub Actions |
| Workflow fails at type check or tests | A real error in the code | Read the log; fix locally with `npm run typecheck` and `npm test` |
| No repositories section | `GITHUB_USERNAME` unset, or the GitHub API was unreachable at build | Set the variable and rebuild; this is expected behaviour |
