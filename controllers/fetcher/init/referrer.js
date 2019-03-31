function referrer (config, referrer) {
  return {
    ...config,
    init: {
      ...config.init,
      referrer
    }
  }
}

export default Object.assign(referrer, {
  client (config) {
    return referrer(config, 'client')
  },
  noReferrer (config) {
    return referrer(config, 'no-referrer')
  }
})
