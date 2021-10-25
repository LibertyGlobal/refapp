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

import { Lightning } from '@lightningjs/sdk'
import constants from './constants'
import theme from '@/themes/default'
import { getPlatformNiceName } from '@/services/RDKServices'

export default class DeviceLabel extends Lightning.Component {
  static _template() {
    return {
      DeviceLabel: {
        x: constants.DEVICELABEL_LEFT,
        y: constants.DEVICELABEL_TOP,
        zIndex: constants.DEVICELABEL_ZINDEX
      }
    }
  }

  async _init() {
    this.tag('DeviceLabel').text = await getPlatformNiceName()
  }
}
