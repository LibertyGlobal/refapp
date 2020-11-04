/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 RDK Management
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
import Button from '../Button'
import theme from '../../themes/default'
import constants from './constants'

export default class OkCancelDialog extends lng.Component {
    static _template() {
        return {
            Dialog:
            {
                mount: 0.5, w: constants.DIALOG_WIDTH, h: constants.DIALOG_HEIGHT, rtt: true, rect: true, color: constants.DIALOG_COLOR, shader: { radius: 20, type: lng.shaders.RoundedRectangle, stroke: 2, strokeColor: constants.DIALOG_BORDER_COLOR },

                Label:
                {
                    mountX: 0.5, mountY: 0.0, x: (w => 0.5 * w), y: (h => 0.15 * h),
                    text: {
                        fontSize: constants.DIALOG_FONTSIZE, textColor: theme.colors.white,
                        shadow: true,
                        shadowColor: 0xff444444,
                        shadowOffsetX: 1,
                        shadowOffsetY: 1,
                        shadowBlur: 2,
                    },
                },

                OkButton: { type: Button, label: "Ok", clrFocus: theme.colors.accent, mount: 0.5, x: (w => 0.25 * w), y: (h => h - 35), w: constants.DIALOG_BUTTON_WIDTH, h: constants.DIALOG_BUTTON_HEIGHT },
                CancelButton: { type: Button, label: "Cancel", clrFocus: theme.colors.accent, mount: 0.5, x: (w => 0.75 * w), y: (h => h - 35), w: constants.DIALOG_BUTTON_WIDTH, h: constants.DIALOG_BUTTON_HEIGHT },
            }
        }
    };

    setLabel(s) {
        this.tag('Label').text = s
    }

    show(question) {
        this.setLabel(question)
        this.setSmooth('alpha', 1, { duration: 0.25 })
        this.tag('CancelButton').setFocus = true
    }

    hide() {
        this.setSmooth('alpha', 0, { duration: 0.25 })
    }

    _init() {
        this.buttons = [
            this.tag('OkButton'),
            this.tag('CancelButton')
        ];

        this.buttonIndex = 1

        this.tag('Dialog').w = this.w
        this.tag('Dialog').h = this.h
    }

    _handleLeft() {
        this.buttonIndex = 0
    }

    _handleRight() {
        this.buttonIndex = 1
    }

    _handleEnter() {
        var name = (this.buttonIndex == 0) ? '$onRemoveOK' : '$onRemoveCANCEL'
        this.fireAncestors(name)
    }

    _handleKey(k) {
        switch (k.keyCode) {
            case 27:
                this.fireAncestors('$onRemoveCANCEL')
                break
        }

        return true
    }

    _getFocused() {
        return this.buttons[this.buttonIndex]
    }
}
