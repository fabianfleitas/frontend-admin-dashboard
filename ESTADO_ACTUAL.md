# Estado Actual Del Proyecto

Fecha de elaboración: 2026-08-25

Este documento resume el estado actual del proyecto `admin-dashboard`: qué está
implementado, qué es placeholder, cuál es el contrato real del backend y qué queda
pendiente. Es un artefacto vivo: debe actualizarse cuando cambie el contrato backend
o se productivicen módulos nuevos.

---

## 1. Resumen ejecutivo

- El **handoff del backend** (`docs/backend_admin_handoff/CHECKLIST_ADMIN_FRONT.md`,
  Fases 1–5) está **completamente ejecutado**, incluido un cierre integral posterior.
- El front quedó **alineado al contrato real** del backend (`openapi.current.json`,
  regenerado 2026-08-25): auth JWT Bearer directa, permisos por `tipo_miembro` +
  `is_platform_admin`, categorías reales y tipado completo de métricas/chat.
- Los módulos futuros (**billing**, **institution**, **platform**) existen como
  **placeholders de rutas** con guards, sin conexión productiva hasta que el backend
  publique los contratos (ver `PLAN_SIGUIENTE_CICLO_BACKEND.md`).
- Cobertura de tests unitarios inicial con **Vitest (13 tests)** sobre helpers puros.
- Los pendientes restantes están concentrados en el **backend** (repo externo).

## 2. Contexto y arquitectura

Repositorio híbrido:

- **Specs funcionales** (español) numeradas en la raíz:
  - Blueprint v1.0: Documentos 02, 03 y 05 (01 y 04 pendientes de regeneración).
  - Functional Specifications: Documentos 06–14 (por feature).
  - Design Brief visual/UX.
- **SPA admin dashboard** en `app/`:
  - React 19 + Vite 8 (rolldown) + TypeScript 6 + Tailwind CSS 4.
  - React Router 7 · TanStack Query 5 · Zustand · React Hook Form + Zod.
  - Recharts (Analytics) · Lucide (iconos) · Supabase Auth (Google OAuth).
- **Contrato backend**: `docs/backend_admin_handoff/openapi.current.json`
  (OpenAPI 3.1, export 2026-08-25). Es la fuente de verdad sobre cualquier prosa.

Arquitectura front: feature-first (`features/<modulo>/{api,components,hooks,pages,schemas}`),
server state solo con TanStack Query, UI state en Zustand, páginas `lazy()` con
vendors separados por chunk (`manualChunks`).

Convenciones de desarrollo y edición de docs: ver `AGENTS.md`.

## 3. Estado del backend (contrato actual)

### Autenticación

El backend valida **JWT de Supabase directamente**:

```http
Authorization: Bearer <jwt>
```

Los headers delegados `X-External-Auth-Id`, `X-Auth-Provider`, `X-User-Type` y
`X-User-Email` son **obsoletos** y ya no se envían.

### Modelo de identidad (`GET /me` → `UserOut`)

| Campo | Uso |
|---|---|
| `tipo_miembro` (`ADMIN \| SECRETARIA \| ESTUDIANTE`) | Permisos institucionales |
| `is_platform_admin` (`boolean`) | Permisos de plataforma |
| `role` (`STUDENT \| STAFF \| ADMIN`) | **Legacy** — no usar como fuente principal |
| `full_name`, `institucion_id` | Contexto de sesión |

Regla multi-tenant: usuario autenticado sin membresía activa no entra a módulos
admin → `/sin-membresia`. Un `404` también puede significar recurso de otra institución.

### Endpoints disponibles hoy

| Grupo | Endpoints |
|---|---|
| Globales | `GET /health` · `GET /ready` · `GET /me` |
| Conversaciones | `POST/GET /api/conversations/` (con slash) · `GET/DELETE /api/conversations/{id}` · `GET /api/conversations/{id}/messages` |
| Chat | `POST /api/chat/query` · `POST /api/chat/voice` · `GET /api/chat/audio/{audio_interaction_id}` · `POST /api/chat/feedback` |
| Admin institucional | `POST/GET /api/admin/documents` · `GET/DELETE /api/admin/documents/{documento_id}` · `POST /api/admin/documents/{documento_id}/versions` · `POST /api/admin/reindex` · `GET /api/admin/audit` · `GET /api/admin/users` · `GET /api/admin/metrics` · `GET /api/admin/categories` |

Paginación estándar: `{ "items": [], "pagination": { total, limit, offset } }`.

### Endpoints NO disponibles todavía

- `/api/platform/*` (superadmin).
- Billing/Stripe operativo (tablas modeladas: `planes`, `suscripciones`,
  `suscripcion_historial`, `pagos`, `comprobantes`, `stripe_eventos`).
- CRUD de instituciones, suscripciones, pagos/comprobantes.
- Settings completos sobre `config_parametros`.
- Filtros (periodo/categoría/modelo/documento) ni series temporales en
  `GET /api/admin/metrics`.
- CRUD de categorías (solo lectura paginada).

## 4. Estado del front por módulo

| Módulo | Ruta(s) | Estado | Endpoints que consume | Notas |
|---|---|---|---|---|
| `landing` | `/`, `/terminos` | Implementado (público) | — | Redirige a `/dashboard` si hay sesión |
| `auth` | `/login`, `/sin-membresia` | Implementado | `GET /me` | Google OAuth; página 403 dedicada para usuarios sin membresía |
| `dashboard` | `/dashboard` | Implementado | `GET /ready`, `GET /api/admin/metrics` | KPIs globales + subgrupo "Métricas IA" + estado del sistema |
| `documents` | `/documents`, `/documents/:id` | Implementado | `GET/POST /api/admin/documents`, `GET/DELETE /api/admin/documents/{id}`, `POST .../versions`, `POST /api/admin/reindex`, `GET /api/admin/categories` | Categorías reales (filtro + alta); filtro INACTIVE = `activo === false` |
| `chat` (Playground) | `/playground` | Implementado (texto) | `POST /api/chat/query`, `POST /api/chat/feedback` | Voz como stub tipado: `sendVoice` + `getAudio` (blob), sin UI |
| `conversations` | `/conversations`, `/conversations/:id` | Implementado | `POST/GET /api/conversations/`, `GET/DELETE /api/conversations/{id}`, `GET .../messages` | Ocultar = soft-delete; drawer con timeline completa |
| `analytics` | `/analytics` | Implementado (agregados) | `GET /api/admin/metrics` | Filtros y series marcados "Nivel 2" hasta contrato nuevo |
| `audit` | `/audit` | Implementado | `GET /api/admin/audit` | Drawer enlaza a Conversations vía `mensaje_id` |
| `users` | `/users` | Implementado (lectura) | `GET /api/admin/users` | Columnas membresía/institución defensivas; badge platform admin |
| `settings` | `/settings` | Implementado (lectura) | `GET /ready`, `GET /api/admin/metrics` | Bloques LLM/Embedding/Storage/Vector como pendientes (`config_parametros`) |
| `billing` | `/billing` | **Placeholder** (guard `admin`) | — | Suscripción/pagos/comprobantes — espera contratos Stripe |
| `institution` | `/institution` | **Placeholder** (guard `admin`) | — | Institución/configuración institucional |
| `platform` | `/platform` | **Placeholder** (guard `platform`) | — | Consola superadmin — espera `/api/platform/*` |

### Guards y navegación

- `components/common/ProtectedRoute.tsx` con `guard`:
  `authenticated | member | staff | admin | platform`.
  - Sin sesión → `/login`; sin membresía (y no platform) → `/sin-membresia`;
    permiso insuficiente → toast + redirect a `/dashboard`.
- `Sidebar.tsx` filtra ítems con las mismas capacidades.
- Helpers de permisos en `lib/roles.ts`: `hasInstitutionMembership`,
  `isInstitutionAdmin`, `isStaffMember`, `isPlatformAdmin`, `memberTypeLabel`;
  derivados vía hook `useAuthCapabilities`.
- Header muestra `full_name` + badge de `tipo_miembro` (+ "Platform Admin").

## 5. Cambios clave implementados (cierre handoff)

1. **Auth**: `lib/http.ts` envía `Authorization: Bearer <jwt>`; eliminados headers
   `X-*` y `userTypeOverride`; soporte `responseType: 'blob'`; manejo central de 401.
2. **Tipos alineados al OpenAPI**: `UserOut` ampliado (`full_name`, `institucion_id`,
   `tipo_miembro`, `is_platform_admin`), `MetricsOut` completo (22 campos,
   `tokens_by_model`), `ChatVoiceOut` + `AudioInteractionOut`, `CategoryOut`,
   paginación `{items, pagination}`.
3. **Permisos**: migración de `role` legacy a `tipo_miembro`/`is_platform_admin`
   (helpers puros testeados).
4. **UX multi-institución**: página `/sin-membresia`; mensajes 404 en drawers de
   detalle que distinguen recurso inexistente vs otra institución.
5. **Categorías reales**: `listCategories()` + hooks `useCategories`/
   `useCategoriesLookup`; filtro por categoría en Knowledge Base y `<Select>` en
   `UploadDialog` (reemplaza input numérico).
6. **Métricas IA**: subgrupo compartido (`MetricsIA` + `TokenTable`) en Dashboard y
   Analytics (tokens, guard/fallos LLM y tasas, retrieval, voz/texto, latencias).
7. **Placeholders Fase 5**: billing/institution/platform con rutas, guards y slots
   en sidebar (no productivos).
8. **Docs**: `AGENTS.md` y `app/README.md` actualizados a la nueva fuente de verdad;
   `documentacion/openapi.json` eliminado (obsoleto).

## 6. Testing

- Framework: **Vitest 3.2.7** (`vitest.config.ts` independiente de `vite.config.ts`;
  entorno node; patrón `src/**/*.test.ts`). Script: `npm test`.
- Cobertura actual (13 tests):
  - `src/lib/roles.test.ts` — helpers de permisos (membresía, admin, staff,
    platform, etiquetas).
  - `src/lib/http.test.ts` — `isNotFound` (404 multi-tenant).
- Componentes/hooks aún sin cobertura (requeriría testing library).

## 7. Docs del handoff (`docs/backend_admin_handoff/`)

| Archivo | Rol |
|---|---|
| `openapi.current.json` | Contrato OpenAPI 3.1 exportado del backend (2026-08-25). Fuente de verdad. |
| `ENDPOINTS_Y_MODELOS_ACTUALES.md` | Auth real, endpoints, modelos y deltas clave. |
| `CHECKLIST_ADMIN_FRONT.md` | Checklist de ejecución del front (Fases 1–5 + validaciones QA + bloqueadores). **Ejecutado.** |
| `PLAN_ARCHIVO_POR_ARCHIVO.md` | Plan de cambios archivo por archivo. **Ejecutado.** |
| `RECOMENDACIONES_BACKEND_PARA_ADMIN_FRONT.md` | Recomendaciones hacia el backend. |
| `PLAN_SIGUIENTE_CICLO_BACKEND.md` | Backlog priorizado del siguiente ciclo backend con criterios de validación desde el front. |
| `README.md` | Índice del paquete y orden sugerido de lectura. |

Deltas spec-vs-backend vigentes (documentados en `AGENTS.md`): reindex global
(`POST /api/admin/reindex`), métricas sin filtros, trailing slashes de
conversaciones, `INACTIVE` = `activo === false`, settings sin endpoints, voice opcional.

## 8. Pendientes / siguientes pasos

### Dependientes del backend (repo externo)

Backlog priorizado completo en `docs/backend_admin_handoff/PLAN_SIGUIENTE_CICLO_BACKEND.md`:

- **Alta**: OpenAPI oficial versionado en CI · exponer `/api/platform/*` ·
  endpoints de billing/Stripe (plan, suscripción, pagos, comprobantes, portal).
- **Media**: ampliar `GET /api/admin/users` (`full_name`, `institucion_id`,
  `tipo_miembro`, `is_platform_admin`, idealmente `nombre_institucion`) ·
  lectura de `config_parametros` por institución (editable vs observable).
- **Baja (Nivel 2)**: filtros/series para Analytics · CRUD de categorías.

Al publicarse cada contrato: actualizar `openapi.current.json` + handoff y
productivizar el módulo correspondiente (los placeholders ya tienen rutas/guards/UI base).

### Validación funcional (QA) contra backend real

Checklist mínimo (requiere backend corriendo + `.env` con `VITE_API_URL`,
`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`):

1. Login con Supabase obtiene JWT y `GET /me` responde con Bearer.
2. Usuario `ADMIN` consume `/api/admin/*`; `SECRETARIA` solo lo permitido por UI;
   `ESTUDIANTE` ve módulos base; sin membresía cae en `/sin-membresia`.
3. Documentos cargan, filtran (incluida categoría real) y muestran versiones.
4. Playground funciona con texto; feedback registra.
5. Dashboard/Analytics no prometen filtros no soportados.
6. `404` de detalle muestra mensaje multi-tenant correcto.

## 9. Comandos de verificación

Desde `app/`:

```bash
npm run dev        # servidor de desarrollo
npm run typecheck  # tsc --noEmit
npm run lint       # oxlint
npm test           # vitest run (unit tests)
npm run build      # tsc -b + vite build
npm run preview    # preview del build
```

Estado al cierre de este documento: `typecheck` ✅ · `lint` ✅ (solo warnings
preexistentes de Fast Refresh en `router.tsx`) · `test` ✅ 13/13 · `build` ✅.

--- Actualización Ciclo 2 (2026-08-26) ---
Estado: Fases A-H completadas. Typecheck ✅, lint ✅ (warnings preexistentes router.tsx), test 13/13 ✅, build ✅.
Módulos: chat (MessageRole uppercase), dashboard/analytics (metrics filters + series), settings (config editable), billing (lectura), platform (consola completa), institution (perfil), users (nombre_institucion).
Pendientes restantes: Stripe checkout/webhooks/portal, CRUD categorías, rate limiting, QA manual contra backend.
