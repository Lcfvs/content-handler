import emit from './emit.js'

export default function trigger (handler, hooks, {target, sse, url}) {
  Object.keys(hooks).forEach(selector => {
    [...target.querySelectorAll(selector)].forEach(element => {
      emit(handler, selector, {element, sse, url})
    })
  })
}
