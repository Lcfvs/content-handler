import delay from './delay.js'
import emit from './emit.js'

export default function parse (handle, html, options = {}) {
  const document = handle.element.ownerDocument
  const fragment = document.createDocumentFragment().cloneNode()
  const body = document.createElement('body')

  body.innerHTML = html
  fragment.appendChild(body)
  delay(emit, 0, fragment, 'DOMContentLoaded', options)

  return fragment
}
