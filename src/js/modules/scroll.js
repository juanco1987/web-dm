import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { LENIS_DURATION } from './constants.js'

let _lenisTickFn = null

/**
 * Inicializa Lenis smooth scroll y lo sincroniza con el ticker de GSAP.
 * @returns {Lenis} La instancia creada
 */
export function initScroll() {
  const lenis = new Lenis({
    duration: LENIS_DURATION,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1.1,
    smoothTouch: false,
    touchMultiplier: 1.5,
    infinite: false,
  })

  lenis.on('scroll', ScrollTrigger.update)

  // Eliminar tick anterior antes de registrar el nuevo
  if (_lenisTickFn) gsap.ticker.remove(_lenisTickFn)
  _lenisTickFn = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(_lenisTickFn)
  gsap.ticker.lagSmoothing(0)

  return lenis
}
