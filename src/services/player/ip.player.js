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
