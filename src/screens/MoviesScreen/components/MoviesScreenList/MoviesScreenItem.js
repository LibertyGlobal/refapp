import { Lightning } from 'wpe-lightning-sdk'
import Item from '@/components/List/Item'
import theme from '@/themes/default'
import constants from '../../constants'

export default class MoviesScreenItem extends Item {
  static _template() {
    return {
      Background: {
        rect: true,
        color: theme.colors.black
      },
      Focus: {
        type: Lightning.components.BorderComponent,
        colorBorder: theme.colors.accent,
        borderWidth: 0
      },
      Image: {},
      Shade: {
        rect: true,
        alpha: constants.ITEM_SHADE_ALPHA,
        color: theme.colors.black
      },
      Title: {
        mountX: constants.ITEM_TITLE_MOUNT_X,
        text: {
          maxLines: constants.ITEM_TITLE_MAXLINES,
          fontSize: constants.ITEM_TITLE_FONTSIZE
        }
      }
    }
  }

  set size({ w, h }) {
    if (w && h) {
      this._size = { w: w, h: h }
      this.patch({
        Background: {
          w: w,
          h: h
        },
        Focus: {
          w: w,
          h: h
        },
        Shade: {
          w: w,
          h: h
        },
        Title: {
          x: w * 0.5,
          y: h - 40
        },
        Image: {
          texture: {
            resizeMode: {
              w: w,
              h: h
            }
          }
        }
      })
    }
  }
}
