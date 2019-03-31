function redirect (config, redirect) {
  return {
    ...config,
    init: {
      ...config.init,
      redirect
    }
  }
}

export default Object.assign(redirect, {
  error (config) {
    return redirect(config, 'error')
  },
  follow (config) {
    return redirect(config, 'follow')
  },
  manual (config) {
    return redirect(config, 'manual')
  }
})
