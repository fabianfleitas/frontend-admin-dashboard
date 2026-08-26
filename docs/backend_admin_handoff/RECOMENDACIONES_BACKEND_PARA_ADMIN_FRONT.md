# Recomendaciones Backend Para Facilitar El Admin Front

## Alta prioridad

- Publicar un OpenAPI oficial actualizado y versionado en el repo.
- Sincronizar `FRONTEND_API_INTEGRATION.md`, README y cualquier spec antigua con el contrato real.
- Exponer endpoints `/api/platform/*` si el objetivo inmediato es soportar superadmin.
- Definir endpoints de billing antes de pedir implementación productiva de Stripe en el front.

## Usuarios y permisos

- Hacer que `GET /api/admin/users` devuelva:
  - `full_name`
  - `institucion_id`
  - `tipo_miembro`
  - `is_platform_admin`
  - idealmente `nombre_institucion`
- Considerar un endpoint específico de contexto de sesión para admin front si van a crecer los roles.

## Settings

- Exponer lectura de `config_parametros` por institución.
- Separar claramente parámetros editables vs solo observables.
- No mezclar secrets sensibles con configuración apta para dashboard.

## Billing y plataforma

- Crear endpoints para:
  - institución actual
  - plan actual
  - suscripción actual
  - historial de pagos
  - comprobantes
  - portal Stripe / checkout
- Si habrá `platform_admin`, separar completamente esos endpoints de `/api/admin/*`.

## Analytics

- Si el módulo va a crecer, agregar:
  - filtros por periodo
  - agregación por documento
  - agregación por categoría
  - agregación por modelo
  - series temporales

## Consistencia documental

- Eliminar deltas obsoletos en specs del frontend.
- Marcar explícitamente qué partes son:
  - implementadas
  - parciales
  - futuras

## Recomendación operativa

- Mantener este handoff como artefacto vivo mientras el admin front se adapta.
- Cada cambio contractual backend debería actualizar:
  - `openapi.current.json`
  - `FRONTEND_API_INTEGRATION.md`
  - este paquete de handoff
