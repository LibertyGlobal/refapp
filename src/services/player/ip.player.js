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
import * as fireBoltMediaPlayerManager from './strategies/fireBoltMediaPlayerManager'

const MODULE_NAME = 'domainModels/player/ip.player'

let currentPlayableEntity
let mode = playerModes.SSM

function getCurrentPlayableEntity() {
  return currentPlayableEntity
}

function playIP(vod) {
  currentPlayableEntity = vod
  if (useFireBoltMediaPlayer()) {
    return fireBoltMediaPlayerManager.start(vod.locator)
  }
  const config = {
    type: 'main',
    locator: vod.locator,
    refId: vod.refId,
  }

  return sessionManager.startPlayback(config)
}

function pause() {
  if (useFireBoltMediaPlayer()) {
    return fireBoltMediaPlayerManager.pause()
  }
  return sessionManager.setPlaybackState({ speed: 0 })
}

function play() {
  if (useFireBoltMediaPlayer()) {
    return fireBoltMediaPlayerManager.play()
  }
  return sessionManager.setPlaybackState({ speed: 1 })
}

function jump(position) {
  if (useFireBoltMediaPlayer()) {
    return fireBoltMediaPlayerManager.setPosition(position)
  }
  return sessionManager.setPlaybackState({ position })
}

function useFireBoltMediaPlayer() {
  return mode === playerModes.FIREBOLT
}

function getPlaybackState() {
  return useFireBoltMediaPlayer() ? fireBoltMediaPlayerManager.getPlaybackState() : sessionManager.getPlaybackState()
}

function stop() {
  if (useFireBoltMediaPlayer()) {
    return fireBoltMediaPlayerManager.stop()
  }
  return sessionManager.stopCurrentPlayback()
}

function switchToFireBoltMediaPlayer() {
  logger.info(MODULE_NAME, 'switchToFireBoltMediaPlayer')
  mode = playerModes.FIREBOLT
  return Promise.resolve()
}

function switchToSessionManagerPlayer() {
  logger.info(MODULE_NAME, 'switchToSessionManagerPlayer')
  mode = playerModes.SSM
  return Promise.resolve()
}

export { getCurrentPlayableEntity, getPlaybackState, playIP, stop, pause, play, jump, switchToFireBoltMediaPlayer, switchToSessionManagerPlayer }

export default {}
