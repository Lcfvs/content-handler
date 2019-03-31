function credentials (config, credentials) {
  return {
    ...config,
    init: {
      ...config.init,
      credentials
    }
  }
}

export default Object.assign(credentials, {
  include (config) {
    return credentials(config, 'include')
  },
  omit (config) {
    return credentials(config, 'omit')
  },
  sameOrigin (config) {
    return credentials(config, 'same-origin')
  }
})
