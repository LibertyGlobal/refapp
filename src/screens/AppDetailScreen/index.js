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

import { Utils } from '@lightningjs/sdk'
import { navigate, navigateBackward } from '../../lib/Router'
import { getDomain } from '@/domain'
import WarningModal from '@/components/WarningModal'
import BaseScreen from '../BaseScreen'
import theme from '../../themes/default'
import Background from '../../components/Background'
import constants from './constants'
import { isInstalledDACApp, installDACApp, uninstallDACApp, startDACApp, stopDACApp } from '@/services/RDKServices'

export default class AppDetailScreen extends BaseScreen {
  static _template() {
    return {
      Background: {
        type: Background
      },
      CTitle: {
        y: theme.layouts.generic.paddingTop,
        x: constants.TOP_TITLE_LEFT,
        text: {
          fontSize: constants.TOP_TITLE_FONTSIZE,
          textColor: theme.colors.white,
          zIndex: 11
        }
      },
      Container: {
        x: constants.CONTAINER_X,
        Title: {
          y: constants.TITLE_Y,
          text: {
            fontSize: constants.TITLE_FONTSIZE,
            textColor: theme.colors.white
          }
        },
        Id: {
          y: constants.ID_Y,
          text: {
            fontSize: constants.ID_FONTSIZE,
            textColor: theme.colors.white
          }
        },
        Version: {
          y: constants.VERSION_Y,
          text: {
            fontSize: constants.VERSION_FONTSIZE,
            textColor: theme.colors.white
          }
        },
        Description: {
          y: constants.DESCRIPTION_Y,
          w: constants.DESCRIPTION_WIDTH,
          text: {
            fontSize: constants.DESCRIPTION_FONTSIZE,
            textColor: theme.colors.white,
            lineHeight: constants.DESCRIPTION_LINEHEIGHT,
            wordWrap: true
          }
        },
      Type: {
        y: constants.APPTYPE_Y,
        text: {
          fontSize: constants.APPTYPE_FONTSIZE,
          textColor: theme.colors.white
        }
      },
      Category: {
        y: constants.CATTYPE_Y,
        text: {
          fontSize: constants.CATTYPE_FONTSIZE,
          textColor: theme.colors.white
        }
      },
      Icon: {
        x: constants.ICON_X,
        y: constants.ICON_Y,
        w: constants.ICON_WIDTH,
        h: constants.ICON_HEIGHT
      }
    },
    Popup: {
      type: WarningModal,
      headerText: "Apps is not available",
      bodyText: "Implementation is planned for future versions of the application",
      x: constants.POPUP_X,
      y: constants.POPUP_Y,
      visible: false
    }
  }
  }
  async update(params) {
    const response = await fetch('http://' + window.location.host + '/apps/' + params)
    const { header } = await response.json()
    let item = header
    item.isInstalled = await isInstalledDACApp(item.id)
  
    // Icon should fetch from asms server
    this.tag('CTitle').text.text = 'App Details Page';
    this.tag('Title').text.text = "Title: "+item.name
    this.tag('Id').text.text = "Id: "+item.id
    if (item.isInstalled) {
      this.tag('Id').text.text += ' (INSTALLED)'
    }
    this.tag('Version').text.text = "Version: V-"+item.version
    this.tag('Type').text.text = "Type: "+item.type
    this.tag('Category').text.text = "Category: "+item.category
    this.tag('Description').text.text = "Description: "+item.description
    this.tag('Icon').patch({
      src: Utils.asset(item.icon)
    }) 
    this._itemId = item.id
}

  _init() {
    this._appRunning = false
  // TODO
  }

  _getFocused() {
  // TODO
  }

  async _handleEnter() {
    if (this._appRunning) {
      return
    }

    const isInstalled = await isInstalledDACApp(this._itemId)
    if (!isInstalled) {
      const success = await installDACApp(this._itemId)
    } else {
      this._appRunning = await startDACApp(this._itemId)
    }
  }

  async _handleKey(key) {
    if (this._appRunning) {
      if (key.code === 'Escape') {
        this._appRunning = ! await stopDACApp(this._itemId)
      }
      return true
    }

    if (key.code === 'Backspace') {
        navigateBackward()
      return true
    } else if (key.code === 'KeyU' || key.code === 'KeyR') {
      let success = await uninstallDACApp(this._itemId)
      return true
    }
    return false
  }

  _focus() {
    this.fireAncestors('$hideMenu')
  }
}
