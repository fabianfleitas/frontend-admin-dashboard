# Plan Siguiente Ciclo Backend

Fecha de elaboración: 2026-08-25

Este documento traduce `RECOMENDACIONES_BACKEND_PARA_ADMIN_FRONT.md` y los
"Bloqueadores backend a vigilar" de `CHECKLIST_ADMIN_FRONT.md` a un backlog
priorizado y accionable para el equipo backend (`backend-agent-system`, repo externo).

El front ya está alineado al contrato actual (`openapi.current.json`). Cada ítem
indica qué desbloquea en el admin front y cómo se valida desde el frontend.

## Prioridad Alta

### 1. OpenAPI oficial versionado

- Publicar `openapi.current.json` (o equivalente) generado automáticamente en CI,
  versionado y accesible desde el repo backend.
- Mantener sincronizados: `FRONTEND_API_INTEGRATION.md`, README y este handoff.

**Validación front**: diff del spec export vs `docs/backend_admin_handoff/openapi.current.json`.

### 2. Exponer `/api/platform/*`

- Router público actual no incluye los endpoints de superadmin.
- Necesario para productivizar `features/platform/` (hoy placeholder con guard `platform`).

**Validación front**: la página Platform consume el primer endpoint publicado; el guard
`is_platform_admin` de `GET /me` ya está implementado.

### 3. Endpoints de billing / Stripe

Definir y publicar contratos para:

- institución actual (nombre, plan, estado)
- plan actual + suscripción actual
- historial de pagos (paginado)
- comprobantes (listado + descarga)
- portal Stripe / checkout

Las tablas (`planes`, `suscripciones`, `suscripcion_historial`, `pagos`,
`comprobantes`, `stripe_eventos`) ya están modeladas en DB.

**Validación front**: productivizar `features/billing/` (hoy placeholder con guard
`admin`). El front ya maneja paginación `{items, pagination}` y blobs para descargas.

## Prioridad Media

### 4. Ampliar `GET /api/admin/users`

Devolver contexto completo de membresía por usuario:

- `full_name`
- `institucion_id`
- `tipo_miembro`
- `is_platform_admin`
- idealmente `nombre_institucion`

**Validación front**: `UsersPage/UsersTable` ya renderizan estas columnas de forma
defensiva (muestran "—" si el backend aún no las envía); al publicar los campos se
llenan sin cambios adicionales salvo `nombre_institucion`.

### 5. Lectura de settings sobre `config_parametros`

- Endpoint de lectura por institución.
- Separar parámetros editables vs solo observables.
- No exponer secrets.

**Validación front**: reemplazar los `PendingBlock` de `SettingsPage` por datos reales;
la UI ya está en modo solo lectura con copies alineados a `config_parametros`.

## Prioridad Baja (Nivel 2)

### 6. Filtros y series para Analytics

- `GET /api/admin/metrics` hoy no soporta filtros (periodo/categoría/modelo/documento).
- Agregar agregaciones por documento, categoría y modelo, y series temporales.

**Validación front**: `FiltersPanel` marca los filtros como "Nivel 2"; las series de
`AnalyticsPage` están vacías esperando el contrato. Al publicarlo, conectar filtros
reales y charts (`ChartLine`/`ChartBar`).

### 7. CRUD de categorías

- `GET /api/admin/categories` existe (paginado); falta crear/editar/desactivar.

**Validación front**: hoy el front solo lista y filtra client-side; un CRUD habilitaría
gestión completa en Knowledge Base.

## Consistencia documental (transversal)

- Cada cambio contractual debe actualizar: `openapi.current.json`,
  `FRONTEND_API_INTEGRATION.md` y este paquete de handoff.
- Marcar explícitamente qué partes son implementadas / parciales / futuras.

## Estado actual del front (referencia)

Al cierre de este ciclo frontend ya se completaron las Fases 1–5 del
`CHECKLIST_ADMIN_FRONT.md`: auth JWT Bearer, permisos por `tipo_miembro` +
`is_platform_admin`, UX `/sin-membresia`, categorías reales, Métricas IA,
multi-tenant 404, placeholders de billing/institution/platform y tests Vitest
de helpers puros.
