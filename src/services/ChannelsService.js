import { Utils } from "wpe-lightning-sdk"

let channels = null
let schedule = {}
let response = null

export const channelsServiceInit = async() => {
  response = await fetch(Utils.asset("mocks/default/channelsV2.json"))
  channels = await response.json()
  response = await fetch(Utils.asset("eventsV2.json"))
  const rawPrograms = await response.json()

  rawPrograms.forEach(function(item, i) {
    schedule[item.channelId] = item.events
  });

  return channels
}

export const getChannel = (index) => {
  return channels[index]
}

export const getSchedule = (channelId) => {
  return schedule[channelId]
}

export const getCurrentProgram = (channelId, timestamp) => {
  let program = getSchedule(channelId).filter(function(item) {
    return item.startTime <= timestamp && item.endTime > timestamp
  })
  if (program.length == 1) {
    return program[0]
  }
  return {}
}
