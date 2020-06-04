import { List } from './../core/list.js'
import Config from './config.js'

export function getBackground() {
  return {
    x: 0,
    y: 0,
    rect: false,
    color: 0xffffffff,
    w: Config.LIST_BACKGROUND_WIDTH,
    h: Config.LIST_BACKGROUND_HEIGHT
  }
}

export function getMainList() {
  let argument = {
    ListItem: {
      width: Config.MAINMENU_ITEM_WIDTH,
      height: Config.MAINMENU_ITEM_HEIGHT,
      color: Config.MAINMENU_ITEM_COLOR,
      Label_x: Config.MAINMENU_LISTITEM_LABEL_X,
      Label_y: Config.MAINMENU_LISTITEM_LABEL_Y,
      xspace: Config.MAINMENU_LIST_XSPACE,
      yspace: Config.MAINMENU_LIST_YSPACE
    }
  }
  return {
    x: Config.MAINMENU_x,
    y: Config.MAINMENU_y,
    type: List,
    signals: { select: true },
    argument: argument
  }
}
