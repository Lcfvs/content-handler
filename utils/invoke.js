import emit from './emit.js'
import listen from './listen.js'

export default function invoke (target, listener) {
  emit(listen(target, {
    invoke (event) {
      return listener.call(target, event)
    }
  }), 'invoke')
}
