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

import PlayerItem from './PlayerItem'
import ItemWrapper from '@/components/List/ItemWrapper'
import List from '@/components/List'
import constants from '../../constants'

export default class PlayerList extends List {
  static _template() {
    return {
      Label: {
        text: {
          fontSize: constants.LIST_LABEL_FONTSIZE
        }
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
        construct: PlayerItem,
        x: index * (this._itemSize.w + 20),
        size: this._itemSize,
        item: item
      }
    })
  }

  get items() {
    return this.tag('Items').children
  }
}
