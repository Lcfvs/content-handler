function integrity (config, integrity) {
  return {
    ...config,
    init: {
      ...config.init,
      integrity
    }
  }
}

export default Object.assign(integrity, {
  attribute (config) {
    return integrity(config, config.element.integrity)
  }
})
