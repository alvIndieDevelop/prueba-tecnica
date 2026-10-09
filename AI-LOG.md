# Bitácora de IA: DevPanel

Herramienta: Kilo Code. Modelo conocido: `openai/gpt-6-sol`. No hay código de aplicación todavía.

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
