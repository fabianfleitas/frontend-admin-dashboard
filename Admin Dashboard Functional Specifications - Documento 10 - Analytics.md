# Admin Dashboard Functional Specifications

# Documento 10 --- Analytics Module

## Objetivo

Visualizar indicadores operativos y de uso del sistema RAG para
facilitar la toma de decisiones.

## KPIs

-   Consultas por día/semana/mes
-   Latencia promedio
-   Feedback positivo/negativo
-   Documentos más consultados
-   Errores
-   Tiempo de indexación

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

AnalyticsPage, MetricCard, LineChart, BarChart, FiltersPanel.

## Definition of Done

KPIs conectados, filtros funcionales, gráficos responsivos.
