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
import * as player from '@/services/player/'
import commonConstants from '@/constants/default'
import constants from './constants'
import { channelsServiceInit, getChannel } from '@/services/ChannelsService'
import TVChannelScreenList from './components/TVChannelScreenList'
import BaseScreen from '../BaseScreen'
import { getActiveScreen, navigateForward, navigateBackward, navigate } from './../../lib/Router'

export default class TVChannelScreen extends BaseScreen {
  static _template() {
    return {
      ChannelListContainer: {
        rect: true,
        w: constants.CHLIST_CONTAINER_WIDTH,
        h: commonConstants.screen.height,
        color: constants.CHLIST_CONTAINER_COLOR,
        alpha: 0.8
      },
      Lists: {
        x: 0,
        y: 60
      },
      ChannelListTitleBg: {
        rect: true,
        color: constants.CHLIST_CONTAINER_COLOR,
        w: constants.CHLIST_CONTAINER_WIDTH,
        h: constants.CHLIST_CONTAINER_BG_HEIGHT,
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
      ChannelInfo: {
        rect: true,
        color: constants.CHLIST_CONTAINER_COLOR,
        alpha: 0.9,
        w: constants.CHLIST_INFO_WIDTH,
        h: constants.CHLIST_INFO_HEIGHT,
        x: constants.CHLIST_INFO_X,
        y: constants.CHLIST_INFO_Y,
        visible: false,
        ImageIcon: {
          w: constants.CHLIST_INFO_IMAGE_WIDTH,
          h: constants.CHLIST_INFO_IMAGE_HEIGHT,
          alpha: 0.5,

        },
        RefIdTxt: {
          x: constants.CHLIST_INFO_REF_ID_X,
          y: constants.CHLIST_INFO_REF_ID_Y,
          text: {
            fontSize: constants.CHLIST_INFO_FONTSIZE,
          }
        },
        LocatorTxt: {
          x: constants.CHLIST_INFO_LOCATER_X,
          y: constants.CHLIST_INFO_LOCATER_Y,
          w: constants.CHLIST_INFO_LOCATER_WIDTH,
          text: {
            fontSize: constants.CHLIST_INFO_FONTSIZE,
            wordWrap: true
          }
        },


      }
    }
  }

  _getFocused() {
    return this.activeList
  }

  _handleKey(key) {
    if (key.code === 'Backspace') {
      navigateBackward()
      return true
    }
    return false
  }

  _handleEnter() {
    let selectedItem = this.tag('Lists').children[0].activeItem._item
    console.log(selectedItem)
    this._play(selectedItem)
    this.tag('ChannelInfo').visible = true;
    this.tag('RefIdTxt').text = "channelId : " + selectedItem.channelId
    this.tag('LocatorTxt').text = "locator : " + selectedItem.locator
    this.tag("ImageIcon").patch({ src: Utils.asset(selectedItem.logo), x: constants.CHLIST_INFO_IMAGE_X, y: constants.CHLIST_INFO_IMAGE_Y });
    let timer = setTimeout(function (ref) {
      ref.tag('ChannelInfo').visible = false;
      clearTimeout(timer);
    }, 4000, this)
  }


  async _play(entry) {
    await player.playQAM(entry)
  }

  async _init() {

    const channels = await channelsServiceInit();
    let channelList = [];

    for (let _index = 0; _index < channels.length; _index++) {
      channels[_index].label = channels[_index].channelId
    }


    let obj = {
      type: TVChannelScreenList,
      itemSize: { w: constants.LIST_ITEM_WIDTH, h: constants.LIST_ITEM_HEIGHT },
      label: "",
      items: channels,
      x: constants.LIST_X,
      y: constants.LIST_Y
    };
    channelList.push(obj);
    this._index = 0
    this.tag('Lists').children = channelList;
  }

  get lists() {
    return this.tag('Lists').children
  }

  get activeList() {
    return this.lists[this._index]
  }
}
