import ContentSupervisor from '../../content-supervisor.js'
import ContentHandler from '../../content-handler.js'
import delay from '../../utils/delay.js'
import emit from '../../utils/emit.js'
import invoke from '../../utils/invoke.js'
import listen from '../../utils/listen.js'
import parse from '../../utils/parse.js'
import url from '../../utils/url.js'

const EventSource = window.EventSource

function handle (emitter) {
  const element = emitter.element

  listen(emitter.supervisor, {
    abort () {
      emitter.stop()
      emit(emitter, 'aborted')
    }
  })

  listen(emitter, {
    message (event) {
      ContentHandler
        .getByDocument(element.ownerDocument)
        .addContainer(parse(emitter, event.data, {
          source: element,
          sse: emitter,
          url: url(element, emitter.input)
        }))
    }
  })
}

export default function sse (config) {
  const emitter = new EventSource(config.input, config.configuration)

  delay(handle, 0, emitter)

  return Object.assign(emitter, config)
}

Object.assign(sse, {
  listen (controllers = [], env = {}) {
    return ({element}) => {
      invoke(new window.EventTarget(), event => {
        ContentSupervisor.handle({element, env, event, controllers}, sse)
      })
    }
  },
  selector: `[data-sse]`
})
