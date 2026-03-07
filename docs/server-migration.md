# TypeScript Server Migration

## Goal

Migrate from Fresh + Preact to a vanilla TypeScript server while keeping:

- the current content pipeline (`makePosts`, `resizePictures`, `loadPosts`)
- performant server-side rendering and fast static image delivery
- route behavior and navigation parity

## Milestone 1 - Pipeline Decoupling

Status: complete

What changed:

- removed `@preact/signals` from data stores in favor of a minimal local signal
- removed `preact-render-to-string` from markdown rendering
- kept `{% picture "src", "alt" %}` behavior with a shared `renderPictureHtml`

How to test:

1. Run `deno task check`.
2. Run `deno task loadPosts`.
3. Open a recent post and verify markdown pictures still render.

## Milestone 2 - Routing Spike

Status: complete (spike)

What changed:

- added `server.ts` with `Deno.serve` routing
- added runtime tasks (`deno task start`, `deno task dev`)
- implemented routes:
  - `/`
  - `/posts/:slug`
  - `/posts/:slug/next`
  - `/posts/:slug/prev`
  - `/posts/random`
  - `/search`
  - `/about`
  - `/books`
- implemented static serving for `/image/*` and `/manifest.json`

How to test:

1. Run `deno task dev`.
2. Open `http://localhost:8001`.
3. Verify:

- home pagination
- post next/prev navigation
- random redirect
- search results
- images load

## Milestone 3 - Parity Hardening

Status: in progress

What changed:

- canonical trailing-slash redirects (`/path/` -> `/path`)
- ETag support with `304` revalidation for HTML pages
- bounded in-memory LRU-style cache for rendered HTML responses
- cache-control headers for HTML and static asset responses
- request-level tests for core route behavior

Remaining:

- optional content/style parity tweaks if desired

## Milestone 4 - Deploy Cutover

Status: complete

What changed:

- switched default runtime tasks to vanilla server
- removed Fresh route/component sources and entrypoints
- removed Fresh, Vite and Tailwind dependency wiring from `deno.json`
- regenerated `deno.lock` from vanilla entrypoints only
