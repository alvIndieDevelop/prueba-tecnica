# Verificación manual

Resultados manuales. La validación del backend no implica que la UI esté conectada.

- [x] Aprobado (2026-10-09): login correcto devuelve 200 y usuario público; contraseña incorrecta devuelve 401; JSON inválido devuelve 400.
- [x] Aprobado (2026-10-09): la sesión siguió válida tras reiniciar el servidor y permitió consultar `/api/auth/me` y `/dashboard`.
- [x] Aprobado (2026-10-09): sin sesión, APIs protegidas devuelven 401 y `/dashboard` redirige a `/login`; con sesión responden 200.
- [x] Aprobado (2026-10-09): seed repetido mantuvo 203 usuarios (162 activos, 41 inactivos); lista, búsqueda y filtros devolvieron datos sin hashes ni tokens. Paginación backend verificada con 10 registros, 21 páginas, última página de 3 registros, combinación con filtros, ajuste de página fuera de rango y parámetros inválidos 400.
- [ ] Pendiente de observación interactiva en navegador: la implementación usa temporizador de 300 ms, `fetch` sin recarga y `AbortController`; endpoint y build verificados.
- [x] Aprobado backend (2026-10-09): logout devolvió 204, invalidó la sesión y es idempotente. Con `SESSION_DURATION_SECONDS=30`, una sesión nueva respondió 200 inmediatamente, 401 después de 35 segundos y `/dashboard` redirigió a `/login`. Redirección cliente ante 401 pendiente de observación interactiva.
- [x] Aprobado (2026-10-09): `npm run lint` sin errores ni advertencias; `npm run build` compiló páginas y cinco Route Handlers; `npm run dev` inició correctamente; instalación validada con `npm install`; auditoría de producción sin vulnerabilidades. Flujo HTTP integrado comprobó redirección sin sesión, login, dashboard autenticado, redirección de login con sesión y logout.
