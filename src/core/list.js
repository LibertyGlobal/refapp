import Config from '../mainMenu/config.js'
import { Lightning } from 'wpe-lightning-sdk'

export class ListItem extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      w: Config.MAINMENU_ITEM_WIDTH,
      h: Config.MAINMENU_ITEM_HEIGHT,
      color: Config.MAINMENU_ITEM_COLOR,
      alpha: 0.8,
      Label: {
        x: 20,
        y: 0
      }
    }
  }
  _init() {
    this.patch({ Label: { text: { text: this.item.label, fontSize: 30 } } })
  }
  _focus() {
    this.patch({ smooth: { alpha: 1, scale: 1.1 } })
  }
  _unfocus() {
    this.patch({ smooth: { alpha: 0.8, scale: 1 } })
  }
}

export class ImageListItem extends ListItem {
  static _template() {
    return {
      rect: true,
      w: Config.MAINMENU_ITEM_WIDTH,
      h: Config.MAINMENU_ITEM_HEIGHT,
      color: Config.MAINMENU_ITEM_COLOR,
      alpha: 0.8,
      Img: {
        x: 0,
        y: 0,
        w: 200,
        h: 200,
        texture: { type: Lightning.textures.ImageTexture, src: './static/img.jpg' }
      },
      Label: {
        x: 20,
        y: 0
      }
    }
  }
}

export class List extends Lightning.Component {
  static _template() {
    return {}
  }

  _init() {
    this.index = 0
  }

  getPosition(startX, startY, xspace, yspace, index, w) {
    return startX + w * index + xspace * index
  }

  set items(items) {
    let startX = Config.MAINMENU_x,
      startY = 0
    let xspace = Config.MAINMENU_ITEM_XSPACE,
      yspace = Config.MAINMENU_ITEM_YSPACE
    let width = Config.MAINMENU_ITEM_WIDTH

    this.children = items.map((item, index) => {
      return {
        ref: 'ListItem-' + index,
        type: this.ListItemsComponend,
        x: this.getPosition(startX, startY, xspace, yspace, index, width),
        item //passing the item as an attribute
      }
    })
  }
  _getFocused() {
    return this.children[this.index]
  }
  _handleLeft() {
    if (this.index > 0) {
      this.index--
    }
  }
  _handleRight() {
    if (this.index < this.children.length - 1) {
      this.index++
    }
  }
  _handleEnter() {
    this.signal('select', { item: this.children[this.index].item, ref: this.ref })
  }
}
