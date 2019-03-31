export default function listen (target, listeners, options, ...extras) {
  Object.keys(listeners).forEach(name => {
    target.addEventListener(name, listeners[name], options, ...extras)
  })

  return target
}
