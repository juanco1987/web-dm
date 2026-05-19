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

/**
 * Vite 8 + Rolldown: no se puede mutar `bundle[foo]`.
 * Los HTML multipágina salen como dist/src/pages/*.html; los movemos al root de dist.
 */
function flattenHtmlOutputPlugin() {
  let outDir = 'dist'
  return {
    name: 'vite-flatten-html-output',
    enforce: 'post',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const pagesDir = path.join(outDir, 'src', 'pages')
      if (!fs.existsSync(pagesDir)) return
      for (const name of fs.readdirSync(pagesDir)) {
        if (!name.endsWith('.html')) continue
        const from = path.join(pagesDir, name)
        const to = path.join(outDir, name)
        fs.renameSync(from, to)
      }
      fs.rmSync(path.join(outDir, 'src'), { recursive: true, force: true })
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
        index: path.resolve(__dirname, 'src/pages/index.html'),
        automatismos: path.resolve(__dirname, 'src/pages/automatismos.html'),
        mantenimientos: path.resolve(__dirname, 'src/pages/mantenimientos.html'),
        cerrajeria: path.resolve(__dirname, 'src/pages/cerrajeria.html'),
      }
    }
  },
  server: {
    open: '/src/pages/index.html'
  },
  plugins: [htmlIncludePlugin(), flattenHtmlOutputPlugin()]
})
