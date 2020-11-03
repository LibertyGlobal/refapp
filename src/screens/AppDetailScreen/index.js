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

import { Utils, Settings } from '@lightningjs/sdk'
import { navigate, navigateBackward } from '../../lib/Router'
import { getDomain } from '@/domain'
import StatusProgress from './components/StatusProgress'
import OkCancelDialog   from "@/components/OkCancelDialog";
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
      OkCancel: { type: OkCancelDialog, x: constants.DIALOG_X, y: constants.DIALOG_Y, w: constants.DIALOG_WIDTH, h: constants.DIALOG_HEIGHT, alpha: 0.0 },
      StatusProgress: { type: StatusProgress, x: constants.CONTAINER_X, y: constants.TITLE_Y - constants.TITLE_FONTSIZE - 20, w: 400, h: constants.TITLE_FONTSIZE },
    }
  }
  
  async update(params) {
    let item = null
    if (Settings.get('app', 'asms-mock', false)) {
      const response = await fetch(Utils.asset(`cache/mocks/${getDomain()}/asms-data.json`))
      const { applications } = await response.json()
      item = applications.find((a) => { return a.id === params })
    } else {
      const response = await fetch('http://' + window.location.host + '/apps/' + params)
      const { header } = await response.json()
      item = header
    }
    item.isInstalled = await isInstalledDACApp(item.id)
    if (item.isInstalled) {
      this.tag('StatusProgress').setProgress(1.0, 'Installed!')
    } else {
      this.tag('StatusProgress').reset()
    }
  
    // Icon should fetch from asms server
    this.tag('CTitle').text.text = 'App Details Page';
    this.tag('Title').text.text = "Title: "+item.name
    this.tag('Id').text.text = "Id: "+item.id
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
      const success = await installDACApp(this._itemId, this.tag('StatusProgress'))
    } else {
      this._appRunning = await startDACApp(this._itemId)
      if (this._appRunning) {
        this.tag('StatusProgress').setProgress(1.0, 'Running!')
      }
    }
  }

  async _handleKey(key) {
    if (this._appRunning) {
      if (key.code === 'Escape') {
        this._appRunning = ! await stopDACApp(this._itemId)
        if (!this._appRunning) {
          this.tag('StatusProgress').setProgress(1.0, 'Installed!')
        }
      }
      return true
    }

    if (key.code === 'Backspace') {
        navigateBackward()
      return true
    } else if (key.code === 'KeyU' || key.code === 'KeyR') {
      this._setState('RemoveAppDialogEnter')
      return true
    }
    return false
  }

  async $onRemoveOK() {
    var dlg = this.tag('OkCancel');

    let success = await uninstallDACApp(this._itemId)
    if (success) {
      this.tag('StatusProgress').reset()
    }
    dlg.hide()
    this._setState('')
  }

  $onRemoveCANCEL() {
    var dlg = this.tag('OkCancel');
    dlg.hide()
    this._setState('')
  }

  _focus() {
    this.fireAncestors('$hideMenu')
  }

  static _states() {
    return [
      class RemoveAppDialogEnter extends this
      {
        $enter() {
          var dlg = this.tag('OkCancel')
          dlg.show('Remove this app?')
        }

        _getFocused() {
          var dlg = this.tag('OkCancel')
          return dlg;
        }
      }
    ]
  }
}
