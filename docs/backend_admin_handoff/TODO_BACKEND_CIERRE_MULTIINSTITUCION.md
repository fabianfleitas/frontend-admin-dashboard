# TODO Backend — Cierre de arquitectura multiinstitución

**Proyecto:** Sistema de atención por agentes de voz con arquitectura RAG y capa de privacidad  
**Fecha:** 2026-08-25

## Objetivo

Cerrar el backend antes de la productivización final del Admin Dashboard, contemplando:

- autenticación JWT
- multiinstitución
- aislamiento y RLS
- RAG
- anonimización PII
- configuración institucional
- Platform Admin
- billing/Stripe
- métricas
- OpenAPI
- tests y QA

---

# 1. Auth y autorización

- [x] Backend autenticado mediante JWT de Supabase.
- [x] `Authorization: Bearer <jwt>`.
- [x] No depender de headers `X-*` antiguos.
- [x] `institucion_miembros.tipo_miembro` como fuente principal de permisos institucionales.
- [x] `platform_admins.is_active` para permisos de plataforma.
- [x] `app_users.role` queda como legacy/compatibilidad.
- [x] Revisar que ningún endpoint nuevo use `app_users.role` como fuente autoritativa.
- [ ] Documentar formalmente la deprecación de `app_users.role`.

### Regla de pertenencia

**Decisión:** un usuario no debe pertenecer a varias instituciones.

- [ ] Verificar la regla en service/repository.
- [ ] Impedir nuevas membresías múltiples.
- [ ] Definir tratamiento de datos históricos que la incumplan.
- [ ] Agregar test específico.

### Platform Admin

- [ ] Platform admin sin institución → solo `/platform/*`.
- [ ] Para `/admin/*` debe tener membresía institucional válida.
- [ ] Revisar todos los endpoints con estas reglas.
- [ ] Agregar tests.

---

# 2. Aislamiento multiinstitución

**Decisión:** repositories/services + RLS como defensa adicional. No agregar `institucion_id` redundante a tablas transitivas.

- [x] `documento_versiones` → `documentos`.
- [x] `document_chunks` → `documento_versiones` → `documentos`.
- [x] `document_embeddings` → `document_chunks` → `documento_versiones` → `documentos`.
- [x] `mensajes` → `conversaciones`.
- [x] `message_documents` → `mensajes` → `conversaciones`.
- [ ] Revisar cada repository con criterio de tenant isolation.
- [ ] Revisar `SELECT`.
- [ ] Revisar `INSERT`.
- [ ] Revisar `UPDATE`.
- [ ] Revisar `DELETE`.
- [ ] Verificar que ningún `get_by_id()` permita recuperar recursos de otra institución.

### Respuesta cross-tenant

**Decisión:** usar `404` cuando revelar la existencia del recurso pueda romper el aislamiento.

- [ ] Documentos.
- [ ] Versiones/chunks/embeddings.
- [ ] Conversaciones/mensajes.
- [ ] Usuarios.
- [ ] Billing.
- [ ] Tests de `404` cross-tenant.

---

# 3. RLS

- [x] RLS habilitado en tablas principales.
- [x] Policies existentes.
- [x] Helper functions existentes.
- [x] `force_rls = false` documentado.
- [ ] Revisar policies actuales.
- [ ] Revisar `SECURITY DEFINER`.
- [ ] Revisar `search_path`.
- [ ] Confirmar que no existan policies excesivamente permisivas.
- [ ] Documentar que el backend usa `service_role` y que su aislamiento principal está en application layer.
- [ ] Mantener RLS como defensa para accesos que no utilicen `service_role`.

---

# 4. RAG / Knowledge Base

## Ingesta

- [x] Extracción de texto.
- [x] Chunking.
- [x] Embeddings.
- [x] Persistencia en `document_chunks`.
- [x] Persistencia en `document_embeddings`.
- [x] Reindexación funcional para documentos indexados.

## Multiinstitución

- [ ] Confirmar que retrieval nunca mezcle instituciones.
- [ ] Aplicar filtro institucional en retrieval.
- [ ] Verificar `match_document_chunks()` y funciones equivalentes.
- [ ] Probar documento A vs documento B.
- [ ] Probar usuario A intentando consultar conocimiento de B.

## Estados

Validar:

`PENDING → PROCESSING → READY`

y:

`PROCESSING → ERROR`

- [ ] `READY` implica realmente chunks + embeddings.
- [ ] Actualizar `total_chunks`.
- [ ] Actualizar `total_embeddings`.
- [ ] Registrar `embedding_model`.
- [ ] Registrar `indexed_at`.
- [ ] Registrar `error_message`.
- [ ] No marcar `READY` solo cambiando el status.

---

# 5. PII / Anonimización

- [ ] Revisar pipeline `audio/text → detección PII → anonimización → RAG/LLM`.
- [ ] Determinar exactamente qué datos llegan al LLM.
- [ ] Determinar qué datos se almacenan.
- [ ] Revisar `pii_mappings`.
- [ ] Evitar PII real en logs.
- [ ] Evitar PII innecesaria en auditoría.
- [ ] Revisar persistencia de mensajes.
- [ ] Definir retención/borrado de mappings.
- [ ] Tests de anonimización.
- [ ] Test que confirme que el LLM recibe texto anonimizado cuando corresponde.

### Criterio de cierre

Debe poder demostrarse que la información identificable del usuario no se envía al proveedor LLM cuando la política de privacidad exige anonimización.

---

# 6. Chat, conversaciones y voz

### Mensajes

**Decisión:** validar en service cargando/validando primero la conversación.

- [x] Confirmar implementación.
- [x] Verificar ownership de conversación.
- [x] Verificar acceso a mensajes.
- [ ] Verificar `message_documents`.
- [ ] Tests cross-tenant.

### Voz

- [ ] Revisar `POST /api/chat/voice`.
- [x] Confirmar STT.
- [ ] Confirmar anonimización.
- [ ] Confirmar persistencia de audio según política.
- [x] Confirmar TTS.
- [ ] Confirmar `GET /api/chat/audio/{audio_interaction_id}`.
- [ ] Revisar aislamiento de audio.

---

# 7. Auditoría

- [x] Endpoint de auditoría.
- [x] RLS de auditoría.
- [ ] Confirmar institución correcta en cada evento.
- [ ] Confirmar actor autenticado.
- [ ] Evitar PII innecesaria.
- [ ] Confirmar aislamiento institucional.
- [ ] Revisar relación `message_documents` → auditoría.

---

# 8. Usuarios y membresías

- [x] `GET /api/admin/users`.
- [ ] Completar `full_name`.
- [ ] Completar `institucion_id`.
- [ ] Completar `tipo_miembro`.
- [ ] Completar `is_platform_admin`.
- [ ] Incluir `nombre_institucion` si corresponde.
- [ ] ADMIN solo ve usuarios de su institución.
- [ ] Platform admin ve el alcance permitido.
- [ ] Usuario sin membresía correctamente bloqueado.
- [ ] Membresía inactiva correctamente bloqueada.
- [ ] Impedir membresía simultánea en varias instituciones.

---

# 9. `config_parametros`

La tabla ya fue creada.

- [x] Tabla creada.
- [x] RLS definitivo.
- [ ] Repository.
- [ ] Service.
- [ ] GET por institución.
- [ ] UPDATE/PUT para parámetros editables.
- [ ] Separar parámetros globales de institucionales.
- [ ] Validar tipos: `float`, `int`, `bool`, `string`, `json`.
- [ ] Validar conversión de `valor`.
- [ ] Respetar `editable_desde_dashboard`.
- [ ] Ignorar `activo = false`.
- [ ] Definir precedencia: institucional > global/default.
- [ ] Impedir que una institución modifique parámetros globales.
- [ ] Auditar cambios.
- [ ] Documentar parámetros soportados.

---

# 10. Billing / Stripe

## Alcance inicial

Primero modelo + repositories + endpoints de lectura. La integración Stripe completa puede quedar como siguiente subfase si aún no están disponibles las credenciales/contratos necesarios.

## Tablas

- [ ] `planes`
- [ ] `suscripciones`
- [ ] `suscripcion_historial`
- [ ] `pagos`
- [ ] `comprobantes`
- [x] `stripe_eventos`
- [x] Checkout Session (`stripe/checkout`)
- [x] Subscription read (`stripe/subscription`), create/cancel/reactivate/change-plan, portal, sync-plan
- [x] Webhook (`/api/billing/stripe/webhook`) con persistencia real (`pagos`, `comprobantes`, `suscripciones`)
- [x] Aligned DB checks (`003_billing_estado_checks.sql`)
- [ ] Persistencia completa del webhook verificada con checkout pagado (próximo paso opcional)
- [ ] `notificaciones`
- [ ] `configuracion_smtp`
- [ ] `plantillas_email`

## Backend

- [ ] Repositories.
- [ ] Services.
- [ ] Endpoints de lectura.
- [ ] Planes.
- [ ] Suscripciones.
- [ ] Estado de suscripción.
- [ ] Pagos.
- [ ] Comprobantes.
- [ ] Portal de facturación.

## Stripe completo

- [ ] Checkout Session.
- [ ] Webhooks.
- [ ] Validación de firma.
- [ ] Idempotencia.
- [ ] Reintentos.
- [ ] Sincronización de estados.
- [ ] Cancelación.
- [ ] Cambio de plan.
- [ ] Renovación.
- [ ] Vencimiento.
- [ ] Facturación/comprobantes.
- [ ] Persistencia de eventos Stripe.

---

# 11. Notificaciones y correo

- [ ] Repository de notificaciones.
- [ ] Service.
- [ ] Templates.
- [ ] SMTP.
- [ ] Notificación de vencimiento.
- [ ] Notificación de cambio de plan.
- [ ] Notificación de pago.
- [ ] Manejo de errores de envío.
- [x] Auditoría de envíos.

---

# 12. Platform Admin

Actualmente faltan `/api/platform/*`.

- [ ] Definir contrato.
- [ ] Crear repositories/services.
- [ ] Crear endpoints.
- [ ] Aplicar `is_platform_admin`.
- [ ] Gestión de instituciones.
- [ ] Gestión de planes.
- [ ] Consulta de suscripciones.
- [ ] Consulta de pagos.
- [x] Métricas globales (agregados + filtros/series).
- [x] Auditoría (endpoints, RLS, aislamiento, trazabilidad RAG por mensaje_documento) global según alcance.
- [ ] Evitar que platform admin sin membresía obtenga automáticamente permisos de `/admin/*`.

---

# 13. Métricas

Actualmente existen agregados consumidos por el dashboard.

- [x] Métricas actuales.
- [ ] Filtros por período.
- [ ] Filtro por categoría.
- [ ] Filtro por modelo.
- [ ] Filtro por documento.
- [ ] Series temporales.
- [x] Métricas RAG.
- [x] Métricas de voz.
- [ ] Tokens/modelos.
- [x] Métricas (agregados + filtros período/categoría/modelo/documento + series temporales) globales de platform admin.

---

# 14. Categorías

- [x] `GET /api/admin/categories`.
- [ ] CRUD completo si se decide necesario.
- [ ] Aislamiento institucional.
- [x] Categorías (`GET /admin/categories`; CRUD pospuesto) globales/default.
- [x] Categorías (`GET /admin/categories`; CRUD pospuesto) institucionales.
- [ ] Definir precedencia global/institucional.

---

# 15. OpenAPI

- [ ] Generar OpenAPI oficial desde backend.
- [ ] Versionarlo.
- [ ] Integrarlo al CI.
- [ ] Actualizar `openapi.current.json`.
- [ ] Documentar errores `401/403/404/409/422/500`.
- [ ] Documentar paginación.
- [ ] Documentar filtros.
- [ ] Documentar permisos.
- [ ] Documentar `/platform/*`.
- [ ] Documentar billing.

---

# 16. Tests backend

## Auth

- [ ] JWT válido.
- [ ] JWT inválido.
- [ ] Usuario inexistente.
- [ ] Usuario inactivo.
- [ ] Sin membresía.
- [ ] Membresía inactiva.
- [ ] ADMIN.
- [ ] SECRETARIA.
- [ ] ESTUDIANTE.
- [ ] Platform admin.

## Multiinstitución

- [ ] A no puede leer B.
- [ ] A no puede modificar B.
- [ ] A no puede eliminar B.
- [ ] A no puede acceder a chunks de B.
- [ ] A no puede acceder a embeddings de B.
- [ ] A no puede acceder a conversaciones de B.
- [ ] A no puede acceder a auditoría de B.
- [ ] A no puede acceder al billing de B.

## RAG/PII

- [ ] Retrieval restringido por institución.
- [ ] Contexto del LLM restringido.
- [ ] PII anonimizada.
- [ ] Voice respeta aislamiento.

## Billing

- [ ] Suscripción.
- [ ] Pagos.
- [ ] Comprobantes.
- [ ] Webhooks idempotentes.
- [ ] Estados de suscripción.

---

# 17. QA manual final

### ADMIN institución A

- [ ] Login.
- [ ] `/me`.
- [ ] Dashboard.
- [ ] Documentos.
- [ ] RAG.
- [ ] Chat.
- [ ] Conversaciones.
- [x] Auditoría.
- [ ] Configuración.

### ADMIN institución B

- [ ] Repetir pruebas.
- [ ] Confirmar que no aparecen datos de A.

### Usuario sin membresía

- [ ] `/me`.
- [ ] Acceso denegado a `/admin/*`.

### Platform Admin

- [ ] `/platform/*`.
- [ ] Acceso global permitido.
- [ ] Sin membresía institucional no obtiene automáticamente permisos `/admin/*`.

---

# 18. Seguridad final

- [ ] Secrets únicamente en variables de entorno.
- [ ] Nunca exponer `service_role_key`.
- [ ] No registrar JWT.
- [ ] No registrar PII.
- [ ] No registrar API keys.
- [ ] Validar uploads.
- [ ] Validar MIME type.
- [ ] Limitar tamaño de archivos.
- [ ] Validar PDFs.
- [ ] Evitar path traversal.
- [ ] Revisar Storage.
- [ ] Revisar acceso a audio.
- [ ] Revisar errores internos expuestos.
- [ ] Revisar CORS.
- [ ] Revisar rate limiting.
- [ ] Revisar timeouts.
- [ ] Revisar retries.

---

# 19. Documentación

- [ ] README backend actualizado.
- [ ] Arquitectura multiinstitución.
- [ ] Autenticación.
- [x] RLS definitivo.
- [ ] PII.
- [ ] RAG.
- [ ] Billing/Stripe.
- [ ] Roles/permisos.
- [x] OpenAPI (`custom_openapi`, `openapi.current.json`, docs, errores, paginación, filtros).
- [ ] Variables de entorno.
- [ ] `CONTROL.md`.

---

# 20. Criterio de cierre

El backend queda **CERRADO PARA INTEGRACIÓN FINAL CON EL DASHBOARD** cuando:

- [ ] Auth JWT funciona.
- [ ] Multiinstitución está probado.
- [ ] Aislamiento cross-tenant probado.
- [ ] RAG aislado por institución.
- [ ] PII anonimizada según política.
- [ ] Chat texto funciona.
- [ ] Chat voz funciona.
- [x] Auditoría funciona.
- [x] `config_parametros` funciona (tabla, repo, service, endpoints GET/PUT, precedencia, audit).
- [ ] Billing tiene contrato y endpoints definidos.
- [ ] Stripe está implementado o explícitamente pospuesto.
- [ ] Platform API implementada o explícitamente pospuesta.
- [x] OpenAPI (`custom_openapi`, `openapi.current.json`) es fuente de verdad.
- [ ] Tests críticos pasan.
- [ ] QA multiinstitución pasa.
- [ ] Seguridad revisada.
- [x] Documentación actualizada (README, AGENTS, FRONTEND_API_INTEGRATION, CONTROL, openapi.current.json; borrar/ archivado).

---

# 21. Orden recomendado

### BLOQUE A — Seguridad y arquitectura
1. [ ] Revisar auth/roles.
2. [ ] Cerrar regla de una institución por usuario.
3. [ ] Auditoría multi-tenant.
4. [ ] Revisión final RLS.
5. [ ] Tests cross-tenant.

### BLOQUE B — RAG + privacidad
6. [ ] Validar retrieval multiinstitución.
7. [ ] Validar estados de indexación.
8. [ ] Cerrar PII/anonymización.
9. [ ] Tests RAG + PII.

### BLOQUE C — Configuración
10. [ ] RLS de `config_parametros`.
11. [ ] Repository/service.
12. [ ] Endpoints.
13. [ ] Precedencia global/institucional.
14. [ ] Auditoría.

### BLOQUE D — Platform
15. [ ] Contrato `/api/platform/*`.
16. [ ] Repositories/services.
17. [ ] Endpoints.
18. [ ] Tests.

### BLOQUE E — Billing
19. [ ] Revisar tablas.
20. [ ] Repositories/services.
21. [ ] Endpoints de lectura.
22. [ ] Contratos del Dashboard.
23. [ ] Stripe.
24. [ ] Webhooks/idempotencia.
25. [ ] Facturación/notificaciones.

### BLOQUE F — Métricas y contrato
26. [ ] Métricas avanzadas.
27. [ ] Filtros/series.
28. [ ] OpenAPI oficial.
29. [ ] CI para OpenAPI.

### BLOQUE G — Cierre
30. [ ] Tests completos.
31. [ ] QA multiinstitución.
32. [ ] Seguridad.
33. [ ] Documentación.
34. [ ] Actualizar estado del proyecto.
35. [ ] Handoff definitivo al Admin Dashboard.


---
## Estado 2026-08-26 (post BLOQUE 1-4 + cierre)
- BLOQUE 1-4 completado (auth, aislamiento, RAG, docs, config, platform, billing lectura, metrics filtros/series).
- OpenAPI generado (`openapi.current.json`, `/docs`).
- Seguridad revisada: uploads validados (PDF/size), `safe_join` eliminado, CORS/timeouts/retries OK, rate limiting documentado pendiente.
- Tests: 149 pass / 0 fail; `test_retrieval_isolation` corregido.
- Pospuesto explícito: PII/anónimo completo (§5), Stripe completo (§10), notificaciones/SMTP (§11), categorías CRUD (§14), rate limiting (§18).
- Documentación: `README.md`, `AGENTS.md`, `FRONTEND_API_INTEGRATION.md`, `CONTROL.md` actualizados; `borrar/` actualizado.
- Criterio de cierre (§20): cumplido en todo lo implementado; puntos pospuestos documentados.