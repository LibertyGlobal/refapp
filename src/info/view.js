import { List } from './../core/list.js'

export function getNavigationBar() {
  let argument = {
    ListItem: {
      width: 130,
      height: 50,
      color: 0xff00ffff,
      Label_x: 20,
      Label_y: 5,
      xspace: 200,
      yspace: 0,
      Title_Label_x: 10,
      Title_Label_y: 2,
      fontSize: 30,
      border: 5,
      focusItem: 0
    }
  }
  return {
    x: 150,
    y: 300,
    type: List,
    signals: { select: true },
    argument: argument
  }
}
