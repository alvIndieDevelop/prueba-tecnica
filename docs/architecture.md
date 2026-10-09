# Arquitectura prevista

Monolito Next.js App Router con TypeScript: UI sencilla con Tailwind, Route Handlers en runtime Node.js y SQLite local mediante `better-sqlite3`. Sin servicios externos, Docker ni abstracciones adicionales. `bcryptjs` permite guardar solo hashes de contraseñas. SQLite, seed, autenticación, endpoints y UI están conectados.

## Estructura y responsabilidades previstas

```text
src/app/login/                 formulario de acceso
src/app/dashboard/             página protegida y métricas/tabla
src/app/api/auth/login/        POST login
src/app/api/auth/logout/       POST logout (P1)
src/app/api/auth/me/           GET sesión actual
src/app/api/metrics/           GET métricas
src/app/api/users/             GET usuarios
src/components/                presentación y estados de carga/error
src/lib/db.ts                  conexión SQLite y consultas parametrizadas
src/lib/auth.ts                hash, cookie y validación de sesión
scripts/seed.ts                seed idempotente
data/                          base SQLite local, no versionada
```

La UI consume endpoints para métricas y usuarios; el dashboard comprueba la sesión en servidor antes de renderizar. Cada endpoint protegido vuelve a comprobarla en el backend. Evitar middleware dependiente de SQLite. Errores inesperados: 500 genérico sin revelar detalles internos.

## Datos y sesión

- `users`: `id`, `name`, `email` único, `password_hash`, `role`, `status`, `created_at`.
- `sessions`: `id`, `user_id`, `token_hash` único, `expires_at`; vínculo a `users`.
- Login: validar entrada y credenciales con `bcryptjs`; generar token opaco con CSPRNG, guardar solo SHA-256 del token y vencimiento en SQLite, enviar el token únicamente en cookie `HttpOnly`, `SameSite=Lax`, `Path=/`, `Secure` en producción y `Max-Age` coherente con `expires_at`.
- En cada petición protegida, hashear el token recibido, consultar sesión/usuario en SQLite y rechazar ausencia o vencimiento con 401. La sesión sobrevive recargas y reinicios hasta expirar. No serializar `password_hash` ni token.
- Logout (P1): borrar sesión en SQLite e invalidar cookie con los mismos atributos de ruta; si falta la sesión, no revelar datos. La expiración también invalida el acceso aunque quede una cookie antigua.

## Contratos propuestos

| Método y ruta | Entrada | Éxito | Errores |
| --- | --- | --- | --- |
| `POST /api/auth/login` | JSON `{email,password}` | 200 `{user:{id,name,email,role,status}}` y cookie | 400 entrada inválida; 401 credenciales incorrectas; 500 inesperado |
| `GET /api/auth/me` | Cookie | 200 `{user:{id,name,email,role,status}}` | 401 sin sesión válida; 500 inesperado |
| `POST /api/auth/logout` (P1) | Cookie | 204 sin cuerpo y cookie borrada, incluso si falta sesión | 500 inesperado |
| `GET /api/metrics` | Cookie | 200 `{totalUsers,activeUsers}` | 401 sin sesión válida; 500 inesperado |
| `GET /api/users?q=...&role=...&status=...&page=...&limit=...` | Cookie; filtros y paginación opcionales | 200 `{users,total,page,limit,totalPages}` | 400 parámetros inválidos; 401 sin sesión válida; 500 inesperado |

`GET /api/users` busca por nombre o email y filtra por `admin|member` y `active|inactive` con SQL parametrizado, sin interpolar entrada. `total` cuenta el resultado combinado antes de aplicar `LIMIT/OFFSET`; `page` empieza en 1 y `limit` acepta 10, 20 o 50.

## Datos iniciales y configuración

Seed reproducible e idempotente con 203 usuarios de distinto rol y estado. Cuenta de prueba: `demo@devpanel.local` / `Devpanel123!`; genera hashes bcrypt al ejecutar el seed y nunca guarda contraseñas en texto plano. Métricas reales mediante `COUNT(*)` sobre `users` y `COUNT(*)` de usuarios activos, no JSON fijo. Variables server-only: `DATABASE_PATH=./data/devpanel.sqlite` y `SESSION_DURATION_SECONDS=604800`. Token aleatorio, sin secreto estático ni variable de firma. Ejecutar el seed con `npm run seed`.
