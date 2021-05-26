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
import WarningModal from '@/components/WarningModal'
import StatusProgress from './components/StatusProgress'
import OkCancelDialog   from "@/components/OkCancelDialog";
import IconButton   from "@/components/IconButton";
import BaseScreen from '../BaseScreen'
import theme from '../../themes/default'
import Background from '../../components/Background'
import constants from './constants'
import * as player  from '@/services/player/'
import { isInstalledDACApp, installDACApp, uninstallDACApp, startApp, stopApp, isAppRunning } from '@/services/RDKServices'

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
      StartingAppPopup: {
        type: WarningModal,
        headerText: "Starting app...",
        bodyText: "Use CTRL+HOME to exit the app",
        x: constants.POPUP_X,
        y: constants.POPUP_Y,
        visible: false
      }
    }
  }
  
  async update(params) {
    if (Settings.get('app', 'asms-mock', false)) {
      const response = await fetch(Utils.asset(`cache/mocks/${getDomain()}/asms-data.json`))
      const { applications } = await response.json()
      this._app = applications.find((a) => { return a.id === params })
    } else {
      const response = await fetch('http://' + window.location.host + '/apps/' + params)
      const { header } = await response.json()
      this._app = header
    }

    this._app.isDACApp = (this._app.type === 'application/dac.native')
    this._app.isInstalled = this._app.isDACApp ? await isInstalledDACApp(this._app.id) : false
    this._app.isRunning = await isAppRunning(this._app.id)

    // Icon should fetch from asms server
    this.tag('CTitle').text.text = 'App Details Page';
    this.tag('Title').text.text = "Title: " + this._app.name
    this.tag('Id').text.text = "Id: " + this._app.id
    this.tag('Version').text.text = "Version: V-" + this._app.version
    this.tag('Type').text.text = "Type: " + this._app.type
    this.tag('Category').text.text = "Category: " + this._app.category
    this.tag('Description').text.text = "Description: " + this._app.description
    this.tag('Icon').patch({
      src: Utils.asset(this._app.icon)
    })

    this.updateButtonsAndStatus()
  }

  _init() {
    this._app = {}
    this._app.isRunning = false
    this._app.isInstalled = false
    this._app.isInstalling = false
    this._buttonIndex = 0;
    this._setState('AppStateButtons')
  }

  async _handleKey(key) {
    if (this._app.isInstalling) {
      // no keys processing when installing, certainly no backwards nav
      return true
    }

    if (key.code === 'Backspace') {
        navigateBackward()
      return true
    } else if (key.code === 'KeyU' || key.code === 'KeyR') {
      if (this._app.isInstalled) {
        this._setState('RemoveAppDialogEnter')
      }
      return true
    }
    return false
  }

  async $onRemoveOK() {
    var dlg = this.tag('OkCancel');

    let success = await uninstallDACApp(this._app.id)
    if (success) {
      this._app.isInstalled = false
      this.updateButtonsAndStatus()
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
    if (this._app.isInstalled) {
      return
    }
    this._app.isInstalling = await installDACApp(this._app, this.tag('StatusProgress'))
    this.updateButtonsAndStatus()
  }

  async $fireINSTALLFinished(success, msg) {
    this._app.isInstalled = success
    this._app.isInstalling = false
    this.updateButtonsAndStatus()
    if (!success) {
      this.tag('StatusProgress').setProgress(1.0, 'Error: '+ msg)
    }
  }

  async $fireRUN() {
    if (this._app.isRunning || (!this._app.isInstalled && this._app.isDACApp)) {
      return
    }

    this._app.isRunning = await startApp(this._app)
    if (this._app.isRunning) {
      await player.stopPlayBack()
      this.tag("StartingAppPopup").visible = true
      setTimeout(() => {
        this.tag("StartingAppPopup").visible = false
        this._refocus()
      }, constants.POPUP_TIMEOUT)
      this.updateButtonsAndStatus()
      this._setState('AppIsRunning')
    }
  }

  async $fireKILL() {
    if (this._app.isRunning) {
      this._app.isRunning = ! await stopApp(this._app)
      await player.playLastQamChannel()
      this.updateButtonsAndStatus()
    }
  }
  
  $fireREMOVE() {
    if (!this._app.isInstalled) {
      return
    }
    this._setState('RemoveAppDialogEnter')
  }

  updateButtonsAndStatus() {
    if (this._app.isRunning) {
      this.tag('StatusProgress').setProgress(1.0, 'Running!')
    } else {
      if (this._app.isInstalled) {
        this.tag('StatusProgress').setProgress(1.0, 'Installed!')
      } else {
        this.tag('StatusProgress').reset()
      }
    }

    this.tag('ButtonInstall')._enableButton(!this._app.isInstalled && !this._app.isInstalling && this._app.isDACApp)
    this.tag('ButtonRun')._enableButton(!this._app.isRunning && (this._app.isInstalled || !this._app.isDACApp))
    this.tag('ButtonKill')._enableButton(this._app.isRunning)
    this.tag('ButtonRemove')._enableButton(!this._app.isRunning && this._app.isInstalled)

    // focus first enabled button
    let newIdx = 0
    if (this.tag('ButtonInstall')._buttonIsEnabled) {
      newIdx = 0
    } else if (this.tag('ButtonRun')._buttonIsEnabled) {
      newIdx = 1
    } else if (this.tag('ButtonKill')._buttonIsEnabled) {
      newIdx = 2
    } else if (this.tag('ButtonRemove')._buttonIsEnabled) {
      newIdx = 3
    }
    if (newIdx != this._buttonIndex) {
      this._buttonIndex = newIdx
      this._refocus()
    }
  }

  static _states() {
    return [
      class AppIsRunning extends this
      {
        async _handleKey(key) {
          if (this._app.isRunning) {
            if (key.code === 'Home' && key.ctrlKey) {
              this._app.isRunning = ! await stopApp(this._app)
              await player.playLastQamChannel()
              this.updateButtonsAndStatus()
              this._setState('AppStateButtons')
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
