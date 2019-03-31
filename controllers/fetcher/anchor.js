import Fetcher from '../../utils/fetcher.js'
import listen from '../../utils/listen.js'
import url from '../../utils/url.js'

export default function anchor (config) {
  const element = config.element
  const init = config.init || {}

  return {
    ...config,
    init: {
      ...init || {},
      headers: {
        ...init.headers || {}
      }
    },
    input: url(element, element.href)
  }
}

Object.assign(anchor, {
  listen (controllers = [], env = {}) {
    controllers = [anchor, ...controllers]

    return ({element}) => {
      let touched = false

      listen(element, {
        touchstart () {
          touched = true
        },
        touchend (event) {
          if (event.touches.length === 1) {
            touched = false

            return Fetcher.fetch({element, env, event, controllers})
          }

          touched = false
        },
        click (event) {
          if (!touched) {
            return Fetcher.fetch({element, env, event, controllers})
          }

          touched = false
        }
      })
    }
  },
  selector: `
a[href^="."]:not([download]):not([target]),
a[href^="/"]:not([download]):not([target]),
a[href^="http"]:not([download]):not([target]),
a[href^="."][target=_self]:not([download]),
a[href^="/"][target=_self]:not([download]),
a[href^="http"][target=_self]:not([download])`
})
