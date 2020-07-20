import { Lightning, Utils } from 'wpe-lightning-sdk'
import Config from './config.js'
import { getNavigationBar } from './view.js'
import { TabListItem } from './../core/list.js'

export default class info extends Lightning.Component {
  static _template() {
    return {
      Panel: {
        x: 300, //later this value get from argument
        y: 400, ////later this value get from argument
        BGbox: {
          rect: true,
          w: Config.BOX_WIDTH,
          h: Config.BOX_HIGHT,
          color: 0xffff2222,
          alpha: 1
        },
        ImgeBox: {
          rect: true,
          x: 1000,
          w: 300,
          h: 400,
          color: 0xffff22ff,
          alpha: 1
        },
        NavigationTab: getNavigationBar()
      }
    }
  }

  _construct(cont) {}

  _init() {
    let data = Config.BUTTON
    this.tag('NavigationTab').ListItemsComponend = TabListItem
    this.tag('NavigationTab').items = data.map(i => ({ label: i.title, data: i }))
    this._setState('NavigationTab')
  }

  _active() {
    this.tag('Panel').patch({
      Moviename: {
        x: Config.MOVIE_NAME_X,
        y: Config.MOVIE_NAME_Y,
        text: { text: this.argument.moviename, fontSize: 30 }
      },
      Rating: {
        x: Config.RATING_X,
        y: Config.RATING_Y,
        text: { text: this.argument.rating, fontSize: 30 }
      },
      MovieDescription: {
        x: Config.DESCRIPTION_X,
        y: Config.DESCRIPTION_Y,
        text: { text: this.argument.description, fontSize: 30 }
      }
    })
  }

  _handleBack() {
    this.screenBack()
  }
  _handleEnter() {
    this.videplay()
  }

  videplay() {
    this.signal('select', { item: this.argument.item, label: 'Info', action: 'Play' })
  }
  screenBack() {
    this.signal('select', { item: this.argument.item, label: 'Info', action: 'Back' })
  }

  static _states() {
    return [
      class NavigationTab extends this {
        _getFocused() {
          return this.tag('NavigationTab')
        }
        select({ item }) {
          if (item.label == 'Play') {
            this.videplay()
          } else if (item.label == 'Back') {
            this.screenBack()
          }
        }
      }
    ]
  }
}
