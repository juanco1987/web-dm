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
import {
  initHeroParallax, initGridReveal, initTitleReveal, initSectionObserver,
  refreshAos, refreshScrollAnimations,
} from './modules/animations.js'
import { initSplitWords }          from './modules/splitWords.js'
import { initCardTilt, initWaMagnetic, initGlowOrbs } from './modules/interactions.js'
import { initSwipers }             from './modules/swiper.js'
import { initNavigation, runInitialWipe } from './modules/navigation.js'

import '../css/main.css'

// Registro global de plugins GSAP (solo una vez)
gsap.registerPlugin(ScrollTrigger)

// AOS solo para nodos con data-aos (GSAP cubre grillas y títulos de sección)
AOS.init({ once: true, offset: 40, duration: 600, easing: 'ease-out-cubic' })

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
export function reinit(options = {}) {
  teardown(state, options)

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
  refreshScrollAnimations()

  initNavigation(reinit)

  requestAnimationFrame(() => refreshScrollAnimations())
}

document.addEventListener('DOMContentLoaded', () => {
  reinit()
  runInitialWipe()
})
