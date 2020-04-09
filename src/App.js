import { Lightning, Utils } from 'wpe-lightning-sdk'
import { ListItem, ImageListItem } from './core/list.js'
import Model from './mainMenu/model.js'
import { getBackground, getMainList, getSubMenuList } from './mainMenu/view.js'

export default class App extends Lightning.Component {
  static getFonts() {
    return [{ family: 'pixel', url: Utils.asset('fonts/pixel.ttf'), descriptor: {} }]
  }

  static _template() {
    return {
      x: 0,
      y: 0,
      BackGround: getBackground(),
      MainList: getMainList(),
      SubMenuList: getSubMenuList()
    }
  }

  _construct() {
    this.model = new Model()
    this.model.data = {}
  }

  _init() {
    this.model.getMenu().then(data => {
      this.model.data = data
      this.tag('MainList').ListItemsComponend = ListItem
      this.tag('SubMenuList').ListItemsComponend = ImageListItem
      this.tag('MainList').items = data.map(i => ({ label: i.title }))
      this.tag('SubMenuList').items = data[0].submenu.map(i => ({ label: i }))
      this._setState('MainList')
    })
  }

  _handleUp() {
    this._setState('MainList')
  }

  _handleDown() {
    this._setState('SubMenuList')
  }

  static _states() {
    return [
      class SubMenuList extends this {
        _getFocused() {
          return this.tag('SubMenuList')
        }
        select({ item }) {
          console.log(item)
        }
      },
      class MainList extends this {
        _getFocused() {
          return this.tag('MainList')
        }
        select({ item }) {
          let data = this.model.data
          this.tag('SubMenuList').items = []
          for (var index in data) {
            if (item.item.label === data[index].title) {
              this.tag('SubMenuList').items = data[index].submenu.map(i => ({ label: i }))
              break
            }
          }
        }
      }
    ]
  }
}
