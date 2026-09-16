# 🚀 Instalación

## Instalación Global (Recomendado)

Desde cualquier directorio con DSH instalado:

```bash
node install-global.js
```

O con npm:

```bash
npm run install-global
```

## Instalación Local (Solo para el Proyecto Actual)

```bash
node install.js
```

## Qué hace el instalador

1. Detecta tu carpeta de configuración de DSH (`~/.dsh`)
2. Crea la carpeta de plugins si no existe
3. Copia el plugin a `~/.dsh/plugins/dsh-tool-office/`
4. Actualiza o crea `dsh.config.yml` con la referencia al plugin
5. Instala las dependencias de Node.js necesarias

## Desinstalación

Para eliminar el plugin:

```bash
# Elimina la carpeta del plugin
rm -rf ~/.dsh/plugins/dsh-tool-office

# Edita dsh.config.yml y elimina la línea que referencia al plugin
# O elimina todo el archivo si solo tenías este plugin
```