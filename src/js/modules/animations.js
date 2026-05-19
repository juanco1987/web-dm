import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  SELECTORS,
  SCROLL_REVEAL_START,
  SCROLL_CARD_DURATION,
  SCROLL_TITLE_DURATION,
} from './constants.js'

const scrollDefaults = {
  toggleActions: 'play none none none',
  once: true,
  invalidateOnRefresh: true,
}

/**
 * Parallax cinemático en el hero: el contenido sube y el fondo avanza al hacer scroll.
 */
export function initHeroParallax() {
  if (!document.querySelector(SELECTORS.hero)) return

  gsap.to(SELECTORS.headerContent, {
    y: -100,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: SELECTORS.hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  })

  gsap.to(SELECTORS.hero, {
    backgroundPosition: '50% 60%',
    ease: 'none',
    scrollTrigger: {
      trigger: SELECTORS.hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  })
}

/**
 * Revelado por tarjeta al entrar en viewport (sincronizado con Lenis).
 */
export function initGridReveal() {
  const cards = gsap.utils.toArray(`${SELECTORS.grids} > *`)
  if (!cards.length) return

  gsap.set(cards, { opacity: 0, y: 44, scale: 0.97 })

  cards.forEach((card) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: SCROLL_CARD_DURATION,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: SCROLL_REVEAL_START,
        ...scrollDefaults,
      },
    })
  })
}

/**
 * Máscara de clip-path para los títulos de sección.
 */
export function initTitleReveal() {
  document.querySelectorAll(SELECTORS.sectionTitles).forEach((title) => {
    gsap.fromTo(
      title,
      { opacity: 0, y: 36, clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' },
      {
        opacity: 1,
        y: 0,
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: SCROLL_TITLE_DURATION,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: title,
          start: SCROLL_REVEAL_START,
          ...scrollDefaults,
        },
      },
    )
  })
}

/**
 * IntersectionObserver para secciones `.project-category` y `.cta-section`.
 * @returns {IntersectionObserver}
 */
export function initSectionObserver() {
  const elements = document.querySelectorAll(SELECTORS.revealSections)
  elements.forEach((el) => el.classList.add('reveal-element'))

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.05,
      rootMargin: '0px 0px -2% 0px',
    },
  )

  elements.forEach((el) => observer.observe(el))
  return observer
}

/** Recalcula triggers tras cambios de layout (SPA, imágenes, etc.). */
export function refreshScrollAnimations() {
  ScrollTrigger.refresh()
}

/**
 * Re-inicializa AOS solo para nodos que aún lo usen (evitar doble animación con GSAP).
 */
export function refreshAos() {
  if (typeof window.AOS === 'undefined') return
  window.AOS.refresh()
}
