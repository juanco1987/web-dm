import Swiper from 'swiper'
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'
import { SELECTORS } from './constants.js'

/**
 * Inicializa los Swipers que existan en el DOM actual.
 * Devuelve un array con las instancias para poder destruirlas en teardown.
 *
 * @returns {Swiper[]}
 */
export function initSwipers() {
  const instances = []

  // --- Cerrajería: carrusel coverflow de productos ---
  if (document.querySelector(SELECTORS.swiperCerrajeria)) {
    const sw = new Swiper(SELECTORS.swiperCerrajeria, {
      modules: [EffectCoverflow, Autoplay],
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      coverflowEffect: {
        rotate:       0,
        stretch:      0,
        depth:        500,
        modifier:     1,
        slideShadows: true,
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      }
    })
    instances.push(sw)
  }

  // --- Automatismos: tres galerías de proyectos ---
  SELECTORS.swiperAutomatismos.forEach(selector => {
    if (!document.querySelector(selector)) return

    const sw = new Swiper(selector, {
      modules: [Autoplay, Pagination],
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      speed: 1200,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        480:  { slidesPerView: 1 },
        768:  { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }
    })
    instances.push(sw)
  })

  return instances
}
