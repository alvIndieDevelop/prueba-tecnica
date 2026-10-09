# Tabla de usuarios

Estado: pendiente.

## Objetivo y prioridades

P0: listar usuarios del backend y buscarlos por nombre o email sin recargar la página. P1: paginación o scroll infinito. P2: filtros por rol o estado.

## Comportamiento, endpoint y datos

`GET /api/users?q=...` devuelve `{users:[{id,name,email,role,status}],total}` desde SQLite. `q` opcional busca por nombre o email con SQL parametrizado. Mostrar indicadores de carga, lista vacía y error. Esperar 300 ms desde el último cambio de texto antes de consultar; abortar peticiones anteriores o ignorar respuestas antiguas para que no sobrescriban la búsqueda más reciente. `page`/`limit` solo se incorporan en P1.

## Aceptación observable

- La tabla muestra datos sembrados en la base, no JSON fijo; `total` refleja la búsqueda.
- Al escribir varias letras rápidamente se solicita el término final tras 300 ms y la página no se recarga.
- Ningún resultado tardío sustituye al de una búsqueda más reciente; una búsqueda sin coincidencias muestra estado vacío.
- P1: navegación por páginas o scroll sin perder coherencia con el filtro.

## Errores

400 para parámetros inválidos, 401 sin sesión válida y 500 genérico ante fallo inesperado. La UI muestra error de petición sin revelar información sensible; redirección cliente ante 401 es P1.
