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
import { getIpAddress } from '@/services/RDKServices'

export default class CurrentIP extends Lightning.Component {
  static _template() {
    return {
      CurrentIP: {
        x: constants.IP_LEFT,
        y: constants.IP_TOP,
        zIndex: constants.IP_ZINDEX
      }
    }
  }

  async _init() {
    this.tag('CurrentIP').text = await getIpAddress()

    const myAnimation = this.tag('CurrentIP').animation({
        duration: 30,
        repeat: 0,
        stopMethod: 'immediate',
        actions: [
            {p: 'alpha', v: {0: 0, 0.10: 1, 1: 0}}
        ]
    });
    myAnimation.start();
  }
}
