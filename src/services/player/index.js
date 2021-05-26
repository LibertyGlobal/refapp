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

import * as IPPlayer from './ip.player'
import * as QAMPlayer from './qam.player'

let currentPlayer
let needToStopCurrentPlayer = false
let lastActiveQAMChannel

function init(config) {
  config.endpoint = 'http://' + window.location.host;
  return Promise.all([QAMPlayer.setUpPlayer(config), IPPlayer.setUpPlayer(config)])
}

function getCurrentPlayableEntity() {
  return currentPlayer.getCurrentPlayableEntity()
}

function getPlaybackState() {
  return currentPlayer.getPlaybackState()
}

function stopPlayBack() {
  if (needToStopCurrentPlayer) {
    return currentPlayer.stop().then(() => {
      needToStopCurrentPlayer = false
      if (currentPlayer == IPPlayer && lastActiveQAMChannel) {
        return playQAM(lastActiveQAMChannel)
      }
    })
  }
  return Promise.resolve()
}

function playLastQamChannel() {
  if (lastActiveQAMChannel) {
    return playQAM(lastActiveQAMChannel)
  }
  else {
    return Promise.resolve()
  }
}

function playIP(entity) {
  return stopPlayBack().then(() => {
    currentPlayer = IPPlayer
    needToStopCurrentPlayer = true
    return currentPlayer.playIP(entity)
  })
}

function playQAM(entity) {
  return stopPlayBack().then(() => {
    currentPlayer = QAMPlayer
    needToStopCurrentPlayer = true
    lastActiveQAMChannel = entity
    return currentPlayer.playQAM(entity)
  })
}

function pause() {
  return currentPlayer.pause()
}

function play() {
  return currentPlayer.play()
}

function jump(position) {
  return currentPlayer.jump(position)
}

export {
  init,
  getCurrentPlayableEntity,
  getPlaybackState,
  playQAM,
  playIP,
  pause,
  play,
  jump,
  stopPlayBack,
  playLastQamChannel
}

export default {}
