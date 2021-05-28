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

import TVChannelScreenItem from './TVChannelScreenItem'
import ItemWrapper from '@/components/List/ItemWrapper'
import List from '@/components/List'
import constants from '../../constants'

export default class TVChannelScreenList extends List {
  static _template() {
    return {
      Label: {
        text: {
          fontSize: constants.LIST_LABEL_FONTSIZE
        }
      },
      Items: {
        y: 0
      }
    }
  }

  set items(value) {
    this._itemsData = value
    this._itemSize = this._itemSize ? this._itemSize : { w: constants.LIST_ITEM_DEFAULT_WIDTH, h: constants.LIST_ITEM_DEFAULT_HEIGHT }
    this.tag('Items').children = value.map((item, index) => {
      return {
        type: ItemWrapper,
        construct: TVChannelScreenItem,
        y: index * (this._itemSize.h + constants.ITEMS_CAP),
        size: this._itemSize,
        item: item
      }
    })
  }

  get items() {
    return this.tag('Items').children
  }

  _handleUp() {
    if (this._index > 0) {
      this.setIndex(this._index - 1)
    }
  }

  _handleDown() {
    if (this._index < this.items.length - 1) {
      this.setIndex(this._index + 1)
    }
  }

  setIndex(index) {
    const prevIndex = this._index
    this._index = index;
    let itemCap = this._itemSize.h + constants.ITEMS_CAP;
    let displayArea = constants.LIST_VIEW_HEIGHT;
    let bottomFocusItem = Math.floor(displayArea / itemCap);

    if (index > prevIndex) {
      if (((index * itemCap) + this.tag('Items').y) > displayArea) {
        this.tag('Items').setSmooth('y', (itemCap - ((index - bottomFocusItem) * itemCap)));
      }
    } else if (index < prevIndex) {
      if (((index * itemCap) + this.tag('Items').y) <= 0) {
        this.tag('Items').setSmooth('y', (itemCap - ((index + 1) * itemCap)));
      }
    }

    this.fireAncestors('$onTVChannelListItemSelected');
  }
}
