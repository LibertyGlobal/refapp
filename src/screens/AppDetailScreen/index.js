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
import IconButton   from "@/components/IconButton";
import BaseScreen from '../BaseScreen'
import theme from '../../themes/default'
import Background from '../../components/Background'
import constants from './constants'
import { isInstalledDACApp, installDACApp, uninstallDACApp, startDACApp, stopDACApp, isDACAppRunning } from '@/services/RDKServices'

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
      Buttons:
      {
        flex: {direction: 'row'},
        alpha: 1.0,
        x: constants.CONTAINER_X - 10,
        y: constants.TITLE_Y - constants.TITLE_FONTSIZE - 20,

        // images from https://material.io/resources/icons/?icon=get_app&style=baseline
        // Apache License 2.0 https://github.com/google/material-design-icons/blob/master/LICENSE
        ButtonInstall: { btnId: "INSTALL", flexItem: { margin: 30 }, type: IconButton, src1: Utils.asset('img/baseline_get_app_black_48dp.png') },
        ButtonRun: { btnId: "RUN", flexItem: { margin: 30 }, type: IconButton, src1: Utils.asset('img/baseline_check_circle_black_48dp.png') },
        ButtonKill: { btnId: "KILL", flexItem: { margin: 30 }, type: IconButton, src1: Utils.asset('img/baseline_highlight_off_black_48dp.png') },
        ButtonRemove: { btnId: "REMOVE", flexItem: { margin: 30 }, type: IconButton, src1: Utils.asset('img/baseline_delete_black_48dp.png') },
      },
      StatusProgress: { type: StatusProgress, x: constants.CONTAINER_X + 240, y: constants.TITLE_Y - constants.TITLE_FONTSIZE - 20, w: 400, h: constants.TITLE_FONTSIZE },
      OkCancel: { type: OkCancelDialog, x: constants.DIALOG_X, y: constants.DIALOG_Y, w: constants.DIALOG_WIDTH, h: constants.DIALOG_HEIGHT, alpha: 0.0 },
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
    this._isInstalled = item.isInstalled
    this._appRunning = await isDACAppRunning(item.id)
    if (item.isInstalled) {
      if (this._appRunning) {
        this.tag('StatusProgress').setProgress(1.0, 'Running!')
      } else {
        this.tag('StatusProgress').setProgress(1.0, 'Installed!')
      }
    } else {
      this.tag('StatusProgress').reset()
    }

    // Icon should fetch from asms server
    this.tag('CTitle').text.text = 'App Details Page';
    this.tag('Title').text.text = "Title: " + item.name
    this.tag('Id').text.text = "Id: " + item.id
    this.tag('Version').text.text = "Version: V-" + item.version
    this.tag('Type').text.text = "Type: " + item.type
    this.tag('Category').text.text = "Category: " + item.category
    this.tag('Description').text.text = "Description: " + item.description
    this.tag('Icon').patch({
      src: Utils.asset(item.icon)
    })
    this._itemId = item.id

    this.enableCorrectButtons()
  }

  _init() {
    this._appRunning = false
    this._isInstalled = false
    this._isInstalling = false
    this._buttonIndex = 0;
    this._setState('AppStateButtons')
  }

  async _handleKey(key) {
    if (key.code === 'Backspace') {
        navigateBackward()
      return true
    } else if (key.code === 'KeyU' || key.code === 'KeyR') {
      if (this._isInstalled) {
        this._setState('RemoveAppDialogEnter')
      }
      return true
    }
    return false
  }

  async $onRemoveOK() {
    var dlg = this.tag('OkCancel');

    let success = await uninstallDACApp(this._itemId)
    if (success) {
      this._isInstalled = false
      this.tag('StatusProgress').reset()
      this.enableCorrectButtons()
    }
    dlg.hide()
    this._setState('AppStateButtons')
  }

  $onRemoveCANCEL() {
    var dlg = this.tag('OkCancel');
    dlg.hide()
    this._setState('AppStateButtons')
  }

  _focus() {
    this.fireAncestors('$hideMenu')
  }

  async $fireINSTALL() {
    if (this._isInstalled) {
      return
    }
    this._isInstalling = await installDACApp(this._itemId, this.tag('StatusProgress'))
    this.enableCorrectButtons()
  }

  async $fireINSTALLFinished(success) {
    this._isInstalled = success
    this._isInstalling = false
    this.enableCorrectButtons()
  }

  async $fireRUN() {
    if (this._appRunning || !this._isInstalled) {
      return
    }

    this._appRunning = await startDACApp(this._itemId)
    if (this._appRunning) {
      this.tag('StatusProgress').setProgress(1.0, 'Running!')
      this.enableCorrectButtons()
      this._setState('AppIsRunning')
    }
  }

  async $fireKILL() {
    if (this._appRunning) {
      this._appRunning = ! await stopDACApp(this._itemId)
      if (!this._appRunning) {
        this.tag('StatusProgress').setProgress(1.0, 'Installed!')
        this.enableCorrectButtons()
      }
    }
  }
  
  $fireREMOVE() {
    if (!this._isInstalled) {
      return
    }
    this._setState('RemoveAppDialogEnter')
  }

  enableCorrectButtons() {
    this.tag('ButtonInstall')._enableButton(!this._isInstalled && !this._isInstalling)
    this.tag('ButtonRun')._enableButton(!this._appRunning && this._isInstalled)
    this.tag('ButtonKill')._enableButton(this._appRunning)
    this.tag('ButtonRemove')._enableButton(!this._appRunning && this._isInstalled)
  }

  static _states() {
    return [
      class AppIsRunning extends this
      {
        async _handleKey(key) {
          if (this._appRunning) {
            if (key.code === 'Home' && key.ctrlKey) {
              this._appRunning = ! await stopDACApp(this._itemId)
              if (!this._appRunning) {
                this.tag('StatusProgress').setProgress(1.0, 'Installed!')
                this.enableCorrectButtons()
                this._setState('AppStateButtons')
              }
            }
            return true
          }
        }
      },
      class AppStateButtons extends this
      {
        _handleLeft() {
          if (--this._buttonIndex < 0) this._buttonIndex = 0;
        }

        _handleRight() {
          var btns = this.tag("Buttons");
          if (++this._buttonIndex >= btns.children.length) this._buttonIndex = btns.children.length - 1;
        }

        _handleEnter() {
          var btns = this.tag("Buttons");
          var button = btns.children[this._buttonIndex];
          if (button._buttonIsEnabled) {
            var fireThis = '$fire' + button.btnId;
            button.fireAncestors(fireThis);
          }
        }

        _getFocused() {
          var btns = this.tag("Buttons");
          return btns.children[this._buttonIndex]
        }
      },
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
