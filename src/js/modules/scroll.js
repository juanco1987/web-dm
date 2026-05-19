import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { LENIS_DURATION } from './constants.js'

let _lenisTickFn = null

function bindLenisScrollTrigger(lenis) {
  lenis.on('scroll', ScrollTrigger.update)

  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length) {
        lenis.scrollTo(value, { immediate: true })
      }
      return lenis.scroll
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      }
    },
  })

  ScrollTrigger.addEventListener('refresh', () => lenis.resize())
}

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

  if (_lenisTickFn) gsap.ticker.remove(_lenisTickFn)
  _lenisTickFn = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(_lenisTickFn)
  gsap.ticker.lagSmoothing(0)

  bindLenisScrollTrigger(lenis)

  return lenis
}
