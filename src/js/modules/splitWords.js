import { SELECTORS, SPLIT_WORDS_DELAY } from './constants.js'

/**
 * Divide los títulos en spans palabra por palabra y los activa con delay escalonado.
 * El timer se registra en `state.splitWordsTimer` para poder cancelarlo en teardown.
 *
 * @param {{ splitWordsTimer: number|null }} state
 */
export function initSplitWords(state) {
  const titles = document.querySelectorAll(SELECTORS.splitTitles)
  if (!titles.length) return

  titles.forEach(title => {
    const text = title.textContent.trim()
    title.textContent = ''

    text.split(' ').forEach((word, i) => {
      const wrapper = document.createElement('span')
      wrapper.className = 'word-wrapper'

      const inner = document.createElement('span')
      inner.className = 'word-reveal'
      inner.textContent = word
      inner.style.transitionDelay = `${(i * 0.08) + 0.1}s`

      wrapper.appendChild(inner)
      title.appendChild(wrapper)

      if (i < text.split(' ').length - 1) {
        title.appendChild(document.createTextNode(' '))
      }
    })
  })

  state.splitWordsTimer = setTimeout(() => {
    state.splitWordsTimer = null
    titles.forEach(title => title.classList.add('split-active'))
  }, SPLIT_WORDS_DELAY)
}
