# 🛡️ Política de Seguridad (Security Policy)

## Versiones Soportadas

Solo la última versión de la rama principal (`main`) recibe actualizaciones de seguridad.

| Versión | Soportada          |
| ------- | ------------------ |
| >= 0.1.x| ✅ Soportada       |
| < 0.1.0 | ❌ No soportada    |

## Cómo Reportar una Vulnerabilidad

Si descubres un problema de seguridad en **Office Suíte DSH**, **por favor no lo hagas público creando un *issue***.

Para proteger a los usuarios y a ti como autor, te pedimos que utilices la función de **"Private vulnerability reporting"** de GitHub:
1. Ve a la pestaña **Security** en este repositorio.
2. Haz clic en **Advisories** y luego en **Report a vulnerability**.
3. Proporciona los detalles del problema y cómo reproducirlo.

Nos comprometemos a revisar el reporte de manera confidencial y darte una respuesta preliminar en un plazo de 5 días laborables.

## Limitaciones y Riesgos Conocidos

1. **Archivos Excel (`xlsx`)**: El plugin usa la librería `sheetjs/xlsx`, la cual tiene un reporte conocido de *Prototype Pollution* y *ReDoS* (GHSA-4r6h-8v6p-xvw6).
   * **Riesgo:** Solo es explotable si procesas archivos Excel maliciosos creados específicamente por un atacante.
   * **Mitigación:** Abre únicamente archivos de fuentes en las que confíes totalmente. No expongas este plugin como un servicio público en la web donde usuarios anónimos puedan subir documentos.
2. **Acceso al Sistema de Archivos**: El plugin lee y escribe en las rutas locales que se le proporcionan. Actúa con los mismos permisos que el usuario que ejecuta DSH. Ten cuidado de no enviar comandos que apunten a directorios sensibles del sistema operativo.
3. **Manejo de Datos Privados**: Todas las operaciones se realizan **localmente** en tu máquina. El plugin no envía datos, documentos ni telemetría a servidores externos, garantizando la privacidad del usuario.