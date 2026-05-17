import { gsap } from 'gsap'
import { SELECTORS, WA_MAGNETIC_RADIUS, WA_MAGNETIC_STRENGTH } from './constants.js'

let _waMagneticHandler = null
let _orbsMoveHandler   = null

/**
 * Efecto 3D tilt + glare en las tarjetas al mover el ratón.
 */
export function initCardTilt() {
  document.querySelectorAll(SELECTORS.cards3d).forEach(card => {
    card.style.transformStyle = 'preserve-3d'
    card.style.perspective    = '1000px'

    if (!card.querySelector('.card-glare')) {
      const glare = document.createElement('div')
      glare.className = 'card-glare'
      card.appendChild(glare)
    }

    card.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = card.getBoundingClientRect()
      const x = e.clientX - left
      const y = e.clientY - top
      const rotX = ((height / 2 - y) / (height / 2)) * 10
      const rotY = ((x - width  / 2) / (width  / 2)) * 10

      card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.04,1.04,1.04) translateZ(10px)`

      const glare = card.querySelector('.card-glare')
      glare.style.background = `radial-gradient(circle at ${(x / width) * 100}% ${(y / height) * 100}%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 80%)`
      glare.style.opacity = '1'
    })

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1,1,1) translateZ(0)'
      const glare = card.querySelector('.card-glare')
      if (glare) glare.style.opacity = '0'
    })
  })
}

/**
 * Efecto magnético en el botón de WhatsApp: se acerca al cursor al pasar cerca.
 */
export function initWaMagnetic() {
  const waButton = document.querySelector(SELECTORS.waButton)
  if (!waButton) return

  if (_waMagneticHandler) document.removeEventListener('mousemove', _waMagneticHandler)

  _waMagneticHandler = (e) => {
    const { left, top, width, height } = waButton.getBoundingClientRect()
    const btnX = left + width  / 2
    const btnY = top  + height / 2
    const dist = Math.hypot(e.clientX - btnX, e.clientY - btnY)

    if (dist < WA_MAGNETIC_RADIUS) {
      const moveX = (e.clientX - btnX) * WA_MAGNETIC_STRENGTH
      const moveY = (e.clientY - btnY) * WA_MAGNETIC_STRENGTH
      waButton.style.transform  = `translate3d(${moveX}px,${moveY}px,0) scale(1.15)`
      waButton.style.boxShadow  = '0 20px 40px rgba(37,211,102,0.5)'
    } else {
      waButton.style.transform  = 'translate3d(0,0,0) scale(1)'
      waButton.style.boxShadow  = '0 10px 25px rgba(37,211,102,0.3)'
    }
  }

  document.addEventListener('mousemove', _waMagneticHandler)
}

/**
 * Inyecta y anima los orbes de luz ambientador que siguen el ratón.
 */
export function initGlowOrbs() {
  const orb1 = document.createElement('div')
  orb1.className = 'glow-orb orb-primary'
  const orb2 = document.createElement('div')
  orb2.className = 'glow-orb orb-secondary'
  document.body.appendChild(orb1)
  document.body.appendChild(orb2)

  if (_orbsMoveHandler) window.removeEventListener('mousemove', _orbsMoveHandler)

  _orbsMoveHandler = (e) => {
    const xPct = (e.clientX / window.innerWidth)  - 0.5
    const yPct = (e.clientY / window.innerHeight) - 0.5
    gsap.to(orb1, { x:  xPct * 100, y:  yPct * 100, duration: 3, ease: 'power2.out' })
    gsap.to(orb2, { x: -xPct * 100, y: -yPct * 100, duration: 3, ease: 'power2.out' })
  }

  window.addEventListener('mousemove', _orbsMoveHandler)
}
