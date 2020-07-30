import { Lightning } from 'wpe-lightning-sdk'
import theme from '@/themes/default'
import MenuItem from './MenuItem'
import constants from './constants'

export default class Menu extends Lightning.Component {
  static _template() {
    return {
      FocusFrame: {
        rect: true,
        w: constants.MENU_FOCUSFRAME_WIDTH,
        h: constants.MENU_FOCUSFRAME_UNFOCUS_HEIGHT,
        color: theme.colors.accent,
        mountY: constants.MENU_FOCUSFRAME_MOUNT_Y,
        flexItem: false
      },
      Container: {
        flex: {
          direction: 'row',
          justifyContent: 'space-around'
        },
        flexItem: {
          grow: 1
        }
      },
      flex: {
        direction: 'row'
      }
    }
  }

  _init() {
    this._focusIndex = -1
    this._selectedItem = null
  }

  set items(value = []) {
    this.tag('Container').patch({
      children: value.map(item => ({
        type: MenuItem,
        item
      }))
    })
    // TODO: check for items count change, re-adjust the focus index value
    if (this.focusIndex < 0) {
      this.focusIndex = 0
    }
    this._items = value
    this._refocus()

    // TODO: Figure out how to get rid of this ugly hack
    this.tag('FocusFrame').alpha = 0
    setTimeout(() => this.animate(), constants.MENU_ANIMATION_TIMEOUT)
  }

  get items() {
    return this._items
  }

  _active() {
    this.moveFocusFrameToItemByIndex(this._focusIndex)
  }

  animate() {
    this.tag('FocusFrame').setSmooth('alpha', 1)
    this.moveFocusFrameToItemByIndex(this._focusIndex)
  }

  get focusIndex() {
    return this._focusIndex
  }

  set focusIndex(value) {
    this._focusIndex = value
    this.moveFocusFrameToItemByIndex(this._focusIndex)
  }

  onScreenRouted(index) {
    if (index > -1) {
      this.clearSelection()
      this._selectedItem = this.tag('Container').children[index]
      this._selectedItem.isSelected = true
      this.focusIndex = index
      this.signal('itemSelected')
    }
  }

  clearSelection() {
    if (this._selectedItem) {
      this._selectedItem.isSelected = false
    }
    this._selectedItem = null
  }

  _handleLeft() {
    const current = this.focusIndex
    this.focusIndex = current > 0 ? current - 1 : 0
  }

  _handleRight() {
    const current = this.focusIndex
    const maxIndex = this._items.length - 1
    if (current < maxIndex) {
      this.focusIndex = current + 1
      return true
    } else {
      return false
    }
  }

  _handleEnter() {
    const focusedItem = this._getFocused()
    focusedItem.isSelected = true
    if (this._selectedItem) {
      if (this._selectedItem === focusedItem) {
        return true
      }
      this._selectedItem.isSelected = false
    }
    this._selectedItem = focusedItem
    this.signal('itemSelected')
    return true
  }

  _getFocused() {
    return this.tag('Container').children[this.focusIndex]
  }

  _focus() {
    this.tag('FocusFrame').setSmooth('h', constants.MENU_FOCUSFRAME_FOCUS_HEIGHT)
  }

  _unfocus() {
    this.tag('FocusFrame').setSmooth('h', constants.MENU_FOCUSFRAME_UNFOCUS_HEIGHT)
  }

  moveFocusFrameToItemByIndex(value) {
    const focusedItem = this.tag('Container').children[value]
    const focusFrame = this.tag('FocusFrame')
    focusFrame.setSmooth('w', focusedItem.finalW + 250)
    focusFrame.setSmooth('x', focusedItem.finalX - 125)
    focusFrame.y = focusedItem.finalH
  }
}
