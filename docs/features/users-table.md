# Tabla de usuarios

Estado: implementado. Endpoint, búsqueda, filtros y paginación SQL verificados; tabla conectada con carga, error, vacío, debounce de 300 ms, filtros combinables, páginas de diez registros y cancelación mediante `AbortController`. Observación interactiva en navegador pendiente.

## Objetivo y prioridades

P0: listar usuarios del backend y buscarlos por nombre o email sin recargar la página. P1: paginación implementada. P2: filtros por rol o estado implementados.

## Comportamiento, endpoint y datos

`GET /api/users?q=...&role=...&status=...&page=...&limit=...` devuelve usuarios y metadatos de paginación desde SQLite. Todos los criterios se combinan con SQL parametrizado antes de `COUNT`, `LIMIT` y `OFFSET`. La UI muestra diez registros, rango, página actual y navegación. Espera 300 ms desde el último cambio antes de consultar y aborta peticiones anteriores.

## Aceptación observable

- La tabla muestra datos sembrados en la base, no JSON fijo; `total` refleja la búsqueda.
- Al escribir varias letras rápidamente se solicita el término final tras 300 ms y la página no se recarga.
- Ningún resultado tardío sustituye al de una búsqueda más reciente; una búsqueda sin coincidencias muestra estado vacío.
- Los filtros de rol y estado funcionan solos o combinados con la búsqueda y se pueden limpiar juntos.
- La navegación conserva búsqueda y filtros, y vuelve a la primera página cuando cambian.

## Errores

400 para parámetros inválidos, 401 sin sesión válida y 500 genérico ante fallo inesperado. La UI muestra error de petición sin revelar información sensible; redirección cliente ante 401 es P1.
