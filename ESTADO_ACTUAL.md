# Estado Actual Del Proyecto

Fecha de elaboración: 2026-08-25

Este documento resume el estado actual del proyecto `admin-dashboard`: qué está
implementado, qué es placeholder, cuál es el contrato real del backend y qué queda
pendiente. Es un artefacto vivo: debe actualizarse cuando cambie el contrato backend
o se productivicen módulos nuevos.

---

## 1. Resumen ejecutivo

- El **handoff del backend** (Fases 1–5) está **completamente ejecutado**, incluido un cierre integral posterior.
- El front quedó **alineado al contrato real** del backend (`openapi.current.json`,
  regenerado 2026-08-29): auth JWT Bearer directa, permisos por `tipo_miembro` +
  `is_platform_admin`, categorías reales y tipado completo de métricas/chat.
- Los módulos **billing**, **institution** y **platform** ya están **productivos**
  sobre el contrato real del 2026-08-29 (ver tabla del §4).
- Cobertura de tests unitarios inicial con **Vitest (13 tests)** sobre helpers puros.
- Los pendientes restantes se reparten entre backend (rate limiting, CRUD de
  instituciones/planes, lectura/moderación global de feedback, exportaciones,
  `PUT /me`) y QA manual contra backend real.

## 2. Contexto y arquitectura

Repositorio híbrido:

- **Specs funcionales** (español) numeradas en la raíz:
  - Blueprint v1.0: Documentos 02 y 03 (01 y 04 pendientes de regeneración; 05 eliminado).
  - Functional Specifications: Documentos 06–14 (por feature).
  - Design Brief visual/UX.
- **SPA admin dashboard** en `app/`:
  - React 19 + Vite 8 (rolldown) + TypeScript 6 + Tailwind CSS 4.
  - React Router 7 · TanStack Query 5 · Zustand · React Hook Form + Zod.
  - Recharts (Analytics) · Lucide (iconos) · Supabase Auth (Google OAuth).
- **Contrato backend**: `docs/backend_admin_handoff/openapi.current.json`
  (OpenAPI 3.1, export 2026-08-29). Es la fuente de verdad sobre cualquier prosa.

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

Todos los grupos del contrato actual (`openapi.current.json` 2026-08-29) están implementados:

| Grupo | Endpoints |
|---|---|
| Globales | `GET /health` · `GET /ready` · `GET /me` |
| Conversaciones | `POST/GET /api/conversations/` (con slash) · `GET/DELETE /api/conversations/{id}` · `GET /api/conversations/{id}/messages` |
| Chat | `POST /api/chat/query` · `POST /api/chat/voice` · `GET /api/chat/audio/{audio_interaction_id}` · `POST /api/chat/feedback` |
| Admin documental | `POST/GET /api/admin/documents` · `GET/DELETE /api/admin/documents/{documento_id}` · `POST /api/admin/documents/{documento_id}/versions` · `POST /api/admin/reindex` |
| Admin resto | `GET /api/admin/audit` · `GET /api/admin/users` · `GET /api/admin/metrics` (desde/hasta/categoría/modelo/documento, granularidad `day`, series) |
| Categorías | `GET/POST /api/admin/categories` · `PUT/DELETE /api/admin/categories/{categoria_id}` |
| Config | `GET /api/admin/config` · `PUT /api/admin/config/{clave}` |
| Billing (lectura) | `GET /api/admin/plan` · `/subscription` · `/subscription/history` · `/pagos` · `/comprobantes` |
| Billing/Stripe | `POST /api/admin/stripe/{checkout,portal-session,create-subscription,cancel-subscription,reactivate-subscription,change-plan,sync-plan}` · `GET /api/admin/stripe/subscription` · webhook `POST /api/billing/stripe/webhook` |
| Platform (superadmin) | `GET /api/platform/institutions` (+`/{id}`, `+/{id}/members`) · `POST/DELETE .../members...` · `GET /api/platform/{users,metrics,audit,plans,subscriptions,pagos,comprobantes}` |

Paginación estándar: `{ "items": [], "pagination": { total, limit, offset } }`.

## 4. Estado del front por módulo

| Módulo | Ruta(s) | Estado | Endpoints que consume | Notas |
|---|---|---|---|---|
| `landing` | `/`, `/terminos` | Implementado (público) | — | Contiene los términos (`/terminos`); redirige a `/dashboard` si hay sesión |
| `auth` | `/login`, `/sin-membresia` | Implementado | `GET /me` | Google OAuth; página 403 dedicada para usuarios sin membresía |
| `dashboard` | `/dashboard` | Implementado | `GET /ready`, `GET /api/admin/metrics`, `GET /api/admin/audit` | KPIs globales + subgrupo "Métricas IA" + estado del sistema + actividad reciente (audit, staff/platform; EmptyState para estudiantes) |
| `documents` | `/documents`, `/documents/:id` | Implementado | `GET/POST /api/admin/documents`, `GET/DELETE /api/admin/documents/{id}`, `POST .../versions`, `POST /api/admin/reindex`, `GET/POST /api/admin/categories`, `PUT/DELETE /api/admin/categories/{categoria_id}` | Categorías reales (filtro + alta + gestión CRUD en `CategoriesDialog`); deep-linking `/documents/:id`; filtro INACTIVE = `activo === false` |
| `chat` (Playground) | `/playground` | Implementado | `POST /api/chat/query`, `POST /api/chat/voice`, `GET /api/chat/audio/{id}`, `POST /api/chat/feedback` | Voz operativa: grabación (MediaRecorder) + adjuntar archivo + reproducción de la respuesta (`AudioRecorder`/`AudioPlayer`); placeholder optimista `[Audio]` |
| `conversations` | `/conversations`, `/conversations/:id` | Implementado | `POST/GET /api/conversations/`, `GET/DELETE /api/conversations/{id}`, `GET .../messages` | Ocultar = soft-delete; deep-linking real `/conversations/:id`; drawer con timeline completa + contexto recuperado (`sources` por mensaje) + feedback (`rating`/`feedback_comment`) |
| `analytics` | `/analytics` | Implementado | `GET /api/admin/metrics` | Filtros período/categoría/modelo/documento + granularidad `day` + series activos; gráficos con datos reales: "Tendencia de consultas", "Tokens por modelo" (`tokens_by_model`), "Documentos más consultados" (`top_documents`) y "Distribución por categoría" (`documents_by_category`) |
| `audit` | `/audit` | Implementado | `GET /api/admin/audit` | Drawer enlaza a Conversations vía `mensaje_id` |
| `users` | `/users` | Implementado (lectura) | `GET /api/admin/users` | Columnas membresía/institución defensivas; badge platform admin |
| `settings` | `/settings` | Implementado (lectura + edición) | `GET /api/admin/config`, `PUT /api/admin/config/{clave}`, `GET/PUT /api/admin/smtp`, `GET /api/admin/notifications`, `POST .../send-test` | Bloques editables vs solo lectura según `editable_desde_dashboard`; precedencia institucional > global; sección Correo/SMTP + Notificaciones |
| `billing` | `/billing` | **Implementado** | `/api/admin/plan`, `/api/admin/plans`, `/api/admin/subscription`, `/api/admin/pagos`, `/api/admin/comprobantes`, `/api/admin/stripe/*` | Checkout/portal/cancel/reactivate/change-plan (selector con `GET /api/admin/plans`)/sync-plan activos |
| `institution` | `/institution` | **Implementado (perfil + snapshot)** | `GET /me` | Configuración avanzada pendiente (Nivel 2) |
| `platform` | `/platform` | **Implementado** | `/api/platform/*` | Consola superadmin completa (instituciones, miembros, métricas, audit, planes, suscripciones, pagos, comprobantes) + CRUD de instituciones y planes + exportaciones CSV |

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
7. **Cierre integral (Fase 5)**: billing/institution/platform productivos sobre el contrato real — billing con Stripe operativo (checkout/portal/cancel/reactivate/sync-plan) y consola superadmin completa.
8. **Docs**: `AGENTS.md` y `app/README.md` actualizados a la nueva fuente de verdad;
   `documentacion/openapi.json` eliminado (obsoleto).
9. **Categorías (UI)**: gestión CRUD en `CategoriesDialog` (alta/edición/desactivación
   con RHF+Zod, StatusBadge Activa/Inactiva y confirmación destructiva); `DocumentDrawer`
   muestra el nombre de categoría.
10. **Voz en Playground**: grabación con MediaRecorder (`AudioRecorder`) + adjuntar
    archivo, subida a `POST /api/chat/voice` con placeholder optimista y reproducción
    de la respuesta (`AudioPlayer`, `GET /api/chat/audio/{id}`).
11. **Deep-linking**: `/documents/:id` y `/conversations/:id` abren el detalle real
    (IDs inválidos redirigen al listado).
12. **Actividad reciente**: `ActivityTimeline` en Dashboard alimentada por
    `GET /api/admin/audit` (staff/platform; EmptyState para estudiantes).
13. **Analytics Nivel 2**: filtros modelo/documento enviados a la query + chart
    "Tokens por modelo" (desde `tokens_by_model`); charts top-documentos/categoría
    con EmptyState honesto.
14. **Términos**: `/terminos` con borrador genérico (9 secciones + nota legal;
    fecha de generación 2026-09-20).
15. **DashboardRole**: `DashboardPage` migrado del `role` legacy a `useAuthCapabilities`.
16. **Change-plan (Billing)**: nuevo `GET /api/admin/plans` (solo planes activos con
    `stripe_price_id`) + selector en `BillingPage` → `POST /api/admin/stripe/change-plan`
    (prorrateo Stripe) e invalidación de queries.
17. **Contexto y feedback en conversaciones**: `MessageOut` ahora incluye
    `sources` (documentos recuperados, batch por mensaje) y `rating`/`feedback_comment`;
    `ConversationDrawer` integra `ContextViewer` y `FeedbackBadge`.
18. **Charts de Analytics con datos**: `GET /api/admin/metrics` devuelve
    `top_documents` y `documents_by_category` (dedupe por mensaje+documento, join a
    títulos/categorías); los dos `ChartBar` se alimentan de estos agregados.

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
| `openapi.current.json` | Contrato OpenAPI 3.1 (2026-08-29, regenerado tras cierre handoff). Fuente de verdad sobre auth/schemas. |
| `FRONTEND_API_INTEGRATION.md` | Contrato de integración frontend (auth Bearer, paginación, chat/voz, documentos, admin, billing, platform). |
| `TODO_BACKEND_CIERRE_MULTIINSTITUCION.md` | Backlog y cierre integral (billing, platform, institution). |
| `bruno/` | Colección Bruno para pruebas manuales de la API. |

Deltas spec-vs-backend vigentes (documentados en `AGENTS.md`): reindex global
(`POST /api/admin/reindex`), trailing slashes de
conversaciones, `INACTIVE` = `activo === false`, voice opcional.

## 8. Pendientes / siguientes pasos

### Dependientes del backend (repo externo)

- **Alta**: rate limiting distribuido (Redis) diferido (in-memory por proceso documentado).
- **Media**: UI global de moderación de feedback (el backend ya expone
  `GET /api/admin/feedback` con filtros; el dashboard solo muestra `rating`/`feedback_comment`
  por mensaje en el drawer de conversaciones) · `PUT /me` implementado en backend (sin UI
  de edición de perfil en el dashboard) · descarga del PDF original ·
  exportación de auditoría/métricas/comprobantes · notificaciones/SMTP y
  plantillas (backend + UI de Settings) · procesamiento asíncrono (Celery/Redis).
- **OpenAPI**: integrar el versionado del contrato al CI.

### Pendientes de frontend (resueltos en el ciclo 2026-09-20)

- ✅ UI de **CRUD de categorías** (`CategoriesDialog` desde "Gestionar categorías").
- ✅ **Deep-linking real** de `/documents/:id` y `/conversations/:id`.
- ✅ **Voz en Playground** (grabación MediaRecorder + adjuntar archivo + reproducción).
- ✅ **Actividad reciente** en Dashboard (desde `GET /api/admin/audit`).
- ✅ Analytics con filtros modelo/documento + "Tokens por modelo".
- ✅ `/terminos` con contenido.
- ✅ `DashboardPage` migrado a `useAuthCapabilities`.
- ✅ **Change-plan** en Billing (selector con `GET /api/admin/plans`).
- ✅ **Contexto y feedback** en el drawer de conversaciones (`ContextViewer` +
  `FeedbackBadge` desde `sources`/`rating` por mensaje).
- ✅ **Charts de Analytics** "Documentos más consultados" y "Distribución por
  categoría" con datos (`top_documents`/`documents_by_category`).

Quedan solo los items dependientes del backend listados arriba (CRUD de
instituciones/planes, rate limiting, moderación global de feedback, exportaciones).

Al publicarse cada contrato: actualizar `openapi.current.json` + handoff y
productivizar el módulo correspondiente.

### Validación funcional (QA) contra backend real

Checklist mínimo (requiere backend corriendo + `.env` con `VITE_API_URL`,
`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`):

1. Login con Supabase obtiene JWT y `GET /me` responde con Bearer.
2. Usuario `ADMIN` consume `/api/admin/*`; `SECRETARIA` solo lo permitido por UI;
   `ESTUDIANTE` ve módulos base; sin membresía cae en `/sin-membresia`.
3. Documentos cargan, filtran (incluida categoría real) y muestran versiones.
4. Playground funciona con texto; feedback registra.
5. Playground con voz: grabar/adjuntar audio, verificar placeholder `[Audio]` y
   reproducción de la respuesta; validar que el formato de grabación (webm/mp4)
   es aceptado por el STT del backend.
6. CRUD de categorías: alta/edición/desactivación desde "Gestionar categorías";
   la categoría aparece en el drawer del documento.
7. Deep-linking: `/documents/:id` y `/conversations/:id` abren el detalle; IDs
   inválidos redirigen al listado.
8. Change-plan en Billing: el selector lista planes alternativos (`GET /api/admin/plans`),
   excluye el actual y confirma el cambio; el historial registra el evento.
9. Drawer de conversaciones: `ContextViewer` muestra documentos recuperados de la
   última respuesta; `FeedbackBadge` refleja el `rating` por mensaje.
10. Analytics: los charts "Documentos más consultados" y "Distribución por categoría"
    muestran datos reales.
11. `404` de detalle muestra mensaje multi-tenant correcto.

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

--- Actualización 2026-09-20 (sincronización documental) ---
Estado de los pendientes del Ciclo 2:
- **Completado**: Stripe checkout/portal/webhooks (billing operativo); CRUD de categorías (backend + UI `CategoriesDialog`); métricas con filtros y series; config leída y editada en Settings; platform/institution productivos; voz en Playground (grabación + subida + reproducción); deep-linking de detalle; actividad reciente en Dashboard; `/terminos` con contenido; DashboardPage sin `role` legacy.
- **Sigue pendiente**: rate limiting, QA manual contra backend (incluida validación del formato de audio con el STT).

--- Actualización 2026-09-20b (features bloqueadas desbloqueadas) ---
- **Completado**: change-plan en Billing (backend `GET /api/admin/plans` + selector en `BillingPage`); contexto recuperado y feedback por mensaje en conversaciones (backend `sources`/`rating` en `MessageOut` + `ContextViewer`/`FeedbackBadge` en el drawer); charts de Analytics "Documentos más consultados" y "Distribución por categoría" con datos (`top_documents`/`documents_by_category` en `GET /api/admin/metrics`).
- Backend: 201 tests ✅; openapi.current.json regenerado con las 3 rutas/campos nuevos; `FRONTEND_API_INTEGRATION.md` actualizado.
- **Sigue pendiente (backend)**: moderación global de feedback, `PUT /me`, CRUD instituciones/planes, exportaciones, notificaciones/SMTP, rate limiting, QA manual.
- Docs sincronizadas: AGENTS.md, ESTADO_ACTUAL.md, app/README.md y Specs 06/07/08/09/10.

--- Actualización 2026-09-20c (cierre de contrato + hardening + CRUD platform en backend) ---
- **Completado (backend)**: `GET /api/admin/feedback` (moderación global paginada con filtros) · `PUT /me` (edición de perfil `full_name`) · tests de acceso platform-admin-sin-membresía (C1, 7 endpoints 403) · tests cross-tenant de rutas (C2, audit/config/categories/users/metrics/billing/audio/feedback) · rate limiting documentado (C3, in-memory por proceso) · CRUD de instituciones y planes en `/api/platform/*` (C4, soft-deactivate) · CI OpenAPI con artifact (C5).
- Backend: 230 tests ✅; `openapi.current.json` (49 rutas).
- **Sigue pendiente (dashboard)**: notificaciones/SMTP; QA manual contra backend.

--- Actualización 2026-09-20d (UI CRUD de instituciones/planes en Platform) ---
- **Completado**: `PlatformPage` con `InstitutionsDialog` y `PlansDialog` (CRUD sobre `/api/platform/institutions[/{id}]` y `/plans[/{id}]`): alta/edición/desactivación (soft) con RHF+Zod, `StatusBadge`, confirmación destructiva y toasts. Hooks `useCreate/Update/DeleteInstitution` y `useCreate/Update/DeletePlan` con invalidación de queries.
- Frontend: typecheck ✅ · lint ✅ · test 13/13 ✅ · build ✅.

--- Actualización 2026-09-20e (exportaciones CSV) ---
- **Completado**: endpoints `GET /api/admin/{audit,comprobantes,metrics}/export` (CSV) + helper `exportCsv` (blob) + botones en Audit, Billing (Comprobantes) y Analytics. Backend: 234 tests ✅.
- **Sigue pendiente (dashboard)**: QA manual contra backend.

--- Actualización 2026-09-20f (notificaciones/SMTP en backend) ---
- **Completado (backend)**: `GET/PUT /api/admin/smtp`, `GET /api/admin/notifications`, `POST /api/admin/notifications/send-test` (envío `smtplib`, plantillas `{{placeholder}}`, estados PENDING/SENT/FAILED, idempotencia). Backend: 241 tests ✅.
- **Sigue pendiente (dashboard)**: QA manual contra backend.

--- Actualización 2026-09-20g (diferidos del plan: notificaciones/UI/exports platform) ---
- **Completado**: triggers de notificación automática en el webhook Stripe (PAYMENT_SUCCESS/FAILED, SUBSCRIPTION_CANCELED/EXPIRED, PLAN_CHANGED) · CRUD de plantillas email (`/api/admin/email-templates`) · exportaciones de platform (`/api/platform/{audit,comprobantes,metrics}/export`) con botones en `PlatformPage` · UI de Correo/SMTP y Notificaciones en `SettingsPage`.
- **Completado (backlog backend)**: deprecación formal de `app_users.role` · RLS documentado (`docs/RLS.md`) · scripts de vencimiento y reproceso de eventos Stripe · tests de webhook + usuario inactivo · validación PDF en `upload_new_version` + magic-bytes + handler 500 · README backend.
- Backend: 264 tests ✅ · Frontend: typecheck/lint/test/build ✅.
- **Sigue pendiente (dashboard)**: QA manual contra backend.
