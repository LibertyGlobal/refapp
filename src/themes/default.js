/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Liberty Global B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
    installed: 0xFFedd340,
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
