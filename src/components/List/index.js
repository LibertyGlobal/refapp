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
import { Lightning } from '@lightningjs/sdk'
import Item from './Item'
import ItemWrapper from './ItemWrapper'

export default class List extends Lightning.Component {
  static _template() {
    return {
      Label: {
        text: { fontSize: 32 }
      },
      Items: {
        y: 60
      }
    }
  }

  _init() {
    this._index = 0
    this._indexCount = 0
  }

  _handleLeft() {
    if (this._index > 0) {
      this.setIndex(this._index - 1)
    }
  }

  _handleRight() {
    if (this._index < this.items.length - 1) {
      this.setIndex(this._index + 1)
    }
  }

  setIndex(index) {
    const prevIndex = this._index
    this._index = index
    const visibleItemsOnScreen = this._getVisibleItemsOnScreen()
    if (index > prevIndex) {
      if (this._indexCount < visibleItemsOnScreen) {
        this._indexCount++
      }
      if (this._indexCount === visibleItemsOnScreen) {
        this.tag('Items').setSmooth('x', (index - this._indexCount) * -1 * (this._itemSize.w + 50))
      }
    } else if (index < prevIndex) {
      if (this._indexCount > 0) {
        this._indexCount--
      }
      if (this._indexCount === 0) {
        this.tag('Items').setSmooth('x', index * -1 * (this._itemSize.w + 50))
      }
    }
  }

  get index() {
    return this._index
  }

  set label(value) {
    this.tag('Label').text.text = value
  }

  set items(value) {
    this._itemsData = value
    this._itemSize = this._itemSize ? this._itemSize : { w: 300, h: 170 }
    this.tag('Items').children = value.map((item, index) => {
      return {
        type: ItemWrapper,
        construct: Item,
        x: index * (this._itemSize.w + 50),
        size: this._itemSize,
        item: item
      }
    })
  }

  set itemSize(v) {
    if (v && v.w && v.h) {
      this._itemSize = v
    }
  }

  get itemSize() {
    return this._itemSize
  }

  get items() {
    return this.tag('Items').children
  }

  get activeItem() {
    return this.items[this._index]
  }

  _getFocused() {
    return this.activeItem
  }

  _getVisibleItemsOnScreen() {
    return Math.floor(1500 / (this._itemSize.w + 50))
  }
}
