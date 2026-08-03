# Admin Dashboard - Design Brief

> Documento de referencia para el diseñador UX/UI del panel de administración del sistema de atención inteligente basado en arquitectura RAG.

---

# 1. Descripción General de la Maqueta

## Introducción

La maqueta corresponde al panel de administración del sistema de atención inteligente desarrollado como proyecto de tesis, basado en una arquitectura **Retrieval-Augmented Generation (RAG)** para la consulta de documentación institucional mediante Inteligencia Artificial.

El dashboard tiene como objetivo proporcionar una interfaz centralizada para administrar el conocimiento utilizado por el asistente, supervisar su funcionamiento, consultar métricas de uso y gestionar los diferentes componentes del sistema desde una experiencia moderna, clara e intuitiva.

A diferencia de un sistema administrativo tradicional, este panel está orientado a la administración de conocimiento y al monitoreo de un asistente de IA.

---

# 2. Objetivos del Producto

- Gestionar documentos institucionales.
- Administrar versiones de documentos.
- Supervisar el proceso de indexación.
- Probar el funcionamiento del asistente IA.
- Visualizar métricas de uso.
- Consultar auditorías.
- Administrar usuarios y permisos.
- Configurar parámetros generales del sistema.

## Objetivos de UX

- Reducir la complejidad.
- Priorizar la claridad.
- Facilitar la navegación.
- Transmitir innovación y confianza.

---

# 3. Estilo Visual

Inspirado en:

- Notion
- Supabase Studio
- OpenAI Platform
- Linear
- Vercel

Se busca transmitir simplicidad, profesionalismo, tecnología, organización y una experiencia moderna, evitando la apariencia de un ERP o software administrativo tradicional.

---

# 4. Arquitectura de Navegación

```text
Dashboard

Knowledge Base
 ├── Documentos
 ├── Categorías
 └── Versiones

AI Agent
 ├── Playground
 └── Evaluaciones

Analytics

Audit

Users

Settings
```

---

# 5. Pantallas

## Dashboard
Resumen general del sistema con KPIs, estado del sistema, actividad reciente y accesos rápidos.

## Knowledge Base
Gestión de documentos, búsqueda, filtros, carga de PDF, versiones, reindexación y estado de procesamiento.

## AI Agent Playground
Espacio para probar el asistente mostrando pregunta, respuesta, documentos utilizados, chunks, tiempo de respuesta y metadatos.

## Analytics
Visualización de consultas, latencia, documentos más utilizados y métricas generales.

## Audit
Registro de consultas, respuestas, usuario, fecha, documentos utilizados y trazabilidad.

## Users
Administración de usuarios y roles.

## Settings
Configuración del modelo IA, parámetros RAG y opciones generales.

---

# 6. Componentes Principales

- Sidebar
- Header
- Cards
- KPI Cards
- Tablas
- Formularios
- Search Bar
- Upload Area
- Drawer
- Modal
- Tabs
- Timeline
- Badges
- Toast
- Skeleton Loading
- Empty States

---

# 7. Responsive

- Desktop como experiencia principal.
- Tablet con navegación colapsable.
- Mobile adaptado mediante tarjetas y menú hamburguesa.

---

# 8. Identidad Visual

## Colores

- Fondo: #FAFAFA
- Cards: #FFFFFF
- Primario: #4F46E5
- Texto: #18181B
- Texto secundario: #71717A

## Tipografía

- Inter
- Geist

---

# 9. Tecnologías

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- React Hook Form
- Zod
- Recharts
- Lucide React

## Backend

- Python
- FastAPI

## Base de Datos

- PostgreSQL
- Supabase

## Almacenamiento

- Supabase Storage

## IA

- Arquitectura RAG
- Embeddings
- Búsqueda semántica
- Procesamiento de PDFs
- Capa de privacidad

---

# 10. Estado Actual

Actualmente se utiliza un template moderno como base para acelerar el desarrollo funcional. Una vez completada la integración con el backend, el diseño será refinado para incorporar una identidad visual propia.

---

# 11. Entregables Esperados

- Sistema de diseño
- Componentes reutilizables
- Pantallas completas
- Prototipo en Figma
- Auto Layout
- Variables de color
- Assets para desarrollo

---

# Nota Final

Este documento tiene como objetivo brindar al diseñador una visión general del producto, su propósito, estilo visual y alcance funcional, permitiendo desarrollar una interfaz moderna, consistente y alineada con la filosofía del proyecto.
