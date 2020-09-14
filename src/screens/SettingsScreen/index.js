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
import Background from '@/components/Background'
import WarningModal from '@/components/WarningModal'
import constants from './constants'

export default class SettingsScreen extends BaseScreen {
  static _template() {
    return {
      Background: {
        type: Background,
      },
      Popup: {
        type: WarningModal,
        headerText: "Settings are not available",
        bodyText: "Settings implementation is planned for future versions of the application",
        x: constants.POPUP_X,
        y: constants.POPUP_Y
      }
    }
  }
}
