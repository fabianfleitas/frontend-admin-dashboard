# Admin Dashboard Functional Specifications

# Documento 09 --- Conversations Module

## Objetivo

El módulo Conversations permite inspeccionar todas las conversaciones
generadas por los usuarios finales para facilitar tareas de auditoría,
soporte y mejora continua del sistema RAG.

------------------------------------------------------------------------

# Objetivos funcionales

-   Consultar conversaciones históricas.
-   Analizar preguntas y respuestas.
-   Revisar feedback recibido.
-   Identificar documentos utilizados.
-   Detectar respuestas incorrectas o incompletas.

------------------------------------------------------------------------

# Flujo de navegación

``` text
Listado
   ↓
Detalle
   ↓
Mensajes
   ↓
Contexto utilizado
   ↓
Feedback
```

------------------------------------------------------------------------

# Pantalla principal

## Barra superior

-   Buscar conversación
-   Filtro por feedback
-   Incluir ocultas (include_hidden)
-   Botón actualizar

## Tabla

-   ID
-   Título
-   Última interacción
-   Cantidad de mensajes
-   Feedback
-   Acción

------------------------------------------------------------------------

# Drawer de detalle

## Información general

-   Título
-   Fecha
-   Mensajes
-   Tokens
-   Latencia

## Conversación

Vista tipo chat con mensajes del usuario y del asistente.

## Contexto

-   Documentos recuperados
-   Score

## Feedback

-   Positivo / Negativo
-   Comentarios

------------------------------------------------------------------------

# Endpoints

-   GET /api/conversations/
-   POST /api/conversations/
-   GET /api/conversations/{id}
-   DELETE /api/conversations/{id}
-   GET /api/conversations/{id}/messages

Nota: el listado lleva barra final; el detalle no. Respetarlo.

------------------------------------------------------------------------

# Componentes

-   ConversationsPage
-   ConversationsTable
-   ConversationDrawer
-   MessageTimeline
-   ContextViewer
-   FeedbackBadge

------------------------------------------------------------------------

# Estados UX

Loading, Empty, Error y Success con componentes reutilizables.

------------------------------------------------------------------------

# Reglas de negocio

-   No editar conversaciones.
-   No eliminar mensajes individuales.
-   Mostrar únicamente información registrada por el backend.
-   Mantener trazabilidad completa.
-   Ocultar = soft-delete vía DELETE.

------------------------------------------------------------------------

# Checklist QA

-   Filtros funcionan correctamente.
-   Mensajes ordenados cronológicamente.
-   Feedback visible.
-   Contexto asociado a cada respuesta.
-   Responsive.

------------------------------------------------------------------------

# Definition of Done

-   Listado funcional.
-   Drawer implementado.
-   Integración API.
-   Responsive.
-   Accesibilidad básica.

------------------------------------------------------------------------

# Estado actual / deltas (Nivel 2)

-   ContextViewer y FeedbackBadge **integrados** (2026-09-20): el drawer muestra
    el contexto recuperado del último mensaje del asistente (vía `GET
    /api/conversations/{id}`, campo `sources` en `MessageOut`) y el feedback por
    mensaje (`rating`/`feedback_comment`).
-   Pendiente (backend): lectura/moderación global de feedback (`GET` de
    feedback fuera del detalle por conversación) — hoy solo se crea y se muestra
    por mensaje en el detalle.

------------------------------------------------------------------------

# Evolución futura

-   Búsqueda semántica entre conversaciones.
-   Etiquetas.
-   Exportación.
-   Comparación entre respuestas.
