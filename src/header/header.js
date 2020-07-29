import { Lightning } from 'wpe-lightning-sdk'
import Config from './config.js'

export default class Header extends Lightning.Component {
  static _template() {
    return {
      Titlebox: {
        rect: false,
        x: Config.POPUP_X,
        y: Config.POPUP_Y,
        w: Config.POPUP_WIDTH,
        h: Config.POPUP_HEIGHT,
        color: Config.POPUP_COLOR,
        TimeDisplay: {
          x: Config.TimeDisplay_X,
          y: Config.TimeDisplay_Y,
          text: { text: '', fontSize: Config.DEFAULT_FONT_SIZE }
        },
        FeatureName: {
          x: Config.FeatureName_X,
          y: Config.FeatureName_Y,
          text: { text: 'ChannelBar', fontSize: Config.DEFAULT_FONT_SIZE }
        },
        Image: {
          w: Config.LOGO_WIDTH,
          h: Config.LOGG_HEIGHT,
          x: Config.LOGO_X,
          y: Config.LOGO_Y,
          src: Config.LOGO_IMG
        }
      }
    }
  }
  _construct() {
    this.timer = null
  }
  _init() {}

  showTime(ref) {
    let currentTime = new Date()
    let minute =
      currentTime.getMinutes() > 9 ? currentTime.getMinutes() : '0' + currentTime.getMinutes()
    ref.tag('TimeDisplay').text = +currentTime.getHours() + ':' + minute
  }

  headerShow(aStr) {
    function timerevt(ref) {
      ref.showTime(ref)
    }
    this.tag('FeatureName').text = aStr
    this.showTime(this)
    this.timer = setInterval(timerevt, Config.UPDATE_TIME, this)
  }

  headerClear() {
    this.tag('FeatureName').text = ''
    this.tag('TimeDisplay').text = ''
    this.timer ? clearInterval(this.timer) : ''
  }
}
