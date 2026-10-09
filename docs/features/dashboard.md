# Dashboard

Estado: implementado. Endpoint y protección server-side verificados; UI conectada con carga, error y reintento.

## Objetivo y prioridad

P0: mostrar al menos dos tarjetas con métricas reales del backend en página protegida. La UI muestra total, activos e inactivos. P2: mostrar usuario conectado y pulir presentación.

## Comportamiento, endpoint y datos

La página valida la sesión en servidor antes de renderizar; si no es válida, redirige a login. Consulta `GET /api/metrics` para `{totalUsers,activeUsers}`: conteos SQL sobre usuarios totales y usuarios con estado activo. Mostrar carga y error sin inventar números. En P2, obtener identidad pública mediante sesión o `GET /api/auth/me`.

## Aceptación observable

- Sin sesión válida no se ve el dashboard.
- Con sesión válida aparecen dos conteos concordantes con SQLite, no valores codificados en la UI.
- La carga tiene indicador y un fallo muestra error recuperable en lugar de números ficticios.

## Errores

401 de API si la sesión falta o expiró; 500 genérico para fallo inesperado. Redirección cliente ante 401 durante navegación ya abierta corresponde a P1.
