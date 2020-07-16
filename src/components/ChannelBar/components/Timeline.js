import { Lightning } from 'wpe-lightning-sdk'
import constants from '../constants'

export default class Timeline extends Lightning.Component {
  static _template() {
    return {
      Background: {
        rect: true,
        w: constants.TIMELINE_WIDTH,
        h: constants.TIMELINE_HEIGHT,
        color: constants.TIMELINE_BACKGROUND_COLOR,
        CurrentTime: {
          rect: true,
          x: 0,
          y: 0,
          w: 0,
          h: constants.TIMELINE_HEIGHT,
          color: constants.TIMELINE_COLOR,
          zIndex: 10
        }
      }
    }
  }

  update(percent, smoothAnimation) {
    if (smoothAnimation) {
      this.tag('CurrentTime').setSmooth('w', this.tag('Background').finalW * percent / 100)
    } else {
      this.tag('CurrentTime').w = this.tag('Background').finalW * percent / 100
    }
  }
}
