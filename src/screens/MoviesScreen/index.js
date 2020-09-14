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

import { Utils } from 'wpe-lightning-sdk'
import { navigate } from '@/lib/Router'
import BaseScreen from '../BaseScreen'
import Background from '@/components/Background'
import MoviesScreenList from './components/MoviesScreenList'
import theme from '@/themes/default'
import constants from './constants'

export default class MoviesScreen extends BaseScreen {
  static _template() {
    return {
      Background: {
        type: Background
      },
      Title: {
        y: theme.layouts.generic.paddingTop,
        x: theme.layouts.generic.paddingLeft,
        text: {
          fontSize: constants.TITLE_FONTSIZE,
          textColor: theme.colors.white
        }
      },
      Lists: {
        x: constants.LISTS_X,
        y: constants.LISTS_Y
      }
    }
  }

  async _init() {
    const response = await fetch(Utils.asset('cache/mocks/default/movies.json'))
    const { layout } = await response.json()
    this._categories = layout.body
    this.tag('Title').text.text = layout.header.title
    const children = layout.body.map(({ label, items, itemWidth, itemHeight }, index, lists) => {
      let y = 0
      for (let i = 0; i < index; i++) {
        const element = lists[i]
        y += (element.itemHeight || 170) + 200
      }
      return {
        type: MoviesScreenList,
        itemSize: { w: itemWidth, h: itemHeight },
        label: label,
        items: items,
        y: y
      }
    })
    this._index = 0
    this.tag('Lists').children = children
  }

  _handleUp() {
    if (this._index > 0) {
      this.setIndex(this._index - 1)
    }
  }

  _handleDown() {
    if (this._index < this.lists.length - 1) {
      this.setIndex(this._index + 1)
      return true
    }
    return false
  }

  _handleEnter() {
    navigate(`details/${this._categories[this._index].items[this.activeList.index].id}`, true)
  }

  setIndex(index) {
    this._index = index
  }

  _getFocused() {
    return this.activeList
  }

  get lists() {
    return this.tag('Lists').children
  }

  get activeList() {
    return this.lists[this._index]
  }
}
