import delay from './utils/delay.js'
import listen from './utils/listen.js'
import trigger from './utils/trigger.js'
import url from './utils/url.js'

const handlers = []

function is (value) {
  return value.document === this && value.handler
}

export default class ContentHandler extends window.EventTarget {
  constructor (document) {
    super()
    this.hooks = []

    handlers.push({
      document,
      handler: this
    })

    delay(trigger, 0, this, this.hooks, {
      source: document,
      target: document,
      url: url(document.documentElement)
    })
  }
  addContainer (container) {
    const handler = this

    listen(container, {
      DOMContentLoaded ({source, sse, target, url}) {
        trigger(handler, handler.hooks, {source, sse, target, url})
      }
    })
  }
  addEventListener (selector, listener) {
    this.hooks[selector] = this.hooks[selector] || []

    if (!this.hooks[selector].includes(listener)) {
      this.hooks[selector].push({listener, selector})
      super.addEventListener(selector, listener)
    }
  }
  static getByDocument (document = window.document) {
    const handler = handlers.find(is, document)

    if (handler) {
      return handler.handler
    }

    return new ContentHandler(document)
  }
}
