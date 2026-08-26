/**
 * copy-assets.js
 *
 * Las carpetas de medios (LOGOTIPOS DE PuertAcces, images) están en public/.
 * Vite las copia automáticamente a dist/ durante el build, por lo que
 * este script ya no necesita manejarlas.
 *
 * Se mantiene para futuros activos que estén fuera de public/ y
 * necesiten copiarse manualmente al output.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

// Copiar favicon si existe en la raíz y no está en public/
const faviconSrc  = path.join(root, 'favicon.ico')
const faviconDest = path.join(root, 'dist', 'favicon.ico')
if (fs.existsSync(faviconSrc) && !fs.existsSync(path.join(root, 'public', 'favicon.ico'))) {
  fs.copyFileSync(faviconSrc, faviconDest)
  console.log('[copy-assets] favicon.ico → dist/favicon.ico')
}

// Copiar sitemap.xml y CNAME a dist/
const filesToCopy = ['sitemap.xml', 'CNAME']
for (const file of filesToCopy) {
  const src = path.join(root, file)
  const dest = path.join(root, 'dist', file)
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest)
    console.log(`[copy-assets] ${file} → dist/${file}`)
  }
}
