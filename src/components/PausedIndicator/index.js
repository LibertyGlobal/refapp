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
import { Lightning, Utils } from '@lightningjs/sdk'
import constants from './constants'

export default class LoadingIndicator extends Lightning.Component {
  static _template() {
    return {
      Indicator: {
        src: Utils.asset(constants.PAUSEDINDICATOR_ASSET_URL)
      }
    }
  }

  startAnimation() {
    if (this._animation) {
      return
    }
    this._animation = this.animation({
      duration: constants.PAUSEDINDICATOR_ANIMATION_DURATION, repeat: constants.PAUSEDINDICATOR_ANIMATION_REPEAT, 
      actions:[{t: 'Indicator', p: 'alpha', v: {0: 0.5, 0.50: 1, 1: 0.5}}]
    })
    this._animation.start()
  }

  stopAnimation() {
    if (this._animation) {
      this._animation.stop()
      this._animation = null
    }
  }
}
