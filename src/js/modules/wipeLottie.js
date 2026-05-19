import lottie from 'lottie-web'
import {
  LOTTIE_WIPE_AUTOMATISMOS,
  LOTTIE_WIPE_PLAYBACK_SPEED,
  LOTTIE_WIPE_DOORS_AT,
  LOTTIE_WIPE_MIN_DOORS_MS,
} from './constants.js'

let _wipeLottie = null
let _preloadPromise = null
let _completePromise = null
let _resolveComplete = null

export function preloadWipeLottie() {
  if (!_preloadPromise) {
    _preloadPromise = fetch(LOTTIE_WIPE_AUTOMATISMOS).catch(() => {})
  }
  return _preloadPromise
}

export function destroyWipeLottie() {
  if (_wipeLottie) {
    _wipeLottie.destroy()
    _wipeLottie = null
  }
  _completePromise = null
  _resolveComplete = null
}

function armCompletePromise() {
  _completePromise = new Promise((resolve) => {
    _resolveComplete = resolve
  })
  return _completePromise
}

/**
 * @param {HTMLElement} container
 * @param {'doorsOpening' | 'complete'} waitUntil
 * @returns {Promise<void>}
 */
export function playWipeLottie(container, waitUntil = 'complete') {
  destroyWipeLottie()
  if (container) container.replaceChildren()

  armCompletePromise()

  return new Promise((resolve) => {
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      resolve()
    }

    const timeoutMs = waitUntil === 'doorsOpening' ? 6000 : 12000
    const timeout = setTimeout(finish, timeoutMs)

    try {
      _wipeLottie = lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: LOTTIE_WIPE_AUTOMATISMOS,
      })

      _wipeLottie.addEventListener('complete', () => {
        clearTimeout(timeout)
        _resolveComplete?.()
        _resolveComplete = null
        if (waitUntil === 'complete') finish()
      })

      _wipeLottie.addEventListener('error', () => {
        clearTimeout(timeout)
        console.warn('[DoorMaster] Error cargando', LOTTIE_WIPE_AUTOMATISMOS)
        _resolveComplete?.()
        _resolveComplete = null
        finish()
      })

      _wipeLottie.addEventListener('data_ready', () => {
        const anim = _wipeLottie
        const total = anim.totalFrames || 1
        const openFrame = Math.max(1, Math.floor(total * LOTTIE_WIPE_DOORS_AT))
        const playStarted = performance.now()

        anim.setSpeed(LOTTIE_WIPE_PLAYBACK_SPEED)
        anim.play()

        if (waitUntil === 'doorsOpening') {
          const tryFinish = () => {
            const frameOk = anim.currentFrame >= openFrame
            const timeOk = performance.now() - playStarted >= LOTTIE_WIPE_MIN_DOORS_MS
            if (frameOk && timeOk) {
              anim.removeEventListener('enterFrame', tryFinish)
              clearTimeout(timeout)
              finish()
            }
          }
          anim.addEventListener('enterFrame', tryFinish)
          tryFinish()
        }
      })
    } catch (err) {
      clearTimeout(timeout)
      console.warn('[DoorMaster]', err)
      _resolveComplete?.()
      _resolveComplete = null
      finish()
    }
  })
}

/** Espera a que termine la instancia Lottie activa (sin recargar). */
export function waitWipeLottieComplete(maxMs = 12000) {
  if (!_completePromise) return Promise.resolve()
  return Promise.race([
    _completePromise,
    new Promise((resolve) => setTimeout(resolve, maxMs)),
  ])
}
