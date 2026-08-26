# Plan Archivo Por Archivo Para `admin-dashboard`

Este plan referencia archivos del frontend que deberían ajustarse primero.

## Capa base

### `app/src/lib/http.ts`

- Enviar `Authorization: Bearer <jwt>` usando la sesión de Supabase.
- Dejar de construir headers `X-*`.
- Mantener manejo centralizado de `401`.
- Preparar soporte para endpoints que respondan `blob` en audio.

### `app/src/lib/roles.ts`

- Quitar lógica orientada a `X-User-Type`.
- Reemplazar por helpers de UI:
  - `isInstitutionAdmin`
  - `isStaffMember`
  - `isPlatformAdmin`
  - `hasInstitutionMembership`

### `app/src/features/auth/api/auth.service.ts`

- Mantener `getMe()` como bootstrap de perfil.
- Verificar que el redirect post-login apunte a una ruta válida del dashboard.

### `app/src/features/auth/hooks/useMe.ts`

- Guardar en store un perfil ampliado con:
  - `full_name`
  - `institucion_id`
  - `tipo_miembro`
  - `is_platform_admin`
- Exponer helpers derivados para guards.

### `app/src/stores/auth.store.ts`

- Mantener `user` y `profile`.
- Considerar flags derivados:
  - `hasInstitutionMembership`
  - `isPlatformAdmin`
  - `memberType`

## Navegación y guards

### `app/src/components/common/ProtectedRoute.tsx`

- Dejar de depender solo de `role`.
- Diferenciar:
  - autenticado
  - autenticado sin membresía
  - autenticado con membresía insuficiente
  - platform admin
- Evitar falsos positivos si `role` legacy no coincide con membresía real.

### `app/src/components/layout/Sidebar.tsx`

- Filtrar ítems por `tipo_miembro` e `is_platform_admin`.
- Preparar slots futuros para:
  - Billing
  - Institución
  - Platform

### `app/src/app/router.tsx`

- Revisar guards por ruta.
- Mantener módulos actuales.
- Preparar grupos de rutas para módulos institucionales y de plataforma.

## Tipos

### `app/src/features/users/types.ts`

- Ampliar `UserOut` para incluir:
  - `full_name`
  - `institucion_id`
  - `tipo_miembro`
  - `is_platform_admin`

### `app/src/features/dashboard/types.ts`

- Ampliar `MetricsOut` con campos ya soportados por backend:
  - `total_llm_responses`
  - `total_guard`
  - `total_llm_failed`
  - `guard_rate`
  - `llm_failed_rate`
  - `total_tokens_input`
  - `total_tokens_output`
  - `tokens_by_model`
  - `avg_retrieval_similarity`
  - `total_voice_queries`
  - `total_text_queries`
  - `avg_response_time_voice`
  - `avg_response_time_text`

### `app/src/features/chat/types.ts`

- Agregar tipo explícito para `ChatVoiceOut`.
- Mantener `MessageOut` alineado a `USER` / `ASSISTANT` del backend.

### `app/src/features/documents/types.ts`

- Mantener `activo` separado del `status` de la versión.
- Agregar tipos para categorías.

### `app/src/features/audit/types.ts`

- Puede quedarse casi igual.
- Añadir notas o tipos auxiliares para enlazar a conversación/mensaje.

## Servicios por feature

### `app/src/features/dashboard/api/dashboard.service.ts`

- Mantener `GET /ready` y `GET /api/admin/metrics`.
- Ajustar consumidores para nuevos campos.

### `app/src/features/documents/api/documents.service.ts`

- Agregar `listCategories() -> GET /api/admin/categories`.
- Usar categorías reales para filtros y formularios.

### `app/src/features/conversations/api/conversations.service.ts`

- Mantener endpoints actuales.
- Confirmar que el trailing slash siga consistente con el backend actual exportado.

### `app/src/features/chat/api/chat.service.ts`

- Mantener `query` y `feedback`.
- Añadir helper formal para audio si van a implementar voz:
  - `POST /api/chat/voice`
  - `GET /api/chat/audio/{audio_interaction_id}`

### `app/src/features/users/api/users.service.ts`

- Mantener `GET /api/admin/users`.
- Preparar consumo de campos ampliados cuando backend los entregue.

## Páginas

### `app/src/features/dashboard/pages/DashboardPage.tsx`

- Seguir usando KPIs actuales.
- Mostrar nuevos KPIs IA solo si aportan valor visual claro.

### `app/src/features/documents/pages/DocumentsPage.tsx`

- Activar filtro real por categoría.
- Mantener filtro de `INACTIVE` separado del `status` de versión.

### `app/src/features/chat/pages/PlaygroundPage.tsx`

- Mantener MVP texto.
- Si agregan voz, usar `ChatVoiceOut` real y reproducir audio de respuesta.

### `app/src/features/conversations/pages/ConversationsPage.tsx`

- Mantener comportamiento actual.
- Añadir contexto institucional solo si mejora soporte/operación.

### `app/src/features/audit/pages/AuditPage.tsx`

- Mantener tabla actual.
- Mejorar navegación hacia conversaciones asociadas.

### `app/src/features/users/pages/UsersPage.tsx`

- Mostrar membresía e institución si el backend la expone.
- Separar visualmente `platform_admin` de admin institucional.

### `app/src/features/settings/pages/SettingsPage.tsx`

- Mantener modo solo lectura.
- Ajustar copies para reflejar:
  - backend multi-institución
  - `config_parametros` existe en DB
  - endpoints de settings aún faltan

## Documentación del frontend

### `AGENTS.md`

- Actualizar fuente de verdad de auth a JWT Supabase.
- Marcar `documentacion/openapi.json` como obsoleto si se mantiene en el repo.

### `documentacion/openapi.json`

- Reemplazar por el contrato actual generado desde backend o incorporar `openapi.current.json`.

## Módulos futuros a dejar preparados

- `features/billing/`
- `features/institution/`
- `features/platform/`

No implementarlos como productivos hasta que backend publique endpoints reales.
