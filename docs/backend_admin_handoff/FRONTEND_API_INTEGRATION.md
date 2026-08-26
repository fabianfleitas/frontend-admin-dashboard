# Guia de integracion para Frontend

Este documento resume los cambios que el frontend debe contemplar para consumir correctamente las salidas actuales del backend.

El backend ya mezcla persistencia real con degradaciones controladas. El contrato HTTP expone conversaciones separadas, chat, voz, auditoria, documentos, usuarios, metricas y trazabilidad RAG; lo que cambia por flag es si la respuesta sale de retrieval + OpenRouter, de STT/TTS o de un fallback mock.

## Base URL

Por defecto, todas las rutas de negocio usan el prefijo:

```text
/api
```

Rutas globales fuera de `/api`:

```text
GET /health
GET /ready
GET /me
```

## Headers requeridos

Todos los endpoints de negocio y `/me` dependen de autenticacion con JWT de Supabase Auth (`Authorization: Bearer <jwt>`).

El frontend debe enviar siempre:

```http
Authorization: Bearer <jwt_de_supabase>
```

Headers opcionales:

```http
Authorization: Bearer <jwt>

Reglas de auth:
- `Authorization: Bearer <jwt>` obligatorio (JWT de Supabase Auth).
- `tipo_miembro` (`ESTUDIANTE`/`ADMIN`/`SECRETARIA`) resuelto desde `institucion_miembros`.
- `is_platform_admin` resuelto desde `platform_admins`.
- `app_users.role` deprecado; no se consulta.
```

Reglas importantes:

- Si falta `Authorization: Bearer <jwt>`, el backend responde `401`.
- Los endpoints administrativos (`/api/admin/*`) requieren `tipo_miembro` de `ADMIN` o `SECRETARIA` en `institucion_miembros` (o `is_platform_admin=true` para `/api/platform/*`). `app_users.role` está deprecado como fuente de autorización.
- `SECRETARIA` se devuelve al frontend como role `STAFF` en las respuestas.
- No usar JWT propio contra este backend mientras siga activa la autenticacion delegada.

## Cambios principales para el frontend

Las rutas de alumno anteriores ya no son el contrato principal. El frontend debe migrar a estos modulos:

```text
/api/conversations
/api/chat
/api/admin
```

Mapeo recomendado:

| Antes | Ahora |
| --- | --- |
| `POST /api/student/query` | `POST /api/chat/query` |
| `POST /api/student/voice-query` | `POST /api/chat/voice` |
| `GET /api/student/history` | `GET /api/conversations` |
| `PATCH /api/student/history/{id}/hide` | `DELETE /api/conversations/{conversation_id}` |
| `GET /api/health` | `GET /health` |

Nota: aunque la ruta use nombres en ingles, algunos campos de respuesta todavia conservan nombres del modelo inicial en espanol, como `conversacion_id`, `rol_mensaje` y `contenido_texto`.

## Formato de paginacion

Los listados paginados responden siempre:

```json
{
  "items": [],
  "pagination": {
    "total": 0,
    "limit": 20,
    "offset": 0
  }
}
```

El frontend debe leer datos desde `items`, no desde la raiz de la respuesta.

Endpoints paginados:

```text
GET /api/conversations
GET /api/admin/documents
GET /api/admin/audit
GET /api/admin/users
```

Query params:

```text
limit: 1..100, default 20
offset: >=0, default 0
```

## Conversaciones

### Crear conversacion

```http
POST /api/conversations
```

Respuesta `201`:

```json
{
  "id": 1,
  "title": "Conversacion 2026-06-12 15:30:00",
  "messages": []
}
```

El frontend debe crear una conversacion antes de enviar mensajes a `/api/chat/query` o `/api/chat/voice`.

### Listar conversaciones

```http
GET /api/conversations?limit=20&offset=0&include_hidden=false
```

Respuesta:

```json
{
  "items": [
    {
      "id": 1,
      "title": "Conversacion 2026-06-12 15:30:00",
      "last_interaction": "2026-06-12T18:30:00.000000Z",
      "message_count": 2
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 20,
    "offset": 0
  }
}
```

### Obtener detalle

```http
GET /api/conversations/{conversation_id}
```

Respuesta:

```json
{
  "id": 1,
  "title": "Conversacion 2026-06-12 15:30:00",
  "messages": [
    {
      "id": 1,
      "conversacion_id": 1,
      "rol_mensaje": "USER",
      "contenido_texto": "Consulta del estudiante",
      "proveedor_ia": null,
      "modelo_ia": null,
      "temperatura": null,
      "tokens_input": null,
      "tokens_output": null,
      "tiempo_respuesta_ms": null,
      "fecha_envio": "2026-06-12T18:30:00.000000Z",
      "audit_id": null
    }
  ]
}
```

Roles esperados en mensajes:

```text
USER
ASSISTANT
```

Para renderizar chat:

- Usar `rol_mensaje` para decidir alineacion/estilo.
- Usar `contenido_texto` como texto visible del mensaje.
- Usar `fecha_envio` para orden temporal.
- Los metadatos IA (`proveedor_ia`, `modelo_ia`, tokens, tiempos, `audit_id`) normalmente aparecen solo en mensajes `ASSISTANT`.

### Ocultar conversacion

```http
DELETE /api/conversations/{conversation_id}
```

Esto no borra fisicamente la conversacion; solo la oculta para el usuario.

Respuesta:

```json
{
  "id": 1,
  "title": "Conversacion 2026-06-12 15:30:00",
  "last_interaction": "2026-06-12T18:35:00.000000Z",
  "message_count": 2
}
```

Para volver a listar conversaciones ocultas:

```http
GET /api/conversations?include_hidden=true
```

## Chat de texto

```http
POST /api/chat/query
Content-Type: application/json
```

Body:

```json
{
  "conversation_id": 1,
  "message": "Cuales son los requisitos para regularizar una materia?"
}
```

Respuesta:

```json
{
  "response": "Según el artículo del reglamento académico, la matrícula requiere que el estudiante cumpla con la documentación vigente. Para más detalle, ver Artículo 5 del Reglamento Académico (página 2).",
  "conversation_id": 1,
  "sources": [
    {
      "document_id": 7,
      "document": "Reglamento Academico.pdf",
      "page": 3,
      "similarity_score": 0.87
    },
    {
      "document_id": 7,
      "document": "Reglamento Academico.pdf",
      "page": 4,
      "similarity_score": 0.71
    }
  ],
  "audit_id": "6b0f9f86-8f2c-4c49-9d3d-3a9f5bb0a2d1",
  "user_message": {
    "id": 10,
    "conversacion_id": 1,
    "rol_mensaje": "USER",
    "contenido_texto": "Cuales son los requisitos para regularizar una materia?",
    "proveedor_ia": null,
    "modelo_ia": null,
    "temperatura": null,
    "tokens_input": null,
    "tokens_output": null,
    "tiempo_respuesta_ms": null,
    "fecha_envio": "2026-06-12T18:30:00.000000Z",
    "audit_id": null
  },
  "assistant_message": {
    "id": 11,
    "conversacion_id": 1,
    "rol_mensaje": "ASSISTANT",
    "contenido_texto": "Según el artículo del reglamento académico, la matrícula requiere que el estudiante cumpla con la documentación vigente.",
    "proveedor_ia": "OpenRouter",
    "modelo_ia": "openai/gpt-4o-mini",
    "temperatura": 0.2,
    "tokens_input": 310,
    "tokens_output": 120,
    "tiempo_respuesta_ms": 2100.0,
    "fecha_envio": "2026-06-12T18:30:01.000000Z",
    "audit_id": "6b0f9f86-8f2c-4c49-9d3d-3a9f5bb0a2d1"
  }
}
```

Cuando hay contexto sobre el umbral de similitud (`EMBEDDINGS_ENABLED=true` y versiones `READY`
indexadas), `sources` contiene los fragmentos recuperados del RAG: `document_id`, `document`
(titulo del documento), `page` y `similarity_score` reales. Esos mismos fragmentos se persisten
en la tabla `message_documents` (trazabilidad) y `audit_logs.embedding_model` registra el modelo
de embedding usado.

Comportamiento de la respuesta según configuracion:

- **`LLM_ENABLED=true` y contexto recuperado**: `response` es la respuesta real generada por
  OpenRouter (groundeada en el contexto recuperado, con citas de articulo/pagina). En `assistant_message`
  y `audit_logs` quedan `modelo_ia`, `tokens_input` y `tokens_output` reales. `proveedor_ia=OpenRouter`.
- **`LLM_ENABLED=true` y el LLM falla**: `response` es el fallback controlado y `sources` sigue
  conteniendo los fragmentos reales recuperados, que se persisten en `message_documents`. El error
  queda registrado en `audit_logs.observaciones` con prefijo `LLM_FAILED:`. `tokens_input` y
  `tokens_output` son `null` (no hubo consumo real).
- **`LLM_ENABLED=false`** (rollout controlado) y contexto recuperado: `response` es un mock que
  describe los fragmentos recuperados (`MOCK: Recuperé N fragmentos relevantes...`) con `sources`
  reales y `modelo_ia=mock-retrieval`.
- **Sin contexto recuperado**: `response` es el guard de dominio y `sources` vacio (el LLM nunca
  se invoca en este caso).

Si no se recupera ningun fragmento sobre el umbral, la respuesta es el guard de dominio y
`sources` vacio:

```json
{
  "response": "No tengo información institucional suficiente para responder esa consulta. Por favor, reformule su pregunta dentro del ámbito académico institucional.",
  "sources": []
}
```

Si `EMBEDDINGS_ENABLED=false` o el pipeline de retrieval falla, la respuesta es un mock clasico
(`MOCK: Recibi tu consulta institucional: ...`) con `sources` vacio. El fallback controlado por
fallo del LLM es:

```json
{
  "response": "No fue posible generar la respuesta en este momento. Intenta nuevamente.",
  "sources": []
}
```

> Nota: `sources` en este caso contiene los fragmentos reales recuperados (no estan vacios si los
> hubo); el bloque anterior solo ilustra el mensaje de respuesta.

Consideraciones para UI:

- Mostrar `response` como respuesta inmediata del asistente.
- Mostrar `sources` como fuentes/citas cuando existan (recuperacion RAG real).
- Si `response` es el guard de dominio y `sources` esta vacio, mostrar que no hay informacion institucional suficiente para esa consulta.
- Si `response` es el fallback controlado ("No fue posible generar la respuesta en este momento"), mostrar el mensaje y opcionalmente una accion de "reintentar".
- Guardar `audit_id` si luego se enviara feedback.
- Usar `conversation_id`, `user_message` y `assistant_message` para actualizar el store inmediatamente sin esperar un refresh del historial.
- Despues de enviar un mensaje, opcionalmente se puede refrescar `GET /api/conversations/{conversation_id}` para reconciliar historial completo.
- Si `conversation_id` no pertenece al usuario autenticado, el backend responde `404`.

#### Memoria de conversacion

Con `LLM_HISTORY_ENABLED=true` (default), el backend incluye en el prompt del LLM los turnos
previos de la conversacion (usuario y asistente) para entender referencias de seguimiento
(pronombres, "eso", "lo anterior"). La memoria:

- Esta **aislada por conversacion y por usuario** (solo usa mensajes de la conversacion que envio el usuario).
- Se recorta por presupuesto de tokens (`LLM_HISTORY_MAX_TOKENS`, default 1500) y por cantidad de mensajes (`LLM_HISTORY_MAX_MESSAGES`, default 10), conservando los mas recientes.
- Los mensajes de fallo controlado ("No fue posible generar la respuesta...") no entran en el historial.
- El contexto institucional recuperado (RAG) sigue siendo la fuente de verdad; el historial solo se usa para entender el seguimiento.

## Chat por voz

```http
POST /api/chat/voice?conversation_id=1
Content-Type: multipart/form-data
```

Form data:

```text
audio: File
```

Respuesta:

```json
{
  "response": "Según el reglamento académico, para matricularse el estudiante debe cumplir con la documentación vigente. Ver Artículo 5 del Reglamento Académico (página 2).",
  "conversation_id": 1,
  "sources": [
    {
      "document_id": 7,
      "document": "Reglamento Academico.pdf",
      "page": 3,
      "similarity_score": 0.87
    }
  ],
  "transcription": "¿Cuáles son los requisitos para matricularme?",
  "audio_interaction": {
    "id": 1,
    "mensaje_id": 2,
    "ruta_audio_original": "audio/archivo.wav",
    "ruta_audio_respuesta": "audio/respuesta.wav",
    "transcripcion": "¿Cuáles son los requisitos para matricularme?",
    "transcription_model": "openai/whisper-1",
    "duracion_segundos": 2.5,
    "formato_audio": "audio/wav",
    "tamano_bytes": 12345,
    "fecha_creacion": "2026-06-12T18:30:00.000000Z"
  },
  "audit_id": "6b0f9f86-8f2c-4c49-9d3d-3a9f5bb0a2d1",
  "user_message": {
    "id": 2,
    "conversacion_id": 1,
    "rol_mensaje": "USER",
    "contenido_texto": "¿Cuáles son los requisitos para matricularme?",
    "proveedor_ia": null,
    "modelo_ia": null,
    "temperatura": null,
    "tokens_input": null,
    "tokens_output": null,
    "tiempo_respuesta_ms": null,
    "fecha_envio": "2026-06-12T18:30:00.000000Z",
    "audit_id": null
  },
  "assistant_message": {
    "id": 3,
    "conversacion_id": 1,
    "rol_mensaje": "ASSISTANT",
    "contenido_texto": "Según el reglamento académico, para matricularse el estudiante debe cumplir con la documentación vigente.",
    "proveedor_ia": "OpenRouter",
    "modelo_ia": "openai/gpt-4o-mini",
    "temperatura": 0.2,
    "tokens_input": 310,
    "tokens_output": 120,
    "tiempo_respuesta_ms": 2100.0,
    "fecha_envio": "2026-06-12T18:30:01.000000Z",
    "audit_id": "6b0f9f86-8f2c-4c49-9d3d-3a9f5bb0a2d1"
  }
}
```

Cuando `STT_ENABLED=true` (y el proveedor configurado responde), `transcription` y
`audio_interaction.transcripcion` contienen el texto real transcrito del audio,
`audio_interaction.transcription_model` registra el modelo STT usado y la transcripcion se
alimenta al mismo pipeline RAG + OpenRouter del chat de texto:
- **`LLM_ENABLED=true` y contexto recuperado**: `response` es la respuesta real generada por
  OpenRouter y `sources` contiene los fragmentos RAG recuperados (se persisten en
  `message_documents`).
- **Sin contexto recuperado**: `response` es el guard de dominio y `sources` vacio.
- **El LLM falla**: `response` es el fallback controlado y `sources` reales.
- La auditoria registra el origen con el sufijo `[voice]` en `observaciones`.

Si `STT_ENABLED=false`, la transcripcion y la respuesta son mock. Si el STT falla con
`STT_ENABLED=true`, el endpoint responde `503` con detalle "No fue posible transcribir el audio.
Intenta nuevamente."

Consideraciones para UI:

- `transcription` es el texto transcripto que puede mostrarse como mensaje del usuario.
- `response` es el texto de respuesta del asistente.
- Usar `conversation_id`, `user_message` y `assistant_message` para actualizar el store inmediatamente despues del envio.
- `ruta_audio_respuesta` apunta al audio sintetizado (mp3) en Supabase Storage cuando `TTS_ENABLED=true` y la sintesis tuvo exito; si TTS esta deshabilitado o fallo, el archivo de respuesta queda vacio y el `response` de texto sigue siendo valido.
- No asumir que `ruta_audio_original` o `ruta_audio_respuesta` son URLs publicas descargables; actualmente son rutas internas de storage.
- Si el backend responde `503`, mostrar el mensaje de que no fue posible transcribir y ofrecer reintentar.

#### Sintesis de voz (TTS)

Con `TTS_ENABLED=true`, la respuesta del asistente se sintetiza a audio (modelo `tts_model`, por
defecto `hexgrad/kokoro-82m` con voz `ef_dora` - español femenino, formato mp3) apuntando a
`POST /api/v1/audio/speech` de OpenRouter y se almacena en `audio_interactions.ruta_audio_respuesta`.
Si la sintesis falla, la respuesta degrada con graceful: se devuelve el `response` de texto, el
audio de respuesta queda vacio, se registra `WARNING` y se anota `TTS_FAILED` en
`audit_logs.observaciones`.

## Reproducción de audio (Descarga autenticada)

Para reproducir el audio de respuesta generado en `/api/chat/voice`, el frontend debe consumir el endpoint autenticado:

```http
GET /api/chat/audio/{audio_interaction_id}
Authorization: Bearer <jwt>
X-User-Type: ADMIN/SECRETARIA (deprecado; backend resuelve tipo_miembro)
X-External-Auth-Id: usr_ext_12345 (deprecado; backend usa sub del JWT)
```

Respuesta exitosa:
- `Status`: `200 OK`
- `Content-Type`: `audio/mpeg` (o `audio/wav` según el formato generado)
- `Content-Disposition`: `inline`
- `Body`: Stream binario de los bytes del audio.

Errores:
- `401 Unauthorized`: Falta `Authorization` / JWT de Supabase inválido, o `app_users.is_active=false`.
- `403 Forbidden`: Usuario sin institución activa (`institucion_miembros` faltante) o `tipo_miembro` insuficiente.
- `404 Not Found`: Recurso inexistente o pertenece a otra institución (acceso cruzado).
- `403 Forbidden`: El audio pertenece a otra conversación/usuario (aislamiento por estudiante).
- `404 Not Found`: No existe la interacción o no se generó archivo de audio.

Ejemplo de consumo en Frontend:
```ts
async function getAudioBlobUrl(audioInteractionId: number): Promise<string> {
  const response = await fetch(`/api/chat/audio/${audioInteractionId}`, {
      'Authorization': 'Bearer ' + tokenSupabase,
      'Authorization': 'Bearer ' + tokenSupabase,
      // El backend resuelve tipo_miembro desde institucion_miembros; no enviar X-User-Type
    },
  });
  if (!response.ok) {
    throw new Error('Error al descargar audio');
  }
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
```

## Feedback de respuestas

```http
POST /api/chat/feedback
Content-Type: application/json
```

Body:

```json
{
  "message_id": 2,
  "rating": 5,
  "comment": "Respuesta util",
  "audit_id": "6b0f9f86-8f2c-4c49-9d3d-3a9f5bb0a2d1"
}
```

Respuesta:

```json
{
  "id": 1,
  "message_id": 2,
  "rating": 5,
  "comment": "Respuesta util",
  "audit_id": "6b0f9f86-8f2c-4c49-9d3d-3a9f5bb0a2d1",
  "created_at": "2026-06-12T18:31:00.000000Z"
}
```

Validaciones:

- `rating` debe estar entre `1` y `5`.
- `audit_id` debe ser UUID.
- El backend valida ownership del `message_id`; si no pertenece al usuario autenticado responde `404`.

## Validacion end-to-end recomendada

Secuencia sugerida para validar integracion con el modulo de estudiante:

1. Obtener JWT de Supabase Auth (`supabase.auth.signIn` / `getSession`). El backend resuelve `external_auth_id` desde `sub` del JWT (campo `auth.users.id`).
2. El backend valida `is_active` en `app_users`, luego resuelve `institucion_id` y `tipo_miembro` en `institucion_miembros` (o `is_platform_admin` en `platform_admins`). No se confía en headers del cliente.
3. Crear conversacion con `POST /api/conversations`.
4. Enviar texto con `POST /api/chat/query` y actualizar el store usando `conversation_id`, `user_message` y `assistant_message`.
5. Enviar voz con `POST /api/chat/voice?conversation_id=...` usando `multipart/form-data`.
6. Refrescar historial con `GET /api/conversations/{conversation_id}` para reconciliar mensajes persistidos.
7. Listar conversaciones con `GET /api/conversations?include_hidden=false`.
8. Enviar feedback sobre el `assistant_message.id` recibido.

Resultados esperados:

- La conversacion debe quedar persistida en Supabase.
- Los mensajes `USER` y `ASSISTANT` deben aparecer en detalle de conversacion.
- `audit_id` debe existir en respuestas del asistente.
- En voz, `audio_interaction` debe registrar rutas internas en bucket `audio`.
- Si el alumno consulta una conversacion ajena, el backend debe responder `404`.

## Usuario actual

```http
GET /me
```

Respuesta:

```json
{
  "external_auth_id": "user-123",
  "email": "usuario@institucion.edu",
  "role": "STUDENT",
  "created_at": "2026-06-12T18:30:00.000000Z",
  "updated_at": "2026-06-12T18:30:00.000000Z"
}
```

Roles devueltos:

```text
STUDENT
STAFF
ADMIN
```

## Administracion

Todos los endpoints de esta seccion requieren:

```http
Authorization: Bearer <jwt>
# Admin institucional: tipo_miembro = ADMIN / SECRETARIA en institucion_miembros
```

o:

```http
Authorization: Bearer <jwt>
# Secretaria: tipo_miembro = SECRETARIA (STAFF) en institucion_miembros
```

### Subir documento

```http
POST /api/admin/documents
Content-Type: multipart/form-data
```

Form data:

```text
file: File
titulo: string
descripcion: string opcional
categoria_id: number opcional
codigo_documento: string opcional
```

Respuesta:

```json
{
  "document": {
    "id": 1,
    "categoria_id": null,
    "codigo_documento": "REG-001",
    "titulo": "Reglamento Academico",
    "descripcion": "Documento institucional",
    "activo": true,
    "fecha_creacion": "2026-06-12T18:30:00.000000Z",
    "version_activa": {
      "id": 1,
      "documento_id": 1,
      "numero_version": 1,
      "ruta_archivo": "storage/documents/archivo.pdf",
      "status": "PENDING",
      "es_version_activa": true,
      "total_chunks": 0,
      "embedding_model": null,
      "fecha_carga": "2026-06-12T18:30:00.000000Z",
      "indexed_at": null,
      "cargado_por_external_auth_id": "admin-123"
    }
  },
  "version": {
    "id": 1,
    "documento_id": 1,
    "numero_version": 1,
    "ruta_archivo": "storage/documents/archivo.pdf",
    "status": "PENDING",
    "es_version_activa": true,
    "total_chunks": 0,
    "embedding_model": null,
    "fecha_carga": "2026-06-12T18:30:00.000000Z",
    "indexed_at": null,
    "cargado_por_external_auth_id": "admin-123"
  }
}
```

Estados posibles de documentos:

```text
PENDING
PROCESSING
READY
FAILED
```

Hoy la subida deja la version en `PENDING`.

### Listar documentos

```http
GET /api/admin/documents?limit=20&offset=0
```

Respuesta paginada con `DocumentOut` dentro de `items`.

### Ver detalle de documento

```http
GET /api/admin/documents/{documento_id}
```

Respuesta con todas las versiones del documento:

```json
{
  "id": 1,
  "categoria_id": 1,
  "codigo_documento": "REG-001",
  "titulo": "Reglamento Academico",
  "descripcion": "Documento institucional",
  "activo": true,
  "fecha_creacion": "2026-06-12T18:30:00.000000Z",
  "versiones": [
    {
      "id": 2,
      "documento_id": 1,
      "numero_version": 2,
      "ruta_archivo": "storage/documents/abc123.pdf",
      "status": "PENDING",
      "es_version_activa": true,
      "total_chunks": 0,
      "embedding_model": null,
      "fecha_carga": "2026-06-13T10:30:00.000000Z",
      "indexed_at": null,
      "cargado_por_external_auth_id": "admin-123"
    },
    {
      "id": 1,
      "documento_id": 1,
      "numero_version": 1,
      "ruta_archivo": "storage/documents/def456.pdf",
      "status": "READY",
      "es_version_activa": false,
      "total_chunks": 0,
      "embedding_model": null,
      "fecha_carga": "2026-06-12T18:30:00.000000Z",
      "indexed_at": "2026-06-12T18:35:00.000000Z",
      "cargado_por_external_auth_id": "admin-123"
    }
  ]
}
```

El campo `versiones` lista todas las versiones del documento ordenadas por `numero_version` descendente. La version activa se identifica con `es_version_activa: true`.

### Subir nueva version de documento

```http
POST /api/admin/documents/{documento_id}/versions
Content-Type: multipart/form-data
```

Form data:

```text
file: File
```

Respuesta `201`:

```json
{
  "document": {
    "id": 1,
    "categoria_id": 1,
    "codigo_documento": "REG-001",
    "titulo": "Reglamento Academico",
    "descripcion": "Documento institucional",
    "activo": true,
    "fecha_creacion": "2026-06-12T18:30:00.000000Z",
    "version_activa": {
      "id": 2,
      "documento_id": 1,
      "numero_version": 2,
      "ruta_archivo": "storage/documents/abc123.pdf",
      "status": "PENDING",
      "es_version_activa": true,
      "total_chunks": 0,
      "embedding_model": null,
      "fecha_carga": "2026-06-13T10:30:00.000000Z",
      "indexed_at": null,
      "cargado_por_external_auth_id": "admin-123"
    }
  },
  "version": {
    "id": 2,
    "documento_id": 1,
    "numero_version": 2,
    "ruta_archivo": "storage/documents/abc123.pdf",
    "status": "PENDING",
    "es_version_activa": true,
    "total_chunks": 0,
    "embedding_model": null,
    "fecha_carga": "2026-06-13T10:30:00.000000Z",
    "indexed_at": null,
    "cargado_por_external_auth_id": "admin-123"
  }
}
```

Al subir una nueva version, el sistema automaticamente:
- Incrementa `numero_version` tomando la maxima existente + 1
- Desactiva todas las versiones anteriores (`es_version_activa = false`)
- Marca la nueva version como activa (`es_version_activa = true`)
- La nueva version queda en estado `PENDING` hasta ser indexada

### Desactivar documento

```http
DELETE /api/admin/documents/{documento_id}
```

Esto no borra fisicamente el documento ni sus versiones; solo cambia `activo` a `false`.

Respuesta:

```json
{
  "id": 1,
  "categoria_id": 1,
  "codigo_documento": "REG-001",
  "titulo": "Reglamento Academico",
  "descripcion": "Documento institucional",
  "activo": false,
  "fecha_creacion": "2026-06-12T18:30:00.000000Z",
  "version_activa": {
    "id": 2,
    "documento_id": 1,
    "numero_version": 2,
    "ruta_archivo": "storage/documents/abc123.pdf",
    "status": "READY",
    "es_version_activa": true,
    "total_chunks": 0,
    "embedding_model": null,
    "fecha_carga": "2026-06-13T10:30:00.000000Z",
    "indexed_at": "2026-06-13T10:35:00.000000Z",
    "cargado_por_external_auth_id": "admin-123"
  }
}
```

Si el documento no existe o ya esta inactivo, responde `404`.

### Reindexar documentos

```http
POST /api/admin/reindex
Content-Type: application/json
```

Body para reindexar todo:

```json
{
  "documento_id": null
}
```

Body para reindexar un documento:

```json
{
  "documento_id": 1
}
```

Respuesta:

```json
{
  "updated_versions": 1
}
```

Reindexar ejecuta `IndexingService.index_version()` sobre versiones `PENDING/FAILED`; extrae texto real, genera chunks/embeddings y actualiza `total_chunks`; no es cambio de metadata mock.

### Auditoria

```http
GET /api/admin/audit?limit=20&offset=0
```

Respuesta:

```json
{
  "items": [
    {
      "id": "6b0f9f86-8f2c-4c49-9d3d-3a9f5bb0a2d1",
      "mensaje_id": 2,
      "score_fidelidad": null,
      "score_relevancia": null,
      "score_contexto": null,
      "observaciones": "MOCK: sin evaluacion automatica",
      "fecha_evaluacion": "2026-06-12T18:31:00.000000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 20,
    "offset": 0
  }
}
```

### Usuarios

```http
GET /api/admin/users?limit=20&offset=0
GET /api/admin/categories?limit=20&offset=0
```

Respuesta paginada con usuarios:

```json
{
  "items": [
    {
      "external_auth_id": "user-123",
      "email": "usuario@institucion.edu",
      "role": "STUDENT",
      "created_at": "2026-06-12T18:30:00.000000Z",
      "updated_at": "2026-06-12T18:30:00.000000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 20,
    "offset": 0
  }
}
```

### Metricas

```http
GET /api/admin/metrics
GET /api/platform/metrics
```

Nota: `/api/admin/subscription`, `/plan`, `/pagos`, `/comprobantes` disponibles; `/api/platform/plans`, `/subscriptions`, `/pagos`, `/comprobantes` para platform admin.

```http
GET /api/admin/metrics
```

Respuesta:

```json
{
  "total_queries": 2,
  "total_conversations": 1,
  "total_documents": 1,
  "total_feedbacks": 1,
  "avg_response_time": 0.03,
  "avg_fidelity": 0.0,
  "avg_relevance": 0.0,
  "system_status": "healthy",
  "total_llm_responses": 1,
  "total_guard": 1,
  "total_llm_failed": 0,
  "guard_rate": 0.5,
  "llm_failed_rate": 0.0,
  "total_tokens_input": 586,
  "total_tokens_output": 87,
  "tokens_by_model": {
    "openai/gpt-4o-mini": {
      "input": 586,
      "output": 87
    }
  },
  "avg_retrieval_similarity": 0.61,
  "total_voice_queries": 0,
  "total_text_queries": 2,
  "avg_response_time_voice": 0.0,
  "avg_response_time_text": 2.1,
  "series": [{"fecha":"2026-08-25","conversaciones":1,"tokens_input":586,"tokens_output":87,"llm":1,"guard":1,"llm_failed":0}],
  "desde": null,
  "hasta": null,
  "categoria_id": null,
  "modelo": null,
  "documento_id": null,
  "granularidad": "day"
}
```

Campos IA:

- `total_llm_responses`, `total_guard`, `total_llm_failed`: conteo de respuestas segun el outcome
  registrado en `audit_logs.observaciones` (`LLM`, `GUARD`, `LLM_FAILED`). Los mocks (`MOCK`/`RETRIEVAL`)
  no se cuentan aqui.
- `guard_rate` y `llm_failed_rate`: proporciones sobre el denominador
  `LLM + GUARD + LLM_FAILED` (excluye mocks).
- `total_tokens_input/output`: tokens totales consumidos por el LLM.
- `tokens_by_model`: consumo por `modelo_ia` (`{modelo: {input, output}}`).
- `avg_retrieval_similarity`: promedio de `similarity_score` en `message_documents`.
- `total_voice_queries`/`total_text_queries` y `avg_response_time_voice/text`: split por canal
  segun el sufijo `[voice]`/`[text]` en `observaciones`.

Nota: en el store actual `system_status` puede venir por default del schema aunque no lo devuelva explicitamente el servicio.

## Platform Admin (`/api/platform/*`)

Requiere `is_platform_admin = true` (JWT de Supabase + registro `platform_admins`).

```http
GET /api/platform/institutions
GET /api/platform/institutions/{id}
GET /api/platform/institutions/{id}/members
POST /api/platform/institutions/{id}/members
DELETE /api/platform/institutions/{id}/members/{member_id}
GET /api/platform/users
GET /api/platform/metrics
GET /api/platform/audit
```

Contratos: `InstitutionOut`, `MemberOut`, `MemberIn`, `UserOut`, `MetricsOut`, `AuditLogOut` con paginación.

## Health y readiness

```http
GET /health
```

Respuesta:

```json
{
  "status": "ok"
}
```

```http
GET /ready
```

Respuesta:

```json
{
  "status": "ready",
  "services": {
    "database": true,
    "openai": true,
    "vector_store": true,
    "storage": true
  }
}
```

Importante:

- `database` y `vector_store` reflejan checks reales contra Supabase y la tabla/servicio correspondiente.
- `openai` sigue siendo un indicador de presencia de key, no una prueba de conectividad real.

## Errores esperados

Formato comun de error FastAPI:

```json
{
  "detail": "Mensaje de error"
}
```

Casos principales:

| Status | Caso |
| --- | --- |
| `401` | Falta `Authorization` / JWT de Supabase inválido / `is_active=false` |
| `403` | Sin institución activa (`institucion_miembros`) o `tipo_miembro` insuficiente; o intento de acceso cross-institution con membresía inactiva (403, sin revelar existencia) |
| `404` | Recurso inexistente o pertenece a otra institución (acceso cruzado) |
| `422` | Body invalido, query params fuera de rango o multipart incompleto |

## Checklist de cambios en frontend

- Enviar `Authorization: Bearer <jwt>` en todas las llamadas al backend.
- Enviar `Authorization: Bearer <jwt>`; el backend resuelve `tipo_miembro` desde `institucion_miembros` (no confiar en headers del cliente).
- Crear conversacion con `POST /api/conversations` antes del primer mensaje.
- Reemplazar historial plano por consumo de `GET /api/conversations` y `GET /api/conversations/{id}`.
- Leer listados desde `response.items` y paginacion desde `response.pagination`.
- Mapear mensajes usando `rol_mensaje` y `contenido_texto`, no `role` ni `content`.
- Enviar chat de texto a `POST /api/chat/query` con `conversation_id`.
- Enviar audio a `POST /api/chat/voice?conversation_id=<id>` como `multipart/form-data`.
- Mostrar fuentes desde `sources[]` cuando existan.
- Guardar `audit_id` para feedback y trazabilidad.
- Implementar feedback con `POST /api/chat/feedback`.
- Tratar `DELETE /api/conversations/{id}` como ocultar conversacion, no como borrado permanente.
- Reproducir audio de respuesta consumiendo `GET /api/chat/audio/{audio_interaction_id}` con header `Authorization: Bearer <jwt>` y generando un Object URL (`URL.createObjectURL(blob)`).
- En admin, subir documentos con `multipart/form-data` y mostrar estado de version activa (`PENDING`, `PROCESSING`, `READY`, `FAILED`).
- En admin, usar `GET /api/admin/documents/{id}` para ver el detalle y todas las versiones de un documento.
- En admin, usar `DELETE /api/admin/documents/{id}` para desactivar (soft-delete) un documento.
- Usar `/health`, no `/api/health`.

## Contratos TypeScript sugeridos

```ts
type UserRole = "STUDENT" | "STAFF" | "ADMIN";
type MessageRole = "USER" | "ASSISTANT";
type DocumentStatus = "PENDING" | "PROCESSING" | "READY" | "FAILED";

type PaginationMeta = {
  total: number;
  limit: number;
  offset: number;
};

type PaginatedResponse<T> = {
  items: T[];
  pagination: PaginationMeta;
};

type ConversationSummary = {
  id: number;
  title: string;
  last_interaction: string;
  message_count: number;
};

type Message = {
  id: number;
  conversacion_id: number;
  rol_mensaje: MessageRole;
  contenido_texto: string;
  proveedor_ia: string | null;
  modelo_ia: string | null;
  temperatura: number | null;
  tokens_input: number | null;
  tokens_output: number | null;
  tiempo_respuesta_ms: number | null;
  fecha_envio: string;
  audit_id: string | null;
};

type ConversationDetail = {
  id: number;
  title: string;
  messages: Message[];
};

type Source = {
  document_id: number;
  document: string;
  page: number;
  similarity_score: number;
};

type ChatQueryResponse = {
  response: string;
  sources: Source[];
  audit_id: string;
};

type AudioInteraction = {
  id: number;
  mensaje_id: number;
  ruta_audio_original: string;
  ruta_audio_respuesta: string | null;
  transcripcion: string | null;
  duracion_segundos: number | null;
  formato_audio: string | null;
  tamano_bytes: number | null;
  fecha_creacion: string;
};

type ChatVoiceResponse = ChatQueryResponse & {
  transcription: string;
  audio_interaction: AudioInteraction;
};

type DocumentVersion = {
  id: number;
  documento_id: number;
  numero_version: number;
  ruta_archivo: string;
  status: DocumentStatus;
  es_version_activa: boolean;
  total_chunks: number;
  embedding_model: string | null;
  fecha_carga: string;
  indexed_at: string | null;
  cargado_por_external_auth_id: string;
};

type DocumentOut = {
  id: number;
  categoria_id: number | null;
  codigo_documento: string | null;
  titulo: string;
  descripcion: string | null;
  activo: boolean;
  fecha_creacion: string;
  version_activa: DocumentVersion | null;
};

type DocumentDetail = {
  id: number;
  categoria_id: number | null;
  codigo_documento: string | null;
  titulo: string;
  descripcion: string | null;
  activo: boolean;
  fecha_creacion: string;
  versiones: DocumentVersion[];
};

type UploadVersionResponse = {
  document: DocumentOut;
  version: DocumentVersion;
};
```
