import emit from './emit.js'

export default function forward (target, {type, ...rest}) {
  return emit(target, type, rest)
}
