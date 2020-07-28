import MoviesScreenItem from './MoviesScreenItem'
import ItemWrapper from '@/components/List/ItemWrapper'
import List from '@/components/List'
import constants from '../../constants'

export default class MoviesScreenList extends List {
  static _template() {
    return {
      Label: {
        text: {
          fontSize: constants.LIST_LABEL_FONTSIZE
        }
      },
      Items: {
        y: constants.LIST_ITEMS_Y
      }
    }
  }

  set items(value) {
    this._itemsData = value
    this._itemSize = this._itemSize ? this._itemSize : { w: constants.LIST_ITEM_DEFAULT_WIDTH, h: constants.LIST_ITEM_DEFAULT_HEIGHT }
    this.tag('Items').children = value.map((item, index) => {
      return {
        type: ItemWrapper,
        construct: MoviesScreenItem,
        x: index * (this._itemSize.w + 20),
        size: this._itemSize,
        item: item
      }
    })
  }

  get items() {
    return this.tag('Items').children
  }
}
