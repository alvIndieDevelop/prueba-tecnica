# DevPanel

Proyecto full-stack para una prueba técnica de dos horas. Login, dashboard protegido, métricas, directorio con búsqueda y logout están implementados sobre datos SQLite.

## Stack

Next.js 16 App Router con TypeScript para UI y Route Handlers, Tailwind CSS 4, SQLite local mediante `better-sqlite3` y `bcryptjs` para hashes de contraseñas. Un solo proyecto evita servicios externos y capas innecesarias; SQLite permite seed reproducible y consultas reales.

## Instalación y ejecución

### Prerrequisitos

- Node.js 20.9 o superior.
- npm 10 o superior.
- Git.

El proyecto fue verificado con Node.js 24.20.0 y npm 11.19.0.

### Inicio rápido

1. Clonar el repositorio y entrar en el proyecto:

```bash
git clone https://github.com/alvIndieDevelop/prueba-tecnica.git
cd prueba-tecnica
```

2. Instalar las dependencias:

```bash
npm install
```

3. Crear la configuración local:

```bash
cp .env.example .env
```

4. Crear la base SQLite y cargar los 203 usuarios de muestra:

```bash
npm run seed
```

El seed es idempotente: puede ejecutarse nuevamente sin duplicar usuarios.

5. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abrir `http://localhost:3000`. La ruta inicial redirige a `/login`.

### Variables de entorno

| Variable | Valor predeterminado | Descripción |
| --- | --- | --- |
| `DATABASE_PATH` | `./data/devpanel.sqlite` | Ruta del archivo SQLite local. |
| `SESSION_DURATION_SECONDS` | `604800` | Duración de una sesión en segundos (siete días). |

Las variables son exclusivas del servidor y no deben usar el prefijo `NEXT_PUBLIC_`. Después de cambiar la duración hay que reiniciar el servidor e iniciar una sesión nueva; las sesiones existentes conservan su vencimiento original.

### Producción local

```bash
npm run build
npm start
```

La base de datos debe haberse preparado previamente con `npm run seed`.

### Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia Next.js en modo desarrollo. |
| `npm run seed` | Crea el esquema y actualiza los datos de muestra. |
| `npm run lint` | Ejecuta ESLint. |
| `npm run build` | Genera el build de producción y valida TypeScript. |
| `npm start` | Sirve un build generado previamente. |

## Credenciales de prueba

`demo@devpanel.local` / `Devpanel123!`. El seed crea 203 usuarios con roles y estados variados. Nunca se guardan contraseñas en texto plano en SQLite.

## Backend disponible

- `POST /api/auth/login`: valida credenciales, crea sesión persistente y establece cookie `HttpOnly`.
- `GET /api/auth/me`: devuelve el usuario de la sesión vigente.
- `POST /api/auth/logout`: invalida la sesión y elimina la cookie.
- `GET /api/metrics`: devuelve usuarios totales y activos desde SQLite.
- `GET /api/users?q=...&role=...&status=...&page=...&limit=...`: lista, busca, filtra y pagina usuarios.

El dashboard valida la sesión en servidor y redirige a `/login` cuando no existe una sesión válida. `/api/auth/me`, `/api/metrics` y `/api/users` validan la sesión en cada petición; logout es idempotente y elimina la sesión cuando existe.

La interfaz consume estos endpoints, presenta tres métricas, estados de carga, error y vacío, filtros combinables y paginación de diez registros. La búsqueda aplica debounce de 300 ms con cancelación de solicitudes anteriores.

## Decisiones y límites

Sesiones de siete días con token opaco aleatorio en cookie `HttpOnly`, hash de token y vencimiento en SQLite; cada recurso protegido valida su sesión en servidor. Métricas y usuarios provienen de consultas a SQLite, no de JSON fijo. Fuera de alcance: registro, recuperación de contraseña, CRUD de usuarios, permisos avanzados y despliegue. No se incluyeron tests automatizados para priorizar el flujo funcional dentro del tiempo disponible; la verificación es manual más build. Los resultados están en `docs/verification.md`.
