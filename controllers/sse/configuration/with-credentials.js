function withCredentials (config, withCredentials) {
  return {
    ...config,
    configuration: {
      ...config.configuration,
      withCredentials
    }
  }
}

export default Object.assign(withCredentials, {
  include (config) {
    return withCredentials(config, true)
  },
  omit (config) {
    return withCredentials(config, false)
  }
})
