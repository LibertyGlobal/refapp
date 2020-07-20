import { Lightning } from 'wpe-lightning-sdk'

export default class Trickmode extends Lightning.Component {
  static _template() {
    return {}
  }

  _construct() {}

  _init() {
    this.patch({
      Txt: { x: 1000, y: 10, text: { text: this.argument, fontSize: 30 } }
    })
  }

  _handleUp() {}
  _handleBack() {
    this.signal('select', { item: { label: 'trickMode', target: 'Movie' } })
  }

  _handleEnter() {}
}
