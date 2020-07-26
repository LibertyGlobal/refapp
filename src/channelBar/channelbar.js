import { Lightning } from 'wpe-lightning-sdk'
import Model from './model.js'
import { startPlayback, stopCurrentPlayback } from './../player/player.js'
import Config from './config.js'
import MastHead from '../header/header.js'

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
        },
        Image: {
          w: Config.LOGO_WIDTH,
          h: Config.LOGG_HEIGHT,
          x: Config.LOGO_X,
          y: Config.LOGO_Y,
          src: Config.LOGO_IMG
        },
        ChannelNumber: {
          x: Config.CHANNELNUMBER_LABEL_X,
          y: Config.CHANNELNUMBER_LABEL_Y,
          alpha: 0.5,
          text: { text: '1', fontSize: Config.CHANNELNUMBER_LABEL_FONT_SIZE }
        },
        EventName: {
          x: Config.EVENTNAME_LABEL_X,
          y: Config.EVENTNAME_LABEL_Y,
          text: { text: 'Event -10', fontSize: Config.FONT_SIZE }
        },
        UpperLine: {
          rect: true,
          alpha: 0.3,
          x: Config.UPPERLINE_X,
          y: Config.UPPERLINE_Y,
          w: Config.CHANNELBAR_WIDTH,
          h: Config.LINEHEIGHT,
          color: Config.LINECOLOR
        },
        LowerLine: {
          rect: true,
          alpha: 0.7,
          x: Config.LOWERLINE_X,
          y: Config.LOWERLINE_Y,
          w: Config.CHANNELBAR_WIDTH,
          h: Config.LINEHEIGHT,
          color: Config.LINECOLOR
        }
      },
      MastHead: {
        type: MastHead
      }
    }
  }

  _construct() {
    this.timer = null
    this.model = new Model()
  }

  _init() {
    this.patch({
      Txt: { x: 600, y: 520, text: { text: this.argument, fontSize: 30 } }
    })

    this.model.getChannel().then(() => {
      startPlayback(this.model.defaultChennal())
    })
  }

  _unfocus(newTarget) {
    this.tag('MastHead').headerClear()
  }

  _focus() {
    this.tag('MastHead').headerShow('ChannelBar')

    this.tag('Ch').text = '' + this.model.getCurrentChannel()
    function timerevt(ref) {
      ref.signal('select', { item: { label: 'OnDemand', target: 'Menu' } })
    }

    if (this.timer) {
      clearTimeout(this.timer)
    }

    this.timer = setTimeout(timerevt, Config.TIMEOUT, this)
  }

  UpdateChannelBar() {
    let channelInfo = this.model.getCurrentChannel()
    this.tag('Ch').text = '' + channelInfo.channelId
    this.tag('ChannelNumber').text = '' + channelInfo.channelNumber
    this.tag('Image').src =
      Config.CHANNELIMAGE_PATH + '/' + channelInfo.logo.split('/').reverse()[0]
  }

  _captureKey(evt) {
    if (evt.code === 'ArrowDown') {
      let metadata = this.model.previousChannel()
      metadata != false ? startPlayback(metadata) : ''
      this.UpdateChannelBar()
    }
    if (evt.code === 'ArrowUp') {
      let metadata = this.model.nextChannel()
      metadata != false ? startPlayback(metadata) : ''
      this.UpdateChannelBar()
    }
    if (evt.code === 'Backspace') {
      this.signal('select', { item: { label: 'OnDemand', target: 'Menu' } })
    }
    return true
  }
}
