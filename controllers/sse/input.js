import url from '../../utils/url.js'

function input (config, href) {
  return {
    ...config,
    input: url(config.element, href)
  }
}

export default Object.assign(input, {
  dataset (config) {
    return input(config, config.element.dataset.sse)
  }
})
