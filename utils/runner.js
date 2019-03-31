import emit from './emit.js'

export default class Runner extends window.EventTarget {
  constructor (controllers) {
    super()
    this.controllers = controllers
  }
  run (config) {
    const supervisor = config.supervisor

    return this.controllers
      .reduce((promise, controller) => promise.then(config => {
        if (supervisor.aborted) {
          throw new Error()
        }

        return controller(config)
      }), Promise.resolve(config))
      .then(config => emit(this, 'config', {config}))
      .catch(error => emit(this, 'error', {error}))
  }
}
