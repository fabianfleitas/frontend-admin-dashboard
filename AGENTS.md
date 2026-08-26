# AGENTS.md

## Repo type

Hybrid repository: contains **spec docs** (Spanish Markdown at the root) **and the Admin Dashboard SPA** under `app/` (React 19 + Vite + TypeScript + Tailwind + TanStack Query + Zustand + Supabase Auth). The external FastAPI backend (described in `docs/backend_admin_handoff/openapi.current.json` as `backend-agent-system`) lives in another repo — do not assume backend code here, only the API client.

## Source of truth

All specs are written in **Spanish** and live as numbered Markdown files at the repo root. The numbering encodes the doc series:

- `Admin Dashboard Blueprint v1.0 - Documento 01..05.md` — product/architecture blueprint. NOTE: `Documento 01` and `Documento 04` are not present in the repo (pending regeneration); only 02, 03 and 05 exist.
- `Admin Dashboard Functional Specifications - Documento 06..14.md` — per-feature functional specs:
  - 06 Dashboard · 07 Knowledge Base · 08 AI Agent Playground · 09 Conversations · 10 Analytics · 11 Audit · 12 Users & Settings · 13 Design System · 14 Architecture & Implementation Guide
- `Admin Dashboard - Design Brief.md` — visual/UX brief (colors, type, tech stack, navigation tree)

When a feature question arises, read the matching numbered doc first; do not guess from filenames alone.

`Documento 14` defines the recommended implementation order (Bootstrap → Layout → Auth → Dashboard → Knowledge Base → AI Agent → Conversations → Analytics → Audit → Users → Settings) and the architecture principles (feature-first, TanStack Query for server state, Zustand for UI state, REST-only integration).

## Other assets

- `docs/backend_admin_handoff/openapi.current.json` — OpenAPI 3.1 spec of the external FastAPI backend, regenerated 2026-08-26. This is the **source of truth** for real endpoint shapes/auth (currently `Authorization: Bearer <jwt>`); trust it over prose when they conflict. Also see `docs/backend_admin_handoff/` for `ENDPOINTS_Y_MODELOS_ACTUALES.md`, `CHECKLIST_ADMIN_FRONT.md` and `PLAN_ARCHIVO_POR_ARCHIVO.md`.
- The old `documentacion/openapi.json` (delegated `X-*` headers) is obsolete and has been removed from the repo.

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

Features: `landing` (página pública + términos, rutas `/` y `/terminos`), `auth`, `dashboard`, `documents`, `chat` (Playground), `conversations`, `analytics`, `audit`, `users`, `settings`. `landing` es público (fuera de `ProtectedRoute`). `billing`, `institution` y `platform` son **módulos productivos** (Fase 5 + cierre integral): `BillingPage` (lectura plan/subscription/pagos/comprobantes), `InstitutionPage` (perfil + snapshot), `PlatformPage` (consola superadmin con instituciones, miembros, métricas, audit, usuarios, planes, suscripciones). El contrato real está en `openapi.current.json` (2026-08-26).

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
npm test           # vitest run (unit tests)
```

Tests use **Vitest** (`src/**/*.test.ts`, environment node). Keep unit tests for pure helpers (e.g. `lib/roles.ts`); components/hooks are not covered yet.

## Critical API integration conventions

The backend validates **Supabase JWTs directly**. `lib/http.ts` must send the Supabase access token on every request:

- `Authorization: Bearer <jwt>` — the user's Supabase access token.

The delegated headers `X-External-Auth-Id`, `X-Auth-Provider`, `X-User-Type` and `X-User-Email` are **obsolete** — do not send them.

`GET /me` is the source of truth for the UI session. Permission model:

- `tipo_miembro` (`ADMIN | SECRETARIA | ESTUDIANTE`) — institutional permissions.
- `is_platform_admin` (`boolean`) — platform permissions.
- `role` (`STUDENT | STAFF | ADMIN`) is **legacy** — do not use it as the primary permission source.

Guards/UI should use the helpers in `app/src/lib/roles.ts` (`hasInstitutionMembership`, `isInstitutionAdmin`, `isStaffMember`, `isPlatformAdmin`). Users with no active institutional membership (no `institucion_id`/`tipo_miembro`) cannot enter admin modules → route to `/sin-membresia`. `404` may also mean a resource belonging to another institution.

## Known spec-vs-OpenAPI deltas (do not re-discover)

1. **Reindex**: real route is `POST /api/admin/reindex` with optional `documento_id` in body — NOT `POST /api/admin/documents/{id}/reindex` (Doc 07).
2. **Metrics**: real route `GET /api/admin/metrics` — NOT `/metrics`. Supports `desde/hasta/categoria_id/modelo/documento_id` filters + `granularidad` (`day`) + `series` temporal (Nivel 2 filters now implemented in Analytics UI).
3. **Categories**: `GET /api/admin/categories` **exists** now (paginated). Documents carry `categoria_id`; resolve names to `CategoryOut` client-side. (No CRUD endpoint for categories yet — Nivel 2.)
4. **DocumentStatus** enum is `PENDING | PROCESSING | READY | FAILED`. Doc 07's `INACTIVE` state = `DocumentOut.activo === false`, separate from version status.
5. **Trailing slashes** vary per path: `/api/conversations/` (with slash) vs `/api/conversations/{id}` (without). Respect exactly.
6. **Settings (Doc 12)**: `GET /api/admin/config` + `PUT /api/admin/config/{clave}` real (`ConfigParamOut.editable_desde_dashboard`). Blocks render editables vs solo lectura; available aggregate data shown; no more "pendiente" notice.
7. **AuditLogOut** lacks user/prompt/response/latency fields. Drawer links to Conversations via `mensaje_id` for full context.
8. **Voice chat** (`POST /api/chat/voice`) is optional MVP per Doc 08.
9. **MessageRole / Contract update 2026-08-26**: `rol_mensaje` uses `USER | ASSISTANT` (uppercase), not `user/assistant`. `UserOut` includes `nombre_institucion`. `POST /api/platform/institutions/{id}/members` requires body `{payload: MemberIn, auth: AuthContext}`.
10. **Billing / Platform contracts**: `GET /api/admin/plan/subscription/pagos/comprobantes`, `GET /api/platform/institutions` + members + users/metrics/audit/plans/subscriptions/pagos/comprobantes now live (openapi 2026-08-26).

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