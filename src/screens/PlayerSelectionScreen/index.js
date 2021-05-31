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

import { Utils } from '@lightningjs/sdk'
import { navigate } from '@/lib/Router'
import BaseScreen from '../BaseScreen'
import Background from '@/components/Background'
import PlayerList from './components/PlayerList'
import theme from '@/themes/default'
import constants from './constants'
import * as IPPlayer from '@/services/player/ip.player'

export default class PlayerSelectionScreen extends BaseScreen {
  static _template() {
    return {
      Background: {
        type: Background
      },
      Title: {
        y: theme.layouts.generic.paddingTop,
        x: theme.layouts.generic.paddingLeft,
        text: {
          fontSize: constants.TITLE_FONTSIZE,
          textColor: theme.colors.white,
          text: 'Player Selection'
        }
      },
      Lists: {
        x: constants.LISTS_X,
        y: constants.LISTS_Y
      }
    }
  }

  async _init() {
    this._index = 0

    let children = [{
      type: PlayerList,
      itemSize: { w: constants.LISTS_W, h: constants.LISTS_H },
      label: 'SessionManager',
      items: [
        {
          label: 'SessionManager (Websocket IPPlayer)',
          id: 'SSM',
          // images from https://material.io/resources/icons/?icon=get_app&style=baseline
          // Apache License 2.0 https://github.com/google/material-design-icons/blob/master/LICENSE
          image: 'img/baseline_theaters_white_48dp.png'
        }
      ],
      y: 0
    }, {
      type: PlayerList,
      itemSize: { w: constants.LISTS_W, h: constants.LISTS_H },
      label: 'FireBoltMediaPlayer',
      items: [
        {
          label: 'FireBoltMediaPlayer (RDKServices/AAMP/OCDM)',
          id: 'FIREBOLT',
          image: 'img/baseline_theaters_white_48dp.png'
        }
      ],
      y: constants.LISTS_Y_BETWEEN + constants.LISTS_H
    }]
    this._index = 0
    this.tag('Lists').children = children
  }

  _handleUp() {
    if (this._index > 0) {
      this.setIndex(this._index - 1)
    }
  }

  _handleDown() {
    if (this._index < this.tag('Lists').children.length) {
      this.setIndex(this._index + 1)
      return true
    }
    return false
  }

  _handleEnter() {
    if (this._index == 0 ) {
      IPPlayer.switchToSessionManagerPlayer()
    } else {
      IPPlayer.switchToFireBoltMediaPlayer()
    }
    navigate('movies', true)
  }

  setIndex(index) {
    this._index = index
  }

  _getFocused() {
    return this.activeList
  }

  get lists() {
    return this.tag('Lists').children
  }

  get activeList() {
    return this.lists[this._index]
  }
}
