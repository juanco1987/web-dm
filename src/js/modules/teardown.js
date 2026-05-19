import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SELECTORS } from './constants.js'
import { destroyLogoLottie } from './logoAnimation.js'
import { destroyWipeLottie } from './wipeLottie.js'

/**
 * Limpia todas las instancias activas antes de reinicializar.
 * Recibe el estado mutable de la aplicación y lo vacía.
 *
 * @param {{ lenis: import('lenis').default|null, observer: IntersectionObserver|null, swiperInstances: any[], splitWordsTimer: number|null }} state
 */
/**
 * @param {object} state
 * @param {{ duringWipeTransition?: boolean }} [options]
 */
export function teardown(state, { duringWipeTransition = false } = {}) {
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

  // No matar la cortina Lottie ni el logo mientras la transición sigue activa
  if (!duringWipeTransition) {
    destroyLogoLottie()
    destroyWipeLottie()
  }
  const logo = document.querySelector(SELECTORS.logo)
  if (logo) {
    const letters = logo.querySelectorAll(SELECTORS.logoLetter)
    if (letters.length) gsap.killTweensOf(letters)
  }

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
