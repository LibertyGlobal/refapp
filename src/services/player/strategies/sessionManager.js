/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Operator reference application
 *
 * Copyright (C) 2018-2019 Liberty Global B.V.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; version 2 of the License.
 */

'use strict'
import * as logger from '@/shared/logger'
import { requestJson } from '@/shared/request'

const MODULE_NAME = 'domainModels/player/strategies'

let currentPlaybackState
let playerEndpoint

function startPlayback(config) {
  return requestJson({
    href: `${playerEndpoint}/vldms/sessionmgr/open`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Connection: 'keep-alive'
    },
    body: {
      openRequest: config
    }
  })
    .then(data => {
      currentPlaybackState = Object.assign({}, config, { sessionId: data.openStatus.sessionId })
      logger.info(MODULE_NAME, 'startPlayback', data)
      return data
    })
    .catch((err) => {
      logger.warn("can't connect to sessionmgr")
    })
}

function stopCurrentPlayback() {
  return requestJson({
    href: `${playerEndpoint}/vldms/sessionmgr/close`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Connection: 'keep-alive'
    },
    body: {
      closeRequest: currentPlaybackState
    }
  })
    .then(data => {
      currentPlaybackState = Object.assign({}, currentPlaybackState, {
        sessionId: data.openStatus.sessionId
      })
      logger.info(MODULE_NAME, 'stopCurrentPlayback', data)
      return data
    })
    .catch(() => {
      logger.warn("can't connect to sessionmgr")
    })
}

function getPlaybackState() {
  return requestJson({
    href: `${playerEndpoint}/vldms/sessionmgr/getSessionProperty`,
    method: 'PUT',
    body: {
      getSessionPropertyRequest: {
        sessionId: currentPlaybackState.sessionId,
        refId: currentPlaybackState.refId,
        properties: ['duration', 'position', 'speed'],
      },
    },
  }).then(data => {
    logger.info(MODULE_NAME, 'getPlaybackState', data)
    return data.sessionProperty || {}
  })
}

function setPlaybackState(props) {
  return requestJson({
    href: `${playerEndpoint}/vldms/sessionmgr/setSessionProperty`,
    method: 'PUT',
    body: {
      setSessionPropertyRequest: {
        sessionId: currentPlaybackState.sessionId,
        refId: currentPlaybackState.refId,
        setProperties: props
      }
    }
  }).then(data => {
    logger.info(MODULE_NAME, 'setPlaybackState', data)
    return data
  })
}

function setPlayerEndpoint(endpoint) {
  playerEndpoint = endpoint
}

export { getPlaybackState, setPlaybackState, setPlayerEndpoint, startPlayback, stopCurrentPlayback }
export default {}
