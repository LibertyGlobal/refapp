import { List } from './../core/list.js'
import Config from './config.js'

export function getBackground() {
  return {
    x: 0,
    y: 0,
    rect: true,
    color: 0xff000000,
    w: Config.LIST_BACKGROUND_WIDTH,
    h: Config.LIST_BACKGROUND_HEIGHT
  }
}

export function getMainList() {
  return { x: Config.MAINMENU_x, y: Config.MAINMENU_y, type: List, signals: { select: true } }
}

export function getSubMenuList() {
  return { y: Config.SUBMENU_LIST_Y, type: List, signals: { select: true } }
}
