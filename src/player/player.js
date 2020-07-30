let currentPlaying = {}
let Status = {}
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
      Status.state = 'OPEN'
      currentPlaying.closeRequest.sessionId = data.openStatus.sessionId
      return data
    })
}

export function stopCurrentPlayback() {
  let requestOptions = {
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
      Status.state = 'CLOSE'
      return data
    })
}

export function getStatus() {
  return Status
}

export async function getPlaybackState(params) {
  var requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Connection: 'keep-alive'
    },
    body: JSON.stringify(params)
  }

  let url = ip + '/vldms/sessionmgr/getSessionProperty'
  return fetch(url, requestOptions)
    .then(response => {
      return response.json()
    })
    .then(data => {
      return data
    })
}

export async function setPlaybackState(params) {
  var requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Connection: 'keep-alive'
    },
    body: JSON.stringify(params)
  }

  let url = ip + '/vldms/sessionmgr/setSessionProperty'
  return fetch(url, requestOptions)
    .then(response => {
      return response.json()
    })
    .then(data => {
      return data
    })
}

export async function play() {
  let params = {
    setSessionPropertyRequest: {
      type: 'main',
      sessionId: currentPlaying.closeRequest.sessionId,
      refId: currentPlaying.closeRequest.refId,
      setProperties: { speed: 1 }
    }
  }
  let result = await setPlaybackState(params)
  Status.state = 'PLAY'
  return result
}

export async function pause() {
  let params = {
    setSessionPropertyRequest: {
      type: 'main',
      sessionId: currentPlaying.closeRequest.sessionId,
      refId: currentPlaying.closeRequest.refId,
      setProperties: { speed: 0 }
    }
  }
  let result = await setPlaybackState(params)
  Status.state = 'PAUSE'
  return result
}

export async function getPosition() {
  let params = {
    getSessionPropertyRequest: {
      type: 'main',
      sessionId: currentPlaying.closeRequest.sessionId,
      refId: currentPlaying.closeRequest.refId,
      properties: ['duration', 'position', 'speed']
    }
  }
  let result = await getPlaybackState(params)
  return result
}
export function fastforward() {
  let params = {
    setSessionPropertyRequest: {
      type: 'main',
      sessionId: currentPlaying.closeRequest.sessionId,
      refId: currentPlaying.closeRequest.refId,
      setProperties: { speed: 5 }
    }
  }
  let result = setPlaybackState(params)
  Status.state = 'FASTFORWARD'
  return result
}

export function rewind() {
  let params = {
    setSessionPropertyRequest: {
      type: 'main',
      sessionId: currentPlaying.closeRequest.sessionId,
      refId: currentPlaying.closeRequest.refId,
      setProperties: { speed: -5 }
    }
  }
  let result = setPlaybackState(params)
  Status.state = 'REWIND'
  return result
}

export async function setPosition(postion) {
  let params = {
    setSessionPropertyRequest: {
      type: 'main',
      sessionId: currentPlaying.closeRequest.sessionId,
      refId: currentPlaying.closeRequest.refId,
      setProperties: { position: postion }
    }
  }
  let result = await setPlaybackState(params)
  return result
}

export function setPlayerEndpoint(config) {
  ip = config.endpoint
}
