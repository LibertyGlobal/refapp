import { Lightning, Utils } from 'wpe-lightning-sdk'
import Menu from './mainMenu/menu.js'

export default class App extends Lightning.Component {
  static getFonts() {
    return [{ family: 'pixel', url: Utils.asset('fonts/pixel.ttf'), descriptor: {} }]
  }

  static _template() {
    return {
      Menu: {
        type: Menu,
        alpha: 1
      }
    }
  }

  _setup() {
    this._setState('Menu')
  }

  static _states() {
    return [
      class Menu extends this {
        $enter() {
          this.tag('Menu').setSmooth('alpha', 1)
        }

        $exit() {
          this.tag('Menu').setSmooth('alpha', 0)
        }

        _getFocused() {
          return this.tag('Menu')
        }
      }
    ]
  }
}
