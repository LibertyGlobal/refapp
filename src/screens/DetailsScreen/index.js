import { Utils } from 'wpe-lightning-sdk'
import { navigate, navigateBackward } from '../../lib/Router'
import BaseScreen from '../BaseScreen'
import theme from '../../themes/default'
import Background from '../../components/Background'
import constants from './constants'

export default class DetailsScreen extends BaseScreen {
  static _template() {
    return {
      Background: {
        type: Background
      },
      Container: {
        x: constants.CONTAINER_X,
        Title: {
          y: constants.TITLE_Y,
          text: {
            fontSize: constants.TITLE_FONTSIZE,
            fontFace: 'Regular',
            textColor: theme.colors.white
          }
        },
        Rating: {
          y: constants.RATING_Y,
          text: {
            fontSize: constants.RATING_FONTSIZE,
            fontFace: 'Regular',
            textColor: theme.colors.white
          }
        },
        Description: {
          y: constants.DESCRIPTION_Y,
          text: {
            fontSize: constants.DESCRIPTION_FONTSIZE,
            fontFace: 'Regular',
            textColor: theme.colors.white
          }
        }
      },
      Poster: {
        x: constants.POSTER_X,
        y: constants.POSTER_Y,
        w: constants.POSTER_WIDTH,
        h: constants.POSTER_HEIGHT
      }
    }
  }

  async update(params) {
    const response = await fetch(Utils.asset('mocks/default/movies.json'))
    const { layout } = await response.json()
    const item = this._getItem(layout, params)
    this.tag('Title').text.text = item.label + ` (${item.year})`
    this.tag('Rating').text.text = `Rating: ${item.rating}`
    this.tag('Description').text.text = item.description
    this.tag('Poster').patch({
      src: Utils.asset(item.poster)
    })
    this._itemId = item.id
  }

  _getItem(layout, params) {
    let result = {}
    layout.body.forEach((category) => {
      category.items.forEach((item, index) => {
        if (item.id === params) {
          result = item
        }
      })
    })
    return result
  }

  _handleEnter() {
    navigate('vod/' + this._itemId)
  }

  _handleKey(key) {
    if (key.code === 'Backspace') {
      navigateBackward()
      return true
    }
    return false
  }

  _focus() {
    this.fireAncestors('$hideMenu')
  }
}
