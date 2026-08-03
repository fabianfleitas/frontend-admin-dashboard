# Admin Dashboard Functional Specifications

# Documento 08 --- AI Agent / Playground

## Objetivo

El AI Agent (Playground) es el entorno de validación del sistema RAG.
Permite a administradores y personal académico comprobar el
comportamiento del asistente antes de que las respuestas lleguen a los
estudiantes.

No sustituye al Student Module; su finalidad es diagnóstico, pruebas y
análisis.

------------------------------------------------------------------------

# Objetivos funcionales

-   Probar consultas contra el RAG.
-   Visualizar el proceso de recuperación.
-   Validar la calidad de las respuestas.
-   Analizar latencia, documentos y chunks utilizados.
-   Registrar feedback para mejorar el sistema.

------------------------------------------------------------------------

# Flujo de una consulta

``` text
Pregunta

↓

API Chat

↓

Anonimización (Presidio)

↓

Embeddings

↓

Búsqueda Vectorial

↓

Construcción del Prompt

↓

LLM (OpenRouter)

↓

Respuesta

↓

Feedback
```

------------------------------------------------------------------------

# Distribución de la pantalla

``` text
+---------------------------------------------------------------+
| Header                                                        |
+---------------------------------------------------------------+

+----------------------+----------------------------------------+
| Conversación         | Respuesta                             |
|                      |                                        |
| Historial            |                                        |
|                      |                                        |
+----------------------+----------------------------------------+

+---------------------------------------------------------------+
| Contexto Recuperado                                         |
|---------------------------------------------------------------|
| Documentos | Chunks | Prompt | Tokens | Latencia | Auditoría |
+---------------------------------------------------------------+
```

------------------------------------------------------------------------

# Panel izquierdo

## Conversación

-   Historial de mensajes.
-   Indicador de usuario/IA.
-   Scroll persistente.

Acciones:

-   Nueva conversación.
-   Limpiar chat.
-   Copiar respuesta.

------------------------------------------------------------------------

# Panel principal

Mostrar:

-   Respuesta generada.
-   Markdown.
-   Código (si aplica).
-   Referencias utilizadas.

Botones:

-   👍 Útil
-   👎 No útil
-   Copiar
-   Regenerar

------------------------------------------------------------------------

# Panel inferior

## Documentos recuperados

Tabla:

-   Documento
-   Versión
-   Score
-   Fragmentos utilizados

## Chunks

Lista expandible con:

-   Contenido
-   Score
-   Posición

## Prompt

Visualización en modo solo lectura.

## Métricas

-   Modelo utilizado
-   Tokens prompt
-   Tokens respuesta
-   Tiempo total
-   Tiempo recuperación
-   Tiempo generación

------------------------------------------------------------------------

# Integración con audio

Preparado para:

-   Grabar audio.
-   Reproducir respuesta.
-   Visualizar transcripción.

No obligatorio para el MVP.

------------------------------------------------------------------------

# Endpoints

-   POST /api/chat/query
-   POST /api/chat/voice
-   POST /api/chat/feedback

------------------------------------------------------------------------

# Componentes React

features/chat/

-   ChatPage
-   ConversationPanel
-   MessageList
-   MessageBubble
-   ContextPanel
-   RetrievedDocumentsTable
-   ChunkViewer
-   PromptViewer
-   MetricsCard
-   FeedbackButtons

------------------------------------------------------------------------

# Servicios

chat.service.ts

Funciones:

-   sendMessage()
-   sendAudio()
-   sendFeedback()

------------------------------------------------------------------------

# Tipos TypeScript

-   ChatMessage
-   ChatResponse
-   RetrievedDocument
-   Chunk
-   FeedbackRequest

------------------------------------------------------------------------

# Estados UX

Loading

-   Indicador "La IA está generando una respuesta..."

Empty

-   "Inicia una conversación para probar el asistente."

Error

-   Mostrar mensaje y opción de reintentar.

------------------------------------------------------------------------

# Casos de uso

CU-01 Realizar consulta.

CU-02 Enviar audio.

CU-03 Analizar documentos recuperados.

CU-04 Consultar prompt.

CU-05 Registrar feedback.

------------------------------------------------------------------------

# Definition of Done

-   Chat operativo.
-   Integración con API.
-   Feedback funcional.
-   Visualización de contexto.
-   Componentes reutilizables.
-   Responsive.

------------------------------------------------------------------------

# Evolución futura

Nivel 2

-   Comparar respuestas entre modelos.
-   Mostrar costos.
-   Historial persistente.

Nivel 3

-   Streaming de respuestas.
-   Herramientas del agente.
-   Múltiples modelos.
-   Evaluación automática de respuestas.
