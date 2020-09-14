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
import { Utils, Lightning, Log } from 'wpe-lightning-sdk'
import theme from '@/themes/default'
import constants from './constants'

export default class WarningModal extends Lightning.Component {
  static _template() {
    return {
      Background: {
        rect: true,
        w: constants.DIALOG_BACKGROUND_WIDTH,
        h: constants.DIALOG_BACKGROUND_HEIGHT,
        mount: constants.DIALOG_BACKGROUND_MOUNT,
        color: theme.colors.black,
        Border: {
          type: Lightning.components.BorderComponent,
          colorBorder: theme.colors.white,
          w: constants.DIALOG_BORDER_WIDTH,
          h: constants.DIALOG_BORDER_HEIGHT,
          borderWidth: constants.DIALOG_BORDER_THICKNESS
        },
        Icon: {
          x: constants.DIALOG_ICON_X,
          y: constants.DIALOG_ICON_Y,
          w: constants.DIALOG_ICON_WIDTH,
          h: constants.DIALOG_ICON_HEIGHT,
          src: Utils.asset(constants.DIALOG_ICON_URL)
        },
        Header: {
          x: constants.DIALOG_HEADER_X,
          y: constants.DIALOG_HEADER_Y,
          w: constants.DIALOG_HEADER_WIDTH,
          h: constants.DIALOG_HEADER_HEIGHT,
          text: { fontSize: constants.DIALOG_HEADER_FONTSIZE, textAlign: "center"}
        },
        Body: {
          x: constants.DIALOG_BODY_X,
          y: constants.DIALOG_BODY_Y,
          w: constants.DIALOG_BODY_WIDTH,
          h: constants.DIALOG_BODY_HEIGHT,
          text: { maxLines: constants.DIALOG_BODY_MAXLINES, fontSize: constants.DIALOG_BODY_FONTSIZE, textAlign: "center"}
        }
      }
    }
  }

  set headerText(text) {
    this.tag("Background").tag("Header").text.text = text
  }

  set bodyText(text) {
    this.tag("Background").tag("Body").text.text = text
  }

  _handleUp() {
    return true
  }

  _handleDown() {
    return true
  }

  _handleLeft() {
    return true
  }

  _handleRight() {
    return true
  }
}
