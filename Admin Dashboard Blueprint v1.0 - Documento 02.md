# Admin Dashboard Blueprint v1.0

# Documento 02 --- Frontend Technical Design

## Objetivo

Definir la arquitectura técnica del frontend del Admin Dashboard para
garantizar escalabilidad, mantenibilidad y reutilización de componentes.

------------------------------------------------------------------------

# Principios

-   Arquitectura modular (Feature First)
-   Componentes reutilizables
-   Separación entre UI, lógica y acceso a datos
-   Tipado estricto con TypeScript
-   Consumo exclusivo de la API FastAPI
-   Estado del servidor mediante TanStack Query
-   Formularios con React Hook Form + Zod

------------------------------------------------------------------------

# Stack Tecnológico

-   React 19
-   Vite
-   TypeScript
-   Tailwind CSS
-   React Router
-   TanStack Query
-   React Hook Form
-   Zod
-   Recharts
-   Lucide React
-   Supabase Auth

------------------------------------------------------------------------

# Estructura propuesta

``` text
src/
│
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   ├── providers.tsx
│   └── query-client.ts
│
├── assets/
├── components/
│   ├── common/
│   ├── forms/
│   ├── layout/
│   ├── tables/
│   ├── charts/
│   └── feedback/
│
├── features/
│   ├── dashboard/
│   ├── documents/
│   ├── conversations/
│   ├── audit/
│   ├── analytics/
│   ├── users/
│   └── settings/
│
├── hooks/
├── layouts/
├── lib/
├── routes/
├── services/
├── stores/
├── styles/
├── types/
└── utils/
```

------------------------------------------------------------------------

# Arquitectura por Feature

Cada módulo contendrá:

``` text
documents/
│
├── api/
├── components/
├── hooks/
├── pages/
├── schemas/
├── types/
└── index.ts
```

Beneficios:

-   Bajo acoplamiento
-   Escalabilidad
-   Reutilización
-   Fácil testing

------------------------------------------------------------------------

# Gestión de Estado

## Estado servidor

TanStack Query

Responsable de:

-   Cache
-   Refetch
-   Loading
-   Error
-   Invalidación

## Estado global

Zustand

Uso exclusivo para:

-   Sidebar
-   Preferencias UI
-   Tema
-   Usuario autenticado

No almacenar información proveniente de la API.

------------------------------------------------------------------------

# Autenticación

Supabase Auth

Flujo:

1.  Login con Google
2.  Obtener sesión
3.  Obtener JWT
4.  Consumir FastAPI
5.  Backend valida permisos

------------------------------------------------------------------------

# Routing

Rutas protegidas

``` text
/login

/dashboard

/documents

/documents/:id

/conversations

/conversations/:id

/audit

/analytics

/users

/settings
```

------------------------------------------------------------------------

# Servicios

Cada feature posee su cliente API.

Ejemplo

``` text
services/

documents.service.ts

users.service.ts

audit.service.ts

analytics.service.ts
```

No se realizarán llamadas HTTP directamente desde los componentes.

------------------------------------------------------------------------

# Convenciones

-   Componentes en PascalCase
-   Hooks prefijo use
-   Servicios terminados en .service.ts
-   Tipos centralizados
-   Un componente = una responsabilidad

------------------------------------------------------------------------

# Manejo de errores

-   Error Boundary
-   Toast global
-   Estados Empty
-   Skeleton Loading
-   Retry automático para consultas

------------------------------------------------------------------------

# Convenciones UI

Layout persistente:

Sidebar

↓

Header

↓

Breadcrumb

↓

Contenido

↓

Footer

------------------------------------------------------------------------

# Preparado para evolución

La arquitectura permitirá incorporar sin cambios estructurales:

-   Realtime
-   Configuración dinámica
-   Playground IA
-   Gestión avanzada de permisos
-   Multiinstitución

------------------------------------------------------------------------

# Resultado esperado

Un frontend desacoplado del backend, organizado por módulos y preparado
para crecer conforme se complete el pipeline RAG.
