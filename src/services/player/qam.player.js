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
  return sessionManager.getPlaybackState()
}

function stop() {
  return sessionManager.stopCurrentPlayback()
}

export { getCurrentPlayableEntity, getPlaybackState, playQAM, stop, pause, play, jump }

export default {}
