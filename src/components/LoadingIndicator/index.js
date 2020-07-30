import { Lightning, Utils } from 'wpe-lightning-sdk'
import constants from './constants'

export default class LoadingIndicator extends Lightning.Component {
  static _template() {
    return {
      Indicator: {
        src: Utils.asset(constants.LOADINGINDICATOR_ASSET_URL)
      }
    }
  }

  startAnimation() {
    this._animation = this.animation({
      duration: constants.LOADINGINDICATOR_ANIMATION_DURATION, repeat: constants.LOADINGINDICATOR_ANIMATION_REPEAT, actions:[{t: 'Indicator', p:'rotation', v:{sm: 0, 0: 0, 1: Math.PI * 2}}]
    })
    this._animation.start()
  }

  stopAnimation() {
    if (this._animation) {
      this._animation.stop()
    }
  }
}
