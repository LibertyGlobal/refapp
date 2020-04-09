export default class model {
  constructor() {
    this.init()
    this.data = {}
    this.currrentChannel = ''
    this.channelIndex = 0
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

  getMetaData() {
    let params = {
      openRequest: {
        type: 'main',
        locator: this.data[this.channelIndex].locator,
        refId: this.data[this.channelIndex].channelId
      }
    }
    this.currrentChannel = this.data[this.channelIndex].channelId
    return params
  }

  getChannel() {
    return fetch('./cache/demo/channelsV2.json')
      .then(response => {
        return response.json()
      })
      .then(data => {
        this.data = data
      })
  }

  nextChannel() {
    if (this.channelIndex < this.data.length - 1) {
      this.channelIndex++
    } else {
      console.log('nex')
      return false
    }

    this.currrentChannel = this.data[this.channelIndex].channelId
    return this.getMetaData()
  }

  defaultChennal() {
    this.currrentChannel = this.data[this.channelIndex].channelId
    return this.getMetaData()
  }

  previousChannel() {
    if (this.channelIndex >= 1) {
      this.channelIndex--
    } else {
      console.log('pre')
      return false
    }
    this.currrentChannel = this.data[this.channelIndex].channelId
    return this.getMetaData()
  }
}
