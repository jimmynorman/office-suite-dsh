# 🚀 DSH Tool Office - Instalación con UN SOLO COMANDO

[![Node.js](https://img.shields.io/badge/Node.js->=18.0.0-green.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![DSH](https://img.shields.io/badge/DSH-Plugin-orange.svg)](https://github.com/deepseek-ai)

Plugin profesional para DSH (DeepSeek Harness) que permite trabajar con archivos de ofimática: **PDF, Word, Excel y PowerPoint**.

---

## ⚡ INSTALACIÓN RÁPIDA (UN SOLO COMANDO)

```bash
cd dsh-tool-office
node install.js
```

**¡Eso es todo!** El instalador automático detecta tu configuración, instala dependencias y configura el plugin.

### Otras opciones de instalación

```bash
# Linux/Mac
bash install.sh

# Windows PowerShell
.\install.ps1
```

---

## 📋 Requisitos

- **Node.js** >= 18.0.0
- **DSH** (DeepSeek Harness) instalado

---

## 🎯 ¿Qué hace el instalador?

1. ✅ **Detecta** automáticamente tu configuración de DSH
2. ✅ **Instala** todas las dependencias necesarias
3. ✅ **Configura** el plugin en tu archivo de configuración
4. ✅ **Verifica** que todo funcione correctamente
5. ✅ **Muestra** instrucciones de uso

---

## 📦 Funcionalidades

| Formato | Leer | Crear | Modificar | Funciones Avanzadas |
|---------|:----:|:-----:|:---------:|---------------------|
| **PDF** | ✅ | ✅ | ✅ | Combinar, extraer páginas |
| **Word (.docx)** | ✅ | ✅ | ✅ | Convertir a HTML/texto |
| **Excel (.xlsx)** | ✅ | ✅ | ✅ | Convertir a CSV, leer celdas |
| **PowerPoint (.pptx)** | ⚠️ | ✅ | ⚠️ | Plantillas, notas |

### 16 Herramientas Disponibles

**PDF (5 herramientas)**
- `read_pdf` - Leer contenido y metadatos
- `create_pdf` - Crear nuevos PDFs
- `modify_pdf` - Modificar PDFs existentes
- `merge_pdfs` - Combinar múltiples PDFs
- `extract_pdf_pages` - Extraer páginas específicas

**Word (5 herramientas)**
- `read_word` - Leer documentos Word
- `create_word` - Crear con formato y secciones
- `modify_word` - Modificar documentos existentes
- `word_to_text` - Convertir a texto plano
- `word_to_html` - Convertir a HTML

**Excel (7 herramientas)**
- `read_excel` - Leer y convertir a JSON
- `create_excel` - Crear con múltiples hojas
- `modify_excel` - Añadir/actualizar datos
- `excel_to_csv` - Convertir a CSV
- `csv_to_excel` - Convertir CSV a Excel
- `read_excel_cell` - Leer celda específica
- `get_excel_stats` - Estadísticas del archivo

**PowerPoint (4 herramientas)**
- `create_powerpoint` - Presentaciones completas
- `create_simple_powerpoint` - Presentaciones simples
- `create_powerpoint_from_template` - Con plantillas
- `get_powerpoint_info` - Información de capacidades

---

## 💻 Ejemplos de Uso Rápido

### Crear un PDF

```javascript
await tools.execute('create_pdf', {
  file_path: './informe.pdf',
  title: 'Informe Mensual',
  content: 'Contenido del informe aquí...',
  author: 'Juan Pérez'
});
```

### Crear un Excel con datos

```javascript
await tools.execute('create_excel', {
  file_path: './ventas.xlsx',
  data: [
    { producto: 'Laptop', precio: 1200, stock: 45 },
    { producto: 'Mouse', precio: 25, stock: 120 }
  ],
  sheet_name: 'Inventario'
});
```

### Crear una presentación

```javascript
await tools.execute('create_powerpoint_from_template', {
  file_path: './presentacion.pptx',
  title: 'Informe Anual 2026',
  author: 'Equipo Directivo',
  sections: [
    {
      section_title: 'Resultados Financieros',
      slides: [
        {
          title: 'Ventas del Año',
          bullet_points: [
            'Ventas totales: $10M',
            'Crecimiento: 25%',
            'Nuevos clientes: 150'
          ]
        }
      ]
    }
  ]
});
```

### Leer un PDF

```javascript
const resultado = await tools.execute('read_pdf', {
  file_path: './contrato.pdf'
});
console.log(resultado);
```

### Combinar PDFs

```javascript
await tools.execute('merge_pdfs', {
  output_path: './informe-completo.pdf',
  input_paths: [
    './parte1.pdf',
    './parte2.pdf',
    './anexos.pdf'
  ]
});
```

---

## 🔧 Opciones del Instalador

```bash
# Instalación normal
node install.js

# Forzar reinstalación
node install.js --force

# Simular sin ejecutar
node install.js --dry-run

# Configuración personalizada
node install.js --config-path=/ruta/a/dsh.config.yml

# Ver ayuda completa
node install.js --help
```

---

## 📁 Estructura del Proyecto

```
dsh-tool-office/
├── src/
│   ├── index.js              # Plugin principal (630 líneas)
│   ├── pdf-tools.js          # Herramientas PDF (200+ líneas)
│   ├── word-tools.js         # Herramientas Word (150+ líneas)
│   ├── excel-tools.js        # Herramientas Excel (250+ líneas)
│   └── powerpoint-tools.js   # Herramientas PowerPoint (200+ líneas)
├── tests/
│   ├── basic-tests.js        # Pruebas automatizadas
│   └── README.md             # Guía de pruebas
├── install.js                # ⚡ Instalador Node.js (PRINCIPAL)
├── install.sh                # Instalador Bash (Linux/Mac)
├── install.ps1               # Instalador PowerShell (Windows)
├── examples.js               # 12 ejemplos prácticos completos
├── quick-example.js          # Ejemplo rápido de inicio
├── package.json              # Dependencias y configuración
├── README.md                 # Esta documentación
├── QUICKSTART.md             # Guía rápida de inicio
├── INSTALLER.md              # Documentación del instalador
├── INSTALL.md                # Guía de instalación detallada
├── SUMMARY.md                # Resumen del proyecto
└── LICENSE                   # Licencia MIT
```

---

## 🔄 Después de la Instalación

1. **Reiniciar DSH**
   ```bash
   dsh web
   ```

2. **Verificar que el plugin está cargado**
   ```javascript
   // En la consola DSH
   tools.list()
   // Deberías ver las herramientas: read_pdf, create_pdf, etc.
   ```

3. **Probar una herramienta**
   ```javascript
   await tools.execute('create_pdf', {
     file_path: './test.pdf',
     title: 'Prueba',
     content: '¡El plugin funciona!'
   });
   ```

4. **Ejecutar los ejemplos**
   ```bash
   node quick-example.js
   ```

---

## 📖 Documentación Completa

- **[QUICKSTART.md](QUICKSTART.md)** - Inicio rápido con comandos básicos
- **[INSTALLER.md](INSTALLER.md)** - Documentación detallada del instalador
- **[INSTALL.md](INSTALL.md)** - Guía de instalación manual paso a paso
- **[examples.js](examples.js)** - 12 ejemplos prácticos listos para usar
- **[tests/README.md](tests/README.md)** - Guía de pruebas y testing

---

## 🧪 Ejecutar Pruebas

```bash
# Ejecutar suite de pruebas
node tests/basic-tests.js

# O con npm
npm test
```

Las pruebas verifican:
- ✅ Creación y lectura de PDFs
- ✅ Creación y lectura de Word
- ✅ Creación y lectura de Excel
- ✅ Creación de PowerPoint
- ✅ Conversiones entre formatos

---

## ❌ Solución de Problemas

### "DSH no encontrado"
```bash
npm install -g @deepseek-ai/dsh
```

### "Node.js no encontrado"
Descarga e instala desde: https://nodejs.org (requiere >= 18.0.0)

### "Error de permisos"
```bash
# Linux/Mac
sudo node install.js

# Windows PowerShell (como administrador)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\install.ps1
```

### "Configuración no encontrada"
El instalador te mostrará cómo configurar manualmente:
```yaml
# dsh.config.yml
plugins:
  dsh-tool-office:
    enabled: true
    $ref: ./dsh-tool-office/src/index.js
```

### "Dependencias fallidas"
```bash
# Limpiar y reinstalar
rm -rf node_modules
node install.js --force
```

---

## 📦 Dependencias Instaladas

- **pdf-lib** (1.17.1) - Creación y modificación de PDFs
- **pdf-parse** (1.1.1) - Lectura de PDFs
- **mammoth** (1.8.0) - Lectura de documentos Word
- **docx** (9.0.0) - Creación de documentos Word
- **xlsx** (0.18.5) - Lectura y escritura de Excel
- **pptxgenjs** (3.12.0) - Creación de presentaciones PowerPoint

---

## 🌟 Características Destacadas

✨ **Instalación Automática** - Un solo comando para configurar todo
✨ **16 Herramientas Listas** - Para PDF, Word, Excel y PowerPoint
✨ **Ejemplos Incluidos** - 12 ejemplos prácticos listos para usar
✨ **Pruebas Automatizadas** - Suite completa de tests
✨ **Documentación Completa** - Múltiples guías y referencias
✨ **Multi-plataforma** - Windows, Linux y Mac

---

## 🚀 Casos de Uso

- 📄 Generar informes PDF automáticamente
- 📊 Crear hojas de cálculo con datos procesados
- 📝 Generar documentos Word estructurados
- 🎯 Crear presentaciones desde datos
- 🔄 Convertir entre formatos (Excel↔CSV, Word↔HTML)
- 📑 Combinar múltiples PDFs en uno
- ✂️ Extraer páginas específicas de documentos
- 📈 Generar reportes completos multi-formato

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:
1. Abre un issue primero para discutir los cambios
2. Fork el proyecto
3. Crea una rama para tu feature
4. Haz commit de tus cambios
5. Abre un Pull Request

---

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles.

---

## 👥 Autor

DSH Office Plugin - 2026

---

## 📞 Soporte

Si encuentras algún problema:
1. Consulta la sección de **Solución de Problemas** arriba
2. Revisa la [documentación completa](INSTALL.md)
3. Ejecuta las [pruebas](tests/README.md) para diagnosticar
4. Verifica los logs de DSH: `dsh web --verbose`

---

## 🎯 Roadmap Futuro

- [ ] Soporte para leer presentaciones PowerPoint existentes
- [ ] Herramientas adicionales para imágenes en documentos
- [ ] Soporte para tablas avanzadas en Word
- [ ] Gráficos en Excel
- [ ] Plantillas predefinidas
- [ ] Conversión de PDF a Word/Excel

---

**✅ ¡Instalado en segundos, listo para producción!**

```bash
cd dsh-tool-office && node install.js
```

🎉 **¡Empieza a trabajar con archivos de ofimática desde DSH!**
