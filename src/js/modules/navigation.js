import { gsap } from 'gsap'
import { SELECTORS, BREAKPOINT_MOBILE } from './constants.js'
import { initLogoAnimation } from './logoAnimation.js'
import {
  playWipeLottie, destroyWipeLottie, preloadWipeLottie, waitWipeLottieComplete,
} from './wipeLottie.js'

function isAutomatismosPage(urlOrPath = '') {
  return String(urlOrPath).includes('automatismos.html')
}

function setWipeVisualMode(mode) {
  const svg        = document.querySelector(SELECTORS.doorVisualSvg)
  const lottieWrap = document.querySelector(SELECTORS.doorVisualLottie)
  const lottieEl   = document.querySelector(SELECTORS.doorWipeLottie)

  if (mode === 'lottie') {
    if (svg) svg.hidden = true
    if (lottieWrap) lottieWrap.hidden = false
  } else {
    if (svg) svg.hidden = false
    if (lottieWrap) lottieWrap.hidden = true
    destroyWipeLottie()
  }
}

/** Texto DOORMASTER — puerta SVG (resto de páginas) */
function resetBrandTextSvg(brandText) {
  if (!brandText) return
  gsap.set(brandText, { opacity: 0, scale: 0.25, y: 180, filter: 'blur(4px)' })
}

/** Texto DOORMASTER — cortina Lottie (automatismos) */
function resetBrandTextLottie(brandText) {
  if (!brandText) return
  gsap.set(brandText, { opacity: 0, scale: 0.4, y: 90, filter: 'blur(5px)' })
}

function revealBrandText(tl, brandText, position = '<+=0.42') {
  tl.to(brandText, {
    opacity: 1, scale: 1, y: 0, filter: 'blur(0px)',
    duration: 0.85, ease: 'power2.out',
  }, position)
}

/** Texto más lento para no adelantarse a las puertas Lottie */
function revealBrandTextLottie(tl, brandText, position = '+=0.55') {
  tl.to(brandText, {
    opacity: 1, scale: 1, y: 0, filter: 'blur(0px)',
    duration: 1.2, ease: 'power1.out',
  }, position)
}

/**
 * Marca el ítem de nav activo y oculta el enlace de la página actual del submenú.
 */
function setActiveNavItem() {
  const filename = window.location.pathname.split('/').pop() || 'index.html'
  const selector = SELECTORS.navItemMap[filename]
  if (selector) {
    document.querySelector(selector)?.style.setProperty('display', 'none')
  }
  if (filename === 'index.html' || filename === '') {
    const inicioLink = document.querySelector('.navbar a[href="index.html"]')
    if (inicioLink) inicioLink.setAttribute('aria-current', 'page')
  }
}

/** Bind de clics locales y submenús. Recibe `reinit` como callback para el swap. */
export function initNavigation(reinit) {
  setActiveNavItem()
  bindLocalLinks(reinit)
  bindSubmenuToggles()

  window.addEventListener('popstate', () => {
    navigateToPage(window.location.pathname, reinit)
  })
}

function bindLocalLinks(reinit) {
  document.querySelectorAll(SELECTORS.localLinks).forEach(link => {
    link.removeEventListener('click', link._clickHandler)
    link._clickHandler = function(e) {
      const href = this.getAttribute('href')
      if (href && href !== '#' && !href.startsWith('javascript:')) {
        e.preventDefault()
        navigateToPage(href, reinit)
      }
    }
    link.addEventListener('click', link._clickHandler)
  })
}

function bindSubmenuToggles() {
  document.querySelectorAll(SELECTORS.submenuTriggers).forEach(link => {
    link.removeEventListener('click', link._submenuHandler)
    link._submenuHandler = function(e) {
      e.preventDefault()
      if (window.innerWidth > BREAKPOINT_MOBILE) return

      const submenu = this.closest('li')?.querySelector('.submenu')
      if (!submenu) return

      const isOpen = submenu.style.display === 'block'
      document.querySelectorAll('.navbar .submenu').forEach(sm => (sm.style.display = ''))
      if (!isOpen) submenu.style.display = 'block'
    }
    link.addEventListener('click', link._submenuHandler)
  })
}

/**
 * Navega a la URL destino con la animación de puerta, intercambia el DOM y reinicializa.
 */
async function navigateToPage(targetUrl, reinit) {
  const wipe      = document.querySelector(SELECTORS.wipe)
  const doorScene = document.querySelector(SELECTORS.doorScene)
  const doorPanel = document.querySelector(SELECTORS.doorPanel)
  const doorLight = document.querySelector(SELECTORS.doorLight)
  const brandText = document.querySelector(SELECTORS.doorBrandText)

  if (!wipe) {
    window.location.href = targetUrl
    return
  }

  wipe.style.pointerEvents = 'all'

  const pageFetch = fetch(targetUrl)
    .then(r => { if (!r.ok) throw new Error(r.status); return r.text() })
    .catch(err => {
      console.error('Navegación degradada:', err)
      window.location.href = targetUrl
      return null
    })

  const useLottie = isAutomatismosPage(targetUrl)
  const lottieEl  = document.querySelector(SELECTORS.doorWipeLottie)

  buildDoorTimeline({
    wipe, doorScene, doorPanel, doorLight, brandText, lottieEl,
    pageFetch, targetUrl, reinit, useLottie,
  })
}

/**
 * Coreografía GSAP: puerta (SVG o Lottie en automatismos) + DOORMASTER + swap.
 */
function buildDoorTimeline({
  wipe, doorScene, doorPanel, doorLight, brandText, lottieEl,
  pageFetch, targetUrl, reinit, useLottie,
}) {
  if (!doorScene) {
    // Fallback mínimo si falta la escena
    const tl = gsap.timeline()
    tl.to(wipe, { y: '0%', duration: 0.8, ease: 'power4.inOut' })
    tl.add(async () => { const html = await pageFetch; if (html) performDOMSwap(html, targetUrl, reinit) })
    tl.to(wipe, {
      y: '-100%', duration: 1.1, ease: 'power4.inOut',
      onComplete: () => {
        wipe.style.pointerEvents = 'none'
        requestAnimationFrame(() => initLogoAnimation())
      },
    })
    return
  }

  const lottieWrap = document.querySelector(SELECTORS.doorVisualLottie)
  if (useLottie) {
    buildLottieWipeTimeline({ wipe, doorScene, brandText, lottieWrap, pageFetch, targetUrl, reinit })
    return
  }

  if (!doorPanel) {
    buildMinimalWipeTimeline(wipe, pageFetch, targetUrl, reinit)
    return
  }

  setWipeVisualMode('svg')
  gsap.set(wipe, { y: '100%' })
  gsap.set(doorPanel, { rotationY: 0, opacity: 1, scale: 1 })
  if (doorLight) gsap.set(doorLight, { opacity: 0 })
  resetBrandTextSvg(brandText)
  doorScene.style.display = 'flex'

  const tl = gsap.timeline()

  tl.to(wipe, { y: '0%', duration: 0.7, ease: 'power4.inOut' })
  tl.to(doorPanel, { rotationY: -82, duration: 1.15, ease: 'power3.inOut' }, '-=0.05')
  if (doorLight) tl.to(doorLight, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.8')
  revealBrandText(tl, brandText)
  appendWipeExit(tl, {
    wipe, doorScene, brandText, doorPanel, doorLight, lottieWrap,
    pageFetch, targetUrl, reinit, useLottie: false,
  })
}

function buildLottieWipeTimeline({ wipe, doorScene, brandText, lottieWrap, pageFetch, targetUrl, reinit }) {
  setWipeVisualMode('lottie')
  gsap.set(wipe, { y: '100%' })
  if (lottieWrap) gsap.set(lottieWrap, { opacity: 1, scale: 1 })
  resetBrandTextLottie(brandText)
  doorScene.style.display = 'flex'
  preloadWipeLottie()

  const tl = gsap.timeline()

  tl.to(wipe, { y: '0%', duration: 0.7, ease: 'power4.inOut' })
  tl.add(() => {
    const container = document.querySelector(SELECTORS.doorWipeLottie)
    return container ? playWipeLottie(container, 'doorsOpening') : Promise.resolve()
  })
  revealBrandTextLottie(tl, brandText, '+=0.35')
  appendWipeExit(tl, {
    wipe, doorScene, brandText, lottieWrap,
    pageFetch, targetUrl, reinit, useLottie: true,
  })
}

function buildMinimalWipeTimeline(wipe, pageFetch, targetUrl, reinit) {
  const tl = gsap.timeline()
  tl.to(wipe, { y: '0%', duration: 0.8, ease: 'power4.inOut' })
  tl.add(async () => { const html = await pageFetch; if (html) performDOMSwap(html, targetUrl, reinit) })
  tl.to(wipe, {
    y: '-100%', duration: 1.1, ease: 'power4.inOut',
    onComplete: () => {
      wipe.style.pointerEvents = 'none'
      setWipeVisualMode('svg')
      requestAnimationFrame(() => initLogoAnimation())
    },
  })
}

function appendWipeExit(tl, {
  wipe, doorScene, brandText, doorPanel, doorLight, lottieWrap,
  pageFetch, targetUrl, reinit, useLottie,
}) {
  const fadeTargets = useLottie
    ? [brandText, lottieWrap].filter(Boolean)
    : [doorPanel, brandText, doorLight].filter(Boolean)

  tl.add(async () => {
    const html = await pageFetch
    if (html) performDOMSwap(html, targetUrl, reinit)
  })
  if (useLottie) {
    tl.add(() => waitWipeLottieComplete())
  }
  tl.to(fadeTargets, {
    opacity: 0, scale: 0.94, duration: useLottie ? 0.28 : 0.35, ease: 'power2.in',
    delay: useLottie ? 0.15 : 0.28,
  })
  tl.to(wipe, {
    y: '-100%', duration: useLottie ? 0.82 : 1.05, ease: 'power4.inOut',
    onComplete: () => {
      wipe.style.pointerEvents = 'none'
      doorScene.style.display = 'none'
      setWipeVisualMode('svg')
      if (brandText) gsap.set(brandText, { opacity: 1, scale: 1, y: 0, filter: 'none' })
      if (doorPanel) {
        gsap.set(doorPanel, { opacity: 1, scale: 1, rotationY: 0 })
      }
      requestAnimationFrame(() => initLogoAnimation())
    },
  })
}

/**
 * Intercambia el body del DOM, preserva la cortina activa y actualiza la URL.
 */
function performDOMSwap(htmlText, targetUrl, reinit) {
  const parser = new DOMParser()
  const doc    = parser.parseFromString(htmlText, 'text/html')

  // Eliminar cortina del HTML entrante (ya tenemos la activa)
  doc.querySelector(SELECTORS.wipe)?.remove()

  const newClass   = doc.body.className
  const newContent = doc.body.innerHTML
  const newTitle   = doc.title

  // Preservar nodo de cortina activo
  const activeWipe = document.querySelector(SELECTORS.wipe)
  activeWipe?.remove()

  document.body.className = newClass
  document.body.innerHTML = newContent

  if (activeWipe) document.body.insertBefore(activeWipe, document.body.firstChild)

  document.title = newTitle
  window.history.pushState(null, '', targetUrl)

  resetLogoForAnimation()
  reinit({ duringWipeTransition: true })
}

/** Permite reiniciar la animación del logo del menú tras cada navegación. */
function resetLogoForAnimation() {
  document.querySelectorAll(SELECTORS.logo).forEach((logo) => {
    delete logo.dataset.logoAnimated
    logo.classList.remove('logo--ready')
  })
}

/**
 * Coreografía de entrada en la carga inicial de la página (no SPA).
 * Muestra la puerta abriéndose y luego revela el contenido.
 */
export function runInitialWipe() {
  const wipe      = document.querySelector(SELECTORS.wipe)
  if (!wipe) return

  const doorScene = document.querySelector(SELECTORS.doorScene)
  const doorPanel = document.querySelector(SELECTORS.doorPanel)
  const doorLight = document.querySelector(SELECTORS.doorLight)
  const brandText = document.querySelector(SELECTORS.doorBrandText)

  const lottieWrap = document.querySelector(SELECTORS.doorVisualLottie)
  const useLottie  = isAutomatismosPage(window.location.pathname)

  if (!doorScene) {
    gsap.to(wipe, {
      y: '-100%', duration: 1.1, ease: 'power4.inOut', delay: 0.3,
      onComplete: () => {
        wipe.style.pointerEvents = 'none'
        requestAnimationFrame(() => initLogoAnimation())
      },
    })
    return
  }

  gsap.set(wipe, { y: '0%' })
  doorScene.style.display = 'flex'
  wipe.style.pointerEvents = 'all'

  const tl = gsap.timeline({ delay: 0.25 })

  if (useLottie) {
    setWipeVisualMode('lottie')
    resetBrandTextLottie(brandText)
    if (lottieWrap) gsap.set(lottieWrap, { opacity: 1, scale: 1 })
    tl.add(() => {
      const container = document.querySelector(SELECTORS.doorWipeLottie)
      return container ? playWipeLottie(container, 'doorsOpening') : Promise.resolve()
    })
    revealBrandTextLottie(tl, brandText, '+=0.35')
    tl.add(() => waitWipeLottieComplete())
    tl.to([brandText, lottieWrap].filter(Boolean), {
      opacity: 0, scale: 0.94, duration: 0.28, ease: 'power2.in', delay: 0.15,
    })
  } else if (doorPanel) {
    setWipeVisualMode('svg')
    resetBrandTextSvg(brandText)
    gsap.set(doorPanel, { rotationY: 0, opacity: 1, scale: 1 })
    if (doorLight) gsap.set(doorLight, { opacity: 0 })
    tl.to(doorPanel, { rotationY: -82, duration: 1.15, ease: 'power3.inOut' })
    if (doorLight) tl.to(doorLight, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.8')
    revealBrandText(tl, brandText)
    tl.to([doorPanel, brandText, doorLight].filter(Boolean), {
      opacity: 0, scale: 0.94, duration: 0.4, ease: 'power2.in', delay: 0.45,
    })
  }

  tl.to(wipe, {
    y: '-100%',
    duration: useLottie ? 0.82 : 1.1,
    ease: 'power4.inOut',
    onComplete: () => {
      wipe.style.pointerEvents = 'none'
      doorScene.style.display = 'none'
      setWipeVisualMode('svg')
      if (brandText) gsap.set(brandText, { opacity: 1, scale: 1, y: 0, filter: 'none' })
      if (doorPanel) gsap.set(doorPanel, { opacity: 1, scale: 1, rotationY: 0 })
      requestAnimationFrame(() => initLogoAnimation())
    },
  })
}
