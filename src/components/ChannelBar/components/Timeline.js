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
import { Lightning } from 'wpe-lightning-sdk'
import constants from '../constants'

export default class Timeline extends Lightning.Component {
  static _template() {
    return {
      Background: {
        rect: true,
        w: constants.TIMELINE_WIDTH,
        h: constants.TIMELINE_HEIGHT,
        color: constants.TIMELINE_BACKGROUND_COLOR,
        CurrentTime: {
          rect: true,
          x: 0,
          y: 0,
          w: 0,
          h: constants.TIMELINE_HEIGHT,
          color: constants.TIMELINE_COLOR,
          zIndex: 10
        }
      }
    }
  }

  update(percent, smoothAnimation) {
    if (smoothAnimation) {
      this.tag('CurrentTime').setSmooth('w', this.tag('Background').finalW * percent / 100)
    } else {
      this.tag('CurrentTime').w = this.tag('Background').finalW * percent / 100
    }
  }
}
