/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Liberty Global B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'
import * as logger from '@/shared/logger'
import { requestJson } from '@/shared/request'

const MODULE_NAME = 'domainModels/player/strategies'

let currentPlaybackState
let playerEndpoint

function startPlayback(config) {
  const request = {
    openRequest: config
  }
  logger.info(MODULE_NAME, 'startPlayback REQ', request)
  return requestJson({
    href: `${playerEndpoint}/vldms/sessionmgr/open`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Connection: 'keep-alive'
    },
    body: request
  }).then(data => {
    currentPlaybackState = Object.assign({}, config, { sessionId: data.openStatus.sessionId })
    logger.info(MODULE_NAME, 'startPlayback RES', data)
    return data
  }).catch((err) => {
    logger.warn("can't connect to sessionmgr", err)
  })
}

function stopCurrentPlayback() {
  if (currentPlaybackState == null) {
    return Promise.resolve({})
  }
  const request = {
    closeRequest: {
      sessionId: currentPlaybackState.sessionId
    }
  }
  logger.info(MODULE_NAME, 'stopCurrentPlayback REQ', request)
  return requestJson({
    href: `${playerEndpoint}/vldms/sessionmgr/close`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Connection: 'keep-alive'
    },
    body: request
  }).then(data => {
    logger.info(MODULE_NAME, 'stopCurrentPlayback RES', data)
    return data
  }).catch((err) => {
    logger.warn("can't connect to sessionmgr", err)
  })
}

function getPlaybackState() {
  if (currentPlaybackState == null) {
    return Promise.resolve({})
  }
  const request = {
    getSessionPropertyRequest: {
      sessionId: currentPlaybackState.sessionId,
      refId: currentPlaybackState.refId,
      properties: ['duration', 'position', 'speed'],
    }
  }
  logger.info(MODULE_NAME, 'getPlaybackState REQ', request)
  return requestJson({
    href: `${playerEndpoint}/vldms/sessionmgr/getSessionProperty`,
    method: 'PUT',
    body: request
  }).then(data => {
    logger.info(MODULE_NAME, 'getPlaybackState RES', data)
    return data.sessionProperty || {}
  })
}

function setPlaybackState(props) {
  if (currentPlaybackState == null) {
    return Promise.resolve({})
  }
  const request = {
    setSessionPropertyRequest: {
      sessionId: currentPlaybackState.sessionId,
      refId: currentPlaybackState.refId,
      setProperties: props
    }
  }
  logger.info(MODULE_NAME, 'setPlaybackState REQ', request)
  return requestJson({
    href: `${playerEndpoint}/vldms/sessionmgr/setSessionProperty`,
    method: 'PUT',
    body: request
  }).then(data => {
    logger.info(MODULE_NAME, 'setPlaybackState RES', data)
    return data
  })
}

function setPlayerEndpoint(endpoint) {
  playerEndpoint = endpoint
}

export { getPlaybackState, setPlaybackState, setPlayerEndpoint, startPlayback, stopCurrentPlayback }
export default {}
