# Admin Dashboard Functional Specifications

# Documento 11 --- Audit Module

## Objetivo

Garantizar trazabilidad completa de todas las operaciones relevantes.

## Información disponible (AuditLogOut)

-   ID
-   mensaje_id
-   score_fidelidad
-   score_relevancia
-   score_contexto
-   observaciones
-   fecha_evaluacion

## Información NO retornada (Nivel 2)

El backend no expone prompt, respuesta, usuario, modelo ni latencia. El
drawer enlaza a Conversations vía mensaje_id para obtener el contexto
completo.

## Funcionalidades

-   Búsqueda
-   Filtros
-   Drawer de detalle
-   Exportación futura

## Endpoints

-   GET /api/admin/audit

## Componentes

-   AuditPage
-   AuditTable
-   AuditDrawer

## Definition of Done

Consulta histórica completa y navegación por registros.

------------------------------------------------------------------------

# Estado actual / deltas

-   AuditDrawer muestra scores + observaciones y enlaza a Conversations
    vía mensaje_id; no muestra prompt/respuesta/usuario/latencia.
