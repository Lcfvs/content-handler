# <a name="reference">content-handler</a>

**BETA**

An unified system to easily handle all your HTML/SVG contents, using simple event listeners.

Supports AJAX and Server-Sent Events

## <a name="install">Install</a>

`npm i content-handler`

## <a name="get-the-content-handler-for-a-document">Get the content handler for a document</a>

```js
import ContentHandler from 'content-handler'

// If the document isn't provided, it uses the current window.document
const handler = ContentHandler.getByDocument(document)
```

## <a name="await-elements-from-a-handler">Await elements from a handler</a>

### <a name="loaded-or-not">Loaded or not</a>

```js
import ContentHandler from 'content-handler'

// Await any main tag, already present in the document or loaded by the content
// handler, to apply the listener on it
ContentHandler
  .getByDocument()
  .addEventListener('main', ({element}) => {
    // Rewrites the content (just to illustrate, don't do that in real projects)
    element.innerHTML = `<h1>You're currently testing content-handler</h1>
    <p>This main is rewritten by the ContentHandler's listener, even if loaded
    or not, but in this case, this node <em>is already contained</em> by the
    document, at the page loading.</p>`
  })
```

### <a name="loaded-only">Loaded only</a>

The fetched elements **are not** in the current page, **they need to be added on it**.

```js
import ContentHandler from 'content-handler'

// Await any main tag, but only loaded by the content handler, to apply the
// listener on it
ContentHandler
  .getByDocument()
  .addEventListener('body:first-child main', ({element}) => {
    // Select the current main
    const main = document.querySelector('main')
    
    // Replace the current main by the new one
    main.parentNode.replaceChild(element, main)
  })
```

### <a name="present-only">Present only</a>

The fetched elements **are already** in the current page, **they don't need to be added on it**.

```js
import ContentHandler from 'content-handler'

// Await any main tag, already present in the document, to apply the listener on it
ContentHandler
  .getByDocument()
  .addEventListener('body:not(:first-child) main', ({element}) => {
    // Rewrites the content (just to illustrate, don't do that in real projects)
    element.innerHTML = `<h1>You're currently testing content-handler</h1>
    <p>This main is rewritten by the ContentHandler's listener, but only if this
    node <em>is already contained</em> by the document, at the page loading.</p>`
  })
```

## <a name="listen-content-targets">Listen content targets</a>

A content handler doesn't make anything alone, to automate the fetching ou SSE
listening, you need to tell him how to do it.

It also uses the `handler.addEventListener()` and should need some controllers
(provided or custom) to define the request behavior, make some pre- validation,
 some client optimizations before to send it to the server, etc.

The provided controllers are generic as possible, **not required but recommended**,
to avoid uncommon behaviors between browsers.

It shipped with 3 simple initial controllers with, for each, a default `.selector`
to target the related elements (you can define yours), and a `.listen()` method to
control the request.

### <a name="anchor">anchor</a>

```js
import ContentHandler from 'content-handler/content-handler.js'
import anchor from 'content-handler/controllers/fetcher/anchor.js'
import cache from 'content-handler/controllers/fetcher/init/cache.js'
import headers from 'content-handler/controllers/fetcher/init/headers.js'
import credentials from 'content-handler/controllers/fetcher/init/credentials.js'
import mode from 'content-handler/controllers/fetcher/init/mode.js'
import redirect from 'content-handler/controllers/fetcher/init/redirect.js'
import referrer from 'content-handler/controllers/fetcher/init/referrer.js'

ContentHandler
  .getByDocument()
  .addEventListener(anchor.selector, anchor.listen([
    cache.default, // follow the default cache rule
    headers.xhr, // add the common AJAX header
    credentials.sameOrigin, // allow credentials only for the current origin
    mode.sameOrigin, // allow requests handling only for the current origin
    redirect.follow, // follows the redirects
    referrer.client // set request.referrer to "about:client" by default
], {/* optional env object */}))
```

### <a name="form">form</a>

```js
import ContentHandler from 'content-handler/content-handler.js'
import form from 'content-handler/controllers/fetcher/form.js'
import cache from 'content-handler/controllers/fetcher/init/cache.js'
import headers from 'content-handler/controllers/fetcher/init/headers.js'
import credentials from 'content-handler/controllers/fetcher/init/credentials.js'
import mode from 'content-handler/controllers/fetcher/init/mode.js'
import redirect from 'content-handler/controllers/fetcher/init/redirect.js'
import referrer from 'content-handler/controllers/fetcher/init/referrer.js'

ContentHandler
  .getByDocument()
  .addEventListener(form.selector, form.listen([
    headers.contentType, // detect the content type, if needed
    cache.default, // follow the default cache rule
    headers.xhr, // add the common AJAX header
    credentials.sameOrigin, // allow credentials only for the current origin
    mode.sameOrigin, // allow requests handling only for the current origin
    redirect.follow, // follows the redirects
    referrer.client // set request.referrer to "about:client" by default
], {/* optional env object */}))
```

### <a name="sse">sse</a>

```js
import ContentHandler from 'content-handler/content-handler.js'
import sse from 'content-handler/controllers/sse/sse.js'
import withCredentials from 'content-handler/controllers/sse/configuration/with-credentials.js'
import input from 'content-handler/controllers/sse/input.js'

ContentHandler
  .getByDocument()
  .addEventListener(sse.selector, sse.listen([
    input.dataset, // get the input url from "data-sse" attribute
    withCredentials.sameOrigin // allow credentials only for the current origin
  ], {/* optional env object */}))
```

## <a name="make-your-own-controller">Make your own controller</a>

Making your own controller is really easy, it just a function, receiving a
request config object and returning a new one.

```js
function customFetcherController (config) {
  const {input, supervisor} = config // {element, init, input, supervisor, env}
  
  // if the request doesn't targets the current origin, abort
  if (input.origin !== document.location.origin) {
    supervisor.abort()
  }
  
  return {...config}
}

function customSSEController (config) {
  const {input, supervisor} = config // {configuration, element, input, supervisor, env}
  
  // if the request doesn't targets the current origin, abort
  if (input.origin !== document.location.origin) {
    supervisor.abort()
  }
  
  return {...config}
}
```

## <a name="license">License</a>

[MIT](https://github.com/Lcfvs/content-handler/blob/master/licence.md)
