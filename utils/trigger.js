import emit from './emit.js'

export default function trigger (handler, hooks, {source, sse, target, url}) {
  Object.keys(hooks).forEach(selector => {
    [...target.querySelectorAll(selector)].forEach(element => {
      emit(handler, selector, {element, source, sse, url})
    })
  })
}
