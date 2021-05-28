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
import Timeline from './components/Timeline'
import { channelsServiceInit, getCurrentProgram, getChannel } from '@/services/ChannelsService'
import theme from '@/themes/default'
import commonConstants from '@/constants/default'
import constants from './constants'
import { ChannelNumber } from './../NumberInput/channelnumber.js'

let channelsCount = 0
let selectedChannel = null
let selectedProgram = null
let channelNumber = 0
let now = 0

export default class ChannelBar extends Lightning.Component {
  static _template() {
    return {
      w: commonConstants.screen.width,
      h: constants.CHANNELBAR_HEIGHT,
      y: constants.CHANNELBAR_Y,
      src: Utils.asset(constants.CHANNELBAR_BACKGROUND_GRADIENT_URL),
      flex: {
        direction: 'row',
        justifyContent: 'center'
      },
      ChannelContainer: {
        w: constants.CHANNELBAR_CONTAINER_WIDTH,
        h: constants.CHANNELBAR_CONTAINER_HEIGHT,
        y: constants.CHANNELBAR_CONTAINER_Y,
        flex: {
          direction: 'row',
          alignItems: 'center',
          justifyContent: 'space-around'
        },
        ChannelNumber: {
          w: constants.CHANNELBAR_NUMBER_WIDTH,
          h: constants.CHANNELBAR_NUMBER_HEIGHT,
          text: { textColor: theme.colors.white, fontSize: constants.CHANNELBAR_NUMBER_FONTSIZE, textAlign: 'center' }
        },
        Logo: {
          w: constants.CHANNELBAR_LOGO_WIDTH,
          h: constants.CHANNELBAR_LOGO_HEIGHT
        }
      },
      EPGInfo: {
        w: constants.CHANNELBAR_EPG_WIDTH,
        h: constants.CHANNELBAR_EPG_HEIGHT,
        y: constants.CHANNELBAR_EPG_Y,
        ProgressBar: {
          type: Timeline,
          w: constants.TIMELINE_WIDTH,
          h: constants.TIMELINE_HEIGHT
        },
        Title: {
          y: constants.CHANNELBAR_TITLE_Y,
          w: constants.CHANNELBAR_TITLE_WIDTH,
          h: constants.CHANNELBAR_TITLE_HEIGHT,
          text: { textColor: theme.colors.white, fontSize: constants.CHANNELBAR_TITLE_FONTSIZE, textAlign: 'left' }
        },
        Time: {
          y: constants.CHANNELBAR_TIME_Y,
          w: constants.CHANNELBAR_TIME_WIDTH,
          h: constants.CHANNELBAR_TIME_HEIGHT,
          text: { textColor: theme.colors.white, fontSize: constants.CHANNELBAR_TIME_FONTSIZE, textAlign: 'left' }
        },
        BottomLine: {
          rect: true,
          y: constants.CHANNELBAR_LINE_Y,
          w: constants.CHANNELBAR_LINE_WIDTH,
          h: constants.CHANNELBAR_LINE_HEIGHT,
          color: constants.CHANNELBAR_LINE_COLOR
        }
      }
    }
  }

  updateChannel(logoUrl, num) {
    this.tag('ChannelNumber').text.text = num
    this.tag('Logo').src = Utils.asset(logoUrl)
  }

  updateProgram(title, startTime, endTime) {
    this.tag('Title').text.text = title
    this.tag('Time').text.text = startTime + ' - ' + endTime
  }

  updateProgress(percent) {
    this.tag('ProgressBar').update(percent, true)
  }

  switchToNextChannel() {
    channelNumber = ChannelNumber.currentIndex;
    if (channelsCount > 1) {
      if (channelNumber === channelsCount - 1) {
        channelNumber = 0
      } else {
        channelNumber++
      }
	  ChannelNumber.currentIndex = channelNumber;
      this.updateView()
    }
  }

  switchToPrevChannel() {
	  channelNumber = ChannelNumber.currentIndex;
    if (channelsCount > 1) {
      if (channelNumber === 0) {
        channelNumber = channelsCount - 1
      } else {
        channelNumber--
      }
	  ChannelNumber.currentIndex = channelNumber;
      this.updateView()
    }
  }

  changeChannel() {
    if (selectedChannel && selectedProgram) {
      this.signal('channelChanged', { selectedChannel, selectedProgram })
    }
  }

  _handleLeft() {
    this.switchToPrevChannel();
  }

  _handleRight() {
    this.switchToNextChannel();
  }

  _handleEnter() {
    this.changeChannel();
  }

  _handleKey(key) {
    if (key.code === 'PageUp') {
      this.switchToNextChannel();
      this.changeChannel();
      return true;
    }
    if (key.code === 'PageDown') {
      this.switchToPrevChannel();
      this.changeChannel();
      return true;
    }
    return false;
  }

  _focus() {
    channelNumber = ChannelNumber.currentIndex;
    this.updateView();
  }

  updateView() {
    selectedChannel = getChannel(channelNumber)
    selectedProgram = getCurrentProgram(selectedChannel.channelId, now)
    this.updateChannel(selectedChannel.logo, selectedChannel.channelNumber)
    this.updateProgram(selectedProgram.title, this.getTimeFromTimestamp(selectedProgram.startTime * 1000), this.getTimeFromTimestamp(selectedProgram.endTime * 1000))
  }

  async _init() {
    const channels = await channelsServiceInit()
    channelsCount = channels.length
    channelNumber = 0
    // let now = new Date()
    // Math.round(now.getTime()/1000)
    // for testing
    now = 1519221700

    this.updateView()
    this.signal('channelBarReady', { selectedChannel, selectedProgram })
  }

  getTimeFromTimestamp(timestamp) {
    const dateObj = new Date(timestamp)
    const hours = dateObj.getHours().toString()
    const minutes = dateObj.getMinutes().toString().length === 1 ? '0' + dateObj.getMinutes().toString() : dateObj.getMinutes().toString()
    return hours + ':' + minutes
  }
}
