import { Lightning, Utils } from 'wpe-lightning-sdk'
import { ListItem, VodListItem } from './../core/list.js'
import Model from './model.js'
import { getBackground, getMainList } from './view.js'
import { startPlayback } from './../player/player.js'
import Config from './config.js'

export default class Movie extends Lightning.Component {
  static _template() {
    return {
      x: 0,
      y: 0,
      BackGround: getBackground(),
      MainList: getMainList(),
      Txt: {
        x: Config.LIST_TITLE_X,
        y: Config.LIST_TITLE_Y,
        text: { text: Config.LIST_TITLE, fontSize: 30 }
      }
    }
  }

  _construct(cont) {
    this.model = new Model()
    this.model.data = {}
  }

  _init() {
    this.model.getMenu().then(data => {
      this.model.data = data
      this.tag('MainList').ListItemsComponend = VodListItem
      this.tag('MainList').items = this.model.data.map(i => ({ label: i.title, data: i }))
      this._setState('MainList')
    })
  }

  _handleUp() {}
  _handleDown() {}
  _handleBack() {
    console.log('movie js')
  }

  static _states() {
    return [
      class MainList extends this {
        _getFocused() {
          return this.tag('MainList')
        }
        select(item) {
          console.log(item.item.data)
          var body = {
            openRequest: {
              type: 'main',
              locator: item.item.data.locator,
              refId: item.item.data.refId
            }
          }
          startPlayback(body)
        }
      }
    ]
  }
}
