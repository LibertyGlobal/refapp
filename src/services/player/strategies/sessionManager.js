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

'use strict'
import * as logger from '@/shared/logger'
import { Settings } from '@lightningjs/sdk'
import ThunderJS from 'ThunderJS'
const WSRPC_NAME = 'com.libertyglobal.rdk.rmfsessionmgr'
const WSRPC_EVENT_NAME = 'sessionEvent'

let currentPlaybackState
let _sessionmgrwsrpc = null
function sessionMgrWsRpc() {
  if (_sessionmgrwsrpc)
    return _sessionmgrwsrpc

  console.log('INIT sessionMgrWsRpc')
  _sessionmgrwsrpc = ThunderJS({
    host: window.location.hostname,
    port: Settings.get('app', 'sessionMgrWsRpcPort', window.location.port),
    endpoint: '/sessionmgr/wsrpc',
    protocols: [],
    debug: true
  })
  return _sessionmgrwsrpc
}
export const startPlayback = async (config) => {
  const request = {
    openRequest: config
  }
  console.log('startPlayback')

  await registerPlayerEvents()

  let result = null
  try {
    result = await sessionMgrWsRpc()[WSRPC_NAME].open(request)
  } catch (error) {
    console.log('Error on startPlayback: ', error)
  }
  console.log(result)
  currentPlaybackState = Object.assign({}, config, { sessionId: result.openStatus.sessionId })
  return result
}
export const stopCurrentPlayback = async () => {
  if (currentPlaybackState == null) {
    return false
  }
  const request = {
    closeRequest: {
      sessionId: currentPlaybackState.sessionId
    }
  }
  console.log('stopCurrentPlayback')

  let result = null
  try {
    result = await sessionMgrWsRpc()[WSRPC_NAME].close(request)
  } catch (error) {
    console.log('Error on stopCurrentPlayback: ', error)
  }

  await unregisterPlayerEvents()

  return result
}

export const getPlaybackStateDirectly = async () => {
  if (currentPlaybackState == null) {
    return false
  }
  const request = {
    getSessionPropertyRequest: {
      sessionId: currentPlaybackState.sessionId,
      refId: currentPlaybackState.refId,
      properties: ['duration', 'position', 'speed'],
    }
  }

  console.log('getPlaybackState')

  let result = null
  try {
    result = await sessionMgrWsRpc()[WSRPC_NAME].getSessionProperty(request)
  } catch (error) {
    console.log('Error on setPlaybackState: ', error)
  }
  return result == null ? {} : result.sessionProperty
}

export const setPlaybackState = async (props) => {
  if (currentPlaybackState == null) {
    return false
  }
  const request = {
    setSessionPropertyRequest: {
      sessionId: currentPlaybackState.sessionId,
      refId: currentPlaybackState.refId,
      setProperties: props
    }
  }
  console.log('setPlaybackState')

  let result = null
  try {
    result = await sessionMgrWsRpc()[WSRPC_NAME].setSessionProperty(request)
  } catch (error) {
    console.log('Error on setPlaybackState: ', error)
  }
  return result
}

let playBackStatus = { sessionProperty: {}}
let playBackEventHandlers = []

async function registerListener(plugin, eventname, cb) {
  return await sessionMgrWsRpc().on(plugin, eventname, (notification) => {
    console.log("Received sessionmgr event " + plugin + ":" + eventname, notification)
    if (cb != null) {
      cb(notification, eventname, plugin)
    }
  })
}

async function addEventHandler(eventHandlers, pluginname, eventname, cb) {
  eventHandlers.push(await registerListener(pluginname, eventname, cb))
}

async function unregisterPlayerEvents() {
  playBackEventHandlers.map(h => { h.dispose() })
  playBackEventHandlers = []
}

async function registerPlayerEvents() {
  await unregisterPlayerEvents()

  let handleSessionEvent = (notification, eventname, plugin) => {
    if (plugin !== WSRPC_NAME) {
      return
    }
    console.log(WSRPC_EVENT_NAME, JSON.stringify(notification), eventname, plugin)
    if (eventname === WSRPC_EVENT_NAME) {
      //TODO: fix
      // not receiving position, duration and speed via events!
      // "{\"sessionEvent\":{\"eventInfo\":\"variantSwitched\",\"sessionId\":100000011,\"type\":\"main\",\"variantSwitchedEventParams\":{\"bufferLength\":1200,\"encodedFrameRate\":0,\"encodedHeight\":720,\"encodedWidth\":1280,\"measuredBandwidth\":3601.416,\"position\":533,\"positionUTC\":0,\"profileBandwidth\":3395.039,\"renderedFrameRate\":0}}}"
      //playBackStatus = notification
    }
  }

  addEventHandler( playBackEventHandlers, WSRPC_NAME, WSRPC_EVENT_NAME, handleSessionEvent)
}
export const getPlaybackState = async () => {
  // TODO: return received events insteadof polling for latest state
  return getPlaybackStateDirectly()
}

export default {}
