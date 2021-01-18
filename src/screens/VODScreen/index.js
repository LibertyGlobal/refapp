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

import BaseScreen from '../BaseScreen'
import { Utils } from '@lightningjs/sdk'
import { navigateBackward } from '@/lib/Router'
import PlayerProgress from '@/components/PlayerProgress'
import theme from '@/themes/default'
import LoadingIndicator from '@/components/LoadingIndicator'
import * as player from '@/services/player/'
import constants from './constants'
import { isBackKey } from '@/shared/keys'

let intervalId = undefined

export default class VODScreen extends BaseScreen {
  static _template() {
    return {
      Title: {
        y: theme.layouts.generic.paddingTop,
        x: theme.layouts.generic.paddingLeft,
        text: {
          fontSize: constants.TITLE_FONTSIZE,
          textColor: theme.colors.white,
          text: 'Player'
        }
      },
      Progress: {
        y: constants.PROGRESSBAR_Y,
        type: PlayerProgress
      },
      Loading: {
        rect: true,
        w: 1920,
        h: 1080,
        color: theme.colors.black,
        visible: false,
        LoadingIndicator: {
          type: LoadingIndicator,
          mountX: 0.5,
          mountY: 0.5,
          w: 110,
          h: 110,
          x: 960,
          y: 600
        }
      }
    }
  }

  _init() {
    this.currentposition = null;
    this.movieduration = null;
  }

  async update(params) {
    const response = await fetch(Utils.asset('cache/mocks/default/movies.json'))
    const { layout } = await response.json()
    const item = this._getItem(layout, params)
    this._play(item)
    this.tag('Progress').title = item.label
  }

  _getItem(layout, params) {
    let result = {}
    layout.body.forEach((category) => {
      category.items.forEach((item, index) => {
        if (item.id === params) {
          result = item
        }
      })
    })
    return result
  }

  async _play(entry) {
    this._playerSource = entry.locator
    await player.playIP(entry)
    this.startPropertyRequestTimer()
    this.tag('Loading').visible = false
    this.tag('LoadingIndicator').stopAnimation()
    this.tag('Progress').visible = true
  }

  $mediaplayerEnded() {
    navigateBackward()
  }

  $mediaplayerProgress(currentTime, duration) {
    this.tag('Progress').setProgress(currentTime, duration)
  }

  _active() {
    this.tag('Loading').visible = true
    this.tag('LoadingIndicator').startAnimation()
    if(this._playerSource) {
      player.play()
      this.startPropertyRequestTimer()
    }
  }

  _inactive() {
    player.stopPlayBack()
    this.stopPropertyRequestTimer()
  }

  startPropertyRequestTimer() {
    this.stopPropertyRequestTimer()
    this.$mediaplayerProgress(0, 1)
    this.getPlaybackState()
    intervalId = setInterval(this.getPlaybackState.bind(this), 3000);
  }

  stopPropertyRequestTimer() {
    if (intervalId !== undefined) {
      clearInterval(intervalId)
      intervalId = undefined
    }
  }

  getPlaybackState() {
    player.getPlaybackState().then((sessionProperty)=>{
      this.currentposition = sessionProperty.position;
      this.movieduration = sessionProperty.duration;
      this.$mediaplayerProgress(sessionProperty.position, sessionProperty.duration)
    })
  }

  _handleEnter() {
    player.getPlaybackState().then((sessionProperty) => {
      sessionProperty.speed === 0 ? player.play() : player.pause()
    })
  }

  

  _handleLeftRelease(){
    this.currentposition = this.currentposition-(constants.MOVE_POSITION);
    player.jump(this.currentposition);
    this.$mediaplayerProgress(this.currentposition, this.movieduration)
  }


  _handleRightRelease(){
    this.currentposition = this.currentposition+(constants.MOVE_POSITION);
    player.jump(this.currentposition);
    this.$mediaplayerProgress(this.currentposition, this.movieduration)
  }



  _handleKey(key) {
    if (isBackKey(key)) {
      navigateBackward()
      return true
    }
    return false
  }

  _handleUp() {
    this.tag('Progress').visible = !this.tag('Progress').visible
    this.tag('Title').visible = !this.tag('Title').visible
  }

  _focus() {
    this.tag('Title').visible = true
    this.tag('Progress').visible = true
    this.fireAncestors('$hideMenu')
  }

  _unfocus() {
    this.tag('Title').visible = false
    this.tag('Progress').visible = false
  }
}
