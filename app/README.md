# Admin Dashboard SPA

Panel de administración del sistema de atención inteligente basado en arquitectura RAG.
El frontend consume el backend FastAPI (`backend-agent-system`) documentado en
`../docs/backend_admin_handoff/openapi.current.json` y autentica con Supabase Auth (Google).

Las especificaciones funcionales viven como Markdown numerado en la raíz del repo
(ver `../AGENTS.md` para el mapeo Documento → Módulo).

## Stack

- React 19 + Vite 8 + TypeScript 6
- Tailwind CSS 4 (tokens del Design Brief)
- React Router 7 (rutas protegidas)
- TanStack Query 5 (estado servidor)
- Zustand (estado UI: sidebar, sesión, toasts)
- React Hook Form + Zod (formularios)
- Recharts (gráficos Analytics)
- Lucide React (iconografía)
- Supabase Auth (Google OAuth)

## Requisitos

- Node 20+ (probado con Node 23)
- Variables de entorno (ver `.env.example`):
  - `VITE_API_URL` — URL base del backend FastAPI (sin barra final)
  - `VITE_SUPABASE_URL` — URL del proyecto Supabase
  - `VITE_SUPABASE_ANON_KEY` — anon key de Supabase

## Setup

```bash
npm install
cp .env.example .env   # rellenar con valores reales
npm run dev            # http://localhost:5173
```

## Scripts

```bash
npm run dev        # Vite dev server
npm run build      # tsc -b + vite build (genera dist/)
npm run preview    # preview del build
npm run lint        # oxlint
npm run lint:fix   # oxlint --fix
npm run format     # Prettier (src/)
npm run typecheck  # tsc --noEmit (sin artefactos)
```

## Arquitectura

Feature-first: cada módulo agrupa API, hooks, componentes, páginas, schemas y tipos.

```
src/
  app/                  App, router, providers, query-client
  components/
    common/             Button, Card, Drawer, Modal, Pagination, SearchBar, SectionTitle, ProtectedRoute
    forms/              Select
    feedback/           EmptyState, ErrorState, Skeleton, Toaster
    layout/             Sidebar, Header, Breadcrumb, DashboardLayout
  features/
    auth/               Login con Google (Supabase OAuth)
    dashboard/          KPIs + estado del sistema (GET /ready + /api/admin/metrics)
    documents/          Knowledge Base (CRUD + versiones + reindex)
    chat/               AI Agent Playground (POST /api/chat/query + feedback)
    conversations/      Listado + drawer + ocultar (DELETE = soft-delete)
    analytics/          KPIs + gráficos (Recharts)
    audit/              Trazabilidad (GET /api/admin/audit)
    users/              Listado read-only (GET /api/admin/users)
    settings/           Vista solo-lectura (bloques LLM/Embedding/Storage/Vector pendientes en backend)
    billing/            Módulo productivo (Fase 5): suscripción/pagos/comprobantes — lectura + acciones Stripe (checkout, portal, cancel/reactivate, sync-plan, historial)
    institution/        Placeholder de rutas (Fase 5): institución/configuración — sin endpoints aún
    platform/           Placeholder de rutas (Fase 5): superadmin — sin endpoints aún
  lib/                  http.ts (_cliente fetch con Authorization Bearer), supabase.ts, utils.ts
  stores/               auth.store (sesión), ui.store (sidebar), toast.store
  types/                paginación compartida
```

### Capas (orden de dependencia)

Componentes → Hooks (TanStack Query) → Services (`*.service.ts`) → HTTP client (`lib/http.ts`).
NUNCA se llama `fetch` directamente desde componentes ni se almacena estado de API en Zustand.

### Autenticación JWT

El backend valida el JWT de Supabase de forma directa. `lib/http.ts` envía en cada request:

| Header | Valor |
|---|---|
| `Authorization` | `Bearer <access_token>` del usuario logueado en Supabase |

Los headers delegados `X-External-Auth-Id`, `X-Auth-Provider`, `X-User-Type` y `X-User-Email` son obsoletos y **no** se envían. El modelo de permisos usa `tipo_miembro` (`ADMIN | SECRETARIA | ESTUDIANTE`) e `is_platform_admin` desde `GET /me`; `role` es legacy. Ver `../AGENTS.md` §"Critical API integration conventions".

### Code-splitting

Las páginas son `lazy(() => import(...))` en `src/app/router.tsx`. Vendors separados en chunks
(Recharts, Supabase, TanStack Query, React Router) para minimizar el bundle inicial.

## Deltas spec vs OpenAPI conocidas

Ver `../AGENTS.md` §"Known spec-vs-OpenAPI deltas". Las más relevantes en código:

- **Reindex**: `POST /api/admin/reindex` con `documento_id?` en body (no `POST /api/admin/documents/{id}/reindex`).
- **Métricas**: `GET /api/admin/metrics` no soporta filtros. Analytics UI los muestra con aviso "Nivel 2".
- **Categories**: `GET /api/admin/categories` existe (paginado). Resolver `categoria_id` a `CategoryOut` en el cliente (sin CRUD aún, Nivel 2).
- **Trailing slashes**: `/api/conversations/` lleva slash; `/api/conversations/{id}` no. Respétalo.
- **Settings**: bloques LLM/Embedding/Storage/Vector no tienen endpoint → `PendingBlock` con aviso.
- **Audit**: `AuditLogOut` no trae prompt/respuesta/usuario → drawer enlaza a Conversations via `mensaje_id`.
- **DocumentStatus**: enum `PENDING/PROCESSING/READY/FAILED`. `INACTIVE` = `activo === false`.
- **Voice** (`POST /api/chat/voice`): opcional MVP, no implementado.

## Sin tests todavía

Sin Vitest configurado. Si se añaden, actualizar `../AGENTS.md`.