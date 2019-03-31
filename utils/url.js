export default function url (target, destination = null, data = null) {
  const {baseURI, ownerDocument} = target
  const {URL, URLSearchParams} = ownerDocument.defaultView
  const url = new URL(destination === null ? '' : destination, baseURI)
  const params = data !== null ? new URLSearchParams(data) : ''

  if (!params.length) {
    return url
  }

  if (url.search.length) {
    url.search = url.search.concat('&', params)

    return url
  }

  url.search = '?'.concat('&', params)

  return url
}
