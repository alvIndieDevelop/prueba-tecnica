# DevPanel

Borrador de proyecto para una prueba técnica de dos horas. La aplicación aún no está implementada ni verificada.

## Stack previsto

Next.js App Router con TypeScript para UI y Route Handlers, Tailwind para estilos sencillos, SQLite local mediante `better-sqlite3` y `bcryptjs` para hashes de contraseñas. Un solo proyecto evita servicios externos y capas innecesarias; SQLite permite seed reproducible y consultas reales.

## Instalación y ejecución

- Prerrequisitos previstos: Node.js y gestor de paquetes compatibles con las versiones que se seleccionen; versiones exactas pendientes.
- Instalar dependencias: comando pendiente de confirmar después del setup.
- Configurar entorno: copiar `.env.example` a `.env.local` y ajustar `DATABASE_PATH` si hace falta; comando exacto pendiente.
- Preparar DB y ejecutar seed: comando pendiente de implementación y validación.
- Iniciar servidor y ejecutar build: comandos pendientes de implementación y validación.

## Credenciales previstas

`demo@devpanel.local` / `Devpanel123!` (pendientes de crear y verificar en el seed). Incluir al menos otro usuario con estado distinto. Nunca guardar contraseñas en texto plano en SQLite.

## Decisiones y límites

Sesiones con token opaco aleatorio en cookie `HttpOnly`, hash de token y vencimiento en SQLite; cada recurso protegido valida su sesión en servidor. Métricas y usuarios provienen de consultas a SQLite, no de JSON fijo. P0 precede a logout, paginación y mejoras visuales. Fuera de alcance: registro, recuperación de contraseña, CRUD de usuarios, permisos avanzados y despliegue. No se incluyeron tests automatizados para priorizar el flujo funcional dentro del tiempo disponible; la verificación prevista es manual más build. Los resultados aún figuran como pendientes en `docs/verification.md`.
