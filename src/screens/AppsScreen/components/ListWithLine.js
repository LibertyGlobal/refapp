import ListItem from './ListItem'
import ItemWrapper from '../../../components/List/ItemWrapper'
import List from '../../../components/List'
import theme from '@/themes/default'
import constants from '../constants'

export default class ListWithLine extends List {
  static _template() {
    return {
      Label: {
        text: { fontFace: 'Regular', fontSize: constants.LIST_LABEL_FONTSIZE },
      },
      Line: {
        rect: true,
        y: constants.LIST_LINE_Y,
        w: constants.LIST_LINE_WIDTH,
        h: constants.LIST_LINE_HEIGHT,
        color: theme.colors.white
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
        construct: ListItem,
        x: index * (this._itemSize.w + 50),
        size: this._itemSize,
        item: item,
      }
    })
  }

  get items() {
    return this.tag('Items').children
  }

  _focus() {
    this.tag('Line').patch({ color: theme.colors.accent })
    this.tag('Label').text.patch({ textColor: theme.colors.accent })
  }

  _unfocus() {
    this.tag('Line').patch({ color: theme.colors.white })
    this.tag('Label').text.patch({ textColor: theme.colors.white })
  }
}
