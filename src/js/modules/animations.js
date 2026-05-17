import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SELECTORS } from './constants.js'

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
      scrub: true
    }
  })

  gsap.to(SELECTORS.hero, {
    backgroundPosition: '50% 60%',
    ease: 'none',
    scrollTrigger: {
      trigger: SELECTORS.hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })
}

/**
 * Revelado en cascada (stagger) para tarjetas dentro de grillas.
 */
export function initGridReveal() {
  document.querySelectorAll(SELECTORS.grids).forEach(grid => {
    const cards = grid.children
    if (!cards.length) return

    gsap.fromTo(cards,
      { opacity: 0, y: 90, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 1.6,
        ease: 'power4.out',
        stagger: { amount: 0.5 },
        scrollTrigger: {
          trigger: grid,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    )
  })
}

/**
 * Máscara de clip-path para los títulos de sección.
 */
export function initTitleReveal() {
  document.querySelectorAll(SELECTORS.sectionTitles).forEach(title => {
    gsap.fromTo(title,
      { opacity: 0, y: 50, clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' },
      {
        opacity: 1, y: 0,
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      }
    )
  })
}

/**
 * IntersectionObserver para secciones `.project-category` y `.cta-section`.
 * @returns {IntersectionObserver}
 */
export function initSectionObserver() {
  const elements = document.querySelectorAll(SELECTORS.revealSections)
  elements.forEach(el => el.classList.add('reveal-element'))

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1 })

  elements.forEach(el => observer.observe(el))
  return observer
}

/**
 * Re-inicializa AOS si está disponible en el DOM (solo index.html lo usa).
 */
export function refreshAos() {
  if (typeof window.AOS !== 'undefined') window.AOS.refresh()
}
