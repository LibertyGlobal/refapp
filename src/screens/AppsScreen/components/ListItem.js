
import { Lightning } from 'wpe-lightning-sdk'
import Item from '../../../components/List/Item'
import theme from '@/themes/default'
import constants from '../constants'

export default class ListItem extends Item {
  static _template() {
    return {
      alpha: constants.LIST_ITEM_ALPHA_UNFOCUSED,
      Background: {
        rect: true,
        w: constants.LIST_ITEM_BACKGROUND_WIDTH,
        h: constants.LIST_ITEM_BACKGROUND_HEIGHT,
        color: theme.colors.transparent
      },
      Focus: {
        type: Lightning.components.BorderComponent,
        borderWidth: constants.LIST_ITEM_BORDER_UNFOCUSED,
        colorBorder: theme.colors.accent
      },
      Image: {},
      Title: {
        y: constants.LIST_ITEM_TITLE_Y,
        w: constants.LIST_ITEM_TITLE_WIDTH,
        text: { fontFace: 'Regular', maxLines: constants.LIST_ITEM_TITLE_MAXLINES, fontSize: constants.LIST_ITEM_TITLE_FONTSIZE, textAlign: 'center' }
      }
    }
  }

  _focus() {
    this.tag('Focus').setSmooth('borderWidth', constants.LIST_ITEM_BORDER_FOCUSED)
    this.tag('Title').text.patch({ textColor: theme.colors.accent })
    this.setSmooth('alpha', constants.LIST_ITEM_ALPHA_FOCUSED)
  }

  _unfocus() {
    this.tag('Focus').setSmooth('borderWidth', constants.LIST_ITEM_BORDER_UNFOCUSED)
    this.tag('Title').text.patch({ textColor: theme.colors.white })
    this.setSmooth('alpha', constants.LIST_ITEM_ALPHA_UNFOCUSED)
  }
}
