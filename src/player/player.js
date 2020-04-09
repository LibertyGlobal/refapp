let currentPlaying = {}
let ip = {}

export function getMenu() {
  return fetch('./cache/demo/movies.json')
    .then(response => {
      return response.json()
    })
    .then(data => {
      return data
    })
}

export function startPlayback(params) {
  var requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Connection: 'keep-alive'
    },
    body: JSON.stringify(params)
  }

  currentPlaying = {
    closeRequest: {
      type: 'main',
      locator: params.openRequest.locator,
      refId: params.openRequest.refId,
      sessionId: ''
    }
  }

  let url = ip + '/vldms/sessionmgr/open'
  return fetch(url, requestOptions)
    .then(response => {
      return response.json()
    })
    .then(data => {
      currentPlaying.closeRequest.sessionId = data.openStatus.sessionId
      return data
    })
}

export function stopCurrentPlayback() {
  var requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Connection: 'keep-alive'
    },
    body: JSON.stringify(currentPlaying)
  }

  let url = ip + '/vldms/sessionmgr/close'
  return fetch(url, requestOptions)
    .then(response => {
      return response.json()
    })
    .then(data => {
      return data
    })
}

export function getPlaybackState() {}

export function setPlaybackState() {}

export function setPlayerEndpoint(config) {
  ip = config.endpoint
}
