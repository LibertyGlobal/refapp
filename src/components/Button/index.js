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
import theme from '../../themes/default'
import constants from './constants'

export default class Button extends lng.Component {
    static _template() {
        return {
            Button:
            {
                RRect: { w: constants.BUTTON_WIDTH, h: constants.BUTTON_HEIGHT, rect: true, color: constants.BUTTON_COLOR, shader: { radius: 8, type: lng.shaders.RoundedRectangle, stroke: 1, strokeColor: constants.BUTTON_BORDER_COLOR } },
                Label: { mount: 0.5, x: (w => 0.5 * w), y: (h => 0.55 * h), text: { fontSize: constants.BUTTON_FONTSIZE, textColor: theme.colors.white } },
            },
        }
    };

    setLabel(s) {
        var obj = this.tag('Label')
        obj.text.text = s
    }

    _focus() {
        var bb = this.tag('Button')
        var bg = this.tag('RRect')
        bb.setSmooth('alpha', 1.00, { duration: 0.25 })
        bb.setSmooth('scale', 1.17, { duration: 0.25 })
        bg.setSmooth('color', theme.colors.accent, { duration: 0.25 })
    }

    _unfocus() {
        var bb = this.tag('Button')
        var bg = this.tag('RRect')
        bb.setSmooth('alpha', 1.00, { duration: 0.25 })
        bb.setSmooth('scale', 1.00, { duration: 0.25 })
        bg.setSmooth('color', constants.BUTTON_COLOR, { duration: 0.25 })
    }

    _init() {
        var button = this.tag('Button');
        button.w = this.w
        button.h = this.h

        if (this.label) {
            this.setLabel(this.label)
        }
    }
}
