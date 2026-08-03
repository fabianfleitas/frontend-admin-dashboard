# AGENTS.md

## Repo type

Hybrid repository: contains **spec docs** (Spanish Markdown at the root) **and the Admin Dashboard SPA** under `app/` (React 19 + Vite + TypeScript + Tailwind + TanStack Query + Zustand + Supabase Auth). The external FastAPI backend (described in `documentacion/openapi.json` as `backend-agent-system`) lives in another repo — do not assume backend code here, only the API client.

## Source of truth

All specs are written in **Spanish** and live as numbered Markdown files at the repo root. The numbering encodes the doc series:

- `Admin Dashboard Blueprint v1.0 - Documento 01..05.md` — product/architecture blueprint
- `Admin Dashboard Functional Specifications - Documento 06..14.md` — per-feature functional specs:
  - 06 Dashboard · 07 Knowledge Base · 08 AI Agent Playground · 09 Conversations · 10 Analytics · 11 Audit · 12 Users & Settings · 13 Design System · 14 Architecture & Implementation Guide
- `Admin Dashboard - Design Brief.md` — visual/UX brief (colors, type, tech stack, navigation tree)

When a feature question arises, read the matching numbered doc first; do not guess from filenames alone.

`Documento 14` defines the recommended implementation order (Bootstrap → Layout → Auth → Dashboard → Knowledge Base → AI Agent → Conversations → Analytics → Audit → Users → Settings) and the architecture principles (feature-first, TanStack Query for server state, Zustand for UI state, REST-only integration).

## Other assets

- `documentacion/openapi.json` — OpenAPI 3.1 spec of the external FastAPI backend. Reference this for real endpoint shapes/headers (e.g. `X-External-Auth-Id`); trust it over prose when they conflict.
- `documentacion/design html` — a single exported HTML design mockup. Note: it is a **file with no extension**, not a directory.

## App layout

```
app/                      # SPA root (Vite project)
  src/
    app/                 # App.tsx, router.tsx, providers.tsx, query-client.ts
    components/           # common/, forms/, layout/, tables/, charts/, feedback/
    features/<modulo>/    # api/, components/, hooks/, pages/, schemas/, types/, index.ts
    lib/                  # http.ts (fetch client), supabase.ts
    stores/               # Zustand stores (auth, ui)
    types/                # shared types
  .env.example            # VITE_API_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
```

## Developer commands

All commands run from `app/`:

```bash
npm run dev        # Vite dev server
npm run build      # tsc -b + vite build
npm run lint       # oxlint (reemplaza a ESLint en este proyecto)
npm run lint:fix   # oxlint --fix
npm run format     # Prettier (src/)
npm run typecheck  # tsc --noEmit (no build artifacts)
npm run preview    # preview built app
```

No tests configured yet. If adding tests, prefer Vitest and update this file.

## Critical API integration conventions

The backend is **delegated-auth**: it does **not** validate Supabase JWTs directly. `lib/http.ts` must inject the following headers on every request (defaults in parens):

- `X-External-Auth-Id` — user's Supabase UID
- `X-Auth-Provider: delegated`
- `X-User-Type` — MUST be one of `ADMIN | SECRETARIA | ESTUDIANTE` (default `ESTUDIANTE`). Dashboard requests typically send `ADMIN`.
- `X-User-Email` — user email if available (nullable)

`UserOut.role` enum (`STUDENT | STAFF | ADMIN`) maps to `X-User-Type` as: `ADMIN→ADMIN`, `STAFF→SECRETARIA`, `STUDENT→ESTUDIANTE`.

## Known spec-vs-OpenAPI deltas (do not re-discover)

1. **Reindex**: real route is `POST /api/admin/reindex` with optional `documento_id` in body — NOT `POST /api/admin/documents/{id}/reindex` (Doc 07).
2. **Metrics**: real route is `GET /api/admin/metrics` — NOT `/metrics` (Doc 06/10). It does NOT support period/category/model filters (Analytics filters UI must mark those as "Nivel 2").
3. **No `/api/admin/categories` endpoint** — filter documents in the client on `categoria_id`. Backend issue open for Nivel 2.
4. **DocumentStatus** enum is `PENDING | PROCESSING | READY | FAILED`. Doc 07's `INACTIVE` state = `DocumentOut.activo === false`, separate from version status.
5. **Trailing slashes** vary per path: `/api/conversations/` (with slash) vs `/api/conversations/{id}` (without). Respect exactly.
6. **Settings (Doc 12)** LLM/Embedding/Storage/Vector blocks have no backing endpoint — render "solo lectura" with available aggregate data and a "pendiente en backend" notice.
7. **AuditLogOut** lacks user/prompt/response/latency fields. Drawer links to Conversations via `mensaje_id` for full context.
8. **Voice chat** (`POST /api/chat/voice`) is optional MVP per Doc 08.

## Conventions when editing docs

- Keep content in Spanish to match existing files.
- Preserve the `Admin Dashboard ... - Documento NN.md` naming pattern; the number is how docs are cross-referenced.
- Specs are the brief's "single source of truth" for the thesis project — favor amending them over creating new ad-hoc docs.

## Code conventions (app/)

- Components: PascalCase, one responsibility per file.
- Hooks: `use*` prefix.
- Services: `*.service.ts`, no direct `fetch` from components (go via hooks).
- Types: shared in `features/<modulo>/types.ts` or `types/` for cross-feature.
- Forms: React Hook Form + Zod.
- Server state: TanStack Query only; NEVER store API data in Zustand.
- UI state (sidebar, theme, session): Zustand.
- Code-splitting: las páginas son `lazy(() => import(...))` en `src/app/router.tsx`. Vendors separados en chunks por `vite.config.ts` (`manualChunks`: recharts, supabase, tanstack, router). No importar Recharts ni servicios pesados desde componentes compartidos fuera del feature que los usa.