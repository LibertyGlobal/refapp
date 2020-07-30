import { Lightning, Utils } from 'wpe-lightning-sdk'
import { routingEvent } from '@/lib/Router'
import Menu from '../Menu'
import theme from '../../themes/default'
import commonConstants from '@/constants/default'
import constants from './constants'

let self = null

export default class Navbar extends Lightning.Component {
  static _template() {
    return {
      w: commonConstants.screen.width,
      h: constants.NAVBAR_CONTAINER_HEIGHT,
      y: commonConstants.screen.height - constants.NAVBAR_CONTAINER_HEIGHT,
      flex: {
        direction: 'row',
        alignItems: 'center'
      },
      Background: {
        w: commonConstants.screen.width,
        h: constants.NAVBAR_CONTAINER_HEIGHT,
        src: Utils.asset(constants.NAVBAR_BACKGROUND_URL),
        flexItem: false
      },
      BottomLine: {
        rect: true,
        y: constants.NAVBAR_LINE_Y,
        w: commonConstants.screen.width,
        h: constants.NAVBAR_LINE_HEIGHT,
        color: theme.colors.white,
        mountY: constants.NAVBAR_LINE_MOUNT_Y,
        flexItem: false
      },
      Menu: {
        type: Menu,
        flexItem: {
          grow: 1
        },
        signals: {
          itemSelected: '_menuItemSelected'
        }
      }
    }
  }

  _init() {
    this.tag('Menu').items = [
      { text: 'MOVIES', route: 'movies' },
      { text: 'APPS', route: 'apps' },
      { text: 'SETTINGS', route: 'settings' }
    ]

    self = this
    routingEvent.on('routed', this.onScreenRouted)
  }

  onScreenRouted(route) {
    let index = -1
    self.tag('Menu').items.forEach((item, i) => {
      if (item.route === route) {
        index = i
      }
    })
    self.tag('Menu').onScreenRouted(index)
  }

  _menuItemSelected() {}

  _focus() {
    this.setSmooth('alpha', 1)
  }

  _getFocused() {
    return this.tag('Menu')
  }
}
