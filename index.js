import { Context, Schema } from '@deepseek-ai/cordis';
import * as pdfTools from './pdf-tools.js';
import * as wordTools from './word-tools.js';
import * as excelTools from './excel-tools.js';
import * as powerpointTools from './powerpoint-tools.js';
import { resolve, isAbsolute, normalize, dirname } from 'path';
import { fileURLToPath } from 'url';

export const name = 'dsh-tool-office';

export const inject = ['tools'];

export const Config = Schema.object({
  enabled: Schema.boolean().default(true).description('Habilitar herramientas de Office'),
  safePaths: Schema.boolean().default(false).description('Restringir rutas al directorio de trabajo (defiende contra path traversal)'),
  workspaceDir: Schema.string().default('.').description('Directorio raíz permitido cuando safePaths está activo'),
});

export function apply(ctx, config) {
  if (!config.enabled) return;

  // === SAFEPATHS HELPER ===
  const WORKSPACE = isAbsolute(config.workspaceDir)
    ? config.workspaceDir
    : resolve(process.cwd(), config.workspaceDir);

  function resolvePath(raw) {
    if (!config.safePaths) return raw;
    const target = resolve(WORKSPACE, raw);
    const normalized = normalize(target);
    if (!normalized.startsWith(normalize(WORKSPACE) + '/' ) && normalized !== normalize(WORKSPACE)) {
      throw new Error(`Ruta fuera del workspace permitido: ${raw}`);
    }
    return normalized;
  }

  // ==================== HERRAMIENTAS PDF ====================

  ctx.tools.define({
    name: 'read_pdf',
    description: 'Lee el contenido de un archivo PDF y extrae su texto, metadatos y información.',
    parameters: Schema.object({
      file_path: Schema.string().required().description('Ruta al archivo PDF a leer'),
    }),
    async execute({ file_path }) {
      try {
        const result = await pdfTools.readPDF(resolvePath(file_path));
        return {
          type: 'text',
          text: `Archivo PDF leído exitosamente:\n` +
                `- Páginas: ${result.numPages}\n` +
                `- Título: ${result.info?.Title || 'Sin título'}\n` +
                `- Autor: ${result.info?.Author || 'Desconocido'}\n` +
                `- Versión PDF: ${result.version}\n\n` +
                `Contenido:\n${result.text.substring(0, 2000)}${result.text.length > 2000 ? '...' : ''}`
        };
      } catch (error) {
        return { type: 'text', text: `Error: ${error.message}` };
      }
    }
  });

  ctx.tools.define({
    name: 'create_pdf',
    description: 'Crea un nuevo archivo PDF con contenido de texto y metadatos opcionales.',
    parameters: Schema.object({
      file_path: Schema.string().required().description('Ruta donde guardar el archivo PDF'),
      title: Schema.string().description('Título del documento'),
      content: Schema.string().required().description('Contenido de texto del PDF'),
      author: Schema.string().description('Autor del documento'),
      subject: Schema.string().description('Asunto del documento'),
      keywords: Schema.array(Schema.string()).description('Palabras clave del documento'),
    }),
    async execute({ file_path, title, content, author, subject, keywords }) {
      try {
        const result = await pdfTools.createPDF(resolvePath(file_path), {
          title, content, author, subject, keywords
        });
        return {
          type: 'text',
          text: `PDF creado exitosamente en: ${result.filePath}\nPáginas: ${result.pages}`
        };
      } catch (error) {
        return { type: 'text', text: `Error: ${error.message}` };
      }
    }
  });

  ctx.tools.define({
    name: 'modify_pdf',
    description: 'Modifica un PDF existente añadiendo páginas, texto o actualizando metadatos.',
    parameters: Schema.object({
      file_path: Schema.string().required().description('Ruta al archivo PDF a modificar'),
      add_page: Schema.boolean().description('Añadir una nueva página'),
      page_content: Schema.string().description('Contenido de la nueva página'),
      add_text: Schema.object({
        page_index: Schema.number().description('Índice de la página (0-based)'),
        text: Schema.string().description('Texto a añadir'),
        x: Schema.number().description('Posición X'),
        y: Schema.number().description('Posición Y'),
      }).description('Añadir texto a una página existente'),
      update_metadata: Schema.object({
        title: Schema.string(),
        author: Schema.string(),
        subject: Schema.string(),
        keywords: Schema.array(Schema.string()),
      }).description('Actualizar metadatos del PDF'),
    }),
    async execute({ file_path, add_page, page_content, add_text, update_metadata }) {
      try {
        const result = await pdfTools.modifyPDF(resolvePath(file_path), {
          addPage: add_page,
          pageContent: page_content,
          addText: add_text,
          updateMetadata: update_metadata,
        });
        return {
          type: 'text',
          text: `PDF modificado exitosamente: ${result.filePath}\nPáginas totales: ${result.pages}`
        };
      } catch (error) {
        return { type: 'text', text: `Error: ${error.message}` };
      }
    }
  });

  ctx.tools.define({
    name: 'merge_pdfs',
    description: 'Combina múltiples archivos PDF en un solo documento.',
    parameters: Schema.object({
      output_path: Schema.string().required().description('Ruta del archivo PDF resultante'),
      input_paths: Schema.array(Schema.string()).required().description('Lista de rutas de PDFs a combinar'),
    }),
    async execute({ output_path, input_paths }) {
      try {
        const result = await pdfTools.mergePDFs(resolvePath(output_path), input_paths.map(resolvePath));
        return {
          type: 'text',
          text: `PDFs combinados exitosamente:\n` +
                `- Archivo de salida: ${result.outputPath}\n` +
                `- Archivos combinados: ${result.filesCount}\n` +
                `- Páginas totales: ${result.totalPages}`
        };
      } catch (error) {
        return { type: 'text', text: `Error: ${error.message}` };
      }
    }
  });

  ctx.tools.define({
    name: 'extract_pdf_pages',
    description: 'Extrae páginas específicas de un PDF y las guarda en un nuevo archivo.',
    parameters: Schema.object({
      input_path: Schema.string().required().description('Ruta al archivo PDF original'),
      output_path: Schema.string().required().description('Ruta del nuevo archivo PDF'),
      page_numbers: Schema.array(Schema.number()).required().description('Números de páginas a extraer (0-based)'),
    }),
    async execute({ input_path, output_path, page_numbers }) {
      try {
        const result = await pdfTools.extractPDFPages(resolvePath(input_path), resolvePath(output_path), page_numbers);
        return {
          type: 'text',
          text: `Páginas extraídas exitosamente:\n` +
                `- Archivo de salida: ${result.outputPath}\n` +
                `- Páginas extraídas: ${result.extractedPages}`
        };
      } catch (error) {
        return { type: 'text', text: `Error: ${error.message}` };
      }
    }
  });

  // ==================== HERRAMIENTAS WORD ====================

  ctx.tools.define({
    name: 'read_word',
    description: 'Lee el contenido de un archivo Word (.docx) y extrae el texto y HTML.',
    parameters: Schema.object({
      file_path: Schema.string().required().description('Ruta al archivo Word a leer'),
    }),
    async execute({ file_path }) {
      try {
        const result = await wordTools.readWord(resolvePath(file_path));
        return {
          type: 'text',
          text: `Archivo Word leído exitosamente:\n` +
                `- Caracteres: ${result.text.length}\n` +
                `- Mensajes: ${result.messages.length}\n\n` +
                `Contenido:\n${result.text.substring(0, 2000)}${result.text.length > 2000 ? '...' : ''}`
        };
      } catch (error) {
        return { type: 'text', text: `Error: ${error.message}` };
      }
    }
  });

  ctx.tools.define({
    name: 'create_word',
    description: 'Crea un nuevo documento Word (.docx) con contenido estructurado.',
    parameters: Schema.object({
      file_path: Schema.string().required().description('Ruta donde guardar el archivo Word'),
      title: Schema.string().description('Título del documento'),
      content: Schema.string().description('Contenido simple del documento'),
      author: Schema.string().description('Autor del documento'),
      sections: Schema.array(Schema.object({
        heading: Schema.string().description('Encabezado de la sección'),
        content: Schema.string().description('Contenido de la sección'),
      })).description('Secciones con encabezados'),
      paragraphs: Schema.array(Schema.union([
        Schema.string(),
        Schema.object({
          text: Schema.string(),
          bold: Schema.boolean(),
          italic: Schema.boolean(),
          underline: Schema.boolean(),
          fontSize: Schema.number(),
        })
      ])).description('Párrafos personalizados con formato'),
    }),
    async execute({ file_path, title, content, author, sections, paragraphs }) {
      try {
        const result = await wordTools.createWord(resolvePath(file_path), {
          title, content, author, sections, paragraphs
        });
        return {
          type: 'text',
          text: `Documento Word creado exitosamente:\n` +
                `- Archivo: ${result.filePath}\n` +
                `- Párrafos: ${result.paragraphs}`
        };
      } catch (error) {
        return { type: 'text', text: `Error: ${error.message}` };
      }
    }
  });

  ctx.tools.define({
    name: 'modify_word',
    description: 'Modifica un documento Word existente añadiendo contenido al final.',
    parameters: Schema.object({
      file_path: Schema.string().required().description('Ruta al archivo Word a modificar'),
      append_text: Schema.string().description('Texto a añadir al final'),
      append_paragraphs: Schema.array(Schema.union([
        Schema.string(),
        Schema.object({
          text: Schema.string(),
          bold: Schema.boolean(),
          italic: Schema.boolean(),
          underline: Schema.boolean(),
        })
      ])).description('Párrafos a añadir al final'),
      new_title: Schema.string().description('Nuevo título del documento'),
    }),
    async execute({ file_path, append_text, append_paragraphs, new_title }) {
      try {
        const result = await wordTools.modifyWord(resolvePath(file_path), {
          appendText: append_text,
          appendParagraphs: append_paragraphs,
          newTitle: new_title,
        });
        return {
          type: 'text',
          text: `Documento Word modificado exitosamente:\n` +
                `- Archivo: ${result.filePath}\n` +
                `- Párrafos totales: ${result.paragraphs}`
        };
      } catch (error) {
        return { type: 'text', text: `Error: ${error.message}` };
      }
    }
  });

  ctx.tools.define({
    name: 'word_to_text',
    description: 'Convierte un documento Word a texto plano (.txt).',
    parameters: Schema.object({
      input_path: Schema.string().required().description('Ruta al archivo Word'),
      output_path: Schema.string().required().description('Ruta del archivo de texto resultante'),
    }),
    async execute({ input_path, output_path }) {
      try {
        const result = await wordTools.wordToText(resolvePath(input_path), resolvePath(output_path));
        return {
          type: 'text',
          text: `Documento convertido a texto:\n` +
                `- Entrada: ${result.inputPath}\n` +
                `- Salida: ${result.outputPath}\n` +
                `- Longitud: ${result.textLength} caracteres`
        };
      } catch (error) {
        return { type: 'text', text: `Error: ${error.message}` };
      }
    }
  });

  ctx.tools.define({
    name: 'word_to_html',
    description: 'Convierte un documento Word a HTML.',
    parameters: Schema.object({
      input_path: Schema.string().required().description('Ruta al archivo Word'),
      output_path: Schema.string().required().description('Ruta del archivo HTML resultante'),
    }),
    async execute({ input_path, output_path }) {
      try {
        const result = await wordTools.wordToHTML(resolvePath(input_path), resolvePath(output_path));
        return {
          type: 'text',
          text: `Documento convertido a HTML:\n` +
                `- Entrada: ${result.inputPath}\n` +
                `- Salida: ${result.outputPath}\n` +
                `- Longitud: ${result.htmlLength} caracteres`
        };
      } catch (error) {
        return { type: 'text', text: `Error: ${error.message}` };
      }
    }
  });

  // ==================== HERRAMIENTAS EXCEL ====================

  ctx.tools.define({
    name: 'read_excel',
    description: 'Lee el contenido de un archivo Excel (.xlsx, .xls) y devuelve los datos en formato JSON.',
    parameters: Schema.object({
      file_path: Schema.string().required().description('Ruta al archivo Excel'),
      sheet_name: Schema.string().description('Nombre de la hoja a leer (si no se especifica, lee la primera)'),
      range: Schema.string().description('Rango de celdas a leer (ej: "A1:D10")'),
      header: Schema.number().description('Fila de encabezado (1 por defecto)'),
    }),
    async execute({ file_path, sheet_name, range, header }) {
      try {
        const result = await excelTools.readExcel(resolvePath(file_path), {
          sheetName: sheet_name,
          range,
          header,
        });
        return {
          type: 'text',
          text: `Archivo Excel leído exitosamente:\n` +
                `- Hojas disponibles: ${result.sheets.join(', ')}\n` +
                `- Hoja activa: ${result.activeSheet}\n` +
                `- Filas: ${result.rowCount}\n` +
                `- Columnas: ${result.columnCount}\n` +
                `- Registros: ${result.data.length}\n\n` +
                `Primeras filas:\n${JSON.stringify(result.data.slice(0, 5), null, 2)}`
        };
      } catch (error) {
        return { type: 'text', text: `Error: ${error.message}` };
      }
    }
  });

  ctx.tools.define({
    name: 'create_excel',
    description: 'Crea un nuevo archivo Excel (.xlsx) con datos en formato JSON.',
    parameters: Schema.object({
      file_path: Schema.string().required().description('Ruta donde guardar el archivo Excel'),
      data: Schema.array(Schema.any()).description('Datos en formato JSON (array de objetos)'),
      sheet_name: Schema.string().description('Nombre de la hoja'),
      headers: Schema.array(Schema.string()).description('Encabezados personalizados'),
      sheets: Schema.array(Schema.object({
        name: Schema.string().description('Nombre de la hoja'),
        data: Schema.array(Schema.any()).description('Datos de la hoja'),
        headers: Schema.array(Schema.string()).description('Encabezados'),
      })).description('Múltiples hojas con datos'),
    }),
    async execute({ file_path, data, sheet_name, headers, sheets }) {
      try {
        const result = await excelTools.createExcel(resolvePath(file_path), {
          data, sheetName: sheet_name, headers, sheets
        });
        return {
          type: 'text',
          text: `Archivo Excel creado exitosamente:\n` +
                `- Archivo: ${result.filePath}\n` +
                `- Hojas: ${result.sheets.join(', ')}`
        };
      } catch (error) {
        return { type: 'text', text: `Error: ${error.message}` };
      }
    }
  });

  ctx.tools.define({
    name: 'modify_excel',
    description: 'Modifica un archivo Excel existente añadiendo, actualizando o eliminando datos.',
    parameters: Schema.object({
      file_path: Schema.string().required().description('Ruta al archivo Excel a modificar'),
      sheet_name: Schema.string().description('Nombre de la hoja a modificar'),
      data: Schema.array(Schema.any()).description('Nuevos datos para reemplazar'),
      append_data: Schema.array(Schema.any()).description('Datos a añadir al final'),
      add_sheet: Schema.object({
        name: Schema.string(),
        data: Schema.array(Schema.any()),
      }).description('Añadir nueva hoja'),
      delete_sheet: Schema.string().description('Nombre de la hoja a eliminar'),
      update_cell: Schema.object({
        cell: Schema.string().description('Celda a actualizar (ej: "A1")'),
        value: Schema.union([Schema.string(), Schema.number()]).description('Nuevo valor'),
      }).description('Actualizar celda específica'),
    }),
    async execute({ file_path, sheet_name, data, append_data, add_sheet, delete_sheet, update_cell }) {
      try {
        const result = await excelTools.modifyExcel(resolvePath(file_path), {
          sheetName: sheet_name,
          data,
          appendData: append_data,
          addSheet: add_sheet,
          deleteSheet: delete_sheet,
          updateCell: update_cell,
        });
        return {
          type: 'text',
          text: `Archivo Excel modificado exitosamente:\n` +
                `- Archivo: ${result.filePath}\n` +
                `- Hojas: ${result.sheets.join(', ')}`
        };
      } catch (error) {
        return { type: 'text', text: `Error: ${error.message}` };
      }
    }
  });

  ctx.tools.define({
    name: 'excel_to_csv',
    description: 'Convierte un archivo Excel a CSV.',
    parameters: Schema.object({
      input_path: Schema.string().required().description('Ruta al archivo Excel'),
      output_path: Schema.string().required().description('Ruta del archivo CSV resultante'),
      sheet_name: Schema.string().description('Nombre de la hoja a convertir'),
    }),
    async execute({ input_path, output_path, sheet_name }) {
      try {
        const result = await excelTools.excelToCSV(resolvePath(input_path), resolvePath(output_path), { sheetName: sheet_name });
        return {
          type: 'text',
          text: `Excel convertido a CSV:\n` +
                `- Entrada: ${result.inputPath}\n` +
                `- Salida: ${result.outputPath}\n` +
                `- Hoja: ${result.sheet}`
        };
      } catch (error) {
        return { type: 'text', text: `Error: ${error.message}` };
      }
    }
  });

  ctx.tools.define({
    name: 'csv_to_excel',
    description: 'Convierte un archivo CSV a Excel.',
    parameters: Schema.object({
      input_path: Schema.string().required().description('Ruta al archivo CSV'),
      output_path: Schema.string().required().description('Ruta del archivo Excel resultante'),
      sheet_name: Schema.string().description('Nombre de la hoja en el Excel'),
    }),
    async execute({ input_path, output_path, sheet_name }) {
      try {
        const result = await excelTools.csvToExcel(resolvePath(input_path), resolvePath(output_path), { sheetName: sheet_name });
        return {
          type: 'text',
          text: `CSV convertido a Excel:\n` +
                `- Entrada: ${result.inputPath}\n` +
                `- Salida: ${result.outputPath}\n` +
                `- Hoja: ${result.sheetName}`
        };
      } catch (error) {
        return { type: 'text', text: `Error: ${error.message}` };
      }
    }
  });

  ctx.tools.define({
    name: 'read_excel_cell',
    description: 'Lee el valor de una celda específica en un archivo Excel.',
    parameters: Schema.object({
      file_path: Schema.string().required().description('Ruta al archivo Excel'),
      cell: Schema.string().required().description('Celda a leer (ej: "A1", "B5")'),
      sheet_name: Schema.string().description('Nombre de la hoja'),
    }),
    async execute({ file_path, cell, sheet_name }) {
      try {
        const result = await excelTools.readCell(resolvePath(file_path), cell, sheet_name);
        return {
          type: 'text',
          text: `Celda ${result.cell}:\n` +
                `- Valor: ${result.value}\n` +
                `- Tipo: ${result.type}\n` +
                `- Fórmula: ${result.formula || 'N/A'}`
        };
      } catch (error) {
        return { type: 'text', text: `Error: ${error.message}` };
      }
    }
  });

  ctx.tools.define({
    name: 'get_excel_stats',
    description: 'Obtiene estadísticas y metadatos de un archivo Excel.',
    parameters: Schema.object({
      file_path: Schema.string().required().description('Ruta al archivo Excel'),
    }),
    async execute({ file_path }) {
      try {
        const result = await excelTools.getExcelStats(resolvePath(file_path));
        let text = `Estadísticas del archivo Excel:\n- Total de hojas: ${result.totalSheets}\n\n`;
        for (const sheet of result.sheets) {
          text += `Hoja: ${sheet.name}\n`;
          text += `  - Filas: ${sheet.rows}\n`;
          text += `  - Columnas: ${sheet.columns}\n`;
          text += `  - Rango: ${sheet.range}\n`;
          text += `  - Registros de datos: ${sheet.dataRows}\n\n`;
        }
        return { type: 'text', text };
      } catch (error) {
        return { type: 'text', text: `Error: ${error.message}` };
      }
    }
  });

  // ==================== HERRAMIENTAS POWERPOINT ====================

  ctx.tools.define({
    name: 'create_powerpoint',
    description: 'Crea una nueva presentación PowerPoint (.pptx) con diapositivas personalizadas.',
    parameters: Schema.object({
      file_path: Schema.string().required().description('Ruta donde guardar la presentación'),
      title: Schema.string().description('Título de la presentación'),
      author: Schema.string().description('Autor de la presentación'),
      subject: Schema.string().description('Asunto de la presentación'),
      slides: Schema.array(Schema.object({
        title: Schema.string().description('Título de la diapositiva'),
        content: Schema.string().description('Contenido de texto'),
        notes: Schema.string().description('Notas del presentador'),
        elements: Schema.array(Schema.object({
          type: Schema.union([
            Schema.const('text'),
            Schema.const('bullet'),
            Schema.const('shape')
          ]).description('Tipo de elemento'),
          text: Schema.string().description('Texto del elemento'),
          items: Schema.array(Schema.string()).description('Items para listas'),
          x: Schema.number().description('Posición X'),
          y: Schema.number().description('Posición Y'),
          w: Schema.number().description('Ancho'),
          h: Schema.number().description('Alto'),
          fontSize: Schema.number().description('Tamaño de fuente'),
          bold: Schema.boolean().description('Negrita'),
          italic: Schema.boolean().description('Cursiva'),
          color: Schema.string().description('Color (hex sin #)'),
          align: Schema.string().description('Alineación'),
        })).description('Elementos personalizados en la diapositiva'),
      })).description('Diapositivas de la presentación'),
    }),
    async execute({ file_path, title, author, subject, slides }) {
      try {
        const result = await powerpointTools.createPowerPoint(resolvePath(file_path), {
          title, author, subject, slides
        });
        return {
          type: 'text',
          text: `Presentación PowerPoint creada exitosamente:\n` +
                `- Archivo: ${result.filePath}\n` +
                `- Diapositivas: ${result.slides}`
        };
      } catch (error) {
        return { type: 'text', text: `Error: ${error.message}` };
      }
    }
  });

  ctx.tools.define({
    name: 'create_simple_powerpoint',
    description: 'Crea una presentación PowerPoint simple con diapositivas de título y contenido.',
    parameters: Schema.object({
      file_path: Schema.string().required().description('Ruta donde guardar la presentación'),
      slides: Schema.array(Schema.object({
        title: Schema.string().description('Título de la diapositiva'),
        content: Schema.string().description('Contenido de la diapositiva'),
      })).required().description('Diapositivas con título y contenido'),
    }),
    async execute({ file_path, slides }) {
      try {
        const result = await powerpointTools.createSimplePowerPoint(resolvePath(file_path), slides);
        return {
          type: 'text',
          text: `Presentación simple creada exitosamente:\n` +
                `- Archivo: ${result.filePath}\n` +
                `- Diapositivas: ${result.slides}`
        };
      } catch (error) {
        return { type: 'text', text: `Error: ${error.message}` };
      }
    }
  });

  ctx.tools.define({
    name: 'create_powerpoint_from_template',
    description: 'Crea una presentación PowerPoint estructurada con secciones y diapositiva de título/cierre.',
    parameters: Schema.object({
      file_path: Schema.string().required().description('Ruta donde guardar la presentación'),
      title: Schema.string().required().description('Título de la presentación'),
      author: Schema.string().description('Autor de la presentación'),
      sections: Schema.array(Schema.object({
        section_title: Schema.string().description('Título de la sección'),
        slides: Schema.array(Schema.object({
          title: Schema.string().description('Título de la diapositiva'),
          content: Schema.string().description('Contenido de texto'),
          bullet_points: Schema.array(Schema.string()).description('Puntos con viñetas'),
        })).description('Diapositivas de la sección'),
      })).description('Secciones de la presentación'),
    }),
    async execute({ file_path, title, author, sections }) {
      try {
        const result = await powerpointTools.createPresentationFromTemplate(resolvePath(file_path), {
          title, author, sections
        });
        return {
          type: 'text',
          text: `Presentación creada desde plantilla:\n` +
                `- Archivo: ${result.filePath}\n` +
                `- Total de diapositivas: ${result.totalSlides}`
        };
      } catch (error) {
        return { type: 'text', text: `Error: ${error.message}` };
      }
    }
  });

  ctx.tools.define({
    name: 'get_powerpoint_info',
    description: 'Obtiene información sobre las capacidades de las herramientas de PowerPoint.',
    parameters: Schema.object({}),
    async execute() {
      const info = powerpointTools.getPowerPointInfo();
      return {
        type: 'text',
        text: `Información de PowerPoint:\n` +
              `- Formatos: ${info.formats.join(', ')}\n` +
              `- Crear: ${info.capabilities.create}\n` +
              `- Leer: ${info.capabilities.read}\n` +
              `- Modificar: ${info.capabilities.modify}\n` +
              `- Nota: ${info.capabilities.notes}\n\n` +
              `Características:\n${info.features.map(f => `  - ${f}`).join('\n')}`
      };
    }
  });

  ctx.logger.info('DSH Office Tools plugin cargado exitosamente');
}
