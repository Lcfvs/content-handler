import emit from './emit.js'

export default function trigger (handler, hooks, {source, sse, target, url}) {
  Object.keys(hooks).forEach(selector => {
    Array.from(target.querySelectorAll(selector))
      .forEach(element => {
        emit(handler, selector, {element, source, sse, url})
      })
  })
}
