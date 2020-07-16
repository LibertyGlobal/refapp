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

// 'use strict'

import * as logger from '@/shared/logger'

import { playerModes } from './constants'
import * as sessionManager from './strategies/sessionManager'
import * as rdkPlayerManager from './strategies/rdkPlayerManager'

const MODULE_NAME = 'domainModels/player/ip.player'

let currentPlayableEntity
let mode = playerModes.SSM

function getCurrentPlayableEntity() {
  return currentPlayableEntity
}

function playIP(vod) {
  currentPlayableEntity = vod
  if (isRdkMode()) {
    return rdkPlayerManager.startIP(vod.locator)
  }
  const config = {
    type: 'main',
    locator: vod.locator,
    refId: vod.refId,
  }

  return sessionManager.startPlayback(config)
}

function pause() {
  if (isRdkMode()) {
    return rdkPlayerManager.pause()
  }
  return sessionManager.setPlaybackState({ speed: 0 })
}

function play() {
  if (isRdkMode()) {
    return rdkPlayerManager.play()
  }
  return sessionManager.setPlaybackState({ speed: 1 })
}

function jump(position) {
  if (isRdkMode()) {
    return rdkPlayerManager.setPosition(position)
  }
  return sessionManager.setPlaybackState({ position })
}

function isRdkMode() {
  return false
  // return mode === playerModes.RDK
}

function getPlaybackState() {
  return isRdkMode() ? rdkPlayerManager.getPlaybackState() : sessionManager.getPlaybackState()
}

function stop() {
  if (isRdkMode()) {
    return rdkPlayerManager.stopIP()
  }
  return sessionManager.stopCurrentPlayback()
}

function setUpPlayer({ ipPlayerMode, endpoint }) {
  mode = ipPlayerMode
  if (isRdkMode()) {
    return rdkPlayerManager.initPlayer()
  }

  sessionManager.setPlayerEndpoint(endpoint)
  return Promise.resolve()
}

export { getCurrentPlayableEntity, getPlaybackState, playIP, stop, pause, play, jump, setUpPlayer }

export default {}
