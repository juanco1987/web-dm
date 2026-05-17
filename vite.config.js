import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'

const __dirname = resolve()

/** Procesa <!-- @include src/partials/archivo.html --> */
function htmlIncludePlugin() {
  return {
    name: 'vite-plugin-html-include',
    enforce: 'pre',
    transformIndexHtml(html) {
      return html.replace(
        /<!--\s*@include\s+([\w\-\/\.]+)\s*-->/g,
        (_, filePath) => {
          const fullPath = resolve(__dirname, filePath)
          try {
            return fs.readFileSync(fullPath, 'utf-8')
          } catch {
            console.warn(`[html-include] No se pudo incluir: ${fullPath}`)
            return ''
          }
        }
      )
    }
  }
}

/** Mueve los HTML de src/pages/ al root de dist/ en el build de producción */
function flattenHtmlPlugin() {
  return {
    name: 'vite-flatten-html',
    enforce: 'post',
    generateBundle(_, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'asset' && fileName.endsWith('.html') && fileName.startsWith('src/pages/')) {
          const newName = fileName.replace('src/pages/', '')
          chunk.fileName = newName
          bundle[newName] = chunk
          delete bundle[fileName]
        }
      }
    }
  }
}

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index:          resolve(__dirname, 'src/pages/index.html'),
        automatismos:   resolve(__dirname, 'src/pages/automatismos.html'),
        mantenimientos: resolve(__dirname, 'src/pages/mantenimientos.html'),
        cerrajeria:     resolve(__dirname, 'src/pages/cerrajeria.html'),
      }
    }
  },
  server: {
    open: '/src/pages/index.html'
  },
  plugins: [htmlIncludePlugin(), flattenHtmlPlugin()]
})
