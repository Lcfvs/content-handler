import empty from '../../utils/empty.js'
import Fetcher from '../../utils/fetcher.js'
import listen from '../../utils/listen.js'
import url from '../../utils/url.js'

const FormData = window.FormData

export default function form (config) {
  const element = config.element
  const method = (element.method || 'GET')
  const data = new FormData(element)
  const body = empty(method) ? null : data

  return {
    ...config,
    init: {
      ...config.init || {},
      body,
      method
    },
    input: url(element, element.action, body && data)
  }
}

Object.assign(form, {
  listen (controllers = [], env = {}) {
    controllers = [form, ...controllers]

    return ({element}) => {
      listen(element, {
        submit (event) {
          Fetcher.fetch({element, env, event, controllers})
        }
      })
    }
  },
  selector: `
form:not([target]),
form[target=_self]`
})
