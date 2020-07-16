import { Lightning } from 'wpe-lightning-sdk'
import { navigate } from './Router'
export default class NavigationItem extends Lightning.Component {
  _handleEnter() {
    if (this._route) {
      navigate(this._route)
    }
  }
}
