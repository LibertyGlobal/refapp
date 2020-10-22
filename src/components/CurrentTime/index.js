import { Lightning } from 'wpe-lightning-sdk'
import constants from './constants'

export default class Time extends Lightning.Component {
  static _template() {
    return {
      Time: {
        x: constants.TIME_LEFT,
        y: constants.TIME_TOP,
        zIndex: constants.TIME_ZINDEX
      }
    }
  }

  async _init() {
    const startTime = () => {
      let today = new Date();
      let h = today.getHours();
      let m = today.getMinutes();
      let s = today.getSeconds();
      m = checkTime(m);
      s = checkTime(s);
      this.tag('Time').text = h + ":" + m + ":" + s;
      let t = setTimeout(startTime, 500);
    }

    const checkTime = (i) => {
      if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
      return i;
    }
    startTime();
  }
}