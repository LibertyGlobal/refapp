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
import { Lightning, Utils } from '@lightningjs/sdk'
import theme from '@/themes/default'
import commonConstants from '@/constants/default'
import constants from './constants'
import ChannelsList from '@/components/ChannelsList'

export default class TVChannelScreen extends Lightning.Component {
  static _template() {
    return {
      ChannelListContainer: {
        rect: true,
        w: constants.CHLIST_CONTAINER_WIDTH,
        h: commonConstants.screen.height,
        color: constants.CHLIST_CONTAINER_COLOR,
        alpha: 0.8
      },
      ChannelListTitle: {
        w: constants.CHLIST_CONTAINER_WIDTH,
        h: constants.CHLIST_TITLE_HEIGHT,
        y: constants.CHLIST_TITLE_TOP,
        text: {
          text: constants.CHLIST_TITLE,
          fontSize: constants.CHLIST_TITLE_FONTSIZE,
          textAlign: 'center'
        }
      },
      ChannelListTB: {
        rect: true,
        w: constants.CHLIST_CONTAINER_WIDTH,
        h: constants.CHLIST_TITLE_BH,
        y: constants.CHLIST_TITLE_BT,
        color: constants.CHLIST_TITLE_BC
      },
      List:{
        type: ChannelsList,
        zindex: 2
      }
    }
  }

  _handleUp() {
	 // TODO
  }

  _handleDown() {
	  // TODO
  }

  _handleLeft() {
	  // TODO
  }

  _handleRight() {
	  // TODO
  }

  _handleKey(key) {
    if (key.code === 'Backspace') {
      navigateBackward()
      return true
    }
    return false
  }

  _handleEnter() {
    // TODO
    if (selectedChannel) {
      this.signal('channelChanged', { selectedChannel })
    }
  }
  
  _focus() {
    // TODO
    channelNumber = ChannelNumber.currentIndex;
  }

  updateView() {
    // TODO
  }

  async _init() {
  
  }
}
