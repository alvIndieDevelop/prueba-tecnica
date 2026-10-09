# DevPanel

Proyecto full-stack para una prueba técnica de dos horas. Login, dashboard protegido, métricas, directorio con búsqueda y logout están implementados sobre datos SQLite.

## Stack

Next.js 16 App Router con TypeScript para UI y Route Handlers, Tailwind CSS 4, SQLite local mediante `better-sqlite3` y `bcryptjs` para hashes de contraseñas. Un solo proyecto evita servicios externos y capas innecesarias; SQLite permite seed reproducible y consultas reales.

## Instalación y ejecución

- Prerrequisitos: Node.js 20.9 o superior y npm. Verificado con Node.js 24.20.0 y npm 11.19.0.
- Instalar dependencias: `npm install`.
- Configurar entorno: crear `.env` a partir de `.env.example`; ajustar `DATABASE_PATH` y `SESSION_DURATION_SECONDS` si hace falta.
- Preparar o actualizar la DB con datos de muestra: `npm run seed`. El comando es idempotente.
- Iniciar desarrollo: `npm run dev`; abrir `http://localhost:3000`.
- Validar lint: `npm run lint`.
- Crear build de producción: `npm run build`; iniciar ese build con `npm start`.

## Credenciales previstas

`demo@devpanel.local` / `Devpanel123!`. El seed crea 203 usuarios con roles y estados variados. Nunca se guardan contraseñas en texto plano en SQLite.

## Backend disponible

- `POST /api/auth/login`: valida credenciales, crea sesión persistente y establece cookie `HttpOnly`.
- `GET /api/auth/me`: devuelve el usuario de la sesión vigente.
- `POST /api/auth/logout`: invalida la sesión y elimina la cookie.
- `GET /api/metrics`: devuelve usuarios totales y activos desde SQLite.
- `GET /api/users?q=...&role=...&status=...&page=...&limit=...`: lista, busca, filtra y pagina usuarios.

El dashboard valida la sesión en servidor y redirige a `/login` cuando no existe una sesión válida. Todos los endpoints excepto login vuelven a validar la sesión.

La interfaz consume estos endpoints, presenta tres métricas, estados de carga, error y vacío, filtros combinables y paginación de diez registros. La búsqueda aplica debounce de 300 ms con cancelación de solicitudes anteriores.

## Decisiones y límites

Sesiones de siete días con token opaco aleatorio en cookie `HttpOnly`, hash de token y vencimiento en SQLite; cada recurso protegido valida su sesión en servidor. Métricas y usuarios provienen de consultas a SQLite, no de JSON fijo. Fuera de alcance: registro, recuperación de contraseña, CRUD de usuarios, permisos avanzados y despliegue. No se incluyeron tests automatizados para priorizar el flujo funcional dentro del tiempo disponible; la verificación es manual más build. Los resultados están en `docs/verification.md`.
