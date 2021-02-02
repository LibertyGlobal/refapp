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
import { channelsServiceInit, getChannel } from '@/services/ChannelsService'
import theme from '@/themes/default'
import constants from './constants'

let selectedChannel = null

export default class ChannelsList extends Lightning.Component {
  static _template() {
    return {
      ChannelContainer: {
        w: constants.CHCONTAINER_WIDTH,
        h: constants.CHCONTAINER_HEIGHT,
        x: constants.CHCONTAINER_LEFT,
        y: constants.CHCONTAINER_TOP,
      ChannelNumber: {
          w: constants.CHNUM_WIDTH,
          text: { textColor: theme.colors.white, fontSize: constants.CHNUM_FONTSIZE, textAlign: 'left' }
        },
      Logo: {
          w: constants.CHLOGO_WIDTH,
          h: constants.CHLOGO_HEIGHT,
          x: constants.CHLOGO_LEFT
        },
      Title: {
          w: constants.CHTITLE_WIDTH,
          h: constants.CHTITLE_HEIGHT,
          text: { textColor: theme.colors.white, fontSize: constants.CHTITLE_FONTSIZE, textAlign: 'left' }
        },
      BorderBottom: {
          rect: true,
          y: constants.CHCONTAINER_TOP,
          w: constants.CHCONTAINER_WIDTH,
          h: constants.CHCONTAINER_BH,
          color: constants.CHCONTAINER_BC
        }
      }
      }
      }

  _handleLeft() {
    // TODO
  }

  _handleRight() {
	   // TODO
  }

  _handleEnter() {
    // TODO
    if (selectedChannel) {
      this.signal('channelChanged', { selectedChannel })
    }
  }
  
  _focus() {
    // TODO
  }

  async _init() {
    const channels = await channelsServiceInit()
    console.log("channel list :: "+ JSON.stringify(channels))
    let chContTopPos = 0
    let BorderBottomPos = 0
      for (let _index = 0; _index < channels.length; _index++) {
        console.log("index :: "+_index)
        const element = channels[_index]      
      this.tag('ChannelNumber').text.text = element.channelNumber
      console.log("channelNum :: "+element.channelNumber)
      this.tag('Logo').src = Utils.asset(element.logo)
      console.log("logo :: "+element.logo)
      this.tag('Title').text.text = element.channelId
      console.log("Channel Name || Id :: "+element.channelId)
      }
  //  this.signal('channelBarReady', { selectedChannel })
  }
}
