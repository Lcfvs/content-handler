function mode (config, mode) {
  return {
    ...config,
    init: {
      ...config.init,
      mode
    }
  }
}

export default Object.assign(mode, {
  cors (config) {
    return mode(config, 'cors')
  },
  navigate (config) {
    return mode(config, 'navigate')
  },
  noCors (config) {
    return mode(config, 'no-cors')
  },
  sameOrigin (config) {
    return mode(config, 'same-origin')
  }
})
