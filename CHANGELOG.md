# 📋 Changelog — Office Suíte DSH

## [0.1.0] — 08/09/2026 — Lanzamiento inicial

### Agregado
- Plugin DSH Tool Office con 16 herramientas (PDF, Word, Excel, PowerPoint)
- Instalador automático (`install-global.js`) con detección de `~/.dsh`
- Configuración automática de `dsh.config.yml`
- Pruebas básicas (`tests/basic-tests.js`)
- Documentación completa (README, INSTALL, QUICKSTART, SUMMARY)
- Ejemplos prácticos (`examples.js`)

### Corrigiendo
- `npm audit fix --force` aplicado (1 vulnerabilidad persistente en `xlsx`, no crítica en uso local)

### Conocido
- PowerPoint: solo creación, no lectura/modificación de archivos existentes (limitación `pptxgenjs`)
- Excel: usa `xlsx` con vulnerabilidad teórica (GHSA-4r6h-8v6p-xvw6), no afecta uso local controlado
