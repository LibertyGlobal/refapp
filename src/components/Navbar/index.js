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
import { routingEvent } from '@/lib/Router'
import Menu from '../Menu'
import theme from '../../themes/default'
import commonConstants from '@/constants/default'
import constants from './constants'

let self = null

export default class Navbar extends Lightning.Component {
  static _template() {
    return {
      w: commonConstants.screen.width,
      h: constants.NAVBAR_CONTAINER_HEIGHT,
      y: commonConstants.screen.height - constants.NAVBAR_CONTAINER_HEIGHT,
      flex: {
        direction: 'row',
        alignItems: 'center'
      },
      Background: {
        w: commonConstants.screen.width,
        h: constants.NAVBAR_CONTAINER_HEIGHT,
        src: Utils.asset(constants.NAVBAR_BACKGROUND_URL),
        flexItem: false
      },
      BottomLine: {
        rect: true,
        y: constants.NAVBAR_LINE_Y,
        w: commonConstants.screen.width,
        h: constants.NAVBAR_LINE_HEIGHT,
        color: theme.colors.white,
        mountY: constants.NAVBAR_LINE_MOUNT_Y,
        flexItem: false
      },
      Menu: {
        type: Menu,
        flexItem: {
          grow: 1
        },
        signals: {
          itemSelected: '_menuItemSelected'
        }
      }
    }
  }

  _init() {
    this.tag('Menu').items = [
      { text: 'TV CHANNELS', route: 'tvchannels' },
      { text: 'MOVIES', route: 'player' },
      { text: 'APPS', route: 'apps' },
      { text: 'SETTINGS', route: 'settings' }
    ]

    self = this
    routingEvent.on('routed', this.onScreenRouted)
  }

  onScreenRouted(route) {
    let index = -1
    self.tag('Menu').items.forEach((item, i) => {
      if (item.route === route) {
        index = i
      }
    })
    self.tag('Menu').onScreenRouted(index)
  }

  _menuItemSelected() {}

  _focus() {
    this.setSmooth('alpha', 1)
  }

  _getFocused() {
    return this.tag('Menu')
  }
}
