import { ChannelNumber } from './../channelNumber'

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
        locator: this.data[ChannelNumber.currentIndex].locator,
        refId: this.data[ChannelNumber.currentIndex].channelId
      }
    }
    this.currrentChannel = this.data[ChannelNumber.currentIndex].channelId
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

  channelTune() {
    this.currrentChannel = this.data[ChannelNumber.currentIndex].channelId
    return this.getMetaData()
  }

  nextChannel() {
    if (ChannelNumber.currentIndex < this.data.length - 1) {
      ChannelNumber.currentIndex++
    } else {
      return false
    }
    this.currrentChannel = this.data[ChannelNumber.currentIndex].channelId
    return this.getMetaData()
  }

  defaultChennal() {
    this.currrentChannel = this.data[ChannelNumber.currentIndex].channelId
    return this.getMetaData()
  }

  getCurrentChannel() {
    return this.data[ChannelNumber.currentIndex]
  }

  previousChannel() {
    if (ChannelNumber.currentIndex >= 1) {
      ChannelNumber.currentIndex--
    } else {
      return false
    }
    this.currrentChannel = this.data[ChannelNumber.currentIndex].channelId
    return this.getMetaData()
  }
}
