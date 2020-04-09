export default class model {
  constructor() {
    this.init()
    this.data = {}
    this.currrentChannel = ''
  }

  init() {
    fetch('./cache/demo/channelsV2.json')
      .then(response => {
        return response.json()
      })
      .then(data => {
        this.data = data
      })
  }

  nextChannel() {
    let params = {
      openRequest: {
        type: 'main',
        locator: 'tune://pgmno=-1&frequency=302000000&modulation=16&symbol_rate=6875',
        refId: 'channel2'
      }
    }
    this.currrentChannel = 'channel 2'
    return params
  }

  previousChannel() {
    let params = {
      openRequest: {
        type: 'main',
        locator: 'tune://pgmno=-1&frequency=301000000&modulation=16&symbol_rate=6875',
        refId: 'channel1'
      }
    }
    this.currrentChannel = 'channel 1'
    return params
  }
}
