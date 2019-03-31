import ContentSupervisor from '../content-supervisor.js'
import ContentHandler from '../content-handler.js'
import delay from './delay.js'
import emit from './emit.js'
import parse from './parse.js'
import listen from './listen.js'

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

  let url = request.url
  emit(supervisor, 'fetch')

  element.ownerDocument.defaultView
    .fetch(request.clone())
    .then(response => {
      if (!response.ok) {
        throw Object.assign(new Error(`Request rejected`), {
          status: response.status
        })
      }

      fetchers.shift()
      url = response.url || request.url

      return response.text()
    })
    .then(data => {
      ContentHandler
        .getByDocument(element.ownerDocument)
        .addContainer(parse(fetcher, data, {url}))
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
