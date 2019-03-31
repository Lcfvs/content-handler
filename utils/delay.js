export default function delay (fn, timeout, ...args) {
  if (timeout) {
    return setTimeout(fn, timeout, ...args)
  }

  Promise.resolve().then(() => fn(...args))
}
