# 🛤️ Roadmap — Office Suíte DSH

> Este documento permite que cualquier IA o colaborador continúe el proyecto sin depender del historial de chat.

---

## 1. Filosofía de Trabajo

**Principio:** El plugin debe ser invisible hasta que sea necesario. El usuario escribe en lenguaje natural o arrastra archivos; DSH delega automáticamente al plugin sin pasos manuales de configuración por proyecto.

**Workflow:**
```
Usuario → DSH → Detecta archivo ofimática → Plugin procesa → Resultado integrado
```

**No se requiere:** Configuración por proyecto, instalación manual de librerías, conocimiento técnico del usuario.

---

## 2. Arquitectura Técnica

- **Framework:** Cordis (`@deepseek-ai/cordis` v4.0.2)
- **Schema:** `@deepseek-ai/schemastery` para validación de parámetros
- **Módulo:** `src/index.js` exporta `name`, `Config`, `apply()`
- **Inyección:** `inject: ['tools']` registra en sistema de herramientas DSH
- **Instalación:** Global en `.dsh/plugins/` + `dsh.config.yml`

---

## 3. Estado Actual (Versión 0.1.0)

| Componente | Estado | Notas |
|:---|:---|:---|
| PDF (leer/crear/modificar/combinar) | ✅ | `pdf-lib` + `pdf-parse` |
| Word DOCX | ✅ | `docx` + `mammoth` |
| Excel XLSX | ✅ | `xlsx` (vulnerabilidad conocida: GHSA-4r6h-8v6p-xvw6 — sin fix disponible, no crítica en uso local) |
| PowerPoint PPTX | ✅ | `pptxgenjs` v4.x (migrado) |
| Auto-procesamiento adjuntos | ✅ | Detecta `.pdf`, `.docx`, `.xlsx`, `.csv`, `.pptx` |
| Seguridad (safePaths) | ✅ | Protección contra Path Traversal |
| Dependabot | ✅ | Actualizaciones automáticas activas |
| Instalador global | ✅ | `install-global.js` con detección de `~/.dsh` |
| Pruebas | ✅ | 14 casos básicos en `tests/basic-tests.js` |
| Documentación | ✅ | README, INSTALL, EXAMPLES, QUICKSTART |

---

## 4. Próximos Pasos Planificados

- [ ] **v0.2** — Leer PowerPoint existentes (investigar `pptx-ts` o `pptx-parser`)
- [ ] **v0.3** — Gráficos en Excel (`chart` dentro de XLSX)
- [ ] **v0.4** — Conversión PDF ↔ Word/Excel
- [ ] **v0.5** — Plantillas predefinidas (contratos, facturas, reportes)
- [ ] **v0.6** — Integración con base de datos (exportar resultados a SQLite/JSON)

---

## 5. Cómo Continuar sin Historial

1. **Leer `src/index.js`** para ver cómo se registran herramientas
2. **Revisar `tests/basic-tests.js`** para ver qué está cubierto
3. **Ver `install-global.js`** para el flujo de instalación
4. **Actualizar `package.json`** para nuevas dependencias
5. **Agregar herramienta:** Copiar patrón de `read_pdf`, modificar `name` y lógica
6. **Reiniciar DSH:** `dsh web` para cargar cambios

---

## 6. Convenciones

- Nombres de herramientas: `verb_noun` (ej: `read_pdf`, `create_excel`)
- Parámetros: Usar `Schema.object()` con `required()` explícito
- Respuesta: Siempre `{ type: 'text', text: '...' }`
- Errores: Capturar y devolver mensaje legible, nunca lanzar excepción cruda
- Idioma: Español para usuarios, inglés para código
