import { Lightning, Utils } from 'wpe-lightning-sdk'
import { VodListItem } from './../core/list.js'
import Model from './model.js'
import { getBackground, getMainList, getRecommendedList } from './view.js'
import { startPlayback } from './../player/player.js'
import Config from './config.js'
import Info from '../info/info.js'

export default class Movie extends Lightning.Component {
  static _template() {
    return {
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
      },
      Info: {
        w: 2000, //later this value  get from stage config
        h: 2000, ////later this value  get from stage config
        color: 0xff000000,
        rect: true,
        type: Info,
        alpha: 0,
        signals: { select: true },
        argument: { description: 'Info Page Under Construction.' }
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
    this.signal('select', { item: { label: 'Movie', target: 'Menu' } })
  }

  infoPage(item) {
    var body = {
      openRequest: {
        type: 'main',
        locator: item.item.data.locator,
        refId: item.item.data.refId
      }
    }
    this.tag('Info').argument.moviename = 'Movie Name :' + item.item.data.title
    this.tag('Info').argument.rating = 'Rating :' + item.item.data.starRating
    this.tag('Info').argument.description = 'Description :' + item.item.data.mediumSynopsis
    this.tag('Info').argument.item = item.item
    this._setState('Info')
  }

  static _states() {
    return [
      class MainList extends this {
        _getFocused() {
          return this.tag('MainList')
        }
        select(item) {
          this.infoPage(item)
        }
      },
      class RecommendedList extends this {
        _getFocused() {
          return this.tag('RecommendedList')
        }
        select(item) {
          this.infoPage(item)
        }
      },
      class Info extends this {
        $enter() {
          this.tag('Info').setSmooth('alpha', 1)
        }
        $exit() {
          this.tag('Info').setSmooth('alpha', 0)
        }
        _getFocused() {
          return this.tag('Info')
        }

        select(item) {
          var body = {
            openRequest: {
              type: 'main',
              locator: item.item.data.locator,
              refId: item.item.data.refId
            }
          }
          this._setState('MainList')
          if (item.action == 'Play') {
            this.signal('select', { item: { label: 'Movie', target: 'TrickMode' } })
            startPlayback(body)
          }
        }
      }
    ]
  }
}
