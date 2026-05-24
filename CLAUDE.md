# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # start dev server (http://localhost:4321)
pnpm build      # production build to dist/
pnpm preview    # preview the production build locally
```

There are no tests or linting scripts configured.

## Stack

- **Astro 6** — file-based routing under `src/pages/`; `.astro` files use a frontmatter fence (`---`) for server-side JS/TS and HTML below it
- **TypeScript** — strict mode via `astro/tsconfigs/strict`; all `.ts`/`.astro` files are included
- **pnpm** — workspace configured in `pnpm-workspace.yaml`; only `esbuild` and `sharp` are allowed to run install scripts

## Project state

The site is being rebuilt from scratch. The only page is `src/pages/index.astro` (a placeholder). The `astro.config.mjs` has no integrations yet.
When adding integrations (e.g. Tailwind, MDX, React), register them in `astro.config.mjs` via `defineConfig({ integrations: [...] })`.