# Handoff Admin Dashboard — Backend Actual (2026-08-26)

**Fuente de verdad:** `openapi.current.json` (regenerado desde `app/main.py:update`), `FRONTEND_API_INTEGRATION.md` (backend repo).

Estado: BLOQUE 1-4 completado (auth, aislamiento, RAG, config, platform, billing lectura, metrics, docs). 150 tests pass / 0 fall. PII/Stripe/notificaciones rate-limiting pospuestos explícitamente.

## Endpoints clave para integración

**Auth / Sesión**
- `GET /me` → `UserOut` (ahora con `nombre_institucion`, `tipo_membro`, `is_platform_admin`, `institucion_id`)
- `GET /ready`, `GET /health`

**Admin institucional** (`Authorization: Bearer <jwt>`; `tipo_membro = ADMIN/SECRETARIA`; aislamiento `institucion_id`)
- `GET /api/admin/config` / `PUT /api/admin/config/{clave}` — lectura + edición institucional/global (`editable_desde_dashboard`)
- `GET /api/admin/users` — contexto completo de membresía (`nombre_institucion`)
- `GET /api/admin/metrics` — agregados + filtros (`desde/hasta/categoria_id/modelo/documento_id`) + `series`
- `GET /api/admin/audit` / `GET /api/admin/subscription` / `GET /api/admin/plan` / `GET /api/admin/pagos` / `GET /api/admin/comprobantes`
- `POST /api/admin/documents`, `GET /api/admin/documents/{id}`, `/versions`, `/reindex`
- `GET /api/admin/categories`

**Chat / Conversaciones / Voz**
- `POST /api/chat/query`, `POST /api/chat/voice`, `GET /api/chat/audio/{audio_interaction_id}`, `POST /api/chat/feedback`
- `GET /api/conversations/`, `POST /api/conversations/`, etc.

**Platform Admin** (`is_platform_admin = true`; sin requerir `institucion_id` para `/platform/*`; **bloqueado** para `/admin/*` sin membresía)
- `GET /api/platform/institutions` / `{id}` / `{id}/members`
- `POST /api/platform/institutions/{id}/members` / `DELETE .../members/{member_id}`
- `GET /api/platform/users`, `GET /api/platform/metrics`, `GET /api/platform/audit`
- `GET /api/platform/plans`, `/subscriptions`, `/pagos`, `/comprobantes`

**Errores**
- `401` JWT inválido/faltante; `403` sin membresía / no admin; `404` recurso de otra institución o inexistente; `400` uploads (PDF/size), config; `413` archivo grande; `422` validación; `500` internos.

## Estado de integración

- ✅ Auth JWT Bearer directo (headers `X-*` eliminados de contrato)
- ✅ Multiinstitución aislada (`institucion_id`, `institucion_miembros`)
- ✅ `username`/`UserOut` enriquecido para dashboard
- ✅ Config institucional (`config_parametros`) con edición controlada
- ✅ Métricas con filtros y series temporales
- ✅ Platform Admin (`/platform/*`) separado de `/admin/*`
- ✅ Billing lectura (`plan`, `subscription`, `pagos`, `comprobantes`): institucional + global
- ✅ Documents/versionado/reindexación con aislamiento
- ⏳ Stripe completo (checkout/webhooks/portal): pendiente, backend lectura listo
- ⏳ CRUD categorías; rate limiting; QA manual; PII/anónimo completo

## Archivo de referencia
- `openapi.current.json` (125KB) — export actualizado 2026-08-26.
- `FRONTEND_API_INTEGRATION.md` (repo backend) — contrato completo por endpoint.
