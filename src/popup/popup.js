import { Lightning } from 'wpe-lightning-sdk'
import Config from './config.js'

export default class Popup extends Lightning.Component {
  static _template() {
    return {
      PopupClosed: {}
    }
  }
  _construct() {}
  _init() {
    this.patch({
      Border: {
        rect: true,
        x: Config.BORDER_X,
        y: Config.BORDER_Y,
        w: Config.BORDER_WIDTH,
        h: Config.BORDER_HEIGHT,
        color: Config.BORDER_COLOR
      },
      Errorbox: {
        rect: true,
        x: Config.POPUP_X,
        y: Config.POPUP_Y,
        w: Config.POPUP_WIDTH,
        h: Config.POPUP_HEIGHT,
        color: Config.POPUP_COLOR,
        Ch: {
          x: Config.ERROR_TXT_X,
          y: Config.ERROR_TXT_Y,
          text: { text: this.argument.evt.event.errorMsg, fontSize: Config.DEFAULT_FONT_SIZE }
        }
      }
    })
  }
  _active() {
    function timerevt(ref) {
      ref.signal('select', { item: { label: 'POP', evt: ref.argument.evt } })
    }
    setTimeout(timerevt, Config.DISPLAY_TIME, this)
  }

  _handleEnter() {
    this.signal('select', { item: { label: 'POP', evt: this.argument.evt } })
  }
  _handleBack() {}
}
