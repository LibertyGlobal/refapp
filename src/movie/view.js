import { List } from './../core/list.js'
import Config from './config.js'

export function getBackground() {
  return {
    x: Config.LIST_BACKGROUND_X,
    y: Config.LIST_BACKGROUND_Y,
    rect: true,
    color: Config.LIST_BACKGROUND_COLOR,
    w: Config.LIST_BACKGROUND_WIDTH,
    h: Config.LIST_BACKGROUND_HEIGHT
  }
}

export function getMainList() {
  let argument = {
    ListItem: {
      width: Config.LIST_ITEM_WIDTH,
      height: Config.LIST_ITEM_HEIGHT,
      color: Config.LIST_ITEM_COLOR,
      Label_x: Config.LISTITEM_LABEL_X,
      Label_y: Config.LISTITEM_LABEL_Y,
      xspace: Config.LIST_ITEM_XSPACE,
      yspace: Config.LIST_ITEM_YSPACE,
      Title_Label_x: Config.LISTITEM_TITLE_LABEL_X,
      Title_Label_y: Config.LISTITEM_TITLE_LABEL_Y,
      fontSize: Config.LIST_RECOMMENDED_FONTSIZE,
      border: Config.LISTITEM_BORDER,
      focusItem: Config.LISTITEM_FOCUS,
      image_path: Config.LISTITEM_POSTER_PATH
    }
  }
  return {
    x: Config.LIST_X,
    y: Config.LIST_Y,
    type: List,

    signals: { select: true },
    argument: argument
  }
}

export function getRecommendedList() {
  let argument = {
    ListItem: {
      width: Config.LISTITEM_RECOMMENDED_WIDTH,
      height: Config.LISTITEM_RECOMMENDED_HEIGHT,
      color: Config.LISTITEM_RECOMMENDED_COLOR,
      Label_x: Config.LISTITEM_RECOMMENDED_LABEL_X,
      Label_y: Config.LISTITEM_RECOMMENDED_LABEL_Y,
      xspace: Config.LISTITEM_RECOMMENDED_XSPACE,
      yspace: Config.LISTITEM_RECOMMENDED_YSPACE,
      Title_Label_x: Config.LISTITEM_RECOMMENDED_TITLE_LABEL_X,
      Title_Label_y: Config.LISTITEM_RECOMMENDED_TITLE_LABEL_Y,
      fontSize: Config.LIST_RECOMMENDED_FONTSIZE,
      border: Config.LISTITEM_BORDER,
      focusItem: Config.LISTITEM_FOCUS,
      image_path: Config.LISTITEM_POSTER_PATH
    }
  }
  return {
    x: Config.LIST_RECOMMENDED_X,
    y: Config.LIST_RECOMMENDED_Y,
    type: List,
    signals: { select: true },
    argument: argument
  }
}
