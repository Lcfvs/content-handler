import ContentSupervisor from '../../content-supervisor.js'
import ContentHandler from '../../content-handler.js'
import delay from '../../utils/delay.js'
import emit from '../../utils/emit.js'
import invoke from '../../utils/invoke.js'
import listen from '../../utils/listen.js'
import parse from '../../utils/parse.js'

const EventSource = window.EventSource

function handle (source) {
  listen(source.supervisor, {
    abort () {
      source.stop()
      emit(source, 'aborted')
    }
  })

  listen(source, {
    message (event) {
      ContentHandler
        .getByDocument(source.element.ownerDocument)
        .addContainer(parse(source, event.data, {
          sse: source
        }))
    }
  })
}

export default function sse (config) {
  const source = new EventSource(config.input, config.configuration)

  delay(handle, 0, source)

  return Object.assign(source, config)
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
