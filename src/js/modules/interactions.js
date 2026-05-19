import { gsap } from 'gsap'
import { SELECTORS, WA_MAGNETIC_RADIUS, WA_MAGNETIC_STRENGTH } from './constants.js'

let _waMagneticHandler = null
let _orbsMoveHandler   = null

/**
 * Efecto 3D tilt + glare en las tarjetas al mover el ratón o hacer touch.
 * El JS toma el control total del transform para evitar conflictos con CSS :hover.
 */
export function initCardTilt() {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  document.querySelectorAll(SELECTORS.cards3d).forEach(card => {
    card.style.transformStyle = 'preserve-3d'

    if (!card.querySelector('.card-glare')) {
      const glare = document.createElement('div')
      glare.className = 'card-glare'
      card.appendChild(glare)
    }

    function applyTilt(clientX, clientY) {
      const { left, top, width, height } = card.getBoundingClientRect()
      const x    = clientX - left
      const y    = clientY - top
      const rotX = ((height / 2 - y) / (height / 2)) * 10
      const rotY = ((x - width  / 2) / (width  / 2)) * 10

      card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.04,1.04,1.04) translateZ(10px) translateY(-6px)`

      const glare = card.querySelector('.card-glare')
      if (glare) {
        glare.style.background = `radial-gradient(circle at ${(x / width) * 100}% ${(y / height) * 100}%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 80%)`
        glare.style.opacity = '1'
      }
    }

    function resetTilt() {
      card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1,1,1) translateZ(0) translateY(0px)'
      const glare = card.querySelector('.card-glare')
      if (glare) glare.style.opacity = '0'
    }

    // Mouse
    card.addEventListener('mousemove',  (e) => applyTilt(e.clientX, e.clientY))
    card.addEventListener('mouseleave', resetTilt)

    // Touch
    if (isTouchDevice) {
      card.addEventListener('touchmove', (e) => {
        const t = e.touches[0]
        applyTilt(t.clientX, t.clientY)
      }, { passive: true })
      card.addEventListener('touchend',   resetTilt)
      card.addEventListener('touchcancel', resetTilt)
    }
  })
}

/**
 * Efecto magnético en el botón de WhatsApp: se acerca al cursor al pasar cerca.
 * Usa GSAP para evitar el conflicto con @keyframes (las animaciones CSS tienen
 * prioridad sobre inline styles, pero GSAP actualiza en cada RAF frame y gana).
 */
export function initWaMagnetic() {
  const waButton = document.querySelector(SELECTORS.waButton)
  if (!waButton) return

  if (_waMagneticHandler) document.removeEventListener('mousemove', _waMagneticHandler)

  let _waInMagnetic = false

  _waMagneticHandler = (e) => {
    const { left, top, width, height } = waButton.getBoundingClientRect()
    const btnX = left + width  / 2
    const btnY = top  + height / 2
    const dist = Math.hypot(e.clientX - btnX, e.clientY - btnY)

    if (dist < WA_MAGNETIC_RADIUS) {
      if (!_waInMagnetic) {
        _waInMagnetic = true
        // `animation: none` como inline style sobreescribe la regla CSS de clase
        // (el cascade normal sí respeta inline > clase para la propiedad `animation`)
        waButton.style.animation = 'none'
      }
      const moveX = (e.clientX - btnX) * WA_MAGNETIC_STRENGTH
      const moveY = (e.clientY - btnY) * WA_MAGNETIC_STRENGTH
      gsap.to(waButton, {
        x:         moveX,
        y:         moveY,
        scale:     1.2,
        boxShadow: '0 20px 40px rgba(37,211,102,0.55)',
        duration:  0.15,
        ease:      'power2.out',
        overwrite: true,
      })
    } else if (_waInMagnetic) {
      _waInMagnetic = false
      // Regresa al centro con rebote elástico
      gsap.to(waButton, {
        x:         0,
        y:         0,
        scale:     1,
        boxShadow: '2px 2px 10px rgba(0,0,0,0.3)',
        duration:  0.6,
        ease:      'elastic.out(1, 0.5)',
        overwrite: true,
        onComplete: () => {
          // Quitar todos los inline styles de GSAP y restaurar animación CSS
          gsap.set(waButton, { clearProps: 'all' })
          waButton.style.animation = ''
        },
      })
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
