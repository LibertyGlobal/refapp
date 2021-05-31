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

import { Lightning } from '@lightningjs/sdk'
import Item from '@/components/List/Item'
import theme from '@/themes/default'
import constants from '../../constants'

export default class PlayerItem extends Item {
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
      Shade: {
        rect: true,
        alpha: constants.ITEM_SHADE_ALPHA,
        color: theme.colors.black
      },
      Title: {
        mountX: constants.ITEM_TITLE_MOUNT_X,
        text: {
          maxLines: constants.ITEM_TITLE_MAXLINES,
          fontSize: constants.ITEM_TITLE_FONTSIZE
        }
      }
    }
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
        Shade: {
          w: w,
          h: h
        },
        Title: {
          x: w * 0.5,
          y: h - 40
        },
        Image: {
          texture: {
            resizeMode: {
              w: w,
              h: h
            }
          }
        }
      })
    }
  }
}
