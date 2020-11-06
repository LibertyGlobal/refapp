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

export default class IconButton extends lng.Component {
    static _template() {
        let RR = lng.shaders.RoundedRectangle;

        return {
            flexItem: { margin: 40 },
            Button:
            {
                mount: 0.5,
                w: constants.BUTTON_WIDTH, h: constants.BUTTON_HEIGHT,

                RRect: {
                    w: constants.BUTTON_WIDTH, h: constants.BUTTON_HEIGHT, rect: true, color: constants.BUTTON_COLOR, pivot: 0.5, alpha: 0.5, shader: { radius: 8, type: RR, stroke: 1, strokeColor: constants.BUTTON_BORDER_COLOR }
                },
                Image: {
                    mount: 0.50,
                    scale: 0.45,
                    x: (constants.BUTTON_WIDTH * 0.5),
                    y: (constants.BUTTON_HEIGHT * 0.5)
                },
            },
        }
    };

    _focus() {
        var bb = this.tag("Button")
        var bg = this.tag("RRect")
        var clr = this.clrFocus;

        bg.setSmooth('alpha', 1.00, { duration: 0.3 })
        bb.setSmooth('scale', 1.18, { duration: 0.3 })
        bg.setSmooth('color', clr, { duration: 0.3 })
    }

    _unfocus() {
        var bb = this.tag("Button")
        var bg = this.tag("RRect")
        var clr = this.clrBlur

        bg.setSmooth('alpha', 0.50, { duration: 0.3 })
        bb.setSmooth('scale', 1.00, { duration: 0.3 })
        bg.setSmooth('color', clr, { duration: 0.3 })
    }

    _init() {
        if (this.clrFocus == undefined) this.clrFocus = theme.colors.accent
        if (this.clrBlur == undefined) this.clrBlur = constants.BUTTON_COLOR
        var image = this.tag("Image")

        image.patch({ src: this.src1 })
        this._enable(true)
    }
    
    _enableButton(enable) {
        this._buttonIsEnabled = enable
        var bb = this.tag("Button")
        bb.setSmooth('alpha', enable ? 1.00 : 0.3, { duration: 0.3 })
    }
    

    setClrFocus(clr) { this.clrFocus = clr }
    setClrBlur(clr) { this.clrBlur = clr }

}
