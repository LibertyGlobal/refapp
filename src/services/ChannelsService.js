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

import { Utils } from "@lightningjs/sdk"

let channels = null
let schedule = {}
let response = null

export const channelsServiceInit = async() => {
  response = await fetch(Utils.asset('cache/mocks/default/channelsV2.json'))
  channels = await response.json()
  response = await fetch(Utils.asset('cache/mocks/default/eventsV2.json'))
  const rawPrograms = await response.json()

  rawPrograms.forEach(function(item, i) {
    schedule[item.channelId] = item.events
  })

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
  if (program.length === 1) {
    return program[0]
  }
  return {}
}
