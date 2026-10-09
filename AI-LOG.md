# Bitácora de IA: DevPanel

Herramienta: Kilo Code. Modelo conocido al iniciar la bitácora: `openai/gpt-6-sol`.

## Primer prompt del usuario (transcripción literal)

```text
Actúa como desarrollador full-stack senior. Vamos a construir DevPanel para una prueba técnica con un límite total de 2 horas.

Tu primera tarea es crear los archivos de contexto y documentación necesarios para implementar el proyecto. En esta etapa no implementes funcionalidades ni instales dependencias. Inspecciona primero el repositorio y conserva cualquier trabajo existente.

Mantén la documentación breve, concreta y útil para programar. Dedica máximo 10 minutos a esta etapa.

## Stack propuesto

- Next.js con App Router y TypeScript.
- Frontend y backend en el mismo proyecto, utilizando Route Handlers.
- SQLite con seed reproducible.
- Contraseñas hasheadas.
- Sesión mediante token en cookie HttpOnly, persistente y con vencimiento.
- Estilos sencillos con Tailwind.

Documenta estas elecciones y sus razones. Evita servicios externos, Docker y capas de abstracción innecesarias.

## Archivos que debes crear

En la raíz:

- AGENTS.md
- README.md
- AI-LOG.md
- .env.example

Dentro de docs/:

- requirements.md
- architecture.md
- implementation-plan.md
- verification.md

Dentro de docs/features/:

- authentication.md
- dashboard.md
- users-table.md

## Contenido esperado

### AGENTS.md

Instrucciones para el agente:
- Leer los requisitos y el plan antes de implementar.
- Completar y verificar P0 antes de abordar P1 o P2.
- Usar TypeScript con tipos explícitos y evitar any injustificados.
- Validar la sesión en el backend de cada endpoint protegido.
- No exponer hashes de contraseñas ni tokens en respuestas o logs.
- Registrar prompts, decisiones y correcciones reales en AI-LOG.md.
- Mantener commits progresivos con cambios coherentes.
- No marcar funcionalidades como terminadas sin verificarlas.
- No ampliar el alcance sin una razón documentada.

### docs/requirements.md

Separar claramente:

P0 — obligatorio:
1. Login con email y contraseña mediante POST al backend.
2. Sesión persistente después de recargar.
3. Dashboard protegido con redirección al login si no hay sesión válida.
4. Al menos dos tarjetas de métricas.
5. Tabla de usuarios obtenidos del backend.
6. Búsqueda con debounce sin recargar toda la página.

P1 — después de verificar P0:
- Paginación o scroll infinito.
- Logout.
- Manejo de 401 para redirigir al login cuando la sesión vence.

P2 — opcional:
- Usuario conectado visible en el header.
- Filtros por rol o estado.
- Mayor pulido visual.

Restricciones:
- Debe ejecutarse localmente con instrucciones claras.
- No usar un archivo JSON como fuente fija de usuarios.
- Uso de IA obligatorio y documentado.
- Entrega en un repositorio público devpanel-[nombre].
- Commits progresivos durante las dos horas.

Fuera de alcance:
- Registro y recuperación de contraseña.
- Crear, editar y eliminar usuarios.
- Gestión avanzada de permisos.
- Despliegue y servicios externos.

### docs/architecture.md

Definir brevemente:
- Estructura de carpetas prevista.
- Responsabilidades de frontend, endpoints y acceso a datos.
- Modelo mínimo de usuarios y sesiones.
- Flujo de login, validación, vencimiento y logout.
- Contratos de endpoints: método, ruta, entrada, respuesta y errores.
- Seed con credenciales de prueba.
- Métricas calculadas desde la base de datos.
- Búsqueda parametrizada por nombre o email.
- Variables de entorno necesarias.

Mantener una única estrategia de sesión coherente. Documentar cómo se elimina o invalida al cerrar sesión.

### docs/features/

Cada archivo debe incluir:
- Objetivo.
- Requisitos asociados y prioridades.
- Comportamiento esperado.
- Endpoints y datos involucrados.
- Criterios de aceptación observables.
- Casos de error.
- Estado inicial: pendiente.

authentication.md:
Login, persistencia, protección, logout y manejo de 401.

dashboard.md:
Dos métricas reales, obtenidas del backend, con estados de carga y error.

users-table.md:
Tabla desde el backend, búsqueda con debounce de 300 ms, estado vacío y manejo de errores. Evitar que respuestas antiguas sobrescriban búsquedas recientes. Paginación marcada como P1.

### docs/implementation-plan.md

Crear una checklist con este presupuesto total:
- 0–15 min: documentación, setup y primer commit.
- 15–45 min: base de datos, seed, login y sesión.
- 45–60 min: endpoints protegidos, usuarios y métricas.
- 60–90 min: login, dashboard, tabla y búsqueda.
- 90–100 min: verificar P0; incorporar P1 si alcanza.
- 100–120 min: validación final, README, AI-LOG y commit final.

Los 10 minutos de esta primera etapa forman parte del bloque inicial.

### docs/verification.md

Checklist para comprobar:
- Credenciales incorrectas rechazadas.
- Login correcto.
- Sesión conservada después de recargar.
- Acceso sin sesión bloqueado en página y API.
- Métricas y usuarios provenientes de la base de datos.
- Búsqueda con debounce sin recargar la página.
- Logout y sesión vencida, si se implementan.
- Build correcto.
- Instalación y ejecución siguiendo el README.

Dejar los resultados pendientes hasta ejecutar las comprobaciones.

### README.md

Crear un borrador con:
- Stack.
- Prerrequisitos.
- Instalación y ejecución.
- Credenciales de prueba.
- Decisiones técnicas.
- Limitaciones.

Marcar comandos y datos aún no confirmados como pendientes. No afirmar que algo funciona antes de verificarlo.

### AI-LOG.md

Crear una bitácora con:
- Herramientas y modelos utilizados, si se conocen.
- Elección de stack y justificación.
- Prompts exactos, resultados y acciones tomadas.
- Respuestas de IA rechazadas o modificadas y sus motivos.
- Estimación final del porcentaje de código IA/humano.
- Algo que la IA hizo bien y algo que hizo mal.

Registrar esta instrucción como primer prompt. No inventar rechazos, resultados, porcentajes ni intervención humana. Dejar pendientes las secciones que todavía no tengan evidencia.

### .env.example

Incluir únicamente variables previstas por la arquitectura, con valores de ejemplo y sin secretos reales.

## Resultado de esta etapa

Crea los archivos y termina con un resumen breve:
1. Archivos creados.
2. Decisiones técnicas adoptadas.
3. Próximo paso de implementación.

No empieces a implementar la aplicación en esta etapa.
Política de verificación para esta prueba

Por el límite de 2 horas:

No crear tests automatizados.

No instalar ni configurar Jest, Vitest, Playwright, Cypress u otras herramientas de testing.

No crear archivos de tests ni configurar cobertura.

Verificar manualmente los criterios de aceptación y ejecutar el build.

En docs/verification.md, incluir únicamente esta checklist manual:

Login correcto e incorrecto.

Sesión persistente al recargar.

Página y endpoints protegidos sin sesión.

Métricas y tabla obtenidas del backend.

Búsqueda con debounce sin recargar la página.

Logout y manejo de 401, si se implementan.

Build e instrucciones de ejecución.

Registrar los resultados reales. En el README, declarar que no se incluyeron tests automatizados por priorizar el flujo funcional dentro del tiempo disponible.

Aplicar esta política también en AGENTS.md y en el plan de implementación.
```

## Prompts posteriores

- Usuario: `Plan file: .kilo/plans/1791531473968-devpanel-context-docs.md` seguido de `Read this file first and treat it as the source of truth for implementation.` Se leyó el plan antes de editar.

## Decisiones y resultados de esta etapa

- La sesión previa quedó en modo planificación: solo se escribió el plan; no se generaron todavía los documentos solicitados en aquella sesión.
- Inspección de esta etapa: repositorio sin commits ni archivos versionados; `.kilo/` era lo único presente. Se crearon los once documentos solicitados, sin código ni dependencias.
- Stack propuesto adoptado en documentos: monolito Next.js/TypeScript y Tailwind para reducir setup; Route Handlers Node.js y SQLite local para datos reales sin servicios externos; `better-sqlite3`, seed idempotente y `bcryptjs`; token opaco aleatorio en cookie `HttpOnly`, solo hash en SQLite, con vencimiento y comprobación backend.
- Verificación de funcionamiento, ejecución y build: pendiente; la revisión de documentos no demuestra que la aplicación funcione.

## Evidencia aún pendiente

- Respuestas de IA rechazadas o modificadas y motivos: pendiente; ninguna registrada con evidencia.
- Porcentaje final de código IA/humano: pendiente; todavía no hay código de aplicación.
- Algo que la IA hizo bien y algo que hizo mal: pendiente de evaluación con resultados verificables.

## Estructura inicial (2026-10-09)

- Prompt: `lets start creating the structure, with the necesaries component to build this project`.
- Acción: se creó el scaffold explícito de Next.js 16 App Router, TypeScript estricto, Tailwind CSS 4 y ESLint sin sobrescribir la documentación existente. Se instalaron dependencias de aplicación y desarrollo y se aprobaron únicamente los scripts nativos necesarios de `better-sqlite3`, `unrs-resolver` y `esbuild`.
- Componentes: marca, formulario de login deshabilitado, sidebar, tarjetas de métricas y tabla vacía; páginas `/login` y `/dashboard`; tipos públicos y puntos de entrada pendientes para DB, auth y seed. No se simularon datos ni autenticación.
- Resultado verificado: lint correcto, carga de `better-sqlite3` correcta, build correcto y respuestas HTTP 200 de ambas páginas en servidor de desarrollo.
- Corrección aplicada: `npm audit fix` actualizó dependencias de producción. Quedaron cinco avisos altos transitivos de la herramienta ESLint; no se aplicó `--force` porque npm proponía una degradación incompatible de `eslint-config-next`.

## Backend (2026-10-09)

- Prompt: `ok, now lets work with the backend first, to have the project just ready in the backend and then just work the visuals.`
- Decisión: completar y verificar P0 backend antes de logout P1; sesión opaca de siete días, SHA-256 del token en SQLite y cookie `HttpOnly`, `SameSite=Lax`, `Secure` en producción.
- Acción: esquema e índices SQLite, seed idempotente con bcrypt, repositorios tipados, login, sesión actual, métricas, búsqueda parametrizada de usuarios y protección server-side del dashboard. Tras verificar P0 se añadió logout idempotente.
- Resultado manual: seed repetido mantuvo tres usuarios; códigos 400/401/200/204 según contrato; sesión persistió tras reinicio; métricas 3/2; búsqueda literal y por nombre correctas; logout y expiración invalidaron acceso. Ninguna respuesta expuso hashes ni tokens.
- Validación final: lint y build correctos; cinco handlers dinámicos generados; auditoría de dependencias de producción con cero vulnerabilidades.
- Corrección: el primer intento de levantar una segunda instancia falló por un proceso Next.js detectado; no se mató el proceso ajeno y se reintentó tras comprobar que había terminado. También se ajustó JSON malformado de login para devolver 400 y se marcó la ruta dinámica de SQLite como intencional para eliminar la advertencia de Turbopack.

## Integración de interfaz (2026-10-09)

- Prompt: `lets go.` en respuesta al siguiente paso propuesto de conectar la interfaz al backend.
- Acción: formulario de login funcional con error y carga; identidad server-side y logout; métricas con skeleton/error/reintento; tabla real con estados de carga, error y vacío; búsqueda con debounce de 300 ms y cancelación de solicitudes anteriores; redirección al login ante 401.
- Resultado verificado: lint sin advertencias, build correcto y flujo HTTP integrado correcto para acceso anónimo, login, dashboard autenticado, redirección de login con sesión y logout.
- Corrección: ESLint rechazó `window.location.assign` para rutas internas; se sustituyó por `router.replace` y `router.refresh` de App Router.
- Limitación real: no había herramienta de interacción visual en navegador. Se verificaron HTML server-side, rutas y build, pero la observación interactiva del debounce permanece pendiente; no se instalaron frameworks de testing por la política del proyecto.

## Filtros de usuarios (2026-10-09)

- Prompt: `now lets add the filter on the table.`
- Acción: filtros combinables por rol y estado en UI y `GET /api/users`, con validación estricta y condiciones SQL parametrizadas. Se añadió acción para limpiar búsqueda y filtros.
- Resultado: lint y build correctos. Verificación HTTP: `member` devolvió 2 usuarios, `inactive` 1, `member + active` 1, búsqueda más filtro 0 y rol inválido 400.
- Pendiente: comprobar visualmente los selects y su adaptación móvil junto con la revisión interactiva ya pendiente.

## Configuración de entorno (2026-10-09)

- Prompt: `now lets create the .env, i saw some variables that can be on the env.`
- Acción: se completaron `.env` y `.env.example` con la ruta SQLite y duración de sesión. `SESSION_DURATION_SECONDS` se lee solo en servidor y se valida como entero positivo.
- Decisión: no añadir un secreto de sesión estático porque el diseño genera tokens opacos mediante CSPRNG y guarda únicamente su hash.

## Corrección de prueba de expiración (2026-10-09)

- Prompt: el usuario reportó que seguía autenticado tras configurar una expiración de 30 segundos.
- Diagnóstico: `.env` todavía contenía `604800` y las sesiones almacenadas vencían siete días después; cambiar la duración no altera sesiones ya creadas.
- Acción: se estableció `SESSION_DURATION_SECONDS=30` en el entorno local, se reinició el servidor y se creó una sesión nueva aislada.
- Resultado real: la sesión se almacenó con 30 segundos restantes, `/api/auth/me` respondió 200 inmediatamente y 401 tras 35 segundos; `/dashboard` respondió 307 hacia `/login`.

## Dataset y paginación (2026-10-09)

- Prompt: `now lets modify the visual a little. just to have more, and also add more users, put al least 200 user, and pagination on the table.`
- Acción: seed determinista ampliado a 203 usuarios; paginación SQL con conteo, límites 10/20/50 y ajuste de página; controles anterior/siguiente; tercera métrica de inactivos, saludo personalizado y mejoras visuales de tabla.
- Resultado: seed repetido mantuvo 203 usuarios, con 162 activos, 41 inactivos y 23 administradores. La API devolvió 21 páginas de diez, tres registros en la última, filtros paginados y 400 para paginación inválida.
