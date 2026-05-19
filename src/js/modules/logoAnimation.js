import lottie from 'lottie-web'
import { gsap } from 'gsap'
import { SELECTORS, LOTTIE_LOGO_PATH } from './constants.js'

let _logoLottie = null
let _logoFallbackTimer = null

export function destroyLogoLottie() {
  if (_logoFallbackTimer) {
    clearTimeout(_logoFallbackTimer)
    _logoFallbackTimer = null
  }
  if (_logoLottie) {
    _logoLottie.destroy()
    _logoLottie = null
  }
}

function finishLogo(logo, letters) {
  gsap.set(letters, { opacity: 1, y: 0, clearProps: 'transform' })
  logo.classList.add('logo--ready')
  logo.dataset.logoAnimated = '1'
}

/** Fade suave en su sitio (sin forzar salida desde la puerta). */
function revealLetters(logo, letters) {
  if (logo.dataset.logoAnimated === '1') return

  gsap.set(letters, { opacity: 0, y: 6 })
  gsap.to(letters, {
    opacity: 1,
    y: 0,
    duration: 0.35,
    stagger: 0.04,
    ease: 'power2.out',
    onComplete: () => finishLogo(logo, letters),
  })
}

function startLetterFallback(logo, _iconWrap, letters, reason) {
  if (logo.dataset.logoAnimated === '1') return
  if (reason) console.warn('[DoorMaster]', reason)
  revealLetters(logo, letters)
}

/**
 * Logo: Lottie de puerta → letras DOORMASTER. Si falla Lottie, igual se muestra el título.
 */
export function initLogoAnimation() {
  const logo = document.querySelector(SELECTORS.logo)
  if (!logo || logo.dataset.logoAnimated === '1') return

  const iconWrap = logo.querySelector(SELECTORS.logoIconWrap)
  const lottieEl = logo.querySelector(SELECTORS.logoLottie)
  const letters  = logo.querySelectorAll(SELECTORS.logoLetter)
  if (!iconWrap || !lottieEl || !letters.length) return

  destroyLogoLottie()
  gsap.killTweensOf(letters)
  logo.classList.remove('logo--ready')

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finishLogo(logo, letters)
    return
  }

  const fallback = (msg) => startLetterFallback(logo, iconWrap, letters, msg)

  _logoFallbackTimer = setTimeout(() => {
    fallback('Tiempo de espera agotado para Lottie — mostrando texto.')
  }, 4000)

  try {
    _logoLottie = lottie.loadAnimation({
      container: lottieEl,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: LOTTIE_LOGO_PATH,
    })

    const clearFallback = () => {
      if (_logoFallbackTimer) {
        clearTimeout(_logoFallbackTimer)
        _logoFallbackTimer = null
      }
    }

    _logoLottie.addEventListener('data_ready', () => {
      clearFallback()
      _logoLottie.play()
    })

    _logoLottie.addEventListener('complete', () => {
      clearFallback()
      revealLetters(logo, letters)
    })

    _logoLottie.addEventListener('error', () => {
      clearFallback()
      fallback(`No se pudo cargar ${LOTTIE_LOGO_PATH}. Usa "Lottie JSON" (texto que empieza con {), no el archivo .lottie.`)
    })
  } catch (err) {
    if (_logoFallbackTimer) clearTimeout(_logoFallbackTimer)
    fallback(err.message)
  }
}
