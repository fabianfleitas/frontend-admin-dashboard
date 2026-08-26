# Checklist De Ajuste Para Admin Front

Fecha base: 2026-08-25

## Fase 1. Integración obligatoria

- Reemplazar auth delegada por `Authorization: Bearer <jwt>` en todas las llamadas al backend.
- Eliminar dependencia funcional de headers `X-External-Auth-Id`, `X-User-Type`, `X-Auth-Provider`, `X-User-Email`.
- Validar que `/me` sea la fuente de verdad para sesión de UI.
- Actualizar tipos de `UserOut`, `MetricsOut`, `CategoryOut`, `ChatVoiceOut` y respuestas paginadas.
- Sustituir el `openapi.json` viejo del front por `openapi.current.json`.

## Fase 2. Roles y navegación

- Cambiar guards y visibilidad de menú para usar `tipo_miembro` e `is_platform_admin`.
- Tratar `role` como compatibilidad legacy, no como fuente principal de permisos.
- Soportar estos escenarios:
  - miembro institucional `ADMIN`
  - miembro institucional `SECRETARIA`
  - miembro institucional `ESTUDIANTE`
  - `platform_admin`
  - usuario autenticado sin membresía institucional activa
- Definir UX para `403 Institution membership required`.

## Fase 3. Módulos ya consumibles

- Dashboard: mantener KPIs actuales y ampliar tipado de métricas.
- Knowledge Base: integrar categorías reales desde `GET /api/admin/categories`.
- Conversations: mantener flujo actual; contrato real ya es válido.
- Audit: mantener vista actual; enlazar más fuerte hacia Conversations por `mensaje_id`.
- Users: ampliar columnas para membresía e institución cuando backend lo devuelva completo.
- Settings: dejar modo solo lectura, pero con textos alineados a `config_parametros` y realidad backend.

## Fase 4. Ajustes de UX por multi-institución

- Mostrar institución activa del usuario en header o contexto de sesión.
- Aclarar en la UI que el aislamiento es por institución.
- Manejar `404` como posible recurso de otra institución, no solo “no existe”.
- Evitar mensajes de error que contradigan el modelo multi-tenant.

## Fase 5. Trabajo preparatorio para módulos futuros

- Diseñar estructura de rutas y navegación para:
  - institución
  - suscripción
  - pagos
  - comprobantes
  - configuración institucional
  - platform admin
- No conectar esos módulos a producción hasta tener endpoints reales.

## Validaciones funcionales mínimas antes de pasar a QA

- Login con Supabase obtiene JWT y el backend acepta `/me`.
- Un usuario `ADMIN` puede consumir `/api/admin/*`.
- Un usuario `SECRETARIA` puede consumir `/api/admin/*` permitidos por UI.
- Un usuario sin membresía no entra a módulos administrativos.
- Documentos cargan, filtran y muestran categorías reales.
- Playground continúa funcionando con texto.
- Voice queda marcada como opcional mientras no se implemente UX completa.
- Dashboard y Analytics no prometen filtros no soportados por backend.

## Bloqueadores backend a vigilar

- Billing Stripe aún sin endpoints operativos.
- `/api/platform/*` todavía no expuesto en router público actual.
- `/api/admin/users` hoy devuelve poco contexto de membresía.
- Settings aún no tiene endpoints para edición/lectura completa de `config_parametros`.
