import { Lightning } from 'wpe-lightning-sdk'
import Config from './config.js'
import {
  startPlayback,
  getStatus,
  play,
  pause,
  fastforward,
  rewind,
  getPosition,
  setPosition
} from './../player/player.js'

export default class Trickmode extends Lightning.Component {
  static _template() {
    return {
      PlayerBar: {
        x: Config.PROGRESSBAR_X,
        y: Config.PROGRESSBAR_Y,
        Border: {
          rect: true,
          x: Config.PROGRESS_BARBORDER_X,
          y: Config.PROGRESS_BARBORDER_Y,
          w: Config.PROGRESS_BARBORDER_WIDTH,
          h: Config.PROGRESS_BARBORDER_HEIGHT,
          color: Config.PROGRESS_BARBORDER_COLOR
        },
        ProgressBar: {
          rect: true,
          w: Config.PROGRESSBAR_WIDTH,
          h: Config.PROGRESSBAR_HEIGHT,
          color: Config.PROGRESSBAR_COLOR
        },
        SeekMark: {
          rect: true,
          x: Config.SeekMark_X,
          y: Config.SeekMark_Y,
          w: Config.SeekMark_WIDTH,
          h: Config.SeekMark_HEIGHT,
          color: Config.SEEKMARK_COLOR
        }
      },
      PlayerControl_BG: {
        rect: true,
        x: Config.PLAYERCONTROL_BG_X,
        y: Config.PLAYERCONTROL_BG_Y,
        w: Config.PLAYERCONTROL_BG_WIDTH,
        h: Config.PLAYERCONTROL_BG_HEIGHT,
        alpha: 0,
        color: Config.PLAYERCONTROL_BG_COLOR0xffff0000
      },
      Rewind: {
        rect: true,
        x: Config.REWIND_X,
        y: Config.REWIND_Y,
        w: Config.REWIND_WIDTH,
        h: Config.REWIND_HEIGHT,
        color: Config.REWIND_COLOR,
        Rewindbtn: {
          y: 5,
          x: 40,
          text: { text: '<< Rewind', fontSize: Config.FONT_SIZE }
        }
      },
      Playbtn: {
        rect: true,
        x: Config.PLAYBTN_X,
        y: Config.PLAYBTN_Y,
        w: Config.PLAYBTN_WIDTH,
        h: Config.PLAYBTN_HEIGHT,
        color: Config.PLAYBTN_COLOR,
        PlayPausebtn: {
          y: 5,
          x: 40,
          text: { text: '  Play >', fontSize: Config.FONT_SIZE }
        }
      },
      Forward: {
        rect: true,
        x: Config.Forward_X,
        y: Config.Forward_Y,
        w: Config.Forward_WIDTH,
        h: Config.Forward_HEIGHT,
        color: Config.Forward_COLOR,
        Forwardbtn: {
          y: 5,
          x: 40,
          text: { text: 'Forward >>', fontSize: Config.FONT_SIZE }
        }
      }
    }
  }

  seekBarUpdate(ref) {
    getPosition().then(data => {
      let position = data.sessionProperty
      let video_percentage = (position.position * 100) / position.duration
      let x_pos = Math.floor((Config.PROGRESSBAR_WIDTH * video_percentage) / 100)
      ref.tag('SeekMark').setSmooth('x', x_pos)
      ref.currentVideoDuration = position.duration

      if (video_percentage < 99.5) {
        ref.timer = setInterval(ref.timerevt, 5000, ref)
      } else if (video_percentage > 99.5) {
        ref.timer ? clearInterval(ref.timer) : ''
        ref.signal('select', { item: { label: 'trickMode', target: 'Movie' } })
      }
    })
  }

  timerevt(ref) {
    ref.timer ? clearInterval(ref.timer) : ''
    ref.seekBarUpdate(ref)
  }

  _focus() {
    let Playestate = getStatus()
    this.play = Playestate.state == 'PLAY' || Playestate.state == 'OPEN' ? true : false
    this.timer = setInterval(this.timerevt, 5000, this)
    this._setState('ProgressBar')
    this.PlayerControl_index = 1
    this.tag(this.PlayerControl_arr[this.PlayerControl_index]).color = '0xff0000ff'
  }

  setVideoCursor(seekpointer) {
    let per = (seekpointer * 100) / Config.PROGRESSBAR_WIDTH
    let postion = (per * this.currentVideoDuration) / 100

    this.timer ? clearInterval(this.timer) : ''
    setPosition(postion).then(data => {
      this.timer = setInterval(this.timerevt, 5000, this)
    })
  }

  _construct() {
    this.play = null
    this.timer = null
    this.currentVideoDuration = null
    this.PlayerControl_arr = ['Rewindbtn', 'PlayPausebtn', 'Forwardbtn']
    this.PlayerControl_index = 0
  }

  _captureKey(evt) {
    let Playestate = getStatus()
    switch (evt.code) {
      case 'ArrowUp':
        this._setState('ProgressBar')
        break
      case 'ArrowDown':
        this._setState('PlayerControl')
        break
      case 'ArrowRight':
        if (this._getState() == 'PlayerControl') {
          this.PlayerControl_index < 2 ? this.PlayerControl_index++ : ''
          if (this.PlayerControl_index <= 2) {
            this.tag(this.PlayerControl_arr[this.PlayerControl_index - 1]).color = '0xffffffff'
            this.tag(this.PlayerControl_arr[this.PlayerControl_index]).color = '0xff0000ff'
          }
        } else {
          this.tag('SeekMark').x += 20
          this.setVideoCursor(this.tag('SeekMark').x)
        }

        break
      case 'ArrowLeft':
        if (this._getState() == 'PlayerControl') {
          this.PlayerControl_index > 0 ? this.PlayerControl_index-- : ''
          if (this.PlayerControl_index >= 0) {
            this.tag(this.PlayerControl_arr[this.PlayerControl_index + 1]).color = '0xffffffff'
            this.tag(this.PlayerControl_arr[this.PlayerControl_index]).color = '0xff0000ff'
          }
        } else {
          this.tag('SeekMark').x -= 20
          this.setVideoCursor(this.tag('SeekMark').x)
        }
        break
      case 'Backspace':
        this.signal('select', { item: { label: 'trickMode', target: 'Movie' } })
        break
      case 'Space':
        Playestate = getStatus()
        if (Playestate.state == 'PLAY' || Playestate.state == 'OPEN') {
          pause().then(() => {
            this.tag('PlayPausebtn').text = '' + 'PAUSE ||'
            this.timer ? clearInterval(this.timer) : ''
          })
        } else if (
          Playestate.state == 'PAUSE' ||
          Playestate.state == 'REWIND' ||
          Playestate.state == 'FASTFORWARD'
        ) {
          play().then(() => {
            this.tag('PlayPausebtn').text = '' + ' PLAY >'
            this.timer = setInterval(this.timerevt, 5000, this)
          })
        }
        break
      case 'Enter':
        if (this._getState() == 'PlayerControl') {
          if (this.PlayerControl_arr[this.PlayerControl_index] == 'Rewindbtn') {
            //  rewind(); //later this will enabled.
          } else if (this.PlayerControl_arr[this.PlayerControl_index] == 'PlayPausebtn') {
            if (Playestate.state == 'PLAY' || Playestate.state == 'OPEN') {
              pause().then(() => {
                this.tag('PlayPausebtn').text = '' + 'PAUSE ||'
                this.timer ? clearInterval(this.timer) : ''
              })
            } else if (
              Playestate.state == 'PAUSE' ||
              Playestate.state == 'REWIND' ||
              Playestate.state == 'FASTFORWARD'
            ) {
              play().then(() => {
                this.tag('PlayPausebtn').text = '' + ' PLAY >'
                this.timer = setInterval(this.timerevt, 5000, this)
              })
            }
          } else if (this.PlayerControl_arr[this.PlayerControl_index] == 'Forwardbtn') {
            // fastforward(); //later this will enabled.
          }
        }
        break
      default:
      // code block
    }
  }

  _init() {
    this.patch({
      Txt: { x: 1000, y: 10, text: { text: this.argument, fontSize: 30 } }
    })
  }

  static _states() {
    return [
      class ProgressBar extends this {
        $enter() {
          this.tag('Border').setSmooth('alpha', 1)
        }
        $exit() {
          this.tag('Border').setSmooth('alpha', 0)
        }
        _getFocused() {}
        select({ item }) {}
      },
      class PlayerControl extends this {
        $enter() {
          this.tag('PlayerControl_BG').setSmooth('alpha', 0.9)
        }
        $exit() {
          this.tag('PlayerControl_BG').setSmooth('alpha', 0)
          this.tag(this.PlayerControl_arr[this.PlayerControl_index]).color = '0xffffffff'
          this.PlayerControl_index = 1
          this.tag(this.PlayerControl_arr[this.PlayerControl_index]).color = '0xff0000ff'
        }
        _getFocused() {}
        select({ item }) {}
      },
      class Normal extends this {
        $enter() {}
        $exit() {}
        _getFocused() {}
        select({ item }) {}
      }
    ]
  }
}
