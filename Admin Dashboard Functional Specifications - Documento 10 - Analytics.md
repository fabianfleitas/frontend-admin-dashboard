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

# Estado actual / deltas (Nivel 2)

-   GET /api/admin/metrics no soporta filtros ni series temporales. La UI
    muestra los KPIs reales, pero los gráficos y filtros están marcados
    "Nivel 2" (arrays vacíos + EmptyState). Los filtros afectan solo estado
    local, no la query.
