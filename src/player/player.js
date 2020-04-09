let currentPlaying = {}

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

  return fetch('http://localhost:8080/vldms/sessionmgr/open', requestOptions)
    .then(response => {
      return response.json()
    })
    .then(data => {
      currentPlaying.closeRequest.sessionId = data.openStatus.sessionId
      console.log(currentPlaying)
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

  return fetch('http://localhost:8080/vldms/sessionmgr/close', requestOptions)
    .then(response => {
      return response.json()
    })
    .then(data => {
      return data
    })
}

export function getPlaybackState() {}

export function setPlaybackState() {}

export function setPlayerEndpoint() {}
