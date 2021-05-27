/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2021 Liberty Global B.V.
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
import * as rdkservices from '@/services/RDKServices'

const MODULE_NAME = 'domainModels/player/strategies'

function start(url) {
  return rdkservices.startVideo('main', url)
}

function stop() {
  return rdkservices.stopVideo('main')
}

function play() {
  return rdkservices.playVideo('main')
}

function pause() {
  return rdkservices.pauseVideo('main')
}

function setPosition(positionMillis) {
  return rdkservices.seekToVideo('main', positionMillis / 1000)
}

function getPlaybackState() {
  return rdkservices.getVideoPlaybackState().then(state => {
    if (!state || !state['main']) {
      return {}
    } else {
      const convertedState = {
        duration: state.main.durationMiliseconds,
        speed: state.main.playbackSpeed,
        position: state.main.positionMiliseconds
      }
      return convertedState
    }
  })
}

export { start, stop, play, pause, setPosition, getPlaybackState }
export default {}
