# Admin Dashboard Functional Specifications

# Documento 10 --- Analytics Module

## Objetivo

Visualizar indicadores operativos y de uso del sistema RAG para
facilitar la toma de decisiones.

## KPIs

-   Consultas totales
-   Conversaciones totales
-   Documentos totales
-   Feedback total
-   Latencia promedio
-   Fidelidad promedio
-   Relevancia promedio
-   Estado del sistema

## Gráficos

-   Tendencia de consultas
-   Feedback en el tiempo
-   Uso de documentos
-   Distribución por categoría

## Filtros

Periodo, categoría, modelo, documento.

## Endpoints

-   GET /api/admin/metrics

## Componentes

-   AnalyticsPage
-   MetricCard (reutiliza useMetrics)
-   ChartLine
-   ChartBar
-   FiltersPanel

## Definition of Done

KPIs conectados, filtros funcionales, gráficos responsivos.

------------------------------------------------------------------------

# Estado actual / deltas

-   `GET /api/admin/metrics` soporta filtros (`desde/hasta/categoria_id/modelo/
    documento_id`), `granularidad` (`day`) y series temporales. La UI envía los
    filtros del panel (período, categoría, modelo, documento) a la query.
-   Gráficos con datos reales: "Tendencia de consultas" (series), "Tokens por
    modelo" (derivado de `tokens_by_model`, top 8), "Documentos más consultados"
    (`top_documents`) y "Distribución por categoría" (`documents_by_category`).
