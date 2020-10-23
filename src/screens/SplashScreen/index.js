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
import {Utils} from '@lightningjs/sdk'
import LoadingIndicator from '@/components/LoadingIndicator'
import Background from '@/components/Background'
import constants, { INDICATOR_HEIGHT } from './constants'

export default class SplashScreen extends BaseScreen {
  static _template() {
    return {
      Background: {
        type: Background,
      },
      Logo: {
        mountX: constants.LOGO_MOUNT_X,
        mountY: constants.LOGO_MOUNT_Y,
        w: constants.LOGO_WIDTH,
        h: constants.LOGO_HEIGHT,
        x: constants.LOGO_X,
        y: constants.LOGO_Y,
        src: Utils.asset(constants.LOGO_URL)
      },
      LoadingIndicator: {
        type: LoadingIndicator,
        mountX: constants.INDICATOR_MOUNT_X,
        mountY: constants.INDICATOR_MOUNT_Y,
        w: constants.INDICATOR_WIDTH,
        h: constants.INDICATOR_HEIGHT,
        x: constants.INDICATOR_X,
        y: constants.INDICATOR_Y
      },
      Text: {
        mount: constants.TEXT_MOUNT,
        x: constants.TEXT_X,
        y: constants.TEXT_Y,
        text: {
          text: 'Loading',
          fontSize: constants.TEXT_FONTSIZE,
          textColor: constants.TEXT_COLOR,
          textAlign: 'center'
        },
      },
    }
  }

  _init() {
    this.tag("LoadingIndicator").startAnimation()
  }

  _inactive() {
    this.tag("LoadingIndicator").stopAnimation()
  }
}
