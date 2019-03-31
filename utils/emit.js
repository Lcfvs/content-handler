import dispatch from './dispatch.js'

const CustomEvent = window.CustomEvent

export default function emit (target, type, detail = {}) {
  dispatch(target, Object.assign(new CustomEvent(type), detail))
}
