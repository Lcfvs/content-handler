function cache (config, cache) {
  return {
    ...config,
    init: {
      ...config.init,
      cache
    }
  }
}

export default Object.assign(cache, {
  default (config) {
    return cache(config, 'default')
  },
  forceCache (config) {
    return cache(config, 'force-cache')
  },
  noCache (config) {
    return cache(config, 'no-cache')
  },
  noStore (config) {
    return cache(config, 'no-store')
  },
  onlyIfCached (config) {
    return cache(config, 'only-if-cached')
  },
  reload (config) {
    return cache(config, 'reload')
  }
})
