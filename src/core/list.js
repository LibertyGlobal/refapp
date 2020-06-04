import { Lightning } from 'wpe-lightning-sdk'
import Config from './listconfig.js'

export class ListItem extends Lightning.Component {
  static _template() {
    return {}
  }

  _init() {
    this.patch({
      rect: true,
      w: this.argument.ListItem.width,
      h: this.argument.ListItem.height,
      color: this.argument.ListItem.color,
      alpha: 0.8,
      Label: {
        x: this.argument.ListItem.Label_x,
        y: this.argument.ListItem.Label_y,
        text: { text: this.item.label, fontSize: 30 }
      }
    })
  }
  _focus() {
    this.patch({ smooth: { alpha: 1, scale: 1.1 } })
  }
  _unfocus() {
    this.patch({ smooth: { alpha: 0.8, scale: 1 } })
  }
}

//This ListItem show image.
export class ImageListItem extends ListItem {
  static _template() {
    return {}
  }

  _init() {
    this.patch({
      rect: true,
      w: this.argument.ListItem.width,
      h: this.argument.ListItem.height,
      color: this.argument.ListItem.color,
      alpha: 0.8,
      Img: {
        x: this.argument.ListItem.img_x,
        y: this.argument.ListItem.img_y,
        w: this.argument.ListItem.img_width,
        h: this.argument.ListItem.img_height,
        texture: { type: Lightning.textures.ImageTexture, src: Config.LIST_ITEM_DEFAULT_POSTER }
      },
      Label: {
        x: this.argument.ListItem.Label_x,
        y: this.argument.ListItem.Label_y
      }
    })
  }
}

//VoD ListItem .
export class VodListItem extends ListItem {
  static _template() {
    return {}
  }

  _init() {
    let borderPostion = (this.argument.ListItem.border / 2) * -1
    this.patch({
      rect: true,
      w: this.argument.ListItem.width,
      h: this.argument.ListItem.height,
      color: this.argument.ListItem.color,
      alpha: 0.8,
      Bg: {
        rect: true,
        x: borderPostion,
        y: borderPostion,
        w: this.argument.ListItem.width + this.argument.ListItem.border,
        h: this.argument.ListItem.height + this.argument.ListItem.border,
        color: 0xff0000ff,
        alpha: 0
      },
      Img: {
        x: 0,
        y: 0,
        w: this.argument.ListItem.width,
        h: this.argument.ListItem.height,
        texture: {
          type: Lightning.textures.ImageTexture,
          src: this.argument.ListItem.image_path + this.item.data.url
        }
      },
      Label: {
        x: this.argument.ListItem.Label_x,
        y: this.argument.ListItem.Label_y,
        text: { text: this.item.label, fontSize: this.argument.ListItem.fontSize }
      }
    })
  }

  _focus() {
    this.tag('Bg').patch({ smooth: { alpha: 1 } })
  }
  _unfocus() {
    this.tag('Bg').patch({ smooth: { alpha: 0 } })
  }
}

export class List extends Lightning.Component {
  static _template() {
    return {}
  }

  _init() {
    this.index = 0
    this.ListX = this.x
  }

  getPosition(startX, startY, xspace, yspace, index, w) {
    return startX + w * index + xspace * index
  }

  set items(items) {
    let startX = 0,
      startY = 0
    let xspace = this.argument.ListItem.xspace,
      yspace = this.argument.ListItem.yspace
    let width = this.argument.ListItem.width

    this.children = items.map((item, index) => {
      return {
        ref: 'ListItem-' + index,
        type: this.ListItemsComponend,
        x: this.getPosition(startX, startY, xspace, yspace, index, width),
        item, //passing the item as an attribute
        argument: this.argument
      }
    })
  }

  _getFocused() {
    return this.children[this.index]
  }

  _handleLeft() {
    let focusIndex = this.argument.ListItem.focusItem || null
    if (this.index > 0) {
      this.index--
    }
    if (focusIndex && this.index >= focusIndex) {
      this.setSmooth(
        'x',
        this.ListX +
          this.__childList._refs['ListItem-' + focusIndex].x -
          this.__childList._refs['ListItem-' + this.index].x
      )
    }
  }

  _handleRight() {
    let focusIndex = this.argument.ListItem.focusItem || null
    if (this.index < this.children.length - 1) {
      this.index++
    }
    if (focusIndex && this.index > focusIndex) {
      this.setSmooth(
        'x',
        this.ListX +
          this.__childList._refs['ListItem-' + focusIndex].x -
          this.__childList._refs['ListItem-' + this.index].x
      )
    }
  }

  _handleEnter() {
    this.signal('select', { item: this.children[this.index].item, ref: this.ref })
  }
}
