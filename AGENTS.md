# Guía de trabajo: DevPanel

- Leer `docs/requirements.md` y `docs/implementation-plan.md` antes de implementar; consultar `docs/architecture.md` y las fichas de funcionalidad.
- Completar y verificar P0 antes de abordar P1 o P2. No ampliar el alcance sin una razón documentada.
- Usar TypeScript con tipos explícitos; evitar `any` injustificados.
- Validar en el servidor la sesión y su vencimiento en cada endpoint protegido y antes de renderizar el dashboard. No depender de middleware conectado a SQLite.
- No exponer ni registrar hashes de contraseñas, tokens o secretos; las respuestas de error inesperado deben ser genéricas.
- Registrar en `AI-LOG.md` únicamente prompts, decisiones, resultados y correcciones reales; no inventar evidencia.
- Mantener commits progresivos con cambios coherentes cuando se implemente; no dar por terminada una funcionalidad sin verificarla.
- Por el límite de dos horas, no crear tests automatizados, archivos de test, frameworks de testing ni configuración de cobertura. Verificar manualmente los criterios de aceptación y ejecutar el build; registrar resultados reales en `docs/verification.md`.
