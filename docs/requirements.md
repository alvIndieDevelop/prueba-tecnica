# Requisitos de DevPanel

Estado: P0 y logout P1 implementados. Backend, navegación server-side, lint y build verificados; observación interactiva del debounce en navegador pendiente.

## P0: obligatorio

1. Login con email y contraseña mediante POST al backend.
2. Sesión persistente después de recargar.
3. Dashboard protegido con redirección al login si no hay sesión válida.
4. Al menos dos tarjetas de métricas.
5. Tabla de usuarios obtenidos del backend.
6. Búsqueda con debounce sin recargar toda la página.

## P1: después de verificar P0

- Paginación o scroll infinito (paginación implementada).
- Logout.
- Manejo de 401 para redirigir al login cuando la sesión vence.

## P2: opcional

- Usuario conectado visible en el header.
- Filtros por rol o estado (implementados).
- Mayor pulido visual.

## Restricciones

- Ejecutarse localmente con instrucciones claras.
- No usar un archivo JSON como fuente fija de usuarios.
- Uso de IA obligatorio y documentado.
- Entrega en un repositorio público `devpanel-[nombre]` (nombre definitivo pendiente).
- Commits progresivos durante las dos horas de implementación; esta etapa documental no incluye commit.
- Por el límite de tiempo, no crear tests automatizados ni configurar frameworks de testing o cobertura. Verificar manualmente y ejecutar el build.

## Fuera de alcance

- Registro y recuperación de contraseña.
- Crear, editar y eliminar usuarios.
- Gestión avanzada de permisos.
- Despliegue y servicios externos.
