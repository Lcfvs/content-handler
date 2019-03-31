import delay from './utils/delay.js'
import forward from './utils/forward.js'
import listen from './utils/listen.js'
import Runner from './utils/runner.js'

export default class ContentSupervisor extends window.EventTarget {
  constructor (event, runner, callback) {
    super()
    this.controller = new window.AbortController()
    this.event = event

    if (event.defaultPrevented) {
      delay(() => this.abort, 0)
    }

    listen(runner, {
      config (event) {
        if (event.defaultPrevented || this.aborted) {
          return
        }

        event.preventDefault()
        callback(event.config)
      },
      error ({error, type}) {
        forward(this, {error, type})
      }
    })
  }
  abort () {
    this.controller.abort()
  }
  preventDefault () {
    if (!this.event.defaultPrevented) {
      this.event.preventDefault()
    }
  }
  get signal () {
    return this.controller.signal
  }
  static handle ({element, env, event, controllers}, callback) {
    const runner = new Runner(controllers)
    const supervisor = new ContentSupervisor(event, runner, callback)

    runner.run({supervisor, element, env})
  }
}
