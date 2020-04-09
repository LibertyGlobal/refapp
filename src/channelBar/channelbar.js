import { Lightning } from 'wpe-lightning-sdk'
import Model from './model.js'
import { startPlayback, stopCurrentPlayback } from './../player/player.js'
import Config from './config.js'

export default class channelbar extends Lightning.Component {
  static _template() {
    return {
      Channelbar: {
        rect: true,
        x: Config.CHANNELBAR_X,
        y: Config.CHANNELBAR_Y,
        w: Config.CHANNELBAR_WIDTH,
        h: Config.CHANNELBAR_HEIGHT,
        color: Config.CHANNELBAR_COLOR,
        Ch: {
          x: Config.CHANNELBAR_LABEL_X,
          y: Config.CHANNELBAR_LABEL_Y,
          text: { text: 'Channel 1', fontSize: Config.FONT_SIZE }
        }
      }
    }
  }

  _construct() {
    this.model = new Model()
  }

  _init() {
    this.patch({
      Txt: { x: 600, y: 520, text: { text: this.argument, fontSize: 30 } }
    })
    startPlayback(this.model.previousChannel())
  }

  _captureKey(evt) {
    if (evt.code === 'ArrowDown') {
      startPlayback(this.model.previousChannel())
      this.tag('Ch').text = this.model.currrentChannel
    }
    if (evt.code === 'ArrowUp') {
      startPlayback(this.model.nextChannel())
      this.tag('Ch').text = this.model.currrentChannel
    }
    if (evt.code === 'Enter') {
      this.signal('select', { item: { label: 'OnDemand', target: 'Menu' } })
    }
    return true
  }
}
