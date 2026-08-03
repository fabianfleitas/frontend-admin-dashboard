# Admin Dashboard Blueprint v1.0

# Documento 05 --- Development Roadmap

## Objetivo

Definir el plan de implementación del Admin Dashboard, estableciendo el
orden recomendado de desarrollo, las dependencias entre módulos y los
criterios de finalización de cada etapa.

------------------------------------------------------------------------

# Estrategia de desarrollo

Se adoptará un enfoque incremental. Cada sprint dejará una aplicación
funcional y desplegable, evitando desarrollar pantallas aisladas sin
integración.

------------------------------------------------------------------------

# Sprint 1 --- Base del proyecto

## Objetivos

-   Crear proyecto React + Vite + TypeScript.
-   Configurar Tailwind CSS.
-   Configurar ESLint, Prettier y estructura de carpetas.
-   Integrar React Router.
-   Configurar TanStack Query.
-   Configurar Zustand.
-   Integrar Supabase Auth (Google).
-   Crear Layout principal.
-   Implementar Sidebar, Header y Breadcrumb.
-   Configurar cliente HTTP y manejo de errores.

### Definition of Done

-   Login funcional.
-   Layout reutilizable.
-   Navegación protegida.
-   Base preparada para nuevos módulos.

------------------------------------------------------------------------

# Sprint 2 --- Dashboard

## Funcionalidades

-   KPIs.
-   Estado de servicios.
-   Actividad reciente.
-   Quick Actions.
-   Integración con métricas.

### Endpoints

-   GET /ready
-   GET /metrics

------------------------------------------------------------------------

# Sprint 3 --- Knowledge Base

## Funcionalidades

-   Tabla de documentos.
-   Búsqueda.
-   Filtros.
-   Upload.
-   Nueva versión.
-   Reindexar.
-   Drawer de detalle.
-   Timeline de versiones.

### Endpoints

-   GET documents
-   POST upload
-   POST version
-   POST reindex

------------------------------------------------------------------------

# Sprint 4 --- AI Agent

## Funcionalidades

-   Chat de prueba.
-   Historial.
-   Fuentes recuperadas.
-   Chunks.
-   Tokens.
-   Latencia.
-   Feedback.

------------------------------------------------------------------------

# Sprint 5 --- Conversations

## Funcionalidades

-   Listado.
-   Detalle.
-   Mensajes.
-   Feedback.
-   Información técnica.

------------------------------------------------------------------------

# Sprint 6 --- Analytics

## Funcionalidades

-   KPIs.
-   Gráficos.
-   Tendencias.
-   Filtros.
-   Exportación (si el tiempo lo permite).

------------------------------------------------------------------------

# Sprint 7 --- Audit

## Funcionalidades

-   Historial.
-   Drawer.
-   Información técnica.
-   PII detectada.
-   Latencia.

------------------------------------------------------------------------

# Sprint 8 --- Users y Settings

## Users

-   Listado.
-   Rol.
-   Último acceso.

## Settings

-   Información del sistema.
-   Configuración en modo lectura.

------------------------------------------------------------------------

# Sprint 9 --- Integración final

-   Optimización.
-   Pruebas funcionales.
-   Responsive.
-   Accesibilidad.
-   Corrección de errores.
-   Ajustes visuales.

------------------------------------------------------------------------

# Backlog priorizado

## Must Have

-   Login.
-   Dashboard.
-   Knowledge Base.
-   Conversations.
-   Audit.
-   Analytics.
-   Usuarios.
-   Configuración.

## Should Have

-   Playground mejorado.
-   Exportaciones.
-   Filtros avanzados.

## Could Have

-   Tema oscuro/claro.
-   Personalización.
-   Realtime.

## Won't Have (MVP)

-   Gestión dinámica de permisos.
-   Configuración avanzada de IA.
-   Multiinstitución.

------------------------------------------------------------------------

# Dependencias

Knowledge Base depende de Document API.

Analytics depende de Metrics API.

Audit depende del módulo de auditoría.

AI Agent depende del endpoint de chat.

------------------------------------------------------------------------

# Criterios generales de aceptación

Cada módulo deberá cumplir:

-   Integración completa con el backend.
-   Componentes reutilizables.
-   Responsive.
-   Estados Loading, Empty y Error.
-   Validación de formularios.
-   Accesibilidad básica.
-   Código tipado.
-   Cobertura de casos de error.

------------------------------------------------------------------------

# Próxima etapa

Con los cinco documentos finalizados, la siguiente fase consistirá en
elaborar especificaciones funcionales individuales para cada módulo
(Dashboard, Knowledge Base, AI Agent, Analytics, Audit, Users y
Settings), que servirán como guía directa durante la implementación.
