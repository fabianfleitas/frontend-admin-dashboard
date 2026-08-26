# Admin Dashboard Functional Specifications

# Documento 12 --- Users & Settings

## Users

### Objetivo

Consultar los usuarios autorizados al dashboard.

Campos (UserOut):

-   external_auth_id
-   email
-   role (STUDENT | STAFF | ADMIN)
-   created_at
-   updated_at

Acciones MVP:

-   Visualizar información (listado read-only).

Gestión de roles: pendiente de backend (Nivel 2).

### Endpoints

-   GET /api/admin/users

### Componentes

-   UsersPage
-   UsersTable
-   RoleBadge

------------------------------------------------------------------------

## Settings

### Objetivo

Mostrar información técnica del sistema.

Secciones:

-   Modelo LLM (pendiente en backend)
-   Embedding Model (pendiente en backend)
-   Storage (pendiente en backend)
-   Vector Store (pendiente en backend)
-   Estado del sistema (GET /ready + GET /api/admin/metrics)

Los bloques LLM/Embedding/Storage/Vector no tienen endpoint: se renderizan
"solo lectura" con aviso "pendiente en backend".

### Componentes

-   SettingsPage (PendingBlock)

## Definition of Done

Información correctamente obtenida desde el backend.
