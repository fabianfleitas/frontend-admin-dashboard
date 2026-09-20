# Admin Dashboard Functional Specifications

# Documento 06 --- Dashboard Module

## Objetivo

El Dashboard constituye el punto de entrada del panel administrativo y
debe permitir conocer el estado general del sistema RAG sin necesidad de
navegar por otros módulos.

Debe responder rápidamente a preguntas como:

-   ¿El sistema está operativo?
-   ¿Los documentos están indexados?
-   ¿Existen errores?
-   ¿Cómo fue la actividad reciente?
-   ¿Qué acciones requieren atención?

------------------------------------------------------------------------

# Objetivos funcionales

-   Centralizar información crítica.
-   Reducir el tiempo de diagnóstico.
-   Mostrar indicadores relevantes.
-   Acceder rápidamente a las funciones más utilizadas.

------------------------------------------------------------------------

# Wireframe propuesto

``` text
+-----------------------------------------------------------+
| Header + Breadcrumb                                       |
+-----------------------------------------------------------+

 KPIs
+-------+ +-------+ +-------+ +-------+
|Docs   | |Chats  | |Latency| |Feedback|
+-------+ +-------+ +-------+ +-------+

Estado del Sistema             Actividad Reciente

Quick Actions                  Estado Pipeline RAG
```

------------------------------------------------------------------------

# KPIs

## Obligatorios

-   Consultas hoy
-   Consultas semana
-   Documentos activos
-   Documentos indexados
-   Feedback positivo
-   Feedback negativo
-   Latencia promedio
-   Tiempo de indexación

## Futuros

-   Coste OpenRouter
-   Cache Hit
-   RAG Hit
-   Tokens por día
-   Embeddings generados

------------------------------------------------------------------------

# Estado del sistema

Mostrar mediante badges:

  Servicio        Estado
  --------------- ----------------------------
  API             Online / Offline
  Base de datos   Online / Offline
  Storage         Online / Offline
  Vector Store    Online / Offline
  Whisper         Disponible / No disponible
  Presidio        Disponible / No disponible
  OpenRouter      Disponible / No disponible

------------------------------------------------------------------------

# Actividad reciente

Listado cronológico con:

-   Documento cargado
-   Nueva versión
-   Reindexación
-   Conversación reciente
-   Error registrado

Cada evento mostrará:

-   Fecha
-   Usuario
-   Acción
-   Estado

------------------------------------------------------------------------

# Quick Actions

Acciones principales:

-   Subir documento
-   Abrir Knowledge Base
-   Abrir Playground
-   Ver Auditoría
-   Reindexar documentos

------------------------------------------------------------------------

# APIs

## Estado

GET /ready

## Métricas

GET /api/admin/metrics

## Actividad reciente

GET /api/admin/audit (implementado 2026-09-20: `ActivityTimeline` se alimenta de
audit para staff/platform; los estudiantes ven un EmptyState).

------------------------------------------------------------------------

# Componentes React

layout/ - DashboardLayout

components/ - MetricCard - StatusBadge - ActivityTimeline -
QuickActionCard - SystemStatus - SectionTitle

features/dashboard/ - DashboardPage - DashboardService - DashboardHooks

------------------------------------------------------------------------

# Estados

## Loading

Skeleton para:

-   Cards
-   Timeline
-   Estado servicios

## Empty

Mensaje:

"No existen métricas disponibles."

## Error

Mostrar:

"No fue posible obtener el estado del sistema."

Botón:

Actualizar

------------------------------------------------------------------------

# Responsive

Desktop

-   4 KPIs por fila

Tablet

-   2 KPIs

Mobile

-   1 KPI por fila

Sidebar colapsable.

------------------------------------------------------------------------

# Definition of Done

-   KPIs conectados al backend.
-   Estado de servicios funcional.
-   Quick Actions navegables.
-   Actividad reciente visible.
-   Responsive.
-   Accesible.
-   Componentes reutilizables.

------------------------------------------------------------------------

# Evolución futura

Nivel 2

-   Métricas en tiempo real.
-   Tendencias.
-   Comparativas.

Nivel 3

-   Dashboard configurable.
-   Widgets personalizados.
-   Alertas inteligentes.
-   Monitoreo de costos IA.
