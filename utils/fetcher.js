import ContentSupervisor from '../content-supervisor.js'
import ContentHandler from '../content-handler.js'
import delay from './delay.js'
import emit from './emit.js'
import parse from './parse.js'
import listen from './listen.js'
import url from './url.js'

const Request = window.Request
const fetchers = []

function enqueue (fetcher) {
  const key = fetchers.push(fetcher) - 1

  if (!key) {
    return fetch()
  }

  listen(fetchers[key - 1].supervisor, {
    abort: fetch,
    DOMContentLoaded: fetch
  })
}

function fetch () {
  const fetcher = fetchers[0]

  if (!fetcher || fetcher.supervisor.signal.aborted) {
    return
  }

  const {element, request, supervisor} = fetcher

  emit(supervisor, 'fetch')

  element.ownerDocument.defaultView
    .fetch(request.clone())
    .then(response => {
      const status = response.status

      if (status === 408) {
        return delay(fetch, 1000)
      }

      if (!response.ok) {
        const error = new Error(`Request rejected with status ${status}`)

        throw Object.assign(error, {status})
      }

      fetchers.shift()
      fetcher.url = response.url || request.url || fetcher.input

      return response.text()
        .then(data => {
          ContentHandler
            .getByDocument(element.ownerDocument)
            .addContainer(parse(fetcher, data, {
              source: element,
              url: url(element, fetcher.url)
            }))
        })
    })
    .catch(error => {
      if (supervisor.signal.aborted) {
        return emit(fetcher, 'aborted', error)
      }

      emit(fetcher, 'error', error)
    })
}

export default class Fetcher extends window.EventTarget {
  constructor (config) {
    super()
    this.request = new Request(config.input, config.init)
    Object.assign(this, config)

    delay(enqueue, 0, this)
  }
  static fetch (config) {
    ContentSupervisor.handle(config, config => {
      config.supervisor.preventDefault()

      return new Fetcher(config)
    })
  }
}
