import { Lightning, Utils } from 'wpe-lightning-sdk'
import theme from '@/themes/default'

export default class Item extends Lightning.Component {
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
      Title: {
        text: {
          fontFace: 'Regular',
          maxLines: 2,
          fontSize: 24
        }
      }
    }
  }

  _focus() {
    this.tag('Focus').setSmooth('borderWidth', 8)
  }

  _unfocus() {
    this.tag('Focus').setSmooth('borderWidth', 0)
  }

  set colorBorder(color) {
    if (color && color !== '') {
      this.tag('Focus').colorBorder = color
    }
  }

  set colorItemBackground(color) {
    if (color && color !== '') {
      this.tag('Background').color = color
    }
  }

  set item(value) {
    this._item = value
    this.patch({
      Image: {
        texture: {
          resizeMode: {
            type: 'cover',
            w: this._size.w,
            h: this._size.h
          },
          type: Lightning.textures.ImageTexture,
          src: Utils.asset(value.image)
        }
      },
      Title: {
        text: { text: value.label, wordWrapWidth: this._size.w }
      }
    })
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
        Image: {
          texture: {
            resizeMode: {
              w: w,
              h: h
            }
          }
        },
        Title: {
          y: this._size.h + 7
        }
      })
    }
  }
}
