import empty from '../../../utils/empty.js'

function headers (config, name, value) {
  return {
    ...config,
    init: {
      ...config.init,
      headers: {
        ...config.init.headers,
        [name]: value
      }
    }
  }
}

export default Object.assign(headers, {
  contentType (config) {
    if (empty(config.init.method)) {
      return
    }

    const value = config.element.enctype || 'x-www-form-urlencoded'

    return headers(config, 'Content-Type', value)
  },
  xhr (config) {
    return headers(config, 'X-Requested-With', 'XMLHttpRequest')
  }
})
