import { Lightning } from 'wpe-lightning-sdk'
import Config from './config.js'
import { startPlayback, stopCurrentPlayback } from './../player/player.js'
import { ChannelNumber } from './../channelNumber'
import Model from './../channelbar/model.js'

export default class NumberInput extends Lightning.Component {
  static _template() {
    return {}
  }

  _construct() {
    this.timer = null
    this.model = new Model()
  }

  _init() {
    this.patch({
      InputBox: {
        rect: true,
        x: Config.POPUP_X,
        y: Config.POPUP_Y,
        w: Config.POPUP_WIDTH,
        h: Config.POPUP_HEIGHT,
        color: Config.POPUP_COLOR,
        Ch: {
          x: Config.NUM_TXT_X,
          y: Config.NUM_TXT_Y,
          text: { text: '', fontSize: Config.DEFAULT_FONT_SIZE }
        }
      }
    })
  }

  //This method called from notification
  putNumber(value) {
    if (this.tag('InputBox').childList._refs.Ch.text._text.length > 1) {
      return
    }

    let InputBoxValue = this.tag('InputBox').childList._refs.Ch.text._text
    this.tag('InputBox').childList._refs.Ch.text = InputBoxValue + '' + value

    function timerevt(ref) {
      let channelNum = Number(ref.tag('InputBox').childList._refs.Ch.text._text)

      if (channelNum <= 20) {
        ChannelNumber.currentIndex = channelNum
        ChannelNumber.currentIndex = ChannelNumber.currentIndex - 1 //here proper logic will add later.
        let metadata = ref.model.channelTune()
        metadata != false ? startPlayback(metadata) : ''
      }

      ref.signal('select', { item: { label: 'NumberInput', evt: ref.argument.evt } })
      ref.tag('InputBox').childList._refs.Ch.text = ''
    }

    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(timerevt, Config.DISPLAY_TIME, this)
  }

  _focus() {
    this.putNumber(this.argument.evt.event.value)
  }

  _handleBack() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.signal('select', { item: { label: 'NumberInput', evt: this.argument.evt } })
  }
}
