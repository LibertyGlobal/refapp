import { Lightning, Utils } from 'wpe-lightning-sdk'
import { VodListItem } from './../core/list.js'
import Model from './model.js'
import { getBackground, getMainList, getRecommendedList } from './view.js'
import { startPlayback } from './../player/player.js'
import Config from './config.js'

export default class Movie extends Lightning.Component {
  static _template() {
    return {
      x: 0,
      y: 0,
      MainList: getMainList(),
      RecommendedList: getRecommendedList(),
      Txt: {
        x: Config.LIST_ALL_MOVIES_X,
        y: Config.LIST_ALL_MOVIES_Y,
        text: { text: Config.LIST_ALL_MOVIES, fontSize: Config.DEFAULT_FONT_SIZE }
      },
      RecommendedTxt: {
        x: Config.LABEL_RECOMMENDED_X,
        y: Config.LABEL_RECOMMENDED_Y,
        text: { text: Config.LABEL_RECOMMENDED, fontSize: Config.DEFAULT_FONT_SIZE }
      }
    }
  }

  _construct(cont) {
    this.model = new Model()
    this.model.data = {}
  }

  _init() {
    this.model.getRecommend().then(data => {
      let recommended_data = data
      this.tag('RecommendedList').ListItemsComponend = VodListItem
      this.tag('RecommendedList').items = recommended_data.map(i => ({ label: i.title, data: i }))
    })

    this.model.getMovie().then(data => {
      this.model.data = data
      this.tag('MainList').ListItemsComponend = VodListItem
      this.tag('MainList').items = this.model.data.map(i => ({ label: i.title, data: i }))
      this._setState('MainList')
    })
  }

  _handleUp() {
    this._setState('RecommendedList')
  }
  _handleDown() {
    this._setState('MainList')
  }
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
      },
      class RecommendedList extends this {
        _getFocused() {
          return this.tag('RecommendedList')
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
