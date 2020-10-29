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

import { Lightning } from '@lightningjs/sdk'
import constants from './constants'

export default class DownloadProgressBar extends Lightning.Component {
  static _template() {
    return {
      ProgressStatus: {
        rect: true,
        w: constants.PGRSBAR_STATUS_WIDTH,
        x: constants.PGRSBAR_STATUS_LEFT,
        y: constants.PGRSBAR_STATUS_TOP,
        h: constants.PGRSBAR_STATUS_HEIGHT,
        color: constants.PGRSBAR_STATUS_COLOR,
        zIndex: 1,
        visible: false
      },
      ProgressBar: {
        rect: true,
        h: constants.PGRSBAR_STATUS_HEIGHT,
        x: constants.PGRSBAR_STATUS_LEFT,
        y: constants.PGRSBAR_STATUS_TOP,
        color: constants.PGRSBAR_COLOR,
        zIndex: 2,
        visible: false,
      },
      ProgressBarText: {
        x: constants.PGRSBAR_TEXT_LEFT,
        y: constants.PGRSBAR_TEXT_TOP,
        w: constants.PGRSBAR_STATUS_WIDTH,
        fontSize: constants.PGRSBAR_FONTSIZE,
        zIndex: 3,
        visible: false
      }
    }
  }

  async _init() {
    let that = this
    console.log("_init installing app");
    function updateProgressBar() {
      console.log("installing app");
      let width = 1;
      let identity = setInterval(scene, 50);
      function scene() {
        if (width >= 1000) {
          function task() {
            that.tag('ProgressBar').visible = false
            that.tag('ProgressBarText').visible = false
            that.tag('ProgressStatus').visible = false
          }
          clearInterval(identity);
          setTimeout(task, width);
        } else {
          width++;
          that.tag('ProgressBarText').visible = true
          that.tag('ProgressBarText').text = constants.PGRSBAR_TEXT
          that.tag('ProgressStatus').visible = true
          that.tag('ProgressBar').visible = true
          that.tag('ProgressBar').w = width * 1
        }
      }
    }
    updateProgressBar();
  }
}
