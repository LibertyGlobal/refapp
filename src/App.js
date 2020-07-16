/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 RDK Management
 *
 * Licensed under the Apache License, Version 2.0 (the License);
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

import { Lightning, Utils } from 'wpe-lightning-sdk'
import { getActiveScreen, navigateForward, navigateBackward, navigate } from './lib/Router'
import Navbar from './components/Navbar'
import SplashScreen from './screens/SplashScreen'
import { init as initPlayers } from './services/player'

export default class App extends Lightning.Component {
  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
  }

  static _template() {
    return {
      Splash: {
        type: SplashScreen,
        visible: false
      }
    }
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
        src: Utils.asset('images/rdk-logo.png'),
        zIndex: 11
      }

    })
    this._setState('Navbar')

    initPlayers({
      ipPlayerMode: 'sessionManager',
      // your raspberry ip
      endpoint: 'http://192.168.1.102:8080'
    })
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
      if (!activeScreen || activeScreen.ref === 'HomeScreen') {
        if (this._getFocused().ref !== 'Navbar') {
          this._setState('Navbar')
          return true
        }
        return false
      } else {
        if (this._getFocused().ref !== 'Navbar') {
          this._setState('Navbar')
        } else {
          this._setState('Navbar')
          if (!navigateBackward()) {
            navigate('home')
          }
          return true
        }
        return true
      }
    }
    return false
  }

  $hideMenu() {
    this.tag('Navbar').setSmooth('alpha', 0)
  }
}
