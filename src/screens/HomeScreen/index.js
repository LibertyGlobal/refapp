import BaseScreen from '../BaseScreen'
import theme from '@/themes/default'
import ChannelBar from '@/components/ChannelBar'
import LoadingIndicator from '@/components/LoadingIndicator'
import * as player  from '@/services/player/'
import constants from './constants'
import commonConstants from '@/constants/default'

let intervalId = undefined

export default class HomeScreen extends BaseScreen {
  static _template() {
    return {
      Title: {
        y: theme.layouts.generic.paddingTop,
        x: theme.layouts.generic.paddingLeft,
        text: {
          fontSize: constants.TITLE_FONTSIZE,
          textColor: theme.colors.white,
          text: 'Main menu'
        }
      },
      ChannelBar: {
        type: ChannelBar,
        y: constants.CHANNELBAR_Y,
        visible: false,
        signals: {
          channelChanged: '_onChannelChanged',
          channelBarReady: '_onChannelBarReady'
        }
      },
      Loading: {
        rect: true,
        w: commonConstants.screen.width,
        h: commonConstants.screen.height,
        color: theme.colors.black,
        visible: false,
        LoadingIndicator: {
          type: LoadingIndicator,
          mountX: constants.LOADINGINDICATOR_MOUNT_X,
          mountY: constants.LOADINGINDICATOR_MOUNT_Y,
          x: constants.LOADINGINDICATOR_X,
          y: constants.LOADINGINDICATOR_Y,
          w: constants.LOADINGINDICATOR_WIDTH,
          h: constants.LOADINGINDICATOR_HEIGHT,
        }
      }
    }
  }

  _init() {
  }

  async _play(entry) {
    if (this._focused) {
      this.tag('ChannelBar').visible = true
    }
    this._playerSource = entry.locator
    await player.playQAM(entry)

    // Temporary switch off progress
    // this.startPropertyRequestTimer()

    this.tag('LoadingIndicator').stopAnimation()
    this.tag('Loading').visible = false
  }

  _active() {
    if (this._playerSource) {
      player.play()
      this.startPropertyRequestTimer()
    }
  }

  _inactive() {
    player.pause()
    this.stopPropertyRequestTimer()
  }

  startPropertyRequestTimer() {
    this.stopPropertyRequestTimer()
    this.$mediaplayerProgress(0, 1)
    this.getPlaybackState()
    intervalId = setInterval(this.getPlaybackState.bind(this), 3000)
  }

  stopPropertyRequestTimer() {
    if (intervalId !== undefined) {
      clearInterval(intervalId)
      intervalId = undefined
    }
  }

  getPlaybackState() {
    player.getPlaybackState().then((sessionProperty) => {
      this.$mediaplayerProgress(sessionProperty.position, sessionProperty.duration)
    })
  }

  $mediaplayerProgress(currentTime, duration) {
    this.tag('ChannelBar').updateProgress(100 * currentTime / duration)
  }

  _getFocused() {
    return this.tag('ChannelBar')
  }

  _onChannelBarReady(info) {
    this._play(info.selectedChannel)
  }

  _onChannelChanged(info) {
    this.tag('Loading').visible = true
    this.tag('LoadingIndicator').startAnimation()
    this._play(info.selectedChannel)
  }

  _focus() {
    this.tag('Title').text.text = 'Channel bar'
    this.tag('ChannelBar').visible = true
    this._focused = true
    this.fireAncestors('$hideMenu')
  }

  _unfocus() {
    this.tag('Title').text.text = 'Main menu'
    this.tag('Title').visible = true
    this.tag('ChannelBar').visible = false
    this._focused = false
  }

  _handleUp() {
    this.tag('Title').visible = !this.tag('Title').visible
    this.tag('ChannelBar').visible = !this.tag('ChannelBar').visible
  }
}
