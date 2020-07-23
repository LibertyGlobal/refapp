import { Lightning, Utils } from 'wpe-lightning-sdk'
import Notification from './notification/notification.js'
import Appllication from './application/application.js'

export default class Main extends Lightning.Component {
  static getFonts() {
    return []
  }

  static _template() {
    return {
      Appllication: {
        type: Appllication,
        alpha: 1,
        signals: { select: true },
        argument: {}
      },
      Notification: {
        type: Notification,
        alpha: 0,
        signals: { select: true },
        argument: {}
      }
    }
  }

  _setup() {
    this._setState('Appllication')
  }

  _construct() {}
  _init() {}

  _captureKey(evt) {
    return false
  }

  static _states() {
    return [
      class Notification extends this {
        $enter() {
          this.tag('Notification').setSmooth('alpha', 1)
        }
        $exit() {
          this.tag('Notification').setSmooth('alpha', 0)
        }
        _getFocused() {
          return this.tag('Notification')
        }
        select({ item }) {
          this.tag('Appllication').argument['evt'] = item.evt
          this._setState('Appllication')
          this.tag('Appllication')._setState(item.evt.event.returntarget)
        }
      },
      class Appllication extends this {
        $enter() {}
        $exit() {}
        _getFocused() {
          return this.tag('Appllication')
        }
        select({ item }) {
          this.tag('Notification').argument['evt'] = item
          this._setState(item.type)
        }
      }
    ]
  }
}
