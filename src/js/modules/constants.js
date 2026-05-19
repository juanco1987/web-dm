/** Breakpoints de pantalla */
export const BREAKPOINT_MOBILE = 768

/** Efecto magnético del botón de WhatsApp */
export const WA_MAGNETIC_RADIUS   = 150
export const WA_MAGNETIC_STRENGTH = 0.35

/** Delay en ms antes de activar la animación split-words (sincronía con cortina) */
export const SPLIT_WORDS_DELAY = 750

/** Duración del scroll líquido Lenis */
export const LENIS_DURATION = 1.2

/** Scroll reveal — tarjetas y títulos (más alto = aparecen antes al bajar) */
export const SCROLL_REVEAL_START   = 'top 94%'
export const SCROLL_CARD_DURATION  = 0.72
export const SCROLL_TITLE_DURATION = 0.85

/** Animación Lottie del logo (archivo en public/animations/) */
export const LOTTIE_LOGO_PATH = '/animations/puerta-logo.json'

/** Cortina Lottie al entrar a automatismos */
export const LOTTIE_WIPE_AUTOMATISMOS = '/animations/puerta-automatismos.json'

/** Sincronía cortina automatismos (ajustar si el texto adelanta a las puertas) */
export const LOTTIE_WIPE_PLAYBACK_SPEED = 1.4
export const LOTTIE_WIPE_DOORS_AT       = 0.52
export const LOTTIE_WIPE_MIN_DOORS_MS   = 900

/** Selectores CSS usados por múltiples módulos */
export const SELECTORS = {
  wipe:            '.page-transition-wipe',
  doorScene:       '.transition-door-scene',
  doorPanel:       '.door-panel',
  doorLight:       '.door-light',
  doorBrandText:   '.door-brand-text',
  doorVisualSvg:   '.door-visual--svg',
  doorVisualLottie: '.door-visual--lottie',
  doorWipeLottie:  '.door-wipe-lottie',

  hero:            '.header',
  headerContent:   '.header-content',

  grids:           '.services-grid, .benefits-grid, .features-container, .coverage-grid, .video-cards-container, .services-container',
  sectionTitles:   '.main-services h2, .why-choose-us h2, .projects-showcase h2, .gallery-section h2, .why-choose-us h3, .services-section h2',
  revealSections:  '.project-category, .cta-section',

  cards3d:         '.service-card, .benefit-card, .feature-box, .video-card',
  splitTitles:     '.animate-fade-in, .header-content h1',

  waButton:        '.whatsapp-float',
  glowOrb:         '.glow-orb',

  logo:            '.logo',
  logoIconWrap:    '.logo-icon-wrap',
  logoLottie:      '.logo-lottie',
  logoLetter:      '.logo-letter',

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
