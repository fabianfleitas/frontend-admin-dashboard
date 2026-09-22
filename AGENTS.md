# AGENTS.md

## Repo type

The **Admin Dashboard SPA** under `app/` (React 19 + Vite + TypeScript + Tailwind + TanStack Query + Zustand + Supabase Auth). The external FastAPI backend (repo `backend-agent-system`, source of truth: `openapi.current.json`) lives in another repo — do not assume backend code here, only the API client.

## Source of truth

The API contract lives in the backend repo (`backend-agent-system/openapi.current.json`, OpenAPI 3.1, regenerated from the FastAPI app). It is the **source of truth** for real endpoint shapes/auth (currently `Authorization: Bearer <jwt>`); trust it over prose when they conflict. The backend repo also holds `FRONTEND_API_INTEGRATION.md` (contract details) and the `bruno/` collection.

## Other assets

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

Features: `landing` (página pública + términos, rutas `/` y `/terminos`), `auth`, `dashboard`, `documents`, `chat` (Playground), `conversations`, `analytics`, `audit`, `users`, `settings`. `landing` es público (fuera de `ProtectedRoute`). `billing`, `institution` y `platform` son **módulos productivos** (Fase 5 + cierre integral): `BillingPage` (lectura + acciones Stripe: checkout/portal, cancel/reactivate, change-plan con `GET /api/admin/plans`, sync-plan, historial), `InstitutionPage` (perfil + snapshot), `PlatformPage` (consola superadmin con instituciones, miembros, métricas, audit, usuarios, planes, suscripciones). El contrato real está en el repo backend (`backend-agent-system/openapi.current.json`).

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

1. **Reindex**: real route is `POST /api/admin/reindex` with optional `documento_id` in body — NOT `POST /api/admin/documents/{id}/reindex`.
2. **Metrics**: real route `GET /api/admin/metrics` — NOT `/metrics`. Supports `desde/hasta/categoria_id/modelo/documento_id` filters + `granularidad` (`day`) + `series` temporal (Nivel 2 filters now implemented in Analytics UI). Also returns `top_documents` (documentos más consultados, dedupe por mensaje) y `documents_by_category` (distribución por categoría) — consumidos por Analytics.
3. **Categories**: `GET /api/admin/categories` exists (paginated). `POST /api/admin/categories`, `PUT /api/admin/categories/{categoria_id}`, `DELETE /api/admin/categories/{categoria_id}` also live (Nivel 2 CRUD with UI: `CategoriesDialog` from DocumentsPage). Documents carry `categoria_id`; resolve names to `CategoryOut` client-side.
4. **DocumentStatus** enum is `PENDING | PROCESSING | READY | FAILED`. The spec's `INACTIVE` state = `DocumentOut.activo === false`, separate from version status.
5. **Trailing slashes** vary per path: `/api/conversations/` (with slash) vs `/api/conversations/{id}` (without). Respect exactly.
6. **Settings**: `GET /api/admin/config` + `PUT /api/admin/config/{clave}` real (`ConfigParamOut.editable_desde_dashboard`). Blocks render editables vs solo lectura; available aggregate data shown; no more "pendiente" notice.
7. **AuditLogOut** lacks user/prompt/response/latency fields. Drawer links to Conversations via `mensaje_id` for full context.
8. **Voice chat** (`POST /api/chat/voice`) is optional MVP per spec. UI implementada (2026-09-20): grabación con MediaRecorder u adjuntar archivo de audio, placeholder optimista `[Audio]` en el chat y reproducción de la respuesta vía `GET /api/chat/audio/{audio_interaction_id}`. El formato de grabación del navegador (webm/mp4) está pendiente de validar con el STT del backend.
9. **MessageRole / Contract update 2026-08-26**: `rol_mensaje` uses `USER | ASSISTANT` (uppercase), not `user/assistant`. `UserOut` includes `nombre_institucion`. `POST /api/platform/institutions/{id}/members` recibe `MemberIn` (`{external_auth_id, tipo_miembro}`) directamente (sin `payload` ni `auth` en el body; el backend resuelve `auth` vía JWT Bearer).
10. **Billing / Platform contracts**: `GET /api/admin/plan/subscription/pagos/comprobantes`, `GET /api/platform/institutions` + members + users/metrics/audit/plans/subscriptions/pagos/comprobantes now live (openapi 2026-08-26).

## Conventions when editing docs

- Keep content in Spanish to match existing files.
- The API contract lives in the backend repo (`backend-agent-system/openapi.current.json`); favor amending that over creating new ad-hoc docs in this repo.

## Code conventions (app/)

- Components: PascalCase, one responsibility per file.
- Hooks: `use*` prefix.
- Services: `*.service.ts`, no direct `fetch` from components (go via hooks).
- Types: shared in `features/<modulo>/types.ts` or `types/` for cross-feature.
- Forms: React Hook Form + Zod.
- Server state: TanStack Query only; NEVER store API data in Zustand.
- UI state (sidebar, theme, session): Zustand.
- Code-splitting: las páginas son `lazy(() => import(...))` en `src/app/router.tsx`. Vendors separados en chunks por `vite.config.ts` (`manualChunks`: recharts, supabase, tanstack, router). No importar Recharts ni servicios pesados desde componentes compartidos fuera del feature que los usa.