// Just a set of regular colors, add any color that has a generic verbose name here
const palette = {
  white: 0xffffffff,
  black: 0xff000000,
  transparent: 0x00000000
}

const theme = {
  colors: {
    ...palette,
    primary: 0xff0a2c5b,
    accent: 0xff0cb2dd,
    backgroundTop: 0xFF282A33,
    backgroundBottom: 0xFF393939
  },
  layouts: {
    generic: {
      paddingLeft: 115,
      paddingRight: 100,
      paddingTop: 25,
      paddingBottom: 0
    }

  },
  // TODO: replace this ugly hack by theme provider mechanism
  updateColors: colors => {
    const parsed = {}
    for (const field in colors) {
      parsed[field] = parseInt(colors[field])
    }
    theme.colors = { ...theme.colors, ...parsed }
  }
}

module.exports = theme
