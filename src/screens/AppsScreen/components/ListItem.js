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
import Item from '../../../components/List/Item'
import theme from '@/themes/default'
import constants from '../constants'

export default class ListItem extends Item {
  static _template() {
    return {
      alpha: constants.LIST_ITEM_ALPHA_UNFOCUSED,
      Background: {
        rect: true,
        w: constants.LIST_ITEM_BACKGROUND_WIDTH,
        h: constants.LIST_ITEM_BACKGROUND_HEIGHT,
        color: theme.colors.transparent
      },
      Focus: {
        type: Lightning.components.BorderComponent,
        borderWidth: constants.LIST_ITEM_BORDER_UNFOCUSED,
        colorBorder: theme.colors.accent
      },
      Image: {},
      Title: {
        y: constants.LIST_ITEM_TITLE_Y,
        w: constants.LIST_ITEM_TITLE_WIDTH,
        text: { maxLines: constants.LIST_ITEM_TITLE_MAXLINES, fontSize: constants.LIST_ITEM_TITLE_FONTSIZE, textAlign: 'center' }
      }
    }
  }

  _focus() {
    this.tag('Focus').setSmooth('borderWidth', constants.LIST_ITEM_BORDER_FOCUSED)
    this.tag('Title').text.patch({ textColor: theme.colors.accent })
    this.setSmooth('alpha', constants.LIST_ITEM_ALPHA_FOCUSED)
  }

  _unfocus() {
    this.tag('Focus').setSmooth('borderWidth', constants.LIST_ITEM_BORDER_UNFOCUSED)
    this.tag('Title').text.patch({ textColor: theme.colors.white })
    this.setSmooth('alpha', constants.LIST_ITEM_ALPHA_UNFOCUSED)
  }
}
