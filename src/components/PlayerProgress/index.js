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
import commonConstants from '@/constants/default'
import constants from './constants'

export default class PlayerProgress extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: commonConstants.screen.width,
        h: constants.PLAYERPROGRESS_BACKGROUND_HEIGHT,
        src: Utils.asset(constants.PLAYERPROGRESS_BACKGROUND_URL)
      },
      Container: {
        x: constants.PLAYERPROGRESS_CONTAINER_X,
        y: constants.PLAYERPROGRESS_CONTAINER_Y,
        Bar: {
          rect: true,
          color: constants.PLAYERPROGRESS_BAR_COLOR,
          alpha: constants.PLAYERPROGRESS_BAR_ALPHA,
          h: constants.PLAYERPROGRESS_BAR_HEIGHT,
          w: constants.PLAYERPROGRESS_BAR_WIDTH
        },
        Progress: {
          rect: true,
          color: constants.PLAYERPROGRESS_SCALE_COLOR,
          h: constants.PLAYERPROGRESS_SCALE_HEIGHT
        },
        Thumb: {
          y: constants.PLAYERPROGRESS_THUMB_Y,
          mount: constants.PLAYERPROGRESS_THUMB_MOUNT,
          texture: Lightning.Tools.getRoundRect(
            constants.PLAYERPROGRESS_THUMB_RADIUS * 2, constants.PLAYERPROGRESS_THUMB_RADIUS * 2, constants.PLAYERPROGRESS_THUMB_RADIUS, 0, constants.PLAYERPROGRESS_THUMB_COLOR, true, constants.PLAYERPROGRESS_THUMB_COLOR)
        }
      },
      Title: {
        x: constants.PLAYERPROGRESS_TITLE_X,
        text: {
          fontSize: constants.PLAYERPROGRESS_TITLE_FONTSIZE,
          textColor: theme.colors.white
        }
      },
      CurrentTime: {
        x: 1750,
        mountX: 1,
        text: {
          fontSize: 32,
          textColor: theme.colors.white,
          textAlign: 'right'
        }
      }
    }
  }

  set title(value) {
    this.tag('Title').text.text = value
  }

  setProgress(position, duration) {
    const p = position / Math.max(duration, 1)
    this.tag('Progress').w = p * constants.PLAYERPROGRESS_BAR_WIDTH
    this.tag('Thumb').x = p * constants.PLAYERPROGRESS_BAR_WIDTH
    this.tag('CurrentTime').text.text = this._formatTime(position)
  }

  _formatTime(timeInMillis) {
    function pad(number) {
      return number < 10 ? '0' + number : number
    }
    const timeInSecs = timeInMillis / 1000;
    const hours = Math.floor(timeInSecs / 3600)
    const minutes = Math.floor(timeInSecs / 60) % 60
    const seconds = Math.floor(timeInSecs % 60)
    const minutesSeconds = pad(minutes) + ':' + pad(seconds)
    return hours ? pad(hours) + ':' + minutesSeconds : minutesSeconds
  }
}
