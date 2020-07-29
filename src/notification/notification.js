import { Lightning } from 'wpe-lightning-sdk'
import Popup from '../popup/popup.js'
import NumberInput from '../numberinput/numberinput.js'
import Config from './config.js'

export default class Notification extends Lightning.Component {
  static _template() {
    return {}
  }

  _construct() {}
  _init() {}

  _captureKey(evt) {
    if (this._getState() == 'NumberInput') {
      if (evt.key >= 0 && evt.key <= 9) {
        this.tag('NumberInput').putNumber(evt.key)
      }
    }
    return false
  }

  _focus(newTarget, prevTarget) {
    if (this.argument.evt.event.target === 'Popup') {
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
    } else if (this.argument.evt.event.target === 'NumberInput') {
      this.patch({
        NumberInput: {
          type: NumberInput,
          x: Config.NUMBERINPUT_X,
          y: Config.NUMBERINPUT_Y,
          signals: { select: true },
          alpha: 1,
          argument: { evt: this.argument.evt }
        }
      })
      this._setState('NumberInput')
    }
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
          this._setState('Normal')
          this.signal('select', { item: { label: 'notification', evt: item.evt } })
        }
      },
      class NumberInput extends this {
        $enter() {
          this.tag('NumberInput').setSmooth('alpha', 1)
        }
        $exit() {
          this.tag('NumberInput').setSmooth('alpha', 0)
        }
        _getFocused() {
          return this.tag('NumberInput')
        }
        select({ item }) {
          this._setState('Normal')
          this.signal('select', { item: { label: 'notification', evt: item.evt } })
        }
      },
      class Normal extends this {
        $enter() {}
        $exit() {}
        _getFocused() {}
        select({ item }) {}
      }
    ]
  }
}
