import { defineConfig } from 'vite'
import path from 'node:path'
import fs from 'node:fs'

const __dirname = path.resolve()

/** Procesa <!-- @include src/partials/archivo.html --> */
function htmlIncludePlugin() {
  return {
    name: 'vite-plugin-html-include',
    enforce: 'pre',
    transformIndexHtml(html) {
      return html.replace(
        /<!--\s*@include\s+([\w\-\/\.]+)\s*-->/g,
        (_, filePath) => {
          const fullPath = path.resolve(__dirname, filePath)
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

export default defineConfig({
  root: '.',
  publicDir: 'public',
  appType: 'mpa',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        automatismos: path.resolve(__dirname, 'automatismos.html'),
        mantenimientos: path.resolve(__dirname, 'mantenimientos.html'),
        cerrajeria: path.resolve(__dirname, 'cerrajeria.html'),
      }
    }
  },
  server: {
    port: 5173,
    open: '/'
  },
  plugins: [htmlIncludePlugin()]
})
