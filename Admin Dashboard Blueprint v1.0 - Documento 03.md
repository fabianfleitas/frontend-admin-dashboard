# Admin Dashboard Blueprint v1.0

# Documento 03 --- UX & Navigation

## Objetivo

Definir la experiencia de usuario, navegación, layout y organización
visual del Admin Dashboard para garantizar una interfaz consistente,
moderna y escalable.

------------------------------------------------------------------------

# Principios UX

-   Simplicidad sobre complejidad.
-   Información importante primero.
-   Consistencia visual.
-   Acciones críticas claramente identificadas.
-   Minimizar clics.
-   Feedback inmediato al usuario.
-   Navegación predecible.

------------------------------------------------------------------------

# Arquitectura de navegación

``` text
Login

└── Dashboard
    ├── Knowledge Base
    │   ├── Documentos
    │   ├── Detalle Documento
    │   └── Versiones
    │
    ├── Conversations
    │   ├── Listado
    │   └── Detalle
    │
    ├── Analytics
    ├── Audit
    ├── Users
    └── Settings
```

------------------------------------------------------------------------

# Layout principal

``` text
+------------------------------------------------------+
| Header                                               |
+---------+--------------------------------------------+
|         | Breadcrumb                                 |
| Sidebar +--------------------------------------------+
|         |                                            |
|         |                Contenido                   |
|         |                                            |
|         |                                            |
+---------+--------------------------------------------+
```

El layout permanece constante durante toda la aplicación.

------------------------------------------------------------------------

# Sidebar

## Secciones

-   Dashboard
-   Knowledge Base
-   Conversations
-   Analytics
-   Audit
-   Users
-   Settings

Características:

-   Colapsable
-   Iconos + texto
-   Indicador de sección activa
-   Responsive

------------------------------------------------------------------------

# Header

Contiene:

-   Breadcrumb
-   Barra de búsqueda (preparada para futuras versiones)
-   Botón actualizar
-   Estado del sistema
-   Perfil del usuario

------------------------------------------------------------------------

# Breadcrumb

Ejemplos

``` text
Dashboard

Dashboard / Knowledge Base

Dashboard / Documents / Reglamento General

Dashboard / Conversations / Conversación #152
```

------------------------------------------------------------------------

# Flujo de navegación

## Dashboard

Desde el dashboard el usuario puede acceder directamente a:

-   Documentos
-   Conversaciones
-   Auditoría
-   Analytics
-   Usuarios

------------------------------------------------------------------------

## Knowledge Base

``` text
Listado

↓

Detalle

↓

Versiones

↓

Nueva versión

↓

Reindexar
```

------------------------------------------------------------------------

## Conversations

``` text
Listado

↓

Detalle

↓

Mensajes

↓

Fuentes

↓

Feedback
```

------------------------------------------------------------------------

# Responsive

## Desktop

Experiencia principal.

Sidebar expandido.

## Tablet

Sidebar colapsable.

## Mobile

Menú hamburguesa.

Tablas convertidas en tarjetas cuando sea necesario.

------------------------------------------------------------------------

# Componentes reutilizables

## Navegación

-   Sidebar
-   Header
-   Breadcrumb
-   Footer

## Datos

-   DataTable
-   Pagination
-   Filters
-   SearchBar

## Feedback

-   Toast
-   Alert
-   EmptyState
-   Skeleton
-   Loading

## Contenedores

-   Card
-   Drawer
-   Modal
-   Tabs
-   Timeline

## Indicadores

-   KPI Card
-   Status Badge
-   Progress
-   Chip

------------------------------------------------------------------------

# Estados UX

Cada pantalla deberá contemplar:

## Loading

Skeleton.

## Empty

Mensaje descriptivo.

Acción recomendada.

## Error

Mensaje claro.

Botón reintentar.

## Success

Toast.

Actualización automática de la vista.

------------------------------------------------------------------------

# Guía de interacción

Documentos:

-   Doble clic abre detalle.
-   Acciones secundarias mediante menú contextual.

Tablas:

-   Ordenamiento.
-   Paginación.
-   Filtros.
-   Búsqueda.

Formularios:

-   Validación inmediata.
-   Mensajes claros.
-   Botones siempre visibles.

------------------------------------------------------------------------

# Wireframes conceptuales

## Dashboard

``` text
KPIs

Actividad reciente

Estado sistema

Consultas

Documentos
```

## Knowledge Base

``` text
Filtros

Tabla

Drawer detalle

Timeline versiones
```

## Conversations

``` text
Listado

|

Detalle

|

Mensajes

|

Fuentes
```

## Analytics

``` text
KPIs

Gráficos

Ranking

Indicadores
```

------------------------------------------------------------------------

# Consistencia visual

-   Espaciado uniforme.
-   Inter como tipografía principal.
-   Iconografía Lucide.
-   Colores definidos en el Design Brief.
-   Componentes reutilizados en todas las pantallas.

------------------------------------------------------------------------

# Próximo documento

Documento 04 --- Screen Specifications

Se detallará cada pantalla con:

-   Objetivo.
-   Wireframe.
-   Componentes.
-   APIs.
-   Acciones.
-   Estados.
-   Criterios de aceptación.
