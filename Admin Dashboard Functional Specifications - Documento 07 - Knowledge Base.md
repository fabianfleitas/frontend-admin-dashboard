# Admin Dashboard Functional Specifications

# Documento 07 --- Knowledge Base Module

## Objetivo

La Knowledge Base es el núcleo del panel administrativo. Permite
gestionar toda la documentación institucional utilizada por el sistema
RAG, controlar el ciclo de vida de los documentos y supervisar su
proceso de indexación.

------------------------------------------------------------------------

# Objetivos funcionales

-   Centralizar la documentación institucional.
-   Administrar versiones.
-   Controlar el estado de indexación.
-   Facilitar la trazabilidad.
-   Reducir errores durante la actualización del conocimiento.

------------------------------------------------------------------------

# Flujo funcional

``` text
Subir documento
      ↓
PROCESSING
      ↓
Extracción de texto
      ↓
Chunking
      ↓
Embeddings
      ↓
READY
      ↓
Activar versión
```

Si alguna etapa falla:

``` text
FAILED
↓
Ver detalle del error
↓
Reintentar indexación
```

------------------------------------------------------------------------

# Pantalla principal

## Barra superior

-   Buscar documento
-   Filtro por categoría
-   Filtro por estado
-   Botón Actualizar
-   Botón Subir documento

## Tabla

  Campo                 Descripción
  --------------------- ----------------------------------------
  Documento             Nombre
  Categoría             Reglamento, Manual, etc.
  Estado                READY / PROCESSING / FAILED / INACTIVE
  Versión               Activa
  Chunks                Cantidad
  Última indexación     Fecha
  Última modificación   Fecha
  Acciones              Ver, Nueva versión, Reindexar

------------------------------------------------------------------------

# Drawer de detalle

No se navegará a otra página.

El panel lateral mostrará:

## Información general

-   Nombre
-   Categoría
-   Descripción
-   Fecha de creación
-   Usuario

## Versiones

Timeline:

v1 → Histórica

v2 → Activa

v3 → Procesando

## Estado de indexación

-   Extracción
-   Chunking
-   Embeddings
-   Validación

## Auditoría

-   Última modificación
-   Último usuario
-   Última reindexación

------------------------------------------------------------------------

# Estados

## READY

Documento disponible para consultas.

## PROCESSING

Indexación en curso.

## FAILED

Error durante el procesamiento.

Mostrar causa si existe.

## INACTIVE

Documento deshabilitado.

------------------------------------------------------------------------

# Acciones disponibles

-   Subir documento
-   Nueva versión
-   Activar versión
-   Reindexar
-   Desactivar
-   Ver historial

------------------------------------------------------------------------

# Endpoints

-   GET /api/admin/documents
-   GET /api/admin/documents/{id}
-   POST /api/admin/documents
-   POST /api/admin/documents/{id}/versions
-   POST /api/admin/documents/{id}/reindex
-   DELETE /api/admin/documents/{id}

------------------------------------------------------------------------

# Componentes React

features/documents/

-   DocumentsPage
-   DocumentsTable
-   DocumentDrawer
-   VersionTimeline
-   UploadDialog
-   StatusBadge
-   SearchBar
-   Filters

------------------------------------------------------------------------

# Validaciones

-   Solo PDF.
-   Nombre obligatorio.
-   Evitar duplicados.
-   Mostrar progreso de carga.
-   Confirmar acciones destructivas.

------------------------------------------------------------------------

# Estados UX

Loading: - Skeleton de tabla. - Skeleton del drawer.

Empty: "No existen documentos."

Error: "No fue posible cargar los documentos."

------------------------------------------------------------------------

# Casos de uso

CU-01 Subir documento

CU-02 Subir nueva versión

CU-03 Reindexar

CU-04 Consultar historial

CU-05 Desactivar documento

------------------------------------------------------------------------

# Definition of Done

-   Gestión documental funcional.
-   Versionado operativo.
-   Drawer implementado.
-   Estados visuales consistentes.
-   Integración con API.
-   Responsive.
-   Componentes reutilizables.

------------------------------------------------------------------------

# Evolución futura

Nivel 2

-   Gestión de categorías.
-   Indexación masiva.
-   Drag & Drop múltiple.
-   Comparación entre versiones.

Nivel 3

-   Cola de procesamiento.
-   Notificaciones.
-   Programación de indexaciones.
-   Métricas por documento.
