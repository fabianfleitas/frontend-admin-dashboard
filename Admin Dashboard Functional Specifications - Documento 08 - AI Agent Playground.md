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
-   Página
-   Score

## Chunks

Lista expandible con contenido y score.

## Prompt

Visualización en modo solo lectura.

## Métricas

-   Modelo utilizado
-   Tokens prompt
-   Tokens respuesta
-   Latencia

------------------------------------------------------------------------

# Integración con audio

Implementado (2026-09-20):

-   Grabar audio (MediaRecorder + getUserMedia) o adjuntar un archivo de audio
    (`accept="audio/*"`).
-   Enviar el audio a `POST /api/chat/voice` con placeholder optimista `[Audio]`.
-   Reproducir la respuesta de voz vía `GET /api/chat/audio/{audio_interaction_id}`.

Pendiente de validar con el STT del backend: el formato de grabación del
navegador (webm/mp4) debe ser aceptado por el servicio de transcripción.

------------------------------------------------------------------------

# Endpoints

-   POST /api/chat/query
-   POST /api/chat/voice
-   POST /api/chat/feedback

------------------------------------------------------------------------

# Componentes React

features/chat/

-   PlaygroundPage
-   ConversationPanel
-   MessageList
-   MessageBubble
-   ContextPanel
-   RetrievedDocumentsTable
-   MetricsCard
-   FeedbackButtons
-   AudioRecorder
-   AudioPlayer

------------------------------------------------------------------------

# Servicios

chat.service.ts

Funciones:

-   sendChat()
-   sendVoice()
-   getAudio()
-   sendFeedback()

------------------------------------------------------------------------

# Tipos TypeScript

-   ChatQueryIn / ChatQueryOut
-   ChatFeedbackIn / ChatFeedbackOut
-   ChatVoiceOut / AudioInteractionOut
-   SourceOut
-   MessageOut

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

CU-02 Enviar audio (implementado).

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

# Estado actual / deltas (Nivel 2)

-   Historial: el playground guarda mensajes solo en memoria; no carga
    conversaciones previas (pendiente integrar useConversations).
-   Markdown: MessageBubble usa texto plano (pendiente react-markdown +
    rehype-sanitize).
-   Chunks: SourceOut solo expone document_id, document, page y
    similarity_score; no se muestran chunks individuales.
-   Prompt completo: no es retornado por el backend (Nivel 2).
-   Voz: integrada en la UI (grabación MediaRecorder + adjuntar archivo +
    reproducción de la respuesta). El formato de grabación del navegador
    (webm/mp4) está pendiente de validar con el STT del backend.

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
