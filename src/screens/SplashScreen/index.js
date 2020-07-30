import BaseScreen from '../BaseScreen'
import {Utils} from 'wpe-lightning-sdk'
import LoadingIndicator from '@/components/LoadingIndicator'
import Background from '@/components/Background'
import constants, { INDICATOR_HEIGHT } from './constants'

export default class SplashScreen extends BaseScreen {
  static _template() {
    return {
      Background: {
        type: Background,
      },
      Logo: {
        mountX: constants.LOGO_MOUNT_X,
        mountY: constants.LOGO_MOUNT_Y,
        w: constants.LOGO_WIDTH,
        h: constants.LOGO_HEIGHT,
        x: constants.LOGO_X,
        y: constants.LOGO_Y,
        src: Utils.asset(constants.LOGO_URL)
      },
      LoadingIndicator: {
        type: LoadingIndicator,
        mountX: constants.INDICATOR_MOUNT_X,
        mountY: constants.INDICATOR_MOUNT_Y,
        w: constants.INDICATOR_WIDTH,
        h: constants.INDICATOR_HEIGHT,
        x: constants.INDICATOR_X,
        y: constants.INDICATOR_Y
      },
      Text: {
        mount: constants.TEXT_MOUNT,
        x: constants.TEXT_X,
        y: constants.TEXT_Y,
        text: {
          text: 'Loading',
          fontSize: constants.TEXT_FONTSIZE,
          textColor: constants.TEXT_COLOR,
          textAlign: 'center'
        },
      },
    }
  }

  _init() {
    this.tag("LoadingIndicator").startAnimation()
  }

  _inactive() {
    this.tag("LoadingIndicator").stopAnimation()
  }
}
