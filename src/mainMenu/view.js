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
      xspace: 400,
      yspace: 0
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

export function getSubMenuList() {
  let argument = {
    ListItem: {
      width: Config.MAINMENU_ITEM_WIDTH,
      height: Config.MAINMENU_ITEM_HEIGHT,
      color: Config.MAINMENU_ITEM_COLOR,
      Label_x: Config.MAINMENU_LISTITEM_LABEL_X,
      Label_y: Config.MAINMENU_LISTITEM_LABEL_Y,
      img_x: Config.MAINMENU_LISTITEM_IMG_X,
      img_y: Config.MAINMENU_LISTITEM_IMG_Y,
      img_width: Config.MAINMENU_LISTITEM_IMG_HEIGHT,
      img_height: Config.MAINMENU_LISTITEM_IMG_WIDTH,
      xspace: 20,
      yspace: 0
    }
  }
  return {
    y: Config.SUBMENU_LIST_Y,
    type: List,
    signals: { select: true },
    argument: argument
  }
}
