# QA Checklist — Validación manual contra backend real

Fecha de referencia: 2026-09-20 (cubre hasta los estados 2026-09-20h/i del
`TODO_BACKEND_CIERRE_MULTIINSTITUCION.md`).

Requiere: backend corriendo (`uvicorn app.main:app --reload`), dashboard en dev
(`npm run dev`), `.env` reales (`VITE_API_URL`, `VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY`; backend `.env` con Supabase + LLM/STT/TTS si se validan
flujos de IA). Se recomienda tener al menos 2 instituciones y un usuario sin
membresía para probar el aislamiento. Para endpoints sin UI usar `curl` o la
colección `bruno/` del backend.

---

## 1. Autenticación y sesión

- [ ] Login con Supabase (Google) obtiene JWT; `GET /me` responde con Bearer.
- [ ] `ADMIN` consume `/api/admin/*`; `SECRETARIA` solo lo permitido por UI.
- [ ] `ESTUDIANTE` ve módulos base (dashboard, playground, conversaciones, analytics) sin admin.
- [ ] Usuario sin membresía cae en `/sin-membresia`.
- [ ] Platform admin sin membresía NO accede a `/api/admin/*` (403) — solo `/platform/*`.
- [ ] `PUT /me` actualiza `full_name` y `GET /me` lo refleja.
- [ ] Usuario `is_active=false` en `app_users` → 401 (verificado en tests; opcional en QA).

## 2. Dashboard

- [ ] KPIs y estado del sistema cargan.
- [ ] Actividad reciente (timeline) se alimenta de `GET /api/admin/audit` (staff/platform); estudiantes ven EmptyState.
- [ ] `404` de detalle muestra mensaje multi-tenant correcto.

## 3. Knowledge Base (documentos)

- [ ] Documentos cargan, filtran por categoría/estado y muestran versiones.
- [ ] Subir documento (PDF) → PROCESSING → READY; reindexar.
- [ ] Subir **nueva versión** (también valida PDF).
- [ ] **Descargar PDF**: drawer de Documentos → "Descargar PDF" descarga el binario de la versión activa.
- [ ] **Seguridad uploads**: subir un archivo `.pdf` **sin magic-bytes** (`%PDF`) → rechazado (400); MIME no-PDF → 400; archivo > 50 MB → 413.
- [ ] CRUD de categorías: alta/edición/desactivación desde "Gestionar categorías"; la categoría aparece en el drawer del documento.
- [ ] **Precedencia categorías**: admin institucional ve categorías globales + institucionales fusionadas; si nombres coinciden (case-insensitive), gana la institucional; platform admin gestiona solo globales.
- [ ] Deep-linking: `/documents/:id` abre el detalle; IDs inválidos redirigen al listado.

## 4. Playground (chat + voz)

- [ ] Chat por texto: consulta con fuentes recuperadas (`sources`) y feedback.
- [ ] Voz: grabar/adjuntar audio → placeholder `[Audio]` → reproducción de la respuesta.
- [ ] **Validar formato de grabación (webm/mp4) contra el STT real** (`STT_ENABLED=true`); si falla, documentar el MIME aceptado.
- [ ] Feedback (👍/👎) registra `rating`.

## 5. Conversaciones

- [ ] Listado + ocultar (soft-delete) + filtro "incluir ocultas".
- [ ] Deep-linking `/conversations/:id` abre el detalle.
- [ ] Drawer: `ContextViewer` muestra documentos recuperados de la última respuesta; `FeedbackBadge` refleja el `rating` por mensaje.
- [ ] **Moderación de feedback (`/feedback`)**: listado paginado con filtro por valoración; columnas
  rating, mensaje del asistente, comentario, enlace a la conversación y fecha. `GET /api/admin/feedback` con filtros (`rating`, `conversacion_id`).

## 6. Analytics

- [ ] Filtros período/categoría/modelo/documento afectan la query.
- [ ] Charts con datos reales: Tendencia de consultas, Tokens por modelo, Documentos más consultados, Distribución por categoría.
- [ ] Exportar CSV (metrics) descarga el archivo.

## 7. Billing

- [ ] Checkout Stripe: redirige, pago completado → suscripción activa (`?stripe=success`).
- [ ] Portal de Stripe abre.
- [ ] Change-plan: selector lista planes alternativos (`GET /api/admin/plans`), excluye el actual; confirma el cambio (prorrateo) y el historial lo registra.
- [ ] Cancelar/reactivar.
- [ ] Exportar CSV de comprobantes.
- [ ] **Notificaciones automáticas del webhook**: tras pago exitoso → `PAYMENT_SUCCESS`; cancelación → `SUBSCRIPTION_CANCELED`; cambio de plan → `PLAN_CHANGED`; pago fallido → `PAYMENT_FAILED` — verificarlas en Settings → Notificaciones con estado `SENT` (o `FAILED` si SMTP no configurado).

## 8. Platform (superadmin)

- [ ] Consola: instituciones, métricas, audit, usuarios, planes, suscripciones, pagos, comprobantes.
- [ ] CRUD de instituciones: crear/editar/desactivar desde "Gestionar instituciones".
- [ ] CRUD de planes: crear/editar/desactivar desde "Gestionar planes"; sincronizar con Stripe (`sync-plan`) para que aparezcan en checkout.
- [ ] Miembros: agregar/quitar (`ADMIN/SECRETARIA/ESTUDIANTE`).
- [ ] **Exportar CSV** desde los tabs de Audit, Métricas y Comprobantes (`audit.csv`, `metrics.csv`, `comprobantes.csv`).

## 9. Settings

- [ ] Config institucional legible; parámetros `editable_desde_dashboard` editables; globales solo lectura.
- [ ] **Edición de perfil (`/institution`)**: botón "Editar perfil" guarda `full_name` vía `PUT /me`; tras guardar, el header y `GET /me` reflejan el nuevo nombre.
- [ ] **Correo / SMTP (UI)**: completar el form (servidor/puerto/cifrado/usuario/contraseña/remitente) y guardar; `GET` devuelve la config guardada.
- [ ] **Enviar prueba**: botón "Enviar prueba" → notificación `SENT` (o `FAILED` con error si SMTP no responde).

## 10. Notificaciones / SMTP

- [ ] `PUT /api/admin/smtp` guarda la configuración; `GET` la devuelve.
- [ ] `POST /api/admin/notifications/send-test` envía correo y persiste la notificación como `SENT` (o `FAILED` con error).
- [ ] `GET /api/admin/notifications` lista (paginado).
- [ ] **Plantillas email**: `GET /api/admin/email-templates` lista; `POST` crea una institucional (`{codigo, nombre, asunto, contenido_html}`); `PUT` edita; `DELETE` la desactiva (soft). Precedencia institucional > global.

## 11. Aislamiento multi-institución

- [ ] Admin de institución A no ve documentos/métricas/audit/feedback/billing de B.
- [ ] Usuario de B no accede al audio de A (404).
- [ ] Feedback sobre mensaje ajeno → 404.
- [ ] Platform admin ve todo en `/platform/*`.

## 12. Exportaciones (Audit)

- [ ] `GET /api/admin/audit/export` descarga CSV con las columnas esperadas.
- [ ] `GET /api/admin/metrics/export` incluye secciones AGREGADOS / TOKENS POR MODELO / TOP DOCUMENTOS / DISTRIBUCIÓN / SERIE.
- [ ] `GET /api/admin/comprobantes/export` y las 3 de `platform` descargan CSV.

## 13. Seguridad

- [ ] Un `500` (p. ej. ruta que lance excepción) devuelve JSON limpio `{"detail":"Internal server error"}` **sin detalles internos**.
- [ ] Platform admin sin membresía recibe 403 en `/api/admin/*` (ver §1).
- [ ] Scripts opcionales: `python scripts/check_subscription_expiry.py --dry-run` (reporta vencidas; con `--run` marca `EXPIRED` + notificación) y `python scripts/reprocess_stripe_events.py --dry-run` (lista eventos fallidos).

---

## Notas

- Los flujos de IA (LLM/STT/TTS) dependen de `LLM_ENABLED`, `STT_ENABLED`, `TTS_ENABLED`
  en el backend; con flags `false` las respuestas son mock (esperado).
- Cualquier discrepancia: reportarla en el repo backend (`backend-agent-system`) o en el repo de diagramas según corresponda.