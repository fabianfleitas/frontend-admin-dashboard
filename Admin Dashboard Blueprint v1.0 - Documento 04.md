# Admin Dashboard Blueprint v1.0

# Documento 04 --- Screen Specifications

> Este documento especifica funcionalmente las pantallas del Admin
> Dashboard tomando como base el prototipo HTML desarrollado para el
> proyecto y proponiendo mejoras para el MVP.

------------------------------------------------------------------------

# Filosofía

El diseño actual posee una excelente base visual inspirada en productos
como Supabase, Vercel y OpenAI. Se mantendrá dicha línea estética,
priorizando una interfaz limpia, moderna y enfocada en datos.

Las recomendaciones de este documento buscan mejorar la experiencia de
usuario sin aumentar significativamente la complejidad de
implementación.

------------------------------------------------------------------------

# 1. Dashboard

## Objetivo

Ofrecer una visión global del estado del sistema.

## Componentes actuales

-   Cards KPI
-   Estado del sistema
-   Estado del pipeline RAG
-   Modelo activo
-   Quick Actions
-   Actividad reciente

## Mejoras propuestas

### KPIs

Agregar:

-   Consultas hoy
-   Feedback positivo
-   Feedback negativo
-   Documentos activos
-   Documentos indexados
-   Tiempo promedio de respuesta
-   Última indexación
-   Estado OpenRouter

### Quick Actions

Mantener:

-   Upload Documents
-   Playground

Agregar:

-   Reindexar documentos
-   Ver auditoría
-   Nueva conversación de prueba

### Estado del sistema

Mostrar mediante badges:

-   API
-   Base de datos
-   Storage
-   Vector Store
-   OpenRouter
-   Whisper
-   Presidio

------------------------------------------------------------------------

# 2. Knowledge Base

Actualmente el diseño presenta una excelente tabla.

Se recomienda añadir:

## Barra superior

-   Buscar documento
-   Filtrar por categoría
-   Estado
-   Fecha
-   Botón actualizar

## Tabla

Agregar columnas:

-   Nombre
-   Categoría
-   Estado
-   Versión activa
-   Cantidad de chunks
-   Última indexación
-   Última modificación
-   Acciones

## Drawer lateral

Al seleccionar un documento:

Mostrar:

-   Información general
-   Historial de versiones
-   Timeline
-   Estado de indexación
-   Auditoría

No navegar a otra página.

------------------------------------------------------------------------

# Flujo recomendado

Listado

↓

Drawer detalle

↓

Nueva versión

↓

Procesamiento

↓

Ready

------------------------------------------------------------------------

# 3. AI Agent

Actualmente existe un Playground.

Se propone:

Panel dividido.

Izquierda:

-   Chat
-   Historial

Derecha:

-   Documentos recuperados
-   Chunks utilizados
-   Prompt enviado
-   Tokens
-   Tiempo respuesta

Este módulo facilitará las pruebas del sistema RAG.

------------------------------------------------------------------------

# 4. Analytics

Agregar cuatro secciones.

## KPIs

## Consultas por día

## Feedback

## Documentos más utilizados

Agregar filtros:

-   Fecha
-   Categoría
-   Modelo

------------------------------------------------------------------------

# 5. Audit

Tabla principal.

Columnas:

-   Fecha
-   Usuario
-   Consulta
-   Modelo
-   Latencia
-   Score
-   Feedback

Drawer lateral:

-   Prompt completo
-   Respuesta
-   Documentos
-   Chunks
-   Auditoría PII

------------------------------------------------------------------------

# 6. Users

Para el MVP.

Tabla simple.

-   Nombre
-   Correo
-   Rol
-   Último acceso

No implementar edición.

------------------------------------------------------------------------

# 7. Settings

Solo lectura.

Mostrar:

-   Modelo IA
-   Embedding Model
-   Base vectorial
-   Storage
-   Variables importantes

------------------------------------------------------------------------

# Componentes transversales

Todas las pantallas utilizarán:

-   Skeleton Loading
-   Empty State
-   Error State
-   Toast
-   Confirm Dialog

------------------------------------------------------------------------

# Recomendaciones visuales

Conservar:

-   Sidebar oscuro
-   Cards minimalistas
-   Espaciado amplio
-   Iconografía Lucide
-   Tipografía Geist + Inter

Mejorar:

-   Mayor separación entre bloques
-   Menor cantidad de acciones visibles
-   Uso consistente de badges
-   Indicadores de estado con colores homogéneos

------------------------------------------------------------------------

# APIs asociadas

Dashboard

-   GET metrics
-   GET ready

Knowledge Base

-   GET documents
-   POST upload
-   POST version
-   POST reindex

Conversations

-   GET conversations
-   GET messages

Audit

-   GET audit

Users

-   GET users

Analytics

-   GET metrics

------------------------------------------------------------------------

# Definition of Done

Cada pantalla deberá cumplir:

-   Diseño responsive
-   Estados Loading, Empty y Error
-   Integración con API
-   Acciones funcionales
-   Accesibilidad básica
-   Consistencia visual
-   Uso exclusivo de componentes reutilizables

------------------------------------------------------------------------

# Próximo documento

Documento 05 --- Development Roadmap

Se definirá el orden exacto de implementación, dependencias entre
módulos, backlog técnico y planificación por sprints.
