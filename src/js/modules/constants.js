/** Breakpoints de pantalla */
export const BREAKPOINT_MOBILE = 768

/** Efecto magnético del botón de WhatsApp */
export const WA_MAGNETIC_RADIUS   = 150
export const WA_MAGNETIC_STRENGTH = 0.35

/** Delay en ms antes de activar la animación split-words (sincronía con cortina) */
export const SPLIT_WORDS_DELAY = 750

/** Duración del scroll líquido Lenis */
export const LENIS_DURATION = 1.2

/** Selectores CSS usados por múltiples módulos */
export const SELECTORS = {
  wipe:            '.page-transition-wipe',
  logoWrapper:     '.page-transition-logo-wrapper',
  wipeLogo:        '.page-transition-logo',
  wipeBar:         '.page-transition-bar',
  customScene:     '.transition-custom-scene',
  lockSvg:         '.transition-lock-svg',
  keySvg:          '.transition-key-svg',
  lockCore:        '.lock-core',
  lockText:        '.lock-text',
  unlockPulse:     '.unlock-pulse',

  hero:            '.hero',
  headerContent:   '.header-content',

  grids:           '.services-grid, .benefits-grid, .features-container, .video-cards-container',
  sectionTitles:   '.main-services h2, .why-choose-us h2, .projects-showcase h2, .gallery-section h2, .why-choose-us h3',
  revealSections:  '.project-category, .cta-section',

  cards3d:         '.service-card, .benefit-card, .feature-box, .video-card',
  splitTitles:     '.animate-fade-in, .header-content h1',

  waButton:        '.whatsapp-float',
  glowOrb:         '.glow-orb',

  swiperCerrajeria:    '.mySwiper',
  swiperAutomatismos:  ['.mySwiper3', '.mySwiper4', '.mySwiper5'],

  localLinks: 'a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"]):not([href^="https://wa.me"])',
  submenuTriggers: '.navbar ul > li > a[href="#"]',

  navItemMap: {
    'index.html':          null,
    'automatismos.html':   '.nav-item-automatismos',
    'mantenimientos.html': '.nav-item-mantenimientos',
    'cerrajeria.html':     '.nav-item-cerrajeria',
  }
}
