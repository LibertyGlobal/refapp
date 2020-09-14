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

// import { EventEmitter } from 'events'
import { Lightning } from 'wpe-lightning-sdk'
import { playingVodStates } from './constants'

const MODULE_NAME = 'domainModels/player/strategies'

// const eventEmitter = new EventEmitter()
const eventEmitter = new Lightning.EventEmitter()

const DEFAULT_OPTIONS = {
  t: 'wayland',
  x: 0,
  y: 0,
  w: 1280,
  h: 720,
  // parent: global.scene.root,
  parent: Document,
  cmd: 'rdkmediaplayer',
}

let playerStats = {
  duration: 0,
  position: 0,
  speed: 0,
  isPlaying: playerPromiseFabric(playingVodStates.PLAYING_VOD_STARTED),
  isPlayingStopped: playerPromiseFabric(playingVodStates.PLAYING_VOD_STOPPED),
  isPlayingPaused: playerPromiseFabric(playingVodStates.PLAYING_VOD_PAUSED),
}

let waylandObj
let player
let eventPlayExecuted = false
let lastJumpedPosition = 0

function resetPlayerStats() {
  playerStats = {
    duration: 0,
    position: 0,
    speed: 0,
    isPlaying: playerPromiseFabric(playingVodStates.PLAYING_VOD_STARTED),
    isPlayingStopped: playerPromiseFabric(playingVodStates.PLAYING_VOD_STOPPED),
    isPlayingPaused: playerPromiseFabric(playingVodStates.PLAYING_VOD_PAUSED),
  }
}

function playerPromiseFabric(eventName) {
  // return new Promise(resolve => eventEmitter.once(eventName, resolve))
  return new Promise(resolve => eventEmitter.on(eventName, resolve))
}

function onMediaOpened(e) {
  logger.log(
    MODULE_NAME,
    'onMediaOpened',
    `
        Event ${e.name}
        type: ${e.mediaType}
        width: ${e.width}
        height: ${e.height}
        speed: ${e.availableSpeeds}
        sap: ${e.availableAudioLanguages}
        cc: ${e.availableClosedCaptionsLanguages}
        customProperties: ${e.customProperties}
        mediaSegments: ${e.mediaSegments}
    `
  )
}

function onProgress({ duration, position, speed }) {
  logger.log(MODULE_NAME, 'onProgress', !!duration)
  logger.log(MODULE_NAME, 'onProgress', JSON.stringify({ duration, position, speed }))
  playerStats.duration = duration
  playerStats.position = position + lastJumpedPosition
  playerStats.speed = speed
  if (duration && !eventPlayExecuted) {
    eventEmitter.emit(playingVodStates.PLAYING_VOD_STARTED)
    playerStats.isPlayingStopped = playerPromiseFabric(playingVodStates.PLAYING_VOD_STOPPED)
    eventPlayExecuted = true
  }
}

function stopIP() {
  if (player) {
    resetPlayerStats()
    eventPlayExecuted = false
    lastJumpedPosition = 0
    player.stop()
    logger.log(MODULE_NAME, 'STOP_PLAYING_VOD: reset stats', playerStats)
    return playerStats.isPlayingStopped
  }
  return Promise.resolve()
}

function onClosed(e) {
  logger.log(MODULE_NAME, 'onClosed', 'executed')
  eventEmitter.emit(playingVodStates.PLAYING_VOD_STOPPED)
}

function registerPlayerEvents() {
  player.on('onMediaOpened', onMediaOpened)
  player.on('onProgress', onProgress)
  // player.on('onStatus', onStatus);
  // player.on('onWarning', onEvent);
  // player.on('onError', nop);
  // player.on('onSpeedChange', onEvent);
  player.on('onClosed', onClosed)
  // player.on('onPlayerInitialized', onEvent);
  // player.on('onBuffering', onEvent);
  // player.on('onPlaying', onEvent);
  // player.on('onPaused', onEvent);
  // player.on('onComplete', onEvent);
  // player.on('onIndividualizing', onEvent);
  // player.on('onAcquiringLicense', onEvent);
  // player.on('onDRMMetadata', onEvent);
  // player.on('onSegmentStarted', onEvent);
  // player.on('onSegmentCompleted', onEvent);
  // player.on('onSegmentWatched', onEvent);
  // player.on('onBufferWarning', onEvent);
  // player.on('onPlaybackSpeedsChanged', onEvent);
  // player.on('onAdditionalAuthRequired', onEvent);
}

function hackToMakeEventsFlow1() {
  setInterval(hackToMakeEventsFlow2, 250)
}

function hackToMakeEventsFlow2() {
  player.volume
}

function getPlaybackState() {
  logger.log(MODULE_NAME, 'getPlaybackState', `sessionProperty ${playerStats}`)
  return Promise.resolve(playerStats)
}

function initPlayer(options = {}) {}

var startUrl = null
function startPlayer(options = {}) {
  const fullOptions = Object.assign({}, DEFAULT_OPTIONS, options)

  // the rdkmediaplayer has an issue with report position if we reuse the player object
  if (waylandObj) {
    //waylandObj.destroy();
    //waylandObj=null;
    //player=null;
  } else {
    waylandObj = global.scene.create(fullOptions)
  }

  waylandObj.focus = true
  waylandObj.moveToBack()
  return waylandObj.remoteReady
    .then(wayland => {
      logger.log(MODULE_NAME, 'Handle wayland success')
      waylandObj = wayland
      player = waylandObj.api
      registerPlayerEvents()
      //setTimeout(hackToMakeEventsFlow1, 1000);
      player.url = startUrl
      player.setVideoRectangle(0, 0, global.scene.w, global.scene.h)
      player.play()
    })
    .catch(e => {
      logger.warn(MODULE_NAME, 'playIP', `${e}`)
    })
}

function startIP(locator) {
  startUrl = locator
  startPlayer()
  return playerStats.isPlaying
}

function setPosition(position) {
  if (player) {
    lastJumpedPosition += playerStats.position
    player.position = position
  }
  return Promise.resolve()
}

function play() {
  if (!player) {
    return Promise.reject(new Error(`${MODULE_NAME}: player isn't initialized`))
  }
  return player.play()
}

function pause() {
  if (!player) {
    return Promise.reject(new Error(`${MODULE_NAME}: player isn't initialized`))
  }
  return player.pause()
}

export { getPlaybackState, setPosition, startIP, stopIP, play, pause, initPlayer }

export default {}
