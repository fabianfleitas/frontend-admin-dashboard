# Auditoría Técnica del Proyecto - Checklist de Estado

**Instrucciones:** Complete cada punto con:
- ✅ Completado
- 🟡 Parcial (describir qué falta)
- ❌ No iniciado

---

## Estado estimado
- Frontend Dashboard: 70 %
- Documentación: 90 %

---

# 2. Arquitectura Frontend

## Bootstrap
- ✅ React + Vite — `app/vite.config.ts`, `app/package.json`
- ✅ TypeScript — `app/tsconfig.app.json` (strict)
- ✅ Tailwind CSS — `app/src/index.css` (Tailwind v4 vía `@theme`)
- ✅ React Router — `app/src/app/router.tsx`
- ✅ TanStack Query — `app/src/app/query-client.ts`
- ✅ Zustand — `app/src/stores/{auth,ui,toast}.store.ts`
- ✅ React Hook Form — `app/src/features/documents/components/UploadDialog.tsx`
- ✅ Zod — `app/src/features/documents/schemas/upload.schema.ts`
- 🟡 Shadcn/UI — No se instaló shadcn; se construyeron primitivas propias (`Button`, `Card`, `Drawer`, `Modal`, `Select`, `Skeleton`) en `app/src/components/`. Estética alineada al design system pero no es la librería shadcn.
- ✅ ESLint (oxlint reemplaza a ESLint) — `app/.oxlintrc.json`, `app/package.json`
- ✅ Prettier — `app/.prettierrc`, `app/package.json`
- ✅ Alias (@/) — `app/vite.config.ts`, `app/tsconfig.app.json`
- ✅ Variables de entorno — `app/.env.example`, lectura en `app/src/lib/http.ts` y `app/src/lib/supabase.ts`

## Layout
- ✅ Login — `app/src/features/auth/pages/LoginPage.tsx`
- 🟡 Protección de rutas — `app/src/components/common/ProtectedRoute.tsx` sólo valida `isAuthenticated`; NO gatea por rol.
- ✅ Sidebar (colapsable, 8 items) — `app/src/components/layout/Sidebar.tsx`
- ✅ Header (avatar + logout) — `app/src/components/layout/Header.tsx`
- ✅ Breadcrumb — `app/src/components/layout/Breadcrumb.tsx`
- 🟡 Layout responsive — Funciona en desktop; el sidebar No se oculta/adapta en `<sm` (sin nav móvil).
- ❌ Tema oscuro — `index.css` sólo define tema claro; `useUiStore` sólo maneja colapso del sidebar (sin toggle ni `prefers-color-scheme`).

---

# 3. Módulos del Dashboard

## Dashboard
- ✅ KPIs (8 MetricCards vía `useMetrics`) — `DashboardPage.tsx`, `MetricCard.tsx`
- ✅ Estado de servicios — `SystemStatus.tsx` + `useReady` (polling 30s)
- ❌ Actividad reciente — placeholder `EmptyState` "pendiente en backend (Nivel 2)" — `ActivityTimeline.tsx`
- ✅ Quick Actions (5 accesos) — `DashboardPage.tsx`
- ✅ Integración /ready — `dashboard.service.ts`
- ✅ Integración /metrics (ruta real `/api/admin/metrics`, sin filtros) — `dashboard.service.ts`

## Knowledge Base
- ✅ Listado — `DocumentsPage.tsx`, `DocumentsTable.tsx`
- ✅ Buscar (filtro en cliente sobre la página visible) — `DocumentsTable.tsx`
- 🟡 Filtros — Sólo por estado; el de categoría está marcado "pendiente backend" (no existe `/api/admin/categories`).
- ✅ Paginación — `DocumentsPage.tsx`, `Pagination.tsx`
- ✅ Upload (FormData + Zod + RHF, máx 25MB, PDF) — `UploadDialog.tsx`, `documents.service.ts`
- ✅ Nueva versión — `DocumentDrawer.tsx`, `useUploadVersion.ts`
- ✅ Reindexar (ruta real `POST /api/admin/reindex` con `documento_id` opcional) — `documents.service.ts`, `useReindex.ts`
- ❌ Activar versión — No existe endpoint ni UI para marcar una versión pasada como activa; `VersionTimeline.tsx` sólo muestra.
- ✅ Desactivar (DELETE soft-delete con confirmación Modal) — `DocumentDrawer.tsx`, `useDeactivateDocument.ts`
- ✅ Drawer — `DocumentDrawer.tsx`
- ✅ Timeline — `VersionTimeline.tsx`

## AI Agent / Playground
- ✅ Chat (mutación + mensaje optimista) — `PlaygroundPage.tsx`
- ❌ Historial — El playground guarda mensajes sólo en memoria; no carga ni lista conversaciones previas. No hay hook de historial.
- ❌ Markdown — `MessageBubble.tsx` usa `whitespace-pre-wrap` plano; no se importa `react-markdown`/`remark`/`rehype`.
- ✅ Feedback (thumbs → `POST /api/chat/feedback`) — `FeedbackButtons.tsx`, `useChatFeedback.ts`
- ✅ Contexto recuperado — `ContextPanel.tsx`, `RetrievedDocumentsTable.tsx`
- ✅ Documentos (document_id, page, score) — `RetrievedDocumentsTable.tsx`
- 🟡 Chunks — `SourceOut` sólo expone `document_id, document, page, similarity_score`; no se muestran chunks individuales.
- ❌ Prompt — `ContextPanel.tsx` muestra aviso "El prompt completo no es retornado por el backend (Nivel 2)".
- ✅ Tokens — `MetricsCard.tsx` (`tokens_input` / `tokens_output`)
- ✅ Latencia — `MetricsCard.tsx` (`tiempo_respuesta_ms`)
- 🟡 Audio — Existe `sendVoice` en `chat.service.ts` pero **no está integrado** en `PlaygroundPage.tsx` (aviso "Voz opcional no implementada en MVP").

## Conversations
- ✅ Listado — `ConversationsPage.tsx`, `ConversationsTable.tsx` (con `include_hidden`)
- ✅ Drawer — `ConversationDrawer.tsx`
- ✅ Mensajes — `MessageTimeline.tsx`
- 🟡 Feedback — Existe `FeedbackBadge.tsx` pero **no se usa** en la tabla (muestra "Nivel 2 — pendiente en backend"). Componente huérfano.
- 🟡 Fuentes utilizadas — Existe `ContextViewer.tsx` y `getConversationMessages` pero **no se integran** en `ConversationDrawer.tsx` (sólo messages + MetricsCard).

## Analytics
- ✅ KPIs (reutiliza `useMetrics`) — `AnalyticsPage.tsx`
- 🟡 Gráficos — `ChartLine`/`ChartBar` (Recharts) implementados pero se alimentan con arrays **vacíos hardcoded**; siempre se ve `EmptyState` "Nivel 2". — `AnalyticsPage.tsx`
- 🟡 Filtros — `FiltersPanel.tsx` construido y funcional en UI, pero etiquetado "no soportado por `/api/admin/metrics` todavía (Nivel 2)". Los filtros sólo afectan estado local, no la query.

## Audit
- ✅ Tabla (con score tones) — `AuditTable.tsx`
- ✅ Drawer — `AuditDrawer.tsx`
- ❌ Prompt — `AuditDrawer.tsx` declara "no incluye prompt, respuesta, usuario ni latencia".
- ❌ Respuesta — (ídem; enlaza a Conversations vía `mensaje_id`)
- ❌ Modelo — (ídem)
- ❌ Usuario — (ídem)
- ❌ Latencia — (ídem)
- Nota: `AuditLogOut` (`audit/types.ts`) refleja fielmente el delta spec-vs-OpenAPI.

## Users
- ✅ Listado — `UsersPage.tsx`, `UsersTable.tsx`
- ❌ Detalle — No hay drawer/modal ni ruta `/users/:id`; `UsersTable.tsx` no tiene `onSelect`.
- 🟡 Roles — `RoleBadge.tsx` pinta el rol, pero **no hay gestión** (crear/editar/asignar). `UsersPage.tsx` lo declara "Nivel 2".

## Settings
- ❌ Configuración IA — `PendingBlock` "Modelo LLM" + "Embedding Model" — `SettingsPage.tsx`
- ❌ Storage — `PendingBlock` — `SettingsPage.tsx`
- ❌ Vector Store — `PendingBlock` — `SettingsPage.tsx`
- ✅ Estado del sistema — `SettingsPage.tsx` muestra info de `/ready` + `/metrics` y agregados.

---

# 4. Integración Frontend
- ✅ Cliente HTTP — `app/src/lib/http.ts` (get/post/put/patch/delete, multipart, query)
- 🟡 Interceptores — Sólo interceptor de request (headers delegados en `getAuthHeaders`). **No hay** interceptor de respuesta (401 → logout, normalización de errores, refresh).
- 🟡 Manejo global de errores — `ApiError` lanzado en `http.ts`, pero cada página lo captura manualmente con `ErrorState` y toast. **No hay `ErrorBoundary`** ni callback global de error en `queryClient`.
- ✅ TanStack Query (queries) — `useQuery` en dashboard/documents/conversations/audit/users
- ✅ TanStack Query (mutations) — 7 hooks (upload, reindex, deactivate, createConversation, chatQuery, chatFeedback, hide)
- ✅ Invalidación de caché — `onSuccess` invalida claves relevantes en cada mutación (`useReindex.ts`, `useChatQuery.ts`, etc.)
- ✅ Toasts — store Zustand + `<Toaster/>` montado en `app/providers.tsx`
- 🟡 ConfirmDialog — No existe componente reutilizable; las confirmaciones se construyen inline con `<Modal>` (`DocumentDrawer.tsx`, `ConversationDrawer.tsx`).
- 🟡 Loading global — Existe `PageLoader` por Suspense (`router.tsx`) y `Skeleton` por página. No hay barra de progreso global ni `OverlayLoader`.

---

# 5. Componentes reutilizables
- ❌ DataTable — `app/src/components/tables/` **vacío**. Cada feature implementa su propia `<*Table>` (Documents, Conversations, Audit, Users).
- ✅ SearchBar — `app/src/components/common/SearchBar.tsx`
- 🟡 Filters — Existe `FiltersPanel` sólo en analytics; no hay `Filters` compartido. — `features/analytics/components/FiltersPanel.tsx`
- ✅ Drawer — `app/src/components/common/Drawer.tsx`
- ✅ Modal — `app/src/components/common/Modal.tsx`
- ❌ ConfirmDialog — No existe como componente (0 ocurrencias); inline `Modal` en su lugar.
- ✅ StatusBadge — `app/src/features/dashboard/components/StatusBadge.tsx` (vía `DocumentStatusBadge`)
- ✅ MetricCard — `app/src/features/dashboard/components/MetricCard.tsx`
- ✅ EmptyState — `app/src/components/feedback/EmptyState.tsx`
- ✅ Skeleton — `app/src/components/feedback/Skeleton.tsx`
- 🟡 Loader — `PageLoader` en `router.tsx` (texto plano, sin spinner). Sin `Loader` global exportado.
- ✅ Pagination — `app/src/components/common/Pagination.tsx`

Otros primitivos reutilizables presentes: `Button`, `Card`, `SectionTitle`, `Select` (forms), `PagePlaceholder` (sin uso actual).

---

# 6. UX
- 🟡 Responsive — Grillas `sm:`/`lg:`/`xl:` y tablas `overflow-x-auto`. Pero sidebar fijo y `max-w-*` en drawer/modal pueden overflow en móvil; sin nav móvil dedicado.
- ✅ Loading — Skeletons por página, `animate-spin`, `isPending` text
- ✅ Empty — `EmptyState` con icon/title/description/action
- 🟡 Error — `ErrorState` con `onRetry` en cada query; errores de mutación sólo por toast. **Sin `ErrorBoundary`** de React (crash de render no capturado).
- 🟡 Accesibilidad — Buen uso de `aria-label`/`aria-hidden`/`role="status"`, focus-visible en `index.css`, `aria-modal` en Drawers/Modals. Faltan: skip-link, focus-trap en Drawer/Modal.
- ✅ Consistencia visual — Design tokens unificados vía `@theme` en `index.css`; `MetricCard`/`Card`/`SectionTitle` en todas las páginas.

---

# 7. Backend
> El backend (FastAPI `backend-agent-system`) vive en otro repositorio. Esta sección se evalúa desde la **perspectiva de integración/exposición consumida por la SPA**.

## Gestión documental
- ✅ Upload — `documents.service.ts` (`uploadDocument`)
- ✅ Versionado — `documents.service.ts` (`uploadVersion`), `VersionTimeline.tsx`
- ✅ Reindex — `documents.service.ts` (`reindex`, ruta real `POST /api/admin/reindex`)
- ✅ Auditoría — Módulo `features/audit` consume `GET /api/admin/audit-logs`

## Chat
- ✅ Texto — `chat.service.ts` (`sendChat`)
- 🟡 Voz — `sendVoice` existe en el servicio pero no se integra en la UI (MVP opcional).
- ✅ Feedback — `chat.service.ts` (`sendFeedback`)

## Conversations
- ✅ CRUD (listar/ocultar) — `conversations.service.ts`
- ✅ Mensajes — `getConversationMessages`

## Analytics
- ✅ Métricas — `GET /api/admin/metrics` (sin filtros todavía)

## Usuarios
- ✅ Auth — Vía Supabase (no backend delegado)
- 🟡 Roles — Backend gestiona roles; el frontend sólo los muestra, no gestiona.

---

# 10. Seguridad
- ✅ Supabase Auth — `app/src/lib/supabase.ts` (persist/autoRefresh/detectSessionInUrl), `useSession`
- ✅ Login Google — `signInWithOAuth({provider:'google'})` → `/dashboard` — `auth.service.ts`, `LoginPage.tsx`
- 🟡 RBAC — Se inyecta la cabecera `X-User-Type` (default `ADMIN`) en cada request (`http.ts`), pero **NO hay gateo de rutas/UI por rol**; `ProtectedRoute` sólo verifica `isAuthenticated` y el sidebar muestra todos los items a cualquier usuario logueado.
- ✅ Protección API — Cabeceras delegadas (`X-External-Auth-Id`, `X-Auth-Provider`, `X-User-Type`, `X-User-Email`) inyectadas en cada llamada — `app/src/lib/http.ts`
- 🟡 Logs — Frontend sólo `console.warn` ante config faltante. No hay telemetría/Sentry. Auditoría real delegada al backend vía módulo Audit.

---

# 13. Riesgos y bloqueos

- **Bloqueos actuales (todos de backend, ya documentados en `AGENTS.md`):**
  1. `/api/admin/categories` inexistente → filtros y upload de categoría limitados.
  2. `/api/admin/metrics` no soporta filtros ni series temporales → Analytics "Nivel 2", gráficos siempre vacíos.
  3. `AuditLogOut` sin prompt/respuesta/usuario/latencia → Audit Drawer limitado a scores.
  4. Endpoint de actividad reciente no implementado → Dashboard placeholder.
  5. Bloques Settings (LLM/Embedding/Storage/Vector) sin endpoint.
  6. `ConversationDetailOut` no retorna fuentes usadas ni feedback por mensaje.

- **Decisiones pendientes:**
  - Markdown real en chat (¿`react-markdown`/`remark`?) vs. texto plano.
  - ¿Implementar voz (`POST /api/chat/voice`) en MVP o posponer?
  - Primitivas propias vs. adopción real de shadcn/ui.
  - Política RBAC frontend: ¿rol desde `user.app_metadata.role` o endpoint `/me`?

- **Deuda técnica:**
  - **Sin `ErrorBoundary` global** → un error de render en página lazy rompe la app sin recuperación.
  - **`DataTable`/`ConfirmDialog`/`Filters` compartidos inexistentes** → cada tabla duplica clínica (loading/empty/error/search).
  - **Componentes huérfanos**: `FeedbackBadge.tsx`, `ContextViewer.tsx`, `getConversationMessages()`, `sendVoice()`, `PagePlaceholder.tsx` — definidos pero sin uso.
  - **`useChatQuery`** invalida `['conversation', data.conversation_id]` pero el chat no usa `useConversation`; invalida inútil.
  - **Búsqueda/filtro 100% client-side** sobre la página actual (Documents/Conversations/Audit/Users) → con paginación server-side el usuario sólo filtra la página visible. UX engañoso.
  - **No logout automático en 401** — `http.ts` lanza `ApiError` pero nada redirige a `/login`.
  - **No hay tema oscuro** a pesar de aparecer en checklist y Design Brief.
  - **Sidebar no responsive móvil** (sin overlay en `<sm`).
  - **Reindex/Deactivate** no invalida `['metrics']` en `useUploadDocument.ts` → dashboard puede desincronizarse tras upload.

- **Riesgos conocidos:**
  - Variables de entorno vacías producen `console.warn` pero la app degrada silenciosamente (cliente Supabase con URL/key vacía) y el login falla en runtime con error genérico.
  - `rol_mensaje` es `string` en tipos pero discriminatorio — comparaciones sueltas con `'assistant'`/`'user'`.
  - `vite.config.ts` usa `manualChunks` bajo `rolldownOptions` (Vite 8/rolldown): verificar compatibilidad futura.

---

# 14. Próximas prioridades
1. **`ErrorBoundary` global** + callback de error de `QueryClient` que dispare `toast.error` y manejo de 401 (redirigir a `/login`).
2. **Refactor de tablas**: extraer `DataTable<T>` genérico a `components/tables/` unificando loading/empty/error/search/paginación; consolidar `ConfirmDialog` reutilizable.
3. **RBAC frontend**: leer rol del usuario (Supabase `app_metadata` o endpoint `/me`) y gatear rutas/menu (`ProtectedRoute` con `requiredRoles`); ocultar QuickActions de Administrador para Staff/Student.
4. **Cerrar huecos parciales críticos**: (a) historial del Playground (cargar conversaciones previas vía `useConversations` + selector); (b) Markdown en `MessageBubble` (`react-markdown` + `rehype-sanitize`); (c) integrar `FeedbackBadge` y `ContextViewer` en `ConversationDrawer`; (d) Actividad reciente cuando backend lo exponga.
5. **UX responsive y tema oscuro**: drawer móvil del sidebar + validación de breakpoints; implementar tema oscuro con `prefers-color-scheme` + toggle en el Header (state en `ui.store.ts`).