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
import NavigationItem from '../../lib/NavigationItem'
import theme from '@/themes/default'
import constants from './constants'

export default class MenuItem extends NavigationItem {
  static _template() {
    return {
      Caption: {
        text: {
          fontSize: constants.MENU_ITEM_FONTSIZE,
          textColor: theme.colors.white
        }
      }
    }
  }

  _init() {
    this._isSelected = false
  }

  _handleEnter() {
    super._handleEnter()
    return false
  }

  set item(value) {
    const caption = this.tag('Caption')
    caption.text.text = value.text

    const handleTextureChange = () => {
      this.patch({
        w: caption.renderWidth,
        h: caption.renderHeight
      })
      this.signal('sizeChanged', caption.renderWidth)
    }
    // caption.on('txLoaded', handleTextureChange)
    caption.loadTexture()
    handleTextureChange()

    this._item = value
    this._route = value.route
  }

  get item() {
    return this._item
  }

  set isSelected(value) {
    this._isSelected = value
    const caption = this.tag('Caption')
    caption.text.patch({
      textColor: value ? theme.colors.accent : theme.colors.white
    })
  }

  get isSelected() {
    return this._isSelected
  }
}
