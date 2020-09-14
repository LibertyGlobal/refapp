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

export default class ItemWrapper extends Lightning.Component {
  set construct(value) {
    this._construct = value
  }

  get construct() {
    return this._construct
  }

  set item(value) {
    this._item = value
  }

  get item() {
    return this._item
  }

  get child() {
    return this.children[0]
  }

  set size(v) {
    this._size = v
  }

  create() {
    this.children = [
      {
        type: this._construct,
        size: this._size,
        item: this._item,
      },
    ]


    // if item is flagged and has focus, notify parent
    // that focuspath can be recalculated
    if (this._notifyOnItemCreation && this.hasFocus()) {
      this._refocus()
    }
  }

  _firstActive() {
    this.create()

    if (!ItemWrapper.FIRST_CREATED) {
      this.fireAncestors('$firstItemCreated')
      ItemWrapper.FIRST_CREATED = true
    }
  }

  _getFocused() {
    // due to lazy creation there is the possibility that
    // an component receives focus before the actual item
    // is created, therefore we set a flag
    if (!this.child) {
      this._notifyOnItemCreation = true
    } else {
      return this.child
    }
  }
}

ItemWrapper.FIRST_CREATED = false
