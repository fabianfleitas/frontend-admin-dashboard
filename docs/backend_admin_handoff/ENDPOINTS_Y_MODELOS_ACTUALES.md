# Endpoints y Modelos Actuales — Backend 2026-08-26

Fuente de verdad: `openapi.current.json` (regenerado 2026-08-26, 35 rutas, 50 schemas).

## Auth
- `Authorization: Bearer <jwt>` obligatorio
- Headers delegados `X-*` eliminados del contrato

## Admin institucional (`/api/admin/*`)
- `GET /api/admin/users` → `PaginatedResponse[UserOut]` (ahora con `nombre_institucion`, `tipo_miembro`)
- `GET /api/admin/metrics` → `MetricsOut` + filtros `desde/hasta/categoria_id/modelo/documento_id` + `series`
- `GET /api/admin/config` / `PUT /api/admin/config/{clave}` → `ConfigParamOut` / `ConfigParamIn`
- `GET /api/admin/subscription` → `SubscriptionOut`
- `GET /api/admin/plan` → `PlanOut`
- `GET /api/admin/pagos` → `PaginatedResponse[PagoOut]`
- `GET /api/admin/comprobantes` → `PaginatedResponse[ComprobanteOut]`
- `GET /api/admin/audit` → paginado `AuditLogOut`

## Platform (`/api/platform/*`)
- `GET /api/platform/institutions`, `GET .../{id}`, `GET .../{id}/members`
- `POST .../members` / `DELETE .../members/{member_id}`
- `GET /api/platform/users`, `metrics`, `audit`
- `GET /api/platform/plans`, `/subscriptions`, `/pagos`, `/comprobantes`

## Chat / Conversaciones / Voz
- `POST /api/chat/query`, `POST /api/chat/voice`, `GET /api/chat/audio/{audio_interaction_id}`
- `POST /api/chat/feedback`

## Modelos clave
- `UserOut`: `nombre_institucion`, `institucion_id`, `tipo_miembro`, `is_platform_admin`
- `MetricsOut`: `series[]` (`fecha`, `conversaciones`, `tokens_input/output`, `llm`, `guard`, `llm_failed`)
- `SubscriptionOut`: `plan` anidado (`PlanOut`), `estado`, fechas
- `PlanOut`: `features` (`dict` / `jsonb`)
