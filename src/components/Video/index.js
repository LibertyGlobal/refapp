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
import { Lightning, MediaPlayer, Settings, Metrics, Log } from '@lightningjs/sdk'
import commonConstants from '@/constants/default'

export default class Video extends MediaPlayer {
  get videoId() {
    return this._videoId
  }

  updateSettings(settings = {}) {
    // The Component that 'consumes' the media player.
    this._consumer = settings.consumer

    if (settings.videoId) {
      this._videoId = settings.videoId
    }

    if (this._consumer && this._consumer.getMediaplayerSettings) {
      // Allow consumer to add settings.
      settings = Object.assign(settings, this._consumer.getMediaplayerSettings())
    }
    if (!Lightning.Utils.equalValues(this._stream, settings.stream)) {
      if (settings.stream && settings.stream.keySystem) {
        navigator
          .requestMediaKeySystemAccess(
            settings.stream.keySystem.id,
            settings.stream.keySystem.config
          )
          .then(keySystemAccess => {
            return keySystemAccess.createMediaKeys()
          })
          .then(createdMediaKeys => {
            return this.videoEl.setMediaKeys(createdMediaKeys)
          })
          .then(() => {
            if (settings.stream && settings.stream.src) this.open(settings.stream.src)
          })
          .catch(() => {
            console.error('Failed to set up MediaKeys')
          })
      } else if (settings.stream && settings.stream.src) {
        // This is here to be backwards compatible, will be removed
        // in future sdk release
        if (Settings.get('app', 'hls')) {
          if (!window.Hls) {
            window.Hls = class Hls {
              static isSupported() {
                console.warn('hls-light not included')
                return false
              }
            }
          }
          if (window.Hls.isSupported()) {
            if (!this._hls) this._hls = new window.Hls({ liveDurationInfinity: true })
            this._metrics = Metrics.media(settings.stream.src)
            this._hls.loadSource(settings.stream.src)
            this._hls.attachMedia(this.videoEl)
            this.videoEl.style.display = 'block'
          }
        } else {
          this.open(settings.stream.src)
        }
      } else {
        this.close()
      }
      this._stream = settings.stream
    }

    this._setHide(settings.hide)
    this.setVideoArea(settings.videoPosition)
  }

  set consumer(v) {
    this._consumer = v
  }

  _setHide(hide) {
    if (this.textureMode) {
      this.tag('Video').setSmooth('alpha', hide ? 0 : 1)
    } else {
      this.videoEl.style.visibility = hide ? 'hidden' : 'visible'
    }
  }

  open(url, settings = { hide: false, videoPosition: null }) {
    this._stream = url
    this._metrics = Metrics.media(url)
    Log.info('Playing stream', url)
    if (this.application.noVideo) {
      Log.info('noVideo option set, so ignoring: ' + url)
      return
    }
    if (this.videoEl.getAttribute('src') === url) return this.reload()
    this.videoEl.setAttribute('src', url)

    this.videoEl.style.display = 'block'

    this._setHide(settings.hide)
    this.setVideoArea(settings.videoPosition)
  }

  setVideoArea(v) {
    this._setVideoArea(v || [0, 0, commonConstants.screen.width, commonConstants.screen.height])
  }

  close() {
    if (this._stream) {
      this._stream = null

      // We need to pause first in order to stop sound.
      this.videoEl.pause()
      this.videoEl.removeAttribute('src')

      // force load to reset everything without errors
      this.videoEl.load()

      this._clearSrc()

      this.videoEl.style.display = 'none'
    }
    this._videoId = null
  }

  _setVideoArea(videoPos) {
    this._videoPos = videoPos

    if (this.textureMode) {
      this.videoTextureView.patch({
        smooth: {
          x: videoPos[0],
          y: videoPos[1],
          w: videoPos[2] - videoPos[0],
          h: videoPos[3] - videoPos[1]
        }
      })
    } else {
      const precision = this.stage.getRenderPrecision()
      this.videoEl.style.left = Math.round(videoPos[0] * precision) + 'px'
      this.videoEl.style.top = Math.round(videoPos[1] * precision) + 'px'
      this.videoEl.style.width = Math.round((videoPos[2] - videoPos[0]) * precision) + 'px'
      this.videoEl.style.height = Math.round((videoPos[3] - videoPos[1]) * precision) + 'px'
    }
  }
}
