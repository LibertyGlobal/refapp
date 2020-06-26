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

import * as sessionManager from './strategies/sessionManager'

let currentPlayableEntity = null

function getCurrentPlayableEntity() {
  return currentPlayableEntity
}

function playQAM(service) {
  currentPlayableEntity = service
  const config = {
    type: 'main',
    locator: service.locator,
    refId: service.channelId,
  }

  return sessionManager.startPlayback(config)
}

function pause() {
  return sessionManager.setPlaybackState({ speed: 0 })
}

function play() {
  return sessionManager.setPlaybackState({ speed: 1 })
}

function jump(position) {
  return sessionManager.setPlaybackState({ position })
}

function getPlaybackState() {
  sessionManager.getPlaybackState()
}

function stop() {
  return sessionManager.stopCurrentPlayback()
}

function setUpPlayer({ endpoint }) {
  sessionManager.setPlayerEndpoint(endpoint)
  return Promise.resolve()
}

export { getCurrentPlayableEntity, getPlaybackState, playQAM, stop, pause, play, jump, setUpPlayer }

export default {}
