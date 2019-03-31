const empties = ['GET', 'HEAD']

export default function empty (method) {
  return empties.includes(method.toUpperCase())
}
