# Admin Dashboard Blueprint v1.0

## Documento 01 --- Product Blueprint

## 1. Propósito

El **Admin Dashboard** es una aplicación independiente del Student
Module cuyo objetivo es administrar y supervisar el sistema de atención
inteligente basado en arquitectura RAG desarrollado para la tesis.

Se conecta exclusivamente al backend FastAPI mediante su API REST y
constituye la herramienta utilizada por administradores y personal
académico para gestionar la base de conocimiento, monitorear el sistema
y consultar métricas.

------------------------------------------------------------------------

# 2. Arquitectura General

    backend-agent-system
            │
            ├── Student Module (React)
            │
            └── Admin Dashboard (React)

Tecnologías:

-   React + Vite + TypeScript
-   Tailwind CSS
-   React Router
-   TanStack Query
-   React Hook Form
-   Zod
-   Recharts
-   Supabase Auth (Google)
-   FastAPI
-   Supabase

------------------------------------------------------------------------

# 3. Objetivos del MVP

## Dashboard

-   Estado del sistema
-   KPIs
-   Actividad reciente
-   Estado de servicios

## Knowledge Base

-   Gestión documental
-   Versionado
-   Activación de versiones
-   Reindexación
-   Estado de indexación

## Conversaciones

-   Visualización completa
-   Mensajes
-   Feedback
-   Información técnica

## Auditoría

-   Request
-   Response
-   Usuario
-   Modelo
-   Documentos utilizados
-   Latencia
-   Score
-   Feedback

## Analytics

-   Consultas
-   Latencia
-   Tokens
-   Feedback
-   Documentos
-   Errores
-   Estado del sistema

## Usuarios

-   Listado
-   Roles existentes
-   Información básica

## Configuración

-   Solo lectura en el MVP

------------------------------------------------------------------------

# 4. Funcionalidades fuera del MVP

## Nivel 2

-   Configuración del modelo IA
-   Parámetros RAG
-   Playground avanzado
-   Gestión de categorías
-   Gestión de prompts
-   Exportaciones
-   Filtros avanzados

## Nivel 3

-   Realtime
-   Cola de indexación
-   Notificaciones
-   Feature Flags
-   Observabilidad
-   Dashboard configurable
-   Gestión avanzada de permisos

------------------------------------------------------------------------

# 5. Estado actual del Backend

Actualmente ya existen:

-   Gestión documental
-   Conversaciones
-   Auditoría
-   Usuarios
-   Métricas
-   Feedback
-   Audio

Pendiente de implementación:

-   Chunking
-   Embeddings
-   Recuperación semántica
-   Prompt contextualizado
-   Reindexación real

------------------------------------------------------------------------

# 6. Autenticación

-   Supabase Auth
-   Inicio de sesión con Google
-   RBAC basado en los roles actuales
-   Protección de rutas
-   Renovación automática de sesión

------------------------------------------------------------------------

# 7. Roadmap General

Fase 1 - Bootstrap - Arquitectura - Layout - Login

Fase 2 - Dashboard

Fase 3 - Gestión documental

Fase 4 - Conversaciones

Fase 5 - Auditoría

Fase 6 - Analytics

Fase 7 - Usuarios

Fase 8 - Configuración

Fase 9 - Integración completa con RAG

------------------------------------------------------------------------

# 8. Próximos documentos

2.  Frontend Technical Design

3.  UX & Navigation

4.  Screen Specifications

5.  Development Roadmap

------------------------------------------------------------------------

# Nota

Este documento constituye el punto de partida oficial para el desarrollo
del Admin Dashboard y deberá mantenerse sincronizado con la evolución
del backend y del Student Module.
