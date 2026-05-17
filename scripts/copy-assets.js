/**
 * copy-assets.js
 *
 * Las carpetas de medios (LOGOTIPOS DE DOORMASTER, images) están en public/.
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
} else {
  console.log('[copy-assets] Nada que copiar — los activos están en public/ y Vite los gestiona.')
}
