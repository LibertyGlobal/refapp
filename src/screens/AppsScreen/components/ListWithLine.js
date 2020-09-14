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

import ListItem from './ListItem'
import ItemWrapper from '../../../components/List/ItemWrapper'
import List from '../../../components/List'
import theme from '@/themes/default'
import constants from '../constants'

export default class ListWithLine extends List {
  static _template() {
    return {
      Label: {
        text: { fontSize: constants.LIST_LABEL_FONTSIZE },
      },
      Line: {
        rect: true,
        y: constants.LIST_LINE_Y,
        w: constants.LIST_LINE_WIDTH,
        h: constants.LIST_LINE_HEIGHT,
        color: theme.colors.white
      },
      Items: {
        y: constants.LIST_ITEMS_Y
      }
    }
  }

  set items(value) {
    this._itemsData = value
    this._itemSize = this._itemSize ? this._itemSize : { w: constants.LIST_ITEM_DEFAULT_WIDTH, h: constants.LIST_ITEM_DEFAULT_HEIGHT }
    this.tag('Items').children = value.map((item, index) => {
      return {
        type: ItemWrapper,
        construct: ListItem,
        x: index * (this._itemSize.w + 50),
        size: this._itemSize,
        item: item,
      }
    })
  }

  get items() {
    return this.tag('Items').children
  }

  _focus() {
    this.tag('Line').patch({ color: theme.colors.accent })
    this.tag('Label').text.patch({ textColor: theme.colors.accent })
  }

  _unfocus() {
    this.tag('Line').patch({ color: theme.colors.white })
    this.tag('Label').text.patch({ textColor: theme.colors.white })
  }
}
