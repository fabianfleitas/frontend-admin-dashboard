# Admin Dashboard SPA

Panel de administración del sistema de atención inteligente basado en arquitectura RAG.
El frontend consume el backend FastAPI (`backend-agent-system`), cuyo contrato vive en
`openapi.current.json` de ese repo, y autentica con Supabase Auth (Google).

## Stack

- React 19 + Vite 8 + TypeScript 6
- Tailwind CSS 4
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
npm test           # vitest run (unit tests)
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
    dashboard/          KPIs + estado del sistema + actividad reciente (GET /ready + /api/admin/metrics + /api/admin/audit)
    documents/          Knowledge Base (CRUD + versiones + reindex + gestión de categorías CRUD)
    chat/               AI Agent Playground (POST /api/chat/query, voz POST /api/chat/voice con grabación/subida + reproducción, feedback)
    conversations/      Listado + drawer (timeline + contexto recuperado + feedback) + ocultar (DELETE = soft-delete) + deep-linking
    analytics/          KPIs + gráficos (Recharts) + filtros período/categoría/modelo/documento + export CSV
    audit/              Trazabilidad (GET /api/admin/audit + export CSV)
    feedback/           Moderación global de feedback (GET /api/admin/feedback, filtro por rating)
    users/              Listado read-only (GET /api/admin/users; columnas membresía/institución)
    settings/           Lectura + edición de configuración institucional (GET/PUT /api/admin/config) + Correo/SMTP y Notificaciones (GET/PUT /api/admin/smtp, notifications, send-test)
    billing/            Módulo productivo: suscripción/pagos/comprobantes (con export CSV) + acciones Stripe (checkout, portal, cancel/reactivate, change-plan con GET /api/admin/plans, sync-plan, historial)
    institution/        Módulo productivo: perfil de institución + snapshot (GET /me, PUT /me para editar nombre)
    platform/           Módulo productivo: consola superadmin (GET /api/platform/*) + CRUD de instituciones y planes + exportaciones CSV
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

## Deltas de contrato conocidos

Ver `../AGENTS.md` §"Known spec-vs-OpenAPI deltas". Las más relevantes en código:

- **Reindex**: `POST /api/admin/reindex` con `documento_id?` en body (no `POST /api/admin/documents/{id}/reindex`).
- **Métricas**: `GET /api/admin/metrics` con filtros `desde/hasta/categoria_id/modelo/documento_id` + `granularidad` (`day`) + `series`; además `top_documents` (documentos más consultados) y `documents_by_category` (distribución por categoría), consumidos por Analytics.
- **Categories**: `GET /api/admin/categories` existe (paginado), y también `POST/PUT/DELETE`. Resolver `categoria_id` a `CategoryOut` en el cliente; CRUD en backend + UI de gestión (`CategoriesDialog` en DocumentsPage). Para un admin institucional la lista es la fusión globales + institucionales (precedencia institucional, dedupe por nombre case-insensitive); platform admin gestiona solo globales.
- **Descarga de documento**: `GET /api/admin/documents/{id}/download` (blob del PDF de la versión activa, aislado por institución) → botón "Descargar PDF" en `DocumentDrawer`.
- **Trailing slashes**: `/api/conversations/` lleva slash; `/api/conversations/{id}` no. Respétalo.
- **Settings**: `GET /api/admin/config` + `PUT /api/admin/config/{clave}` reales (`editable_desde_dashboard`); bloques editables vs solo lectura.
- **Audit**: `AuditLogOut` no trae prompt/respuesta/usuario → drawer enlaza a Conversations via `mensaje_id`.
- **MessageOut**: incluye `sources` (documentos recuperados, batch) y `rating`/`feedback_comment` desde `GET /api/conversations/{id}` y `.../messages` → `ContextViewer`/`FeedbackBadge`.
- **DocumentStatus**: enum `PENDING/PROCESSING/READY/FAILED`. `INACTIVE` = `activo === false`.
- **Voice** (`POST /api/chat/voice`): opcional MVP; UI implementada (grabación MediaRecorder + adjuntar archivo + reproducción de la respuesta vía `GET /api/chat/audio/{id}`). Formato de grabación (webm/mp4) pendiente de validar con el STT del backend.

## Tests

Vitest (entorno node, patrón `src/**/*.test.ts`): 13 tests sobre helpers puros —
`lib/roles.test.ts` (permisos por `tipo_miembro`/`is_platform_admin`) y `lib/http.test.ts`
(`isNotFound`, 404 multi-tenant). Ejecutar con `npm test`. Componentes/hooks aún sin cobertura.