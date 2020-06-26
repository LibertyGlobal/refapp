import { Lightning } from 'wpe-lightning-sdk'
import theme from '../../themes/default'
import commonConstants from '@/constants/default'

export default class Background extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      w: commonConstants.screen.width,
      h: commonConstants.screen.height,
      colorTop: theme.colors.backgroundTop,
      colorBottom: theme.colors.backgroundBottom
    }
  }
}
