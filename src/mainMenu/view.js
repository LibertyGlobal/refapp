import { List } from './../core/list.js'
import Config from './config.js'

export function getBackground() {
  return { x: 0, y: 0, rect: true, color: 0xffff0000, w: 1920, h: 1080 }
}

export function getMainList() {
  return { x: Config.MAINMENU_x, y: Config.MAINMENU_y, type: List, signals: { select: true } }
}

export function getSubMenuList() {
  return { y: 400, type: List, signals: { select: true } }
}
