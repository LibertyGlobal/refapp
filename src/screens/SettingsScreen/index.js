import BaseScreen from '../BaseScreen'
import Background from '@/components/Background'
import WarningModal from '@/components/WarningModal'
import constants from './constants'

export default class SettingsScreen extends BaseScreen {
  static _template() {
    return {
      Background: {
        type: Background,
      },
      Popup: {
        type: WarningModal,
        headerText: "Settings are not available",
        bodyText: "Settings implementation is planned for future versions of the application",
        x: constants.POPUP_X,
        y: constants.POPUP_Y
      }
    }
  }
}
