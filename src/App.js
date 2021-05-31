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

import { Lightning, Utils } from '@lightningjs/sdk'
import { getActiveScreen, navigateForward, navigateBackward, navigate } from './lib/Router'
import Navbar from './components/Navbar'
import SplashScreen from './screens/SplashScreen'
import NumberInput from './components/NumberInput'
import CurrentTime from './components/CurrentTime'
import CurrentIP from './components/CurrentIP'

export default class App extends Lightning.Component {
  static _template() {
    return {
      Splash: {
        type: SplashScreen,
        visible: false
      },
      NumberInput: {
        type: NumberInput,
        x: 200,
        y: 700,
        signals: { select: true },
        alpha: 0
      },
      Time:{
        type: CurrentTime,
        visible: true
      },
      CurrentIP:{
        type: CurrentIP,
        visible: true
      } 
    }
  }

  _construct() {
    // prevent browser from navigating backwards when pressing 'Backspace'
    // Chrome and Safari did not do this. However, Firefox and WPE webkitbrowser
    // did, which resulted in navigation problems on those browsers
    document.onkeydown = function (e) { if (e.code === 'Backspace') { return false } }

    // Taken from L&T version
    // This fix will be removed once get acess body element through lighting framework.
    // issue is addressed here https://github.com/rdkcentral/Lightning-CLI/pull/78/commits/6bc1cc3521b62d2fb19dae6b9020fe9677897ada
    var style = document.createElement('style')
    document.head.appendChild(style)
    style.sheet.insertRule(
      '@media all { html {height: 100%; width: 100%;} *,body {margin:0; padding:0;} canvas { position: absolute; z-index: 2; } body { background-color:transparent; width: 100%; height: 100%;} }'
    )
  }

  async _init() {
    this._setState('Splash')
    const testIncreaseSplashVisibility = new Promise((resolve, reject) => {
      setTimeout(() => resolve(), 2000)
    })
    await testIncreaseSplashVisibility

    this.patch({
      Navbar: {
        type: Navbar,
        zIndex: 10
      },
      Logo: {
        mountX: 0.5,
        x: 960,
        y: 15,
        src: Utils.asset('cache/images/rdk-logo.png'),
        zIndex: 11
      }
    })

    this._setState('Navbar')
  }

  static _states() {
    return [
      class Splash extends this {
        $enter() {
          this.tag('Splash').visible = true
        }

        $exit() {
          this.tag('Splash').visible = false
        }

        _getFocused() {
          return this.tag('Splash')
        }
      },
      class Navbar extends this {
        _getFocused() {
          return this.tag('Navbar')
        }

        $enter() {
          navigate()
        }
      },
      class Screen extends this {
        _getFocused() {
          return getActiveScreen()
        }
      },
      class NumberInput extends this {
        $enter() {
        }
        $exit() {
        }
        _getFocused() {
          return this.tag('NumberInput')
        }
        select(item) {
          this._setState('Screen')
        }
      }
    ]
  }

  _handleUp() {
    this._setState('Screen')
  }

  _handleDown() {
    this._setState('Navbar')
  }

  _handleKey(key) {
    if (key.code === 'KeyF') {
      return navigateForward()
    }
    if (key.code === 'Backspace') {
      const activeScreen = getActiveScreen()
      if (activeScreen.ref === 'HomeScreen') {
        this._setState('Navbar')
      } else {
        this._setState('Navbar')
        if (!navigateBackward()) {
          navigate('home')
        }
      }
    }
  }

  $hideMenu() {
    this.tag('Navbar').setSmooth('alpha', 0)
  }
}
