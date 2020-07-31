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

import * as IPPlayer from './ip.player'
import * as QAMPlayer from './qam.player'

// const IPPlayer = require('./ip.player')
// const QAMPlayer = require('./qam.player')

let currentPlayer
let needToStopCurrentPlayer = false

function init(config) {
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
    })
  }
  return Promise.resolve()
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
  stopPlayBack
}

export default {}
