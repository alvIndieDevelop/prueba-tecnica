# Plan de documentación inicial de DevPanel

## Contexto y límites

- Inspección realizada: repositorio sin archivos versionados, commits ni cambios pendientes; solo `.kilo/` local. Conservar cualquier trabajo que aparezca antes de editar.
- En la etapa solicitada crear únicamente `AGENTS.md`, `README.md`, `AI-LOG.md`, `.env.example`, `docs/requirements.md`, `docs/architecture.md`, `docs/implementation-plan.md`, `docs/verification.md` y `docs/features/{authentication,dashboard,users-table}.md`. No implementar código, instalar dependencias, crear tests ni afirmar comprobaciones no realizadas.
- Esta etapa ocupa como máximo los primeros 10 minutos del bloque 0–15 min indicado por el usuario. No hacer un commit sin petición explícita; el plan documentará commits progresivos para la posterior implementación.

## Decisiones técnicas para documentar

- Proyecto monolítico Next.js App Router + TypeScript; UI Tailwind simple; Route Handlers Node.js para API; SQLite local con `better-sqlite3` y seed idempotente; contraseñas con `bcryptjs` (hash del seed generado al ejecutar el seed, nunca texto plano en DB).
- Carpetas previstas: `src/app/{login,dashboard,api/auth/login,api/auth/logout,api/auth/me,api/metrics,api/users}`, `src/components/`, `src/lib/{db,auth}.ts`, `scripts/seed.ts`, `data/` (DB local no versionada). Marcar estructura como prevista, no existente.
- Usuario mínimo: `id`, `name`, `email` único, `password_hash`, `role`, `status`, `created_at`; sesión: `id`, `user_id`, `token_hash` único, `expires_at`. No serializar `password_hash` ni token. Token aleatorio opaco, hash SHA-256 almacenado, cookie `HttpOnly`, `SameSite=Lax`, `Secure` en producción, `Path=/`, `Max-Age` coherente con expiración de DB. Persistencia tras recarga/reinicio; validar sesión y vencimiento en servidor en cada endpoint protegido y antes de renderizar dashboard. Logout P1: borrar sesión de DB e invalidar cookie. Evitar middleware dependiente de SQLite.
- Contratos a documentar: `POST /api/auth/login` `{email,password}` -> 200 `{user:{id,name,email,role,status}}` y cookie, 400 entrada inválida, 401 credenciales incorrectas; `GET /api/auth/me` -> 200 `{user}` o 401; `POST /api/auth/logout` -> 204 y cookie borrada, tratar ausencia de sesión sin exponer datos; `GET /api/metrics` -> 200 `{totalUsers,activeUsers}` o 401; `GET /api/users?q=...` -> 200 `{users:[{id,name,email,role,status}], total}` o 401/400, con búsqueda SQL parametrizada por nombre o email; paginación `page/limit` solo P1. 500 genérico en fallos inesperados, sin filtrar secretos.
- Seed de muestra con al menos dos usuarios de distinto estado y credenciales de prueba `demo@devpanel.local` / `Devpanel123!`; idempotente y reproducible. Métricas `COUNT(*)` total y activos sobre SQLite, no datos fijos en JSON. Única variable inicial prevista: `DATABASE_PATH=./data/devpanel.sqlite`; secretos de sesión generados con CSPRNG, no variable ni clave estática. Comandos exactos de setup/seed/build y versiones de dependencias se marcarán pendientes hasta implementarlos y validarlos.
- Búsqueda de 300 ms con estado vacío/error y protección contra carreras (AbortController o secuencia de solicitud). En P1, redirigir al login al recibir 401 por expiración en cliente; el dashboard y las APIs se protegen ya en P0.

## Archivos y contenido

1. `AGENTS.md`: lectura previa de requisitos y plan; P0 antes de P1/P2; TypeScript explícito sin `any` injustificado; validación backend por endpoint; no registrar ni exponer hashes/tokens; log solo de prompts/decisiones/correcciones reales; commits coherentes progresivos; verificar antes de marcar terminado; evitar scope creep; prohibición de tests automatizados, frameworks de testing y cobertura; verificación manual + build.
2. `docs/requirements.md`: transcribir sin alterar la priorización P0 (login POST, persistencia, protección y redirección, 2 métricas, tabla backend, debounce sin reload), P1 (paginación/scroll, logout, 401), P2 (usuario header, filtros, visual). Restricciones y fuera de alcance exactamente según encargo, incluida entrega pública `devpanel-[nombre]`, IA documentada y commits progresivos. Diferenciar intención de implementación de evidencia de funcionamiento.
3. `docs/architecture.md`: estructura prevista, responsabilidades UI/API/DB, esquema y flujo de sesión único, contratos completos, seed y métricas SQL, búsqueda parametrizada, variables; explicar invalidación en logout y fallos 400/401/500.
4. `docs/features/{authentication,dashboard,users-table}.md`: para cada una objetivo, requisitos y prioridades, comportamiento, endpoints/datos, aceptación observable, errores y `Estado: pendiente`. Autenticación: persistencia/protección P0, logout/401 P1; dashboard: métricas reales con carga/error; tabla: backend, debounce 300 ms, vacío/error, respuestas fuera de orden y paginación P1.
5. `docs/implementation-plan.md`: checklist con bloques exactos del usuario: 0–15 documentación/setup/primer commit (esta etapa, máximo 10 minutos); 15–45 DB/seed/login/sesión; 45–60 endpoints protegidos/usuarios/métricas; 60–90 UI/login/dashboard/tabla/búsqueda; 90–100 verificar P0 antes de P1; 100–120 validación final/README/AI-LOG/commit. Incluir únicamente comprobación manual y build, sin tests ni cobertura. No ejecutar ningún bloque posterior en esta etapa.
6. `docs/verification.md`: **únicamente** checklist manual con resultados `Pendiente` para: login correcto e incorrecto; persistencia al recargar; página y endpoints protegidos sin sesión; métricas y tabla desde backend; debounce sin recargar; logout y 401 si se implementan; build e instrucciones de ejecución. Registrar resultados reales solo tras comprobarlos.
7. `README.md`: borrador de stack, prerrequisitos, instalación/ejecución, credenciales de prueba, decisiones y límites. Marcar comandos y datos no confirmados como pendientes; declarar que no se incluyeron tests automatizados para priorizar el flujo funcional dentro del tiempo disponible; no afirmar que ya ejecuta.
8. `AI-LOG.md`: modelo conocido `openai/gpt-6-sol` y herramienta Kilo Code; conservar **literalmente el texto completo del primer mensaje del usuario**, incluida la política de verificación, como primer prompt (sin añadir los recordatorios inyectados del sistema); registrar solo el resultado real de esta etapa y decisiones que efectivamente se hayan documentado; dejar pendientes rechazos/correcciones, porcentajes de código IA/humano y aciertos/errores sin evidencia. Indicar explícitamente la limitación del modo de planificación si no se generan documentos todavía.
9. `.env.example`: solamente `DATABASE_PATH=./data/devpanel.sqlite`, ejemplo local sin secretos reales.

## Secuencia y validación de esta etapa

1. En agente capaz de editar documentación, inspeccionar nuevamente estado y archivos, crear `docs/features/` y los once archivos pedidos, sin sobrescribir trabajo concurrente.
2. Revisar consistencia entre P0/P1, cookie y expiración, contratos y credenciales; confirmar que los 11 archivos existen, que no se crearon tests/configuraciones de tests, ni se instalaron dependencias, ni se implementó aplicación. Esta revisión documental no equivale a verificar funcionalidades o build; mantener checklist de ejecución pendiente.
3. Entregar resumen breve de archivos, decisiones y siguiente paso (setup/DB/seed y autenticación P0). En una fase posterior, ejecutar verificación manual y build y registrar resultados reales. Publicación y commits quedan para fase autorizada; no inferir que ya se realizaron.

## Incertidumbres no bloqueantes

- Nombre definitivo del repositorio público y comandos exactos de instalación/seed se completarán cuando exista implementación; documentar como pendientes.
- No existen datos previos para migrar ni aplicación actual cuyo comportamiento preservar.
