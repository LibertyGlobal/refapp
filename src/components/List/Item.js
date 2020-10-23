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

export default class Item extends Lightning.Component {
  static _template() {
    return {
      Background: {
        rect: true,
        color: theme.colors.black
      },
      Focus: {
        type: Lightning.components.BorderComponent,
        colorBorder: theme.colors.accent,
        borderWidth: 0
      },
      Image: {},
      Title: {
        text: {
          maxLines: 2,
          fontSize: 24
        }
      }
    }
  }

  _focus() {
    this.tag('Focus').setSmooth('borderWidth', 8)
  }

  _unfocus() {
    this.tag('Focus').setSmooth('borderWidth', 0)
  }

  set colorBorder(color) {
    if (color && color !== '') {
      this.tag('Focus').colorBorder = color
    }
  }

  set colorItemBackground(color) {
    if (color && color !== '') {
      this.tag('Background').color = color
    }
  }
// TODO: Image should get from asms server, hardcoded for testing purpose

  set item(value) {
    this._item = value

    this.patch({
      Image: {
        texture: {
          resizeMode: {
            type: 'cover',
            w: this._size.w,
            h: this._size.h
          },
          type: Lightning.textures.ImageTexture,
          src: Utils.asset( value.image || value.icon) 
        }
      },
      Title: {
        text: { text: value.name || value.label, wordWrapWidth: this._size.w }
      }
    })
  }

  set size({ w, h }) {
    if (w && h) {
      this._size = { w: w, h: h }
      this.patch({
        Background: {
          w: w,
          h: h
        },
        Focus: {
          w: w,
          h: h
        },
        Image: {
          texture: {
            resizeMode: {
              w: w,
              h: h
            }
          }
        },
        Title: {
          y: this._size.h + 7
        }
      })
    }
  }
}
