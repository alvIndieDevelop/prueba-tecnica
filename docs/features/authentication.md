# Autenticación

Estado: implementado. Backend y redirecciones server-side verificados; formulario, logout y manejo cliente de 401 conectados.

## Objetivo y prioridades

- P0: login por POST, sesión persistente y dashboard protegido con redirección al login cuando no haya sesión válida.
- P1, solo tras verificar P0: logout y redirección del cliente al recibir 401 por vencimiento.

## Comportamiento y datos

Formulario de email/contraseña. `POST /api/auth/login` valida entrada, verifica el hash de contraseña y crea sesión SQLite con token aleatorio opaco entregado en cookie `HttpOnly` y vencimiento coherente con su `Max-Age`. `GET /api/auth/me` devuelve solo `id,name,email,role,status` cuando la sesión es válida. El dashboard verifica la sesión en servidor antes de renderizar; las APIs protegidas la comprueban de nuevo en cada petición. En P1, `POST /api/auth/logout` elimina la sesión y borra la cookie; un 401 recibido en cliente redirige al login.

## Aceptación observable

- Credenciales correctas permiten acceder; credenciales incorrectas no crean sesión.
- Recargar conserva el acceso, incluso después de reiniciar el servidor mientras la sesión no expire.
- Sin cookie válida o con sesión vencida, el dashboard redirige y `/api/auth/me`, `/api/metrics` y `/api/users` responden 401.
- P1: logout impide reutilizar la sesión y limpia la cookie; un 401 posterior conduce al login.

## Errores

400 para entrada inválida; 401 para credenciales incorrectas o sesión ausente/vencida; 500 genérico para fallos inesperados. Nunca exponer tokens, hashes o secretos en respuesta ni logs.
