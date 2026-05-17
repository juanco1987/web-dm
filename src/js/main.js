/**
 * main.js — Orquestador de la aplicación DoorMaster
 *
 * Importa todos los módulos, define el estado de la app y coordina
 * el ciclo inicialización → teardown → reinicialización (SPA).
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AOS from 'aos'
import 'aos/dist/aos.css'

import { teardown }                from './modules/teardown.js'
import { initScroll }              from './modules/scroll.js'
import { initHeroParallax, initGridReveal, initTitleReveal, initSectionObserver, refreshAos } from './modules/animations.js'
import { initSplitWords }          from './modules/splitWords.js'
import { initCardTilt, initWaMagnetic, initGlowOrbs } from './modules/interactions.js'
import { initSwipers }             from './modules/swiper.js'
import { initNavigation, runInitialWipe } from './modules/navigation.js'

import '../css/main.css'

// Registro global de plugins GSAP (solo una vez)
gsap.registerPlugin(ScrollTrigger)

// Inicializar AOS una sola vez (solo afecta a index.html)
AOS.init({ once: true, offset: 100 })

/** Estado mutable de la aplicación — todos los módulos operan sobre este objeto */
const state = {
  lenis:           null,
  observer:        null,
  swiperInstances: [],
  splitWordsTimer: null,
}

/**
 * reinit() se llama:
 *  1. En DOMContentLoaded (carga inicial)
 *  2. Después de cada performDOMSwap (navegación SPA)
 */
export function reinit() {
  teardown(state)

  // Actualizar año en copyright
  const yearEl = document.getElementById('year')
  if (yearEl) yearEl.textContent = new Date().getFullYear()

  state.lenis    = initScroll()
  state.observer = initSectionObserver()
  state.swiperInstances = initSwipers()

  initHeroParallax()
  initGridReveal()
  initTitleReveal()
  initSplitWords(state)
  initCardTilt()
  initWaMagnetic()
  initGlowOrbs()
  refreshAos()

  initNavigation(reinit)
}

document.addEventListener('DOMContentLoaded', () => {
  reinit()
  runInitialWipe()
})
