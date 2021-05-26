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
import theme from '@/themes/default'
import ChannelBar from '@/components/ChannelBar'
import LoadingIndicator from '@/components/LoadingIndicator'
import * as player  from '@/services/player/'
import constants from './constants'
import commonConstants from '@/constants/default'

export default class HomeScreen extends BaseScreen {
  static _template() {
    return {
      Title: {
        y: theme.layouts.generic.paddingTop,
        x: theme.layouts.generic.paddingLeft,
        text: {
          fontSize: constants.TITLE_FONTSIZE,
          textColor: theme.colors.white,
          text: 'Main menu'
        }
      },
      ChannelBar: {
        type: ChannelBar,
        y: constants.CHANNELBAR_Y,
        visible: false,
        signals: {
          channelChanged: '_onChannelChanged',
          channelBarReady: '_onChannelBarReady'
        }
      },
      Loading: {
        rect: true,
        w: commonConstants.screen.width,
        h: commonConstants.screen.height,
        color: theme.colors.black,
        visible: false,
        LoadingIndicator: {
          type: LoadingIndicator,
          mountX: constants.LOADINGINDICATOR_MOUNT_X,
          mountY: constants.LOADINGINDICATOR_MOUNT_Y,
          x: constants.LOADINGINDICATOR_X,
          y: constants.LOADINGINDICATOR_Y,
          w: constants.LOADINGINDICATOR_WIDTH,
          h: constants.LOADINGINDICATOR_HEIGHT,
        }
      }
    }
  }

  _init() {
  }

  async _play(entry) {
    if (this._focused) {
      this.tag('ChannelBar').visible = true
    }
    await player.playQAM(entry)

    this.tag('LoadingIndicator').stopAnimation()
    this.tag('Loading').visible = false
  }

  _getFocused() {
    return this.tag('ChannelBar')
  }

  _onChannelBarReady(info) {
    this._play(info.selectedChannel)
  }

  _onChannelChanged(info) {
    this.tag('Loading').visible = true
    this.tag('LoadingIndicator').startAnimation()
    this._play(info.selectedChannel)
  }

  _focus() {
    this.tag('Title').text.text = 'Channel bar'
    this.tag('ChannelBar').visible = true
    this._focused = true
    this.fireAncestors('$hideMenu')
  }

  _unfocus() {
    this.tag('Title').text.text = 'Main menu'
    this.tag('Title').visible = true
    this.tag('ChannelBar').visible = false
    this._focused = false
  }

  _handleUp() {
    this.tag('Title').visible = !this.tag('Title').visible
    this.tag('ChannelBar').visible = !this.tag('ChannelBar').visible
  }
}
