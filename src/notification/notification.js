import { Lightning } from 'wpe-lightning-sdk'
import Popup from '../popup/popup.js'
import Config from './config.js'

export default class notification extends Lightning.Component {
  static _template() {
    return {}
  }

  _construct() {}
  _init() {}

  _active() {
    this.patch({
      Popup: {
        type: Popup,
        x: Config.POPUP_X,
        y: Config.POPUP_Y,
        signals: { select: true },
        argument: { evt: this.argument.evt }
      }
    })
    this._setState('Popup')
  }

  _handleBack() {}

  static _states() {
    return [
      class Popup extends this {
        $enter() {
          this.tag('Popup').setSmooth('alpha', 1)
        }
        $exit() {
          this.tag('Popup').setSmooth('alpha', 0)
        }
        _getFocused() {
          return this.tag('Popup')
        }
        select({ item }) {
          this.signal('select', { item: { label: 'notification', evt: item.evt } })
        }
      }
    ]
  }
}
