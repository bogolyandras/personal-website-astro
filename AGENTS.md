# AGENTS.md

Guidance for AI coding agents working in this repository.

## Commands

```bash
bun install       # install dependencies
bun run dev       # start dev server (http://localhost:4321)
bun run build     # production build to dist/
bun run preview   # preview the production build locally
```

There are no tests or linting scripts configured.

## Development

When starting the dev server, use background mode:

```
bunx astro dev --background
```

Manage the background server with `bunx astro dev stop`, `bunx astro dev status`, and `bunx astro dev logs`.

## Stack

- **Astro 7** — file-based routing under `src/pages/`; `.astro` files use a frontmatter fence (`---`) for server-side JS/TS and HTML below it
- **TypeScript** — strict mode via `astro/tsconfigs/strict`; all `.ts`/`.astro` files are included
- **Bun** — package manager (`bun.lock`); CI (`.github/workflows/node.js.yml`) installs with `bun install --frozen-lockfile` and builds with `bun run build`

## Project state

The project was re-scaffolded from the Astro `minimal` template with Bun, then the site sources were restored. Pages: `src/pages/index.astro` (home) and `src/pages/404.astro`, both wrapped in `src/layouts/BaseLayout.astro` (takes a `pageTitle` prop) and styled by `src/styles/global.css`.
The `astro.config.mjs` has no integrations yet. When adding integrations (e.g. Tailwind, MDX, React), use `bunx astro add <name>` or register them in `astro.config.mjs` via `defineConfig({ integrations: [...] })`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
