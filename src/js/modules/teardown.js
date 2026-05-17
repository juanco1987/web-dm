import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SELECTORS } from './constants.js'

/**
 * Limpia todas las instancias activas antes de reinicializar.
 * Recibe el estado mutable de la aplicación y lo vacía.
 *
 * @param {{ lenis: import('lenis').default|null, observer: IntersectionObserver|null, swiperInstances: any[], splitWordsTimer: number|null }} state
 */
export function teardown(state) {
  // ScrollTrigger: matar todos los triggers activos
  ScrollTrigger.getAll().forEach(t => t.kill())

  // Lenis: destruir el scroll suavizado
  if (state.lenis) {
    state.lenis.destroy()
    state.lenis = null
  }

  // IntersectionObserver
  if (state.observer) {
    state.observer.disconnect()
    state.observer = null
  }

  // Orbes de luz: eliminar los nodos inyectados
  document.querySelectorAll(SELECTORS.glowOrb).forEach(orb => orb.remove())

  // Swiper: destruir instancias activas para evitar memory leak
  if (state.swiperInstances?.length) {
    state.swiperInstances.forEach(sw => {
      try { sw.destroy(true, true) } catch { /* ignorar si ya fue destruido */ }
    })
    state.swiperInstances = []
  }

  // Cancelar setTimeout de split-words pendiente
  if (state.splitWordsTimer !== null) {
    clearTimeout(state.splitWordsTimer)
    state.splitWordsTimer = null
  }
}
