import { Utils, Log } from 'wpe-lightning-sdk'
import BaseScreen from '../BaseScreen'
import { getDomain } from '@/domain'
import Background from '@/components/Background'
import ListWithLine from './components/ListWithLine'
import { navigate } from '../../lib/Router'
import commonConstants from '@/constants/default'
import constants from './constants'
import theme from '../../themes/default'

export default class AppsScreen extends BaseScreen {
  static _template() {
    return {
      Background: {
        type: Background,
      },
      CTitle: {
        y: theme.layouts.generic.paddingTop,
        x: constants.TOP_TITLE_LEFT,
        text: {
          fontSize: constants.TOP_TITLE_FONTSIZE,
          textColor: theme.colors.white,
          zIndex: 11
        }
      },
      Mask: {
        clipping: true,
        w: commonConstants.screen.width,
        h: commonConstants.screen.height,
        Container: {
          x: constants.CONTAINER_X,
          alpha: constants.CONTAINER_ALPHA,
          Lists: {
            y: constants.CONTAINER_LIST_Y,
          },
        }
      },
    }
  }

  setIndex(index) {
    this._index = index
  }

  _getFocused() {
    return this.activeList
  } 

  get lists() {
    return this.tag('Lists').children
  }

  get activeList() {
    return this.lists[this._index]
  }

  async _init() {
    
  /*  
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("http://127.0.0.1:50050/apps", requestOptions)
      .then(resp => resp.text())
      .then(result => {
        console.log(result)
        this.tag('CTitle').text.text = 'Apps' +JSON.stringify(result);
      })
      .catch(error => console.log('error', error));

  //  const response = await fetch('http://127.0.0.1:50050/apps')
  //  const { applications } = await response.json()
  */
    this.tag('CTitle').text.text = 'Apps'
  //  this.tag('CTitle').text.text = 'Apps' +JSON.stringify(response);

    const response = await fetch(Utils.asset(`cache/mocks/${getDomain()}/asms-data.json`))
    const { applications } = await response.json()

    this._categories = applications

    this.rowsTopPositions = []
      const children = applications.map(({ category }, index, lists) => {
    
      let yPosition = 0
      for (let i = 0; i < index; i++) {
        const element = lists[i]
        yPosition += (constants.ICON_HEIGHT || 100) + 140
      }
      return {
        type: ListWithLine,
        itemSize: { w: constants.ICON_WIDTH, h: constants.ICON_HEIGHT },
        label: category,
        items: applications,
        y: yPosition,
      }
    })
    this._index = 0
    this.tag('Lists').children = children
    this.animate()
  }

  animate() {
    this.tag('Container').alpha = 0
    this.tag('Container').setSmooth('alpha', 1, { duration: 2 })
    for (let i = 0; i < this.lists.length; i++) {
      const list = this.lists[i]

      if (this.rowsTopPositions.length - 1 < i) {
        this.rowsTopPositions.push(list.y)
      }
      const y = this.rowsTopPositions[i]
      list.y = y + 200
      list.setSmooth('y', y, { delay: 0.1 * i, duration: 1 })
    }
  }

  _handleEnter() {
    navigate(`appdetails/${this._categories[this.activeList.index].id}`, true)
  }

  _handleUp() {
    if (this._index > 0) {
      this.setIndex(this._index - 1)
    }
  }

  _handleDown() {
    if (this._index < this.lists.length - 1) {
      this.setIndex(this._index + 1)
      return true
    }
    return false
  }
}
