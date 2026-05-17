import { gsap } from 'gsap'
import { SELECTORS, BREAKPOINT_MOBILE } from './constants.js'

/**
 * Marca el ítem de nav activo y oculta el enlace de la página actual del submenú Servicios.
 */
function setActiveNavItem() {
  const filename = window.location.pathname.split('/').pop() || 'index.html'
  const selector = SELECTORS.navItemMap[filename]
  if (selector) {
    document.querySelector(selector)?.style.setProperty('display', 'none')
  }
  // Marcar enlace "Inicio" como activo en index
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

  // Soporte para botones atrás/adelante del navegador
  window.addEventListener('popstate', () => {
    const url  = window.location.pathname
    const isCerrajeria = url.includes('cerrajeria.html')
    navigateToPage(url, isCerrajeria, reinit)
  })
}

function bindLocalLinks(reinit) {
  document.querySelectorAll(SELECTORS.localLinks).forEach(link => {
    link.removeEventListener('click', link._clickHandler)
    link._clickHandler = function(e) {
      const href = this.getAttribute('href')
      if (href && href !== '#' && !href.startsWith('javascript:')) {
        e.preventDefault()
        navigateToPage(href, href.includes('cerrajeria.html'), reinit)
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
 * Navega a la URL destino con coreografía GSAP, intercambia el DOM y reinicializa.
 */
async function navigateToPage(targetUrl, isCerrajeria, reinit) {
  const wipe        = document.querySelector(SELECTORS.wipe)
  const logoWrapper = document.querySelector(SELECTORS.logoWrapper)
  const wipeLogo    = document.querySelector(SELECTORS.wipeLogo)
  const wipeBar     = document.querySelector(SELECTORS.wipeBar)
  const customScene = document.querySelector(SELECTORS.customScene)
  const lockSvg     = document.querySelector(SELECTORS.lockSvg)
  const keySvg      = document.querySelector(SELECTORS.keySvg)
  const lockText    = document.querySelector(SELECTORS.lockText)

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

  const tl = gsap.timeline()

  if (isCerrajeria && customScene && lockSvg && keySvg && lockText) {
    buildCerrajeriaTimeline(tl, { wipe, logoWrapper, customScene, lockSvg, keySvg, lockText, pageFetch, targetUrl, reinit })
  } else {
    buildStandardTimeline(tl, { wipe, logoWrapper, wipeLogo, wipeBar, customScene, pageFetch, targetUrl, reinit })
  }
}

function buildCerrajeriaTimeline(tl, { wipe, logoWrapper, customScene, lockSvg, keySvg, lockText, pageFetch, targetUrl, reinit }) {
  if (logoWrapper) logoWrapper.style.display = 'none'
  customScene.style.display = 'flex'

  gsap.set([lockSvg, keySvg, lockText], { scale: 1 })
  gsap.set(lockSvg, { opacity: 1 })
  gsap.set([SELECTORS.lockCore, keySvg], { rotate: 0 })
  gsap.set(keySvg, { x: 160, opacity: 0 })
  gsap.set(lockText, { opacity: 0, y: 15 })

  tl.to(wipe, { y: '0%', duration: 0.8, ease: 'power4.inOut' })
  tl.fromTo(keySvg, { x: 160, opacity: 0 }, { x: 26, opacity: 1, duration: 0.9, ease: 'power2.inOut' })
  tl.to(lockSvg, { scale: 1.06, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out' }, '-=0.25')
  tl.to(keySvg, { rotate: 90, duration: 0.6, ease: 'back.out(1.5)' }, '+=0.05')
  tl.to(SELECTORS.lockCore, { rotate: 90, duration: 0.6, ease: 'back.out(1.5)' }, '<')
  tl.add(() => {
    const pulse = document.querySelector(SELECTORS.unlockPulse)
    if (pulse) gsap.fromTo(pulse, { width: 20, height: 20, opacity: 1, scale: 1 }, { width: 500, height: 500, opacity: 0, duration: 0.8, ease: 'power2.out' })
  }, '-=0.2')
  tl.to(lockText, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.4')
  tl.add(async () => {
    const html = await pageFetch
    if (html) performDOMSwap(html, targetUrl, reinit)
  })
  tl.to([lockSvg, keySvg, lockText], { scale: 0.92, opacity: 0, duration: 0.4, ease: 'power2.in', delay: 0.3 })
  tl.to(wipe, {
    y: '-100%', duration: 1.1, ease: 'power4.inOut',
    onComplete: () => {
      wipe.style.pointerEvents = 'none'
      customScene.style.display = 'none'
      if (logoWrapper) logoWrapper.style.display = 'flex'
    }
  })
}

function buildStandardTimeline(tl, { wipe, logoWrapper, wipeLogo, wipeBar, customScene, pageFetch, targetUrl, reinit }) {
  if (customScene) customScene.style.display = 'none'
  if (logoWrapper) logoWrapper.style.display = 'flex'
  if (wipeBar) gsap.set(wipeBar, { left: '-40%' })

  tl.to(wipe, { y: '0%', duration: 0.8, ease: 'power4.inOut' })
  tl.fromTo(wipeLogo, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
  tl.add(async () => {
    const html = await pageFetch
    if (html) performDOMSwap(html, targetUrl, reinit)
  })
  tl.to(wipe, {
    y: '-100%', duration: 1.1, ease: 'power4.inOut',
    onComplete: () => { wipe.style.pointerEvents = 'none' }
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

  reinit()
}

/**
 * Coreografía de entrada en la carga inicial de la página (no SPA).
 */
export function runInitialWipe() {
  const wipe        = document.querySelector(SELECTORS.wipe)
  if (!wipe) return

  const isLocksmith = window.location.pathname.includes('cerrajeria.html')
  const logoWrapper = document.querySelector(SELECTORS.logoWrapper)
  const wipeLogo    = document.querySelector(SELECTORS.wipeLogo)
  const wipeBar     = document.querySelector(SELECTORS.wipeBar)
  const customScene = document.querySelector(SELECTORS.customScene)
  const lockSvg     = document.querySelector(SELECTORS.lockSvg)
  const keySvg      = document.querySelector(SELECTORS.keySvg)
  const lockText    = document.querySelector(SELECTORS.lockText)

  if (isLocksmith && customScene && lockSvg && keySvg && lockText) {
    if (logoWrapper) logoWrapper.style.display = 'none'
    customScene.style.display = 'flex'

    const tl = gsap.timeline()
    gsap.set([lockSvg, keySvg, lockText], { scale: 1 })
    gsap.set(lockSvg, { opacity: 1 })
    gsap.set([SELECTORS.lockCore, keySvg], { rotate: 0 })

    tl.fromTo(keySvg, { x: 160, opacity: 0 }, { x: 26, opacity: 1, duration: 0.9, ease: 'power2.inOut', delay: 0.1 })
    tl.to(lockSvg, { scale: 1.06, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out' }, '-=0.25')
    tl.to(keySvg, { rotate: 90, duration: 0.6, ease: 'back.out(1.5)' }, '+=0.05')
    tl.to(SELECTORS.lockCore, { rotate: 90, duration: 0.6, ease: 'back.out(1.5)' }, '<')
    tl.add(() => {
      const pulse = document.querySelector(SELECTORS.unlockPulse)
      if (pulse) gsap.fromTo(pulse, { width: 20, height: 20, opacity: 1 }, { width: 500, height: 500, opacity: 0, duration: 0.8, ease: 'power2.out' })
    }, '-=0.2')
    tl.to(lockText, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.4')
    tl.to([lockSvg, keySvg, lockText], { scale: 0.92, opacity: 0, duration: 0.4, ease: 'power2.in', delay: 0.4 })
    tl.to(wipe, {
      y: '-100%', duration: 1.1, ease: 'power4.inOut',
      onComplete: () => {
        wipe.style.pointerEvents = 'none'
        customScene.style.display = 'none'
        if (logoWrapper) logoWrapper.style.display = 'flex'
      }
    })
  } else {
    if (customScene) customScene.style.display = 'none'
    if (logoWrapper) logoWrapper.style.display = 'flex'

    gsap.to([wipeLogo, wipeBar?.parentElement].filter(Boolean), {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.1
    })
    gsap.to(wipe, {
      y: '-100%', duration: 1.1, ease: 'power4.inOut', delay: 0.7,
      onComplete: () => { wipe.style.pointerEvents = 'none' }
    })
  }
}
