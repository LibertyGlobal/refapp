import { Lightning } from 'wpe-lightning-sdk'
import Config from './config.js'

export default class Setting extends Lightning.Component {
  static _template() {
    return {}
  }

  // _construct() {}
  // _init() {}
  // _focus() {}
  // _unfocus() {}

  _active() {
    this._setState('Error')
  }
  _handleBack() {
    this.signal('select', { item: { label: 'Setting', target: 'Menu' } })
  }

  // _handleEnter() {}

  enter() {
    this.setSmooth('alpha', 1)
  }

  exit() {
    this.setSmooth('alpha', 0)
    this._setState('Normal')
  }

  static _states() {
    return [
      class Error extends this {
        $enter() {
          this.signal('select', {
            item: {
              label: 'Setting',
              type: 'Notification',
              event: {
                errorMsg: Config.ERROR_MSG,
                returntarget: Config.BACK_TARGET,
                target: Config.ERROR_DISPLAY_COMPONENT
              }
            }
          })
        }
        $exit() {}
        _getFocused() {}
        select({ item }) {}
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
