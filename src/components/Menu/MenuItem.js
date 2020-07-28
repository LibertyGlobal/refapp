import NavigationItem from '../../lib/NavigationItem'
import theme from '@/themes/default'
import constants from './constants'

export default class MenuItem extends NavigationItem {
  static _template() {
    return {
      Caption: {
        text: {
          fontSize: constants.MENU_ITEM_FONTSIZE,
          textColor: theme.colors.white
        }
      }
    }
  }

  _init() {
    this._isSelected = false
  }

  _handleEnter() {
    super._handleEnter()
    return false
  }

  set item(value) {
    const caption = this.tag('Caption')
    caption.text.text = value.text

    const handleTextureChange = () => {
      this.patch({
        w: caption.renderWidth,
        h: caption.renderHeight
      })
      this.signal('sizeChanged', caption.renderWidth)
    }
    // caption.on('txLoaded', handleTextureChange)
    caption.loadTexture()
    handleTextureChange()

    this._item = value
    this._route = value.route
  }

  get item() {
    return this._item
  }

  set isSelected(value) {
    this._isSelected = value
    const caption = this.tag('Caption')
    caption.text.patch({
      textColor: value ? theme.colors.accent : theme.colors.white
    })
  }

  get isSelected() {
    return this._isSelected
  }
}
