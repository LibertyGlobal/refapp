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

import { Settings } from '@lightningjs/sdk'
import ThunderJS from 'ThunderJS'

let rdkservices_initialized = false
let platform = null
let lisaDacConfig = null
let lock_handle = null
const REFAPP2_CLIENT_ID = 'refapp2'
const DAC_MIMETYPE = 'application/dac.native'

let _thunderjs = null
function thunderJS() {
  if (_thunderjs)
    return _thunderjs

  console.log('INIT thunderJS')
  _thunderjs = ThunderJS({
    host: window.location.hostname,
    port: Settings.get('app', 'rdkservicesPort', window.location.port),
    debug: true
  })
  return _thunderjs
}

async function initDACAppsKeyIntercept() {
  console.log('initDACAppsKeyIntercept')

  if (!rdkservices_initialized) {
    rdkservices_initialized = true
    try {
      let result = await thunderJS()['org.rdk.RDKShell'].addKeyIntercept({
        keyCode: 36, // HOME key, Javascript keycodes: https://keycode.info
        modifiers: ['ctrl'],
        client: REFAPP2_CLIENT_ID
      })
      if (result == null || !result.success) {
        console.log('Error on addKeyIntercept')
      }
    } catch (error) {
      console.log('Error on addKeyIntercept: ', error)
    }
  }
}

async function registerListener(plugin, eventname, cb) {
  return await thunderJS().on(plugin, eventname, (notification) => {
    console.log("Received thunderJS event " + plugin + ":" + eventname, notification)
    if (cb != null) {
      cb(notification, eventname, plugin)
    }
  })
}

async function addEventHandler(eventHandlers, pluginname, eventname, cb) {
  eventHandlers.push(await registerListener(pluginname, eventname, cb))
}

function translateLisaProgressEvent(evtname) {
  if (evtname === "DOWNLOADING") {
    return "Downloading..."
  } else if (evtname === "UNTARING") {
    return "Extracting..."
  } else if (evtname === "UPDATING_DATABASE") {
    return "Installing..."
  } else if (evtname === "FINISHED") {
    return "Finished"
  } else {
    return evtname
  }
}

async function registerLISAEvents(id, progress) {
  let eventHandlers = []

  progress.reset()

  let handleProgress = (notification, eventname, plugin) => {
    console.log('handleProgress: ' + plugin + ' ' + eventname)

    if (plugin !== 'LISA') {
      return
    }
    if (notification.status === 'Progress') {
      let parts = notification.details.split(" ")
      if (parts.length >= 2) {
        let pc = parseFloat(parts[1]) / 100.0
        progress.setProgress(pc, translateLisaProgressEvent(parts[0]))
      }
    } else if (notification.status === 'Success') {
      progress.fireAncestors('$fireDACOperationFinished', true)
      eventHandlers.map(h => { h.dispose() })
      eventHandlers = []
    } else if (notification.status === 'Failed') {
      progress.fireAncestors('$fireDACOperationFinished', false, 'Failed')
      eventHandlers.map(h => { h.dispose() })
      eventHandlers = []
    }
  }

  addEventHandler( eventHandlers, 'LISA', 'operationStatus', handleProgress);
}

export const installDACApp = async (app, progress) => {
  let url = app.url
  let mocked = Settings.get('app', 'asms-mock', false)
  if (mocked)  {
    url = url.replace(/rpi3/g, await getPlatformNameForDAC())
  }

  registerLISAEvents(app.id, progress)
  console.log('installDACApp ' + app.id)

  let result = null
  try {
    result = await thunderJS().LISA.install(
      {
        id: app.id,
        type: DAC_MIMETYPE,
        appName: app.name,
        category: app.category,
        versionAsParameter: app.version,
        url: url
      })
  } catch (error) {
    console.log('Error on installDACApp: ' + error.code + ' ' + error.message)
    return false
  }
  return true
}

export const uninstallDACApp = async (app, progress) => {
  console.log('uninstallDACApp ' + app.id)

  registerLISAEvents(app.id, progress)

  let result = null
  try {
    result = await thunderJS().LISA.uninstall(
      {
        id: app.id,
        type: DAC_MIMETYPE,
        versionAsParameter: app.version,
        uninstallType: 'full'
      })
  } catch (error) {
    console.log('Error on uninstallDACApp: ' + error.code + ' ' + error.message)
    return false
  }
  return true
}

export const isInstalledDACApp = async (app) => {
  console.log('isInstalled ' + app.id)

  let result = null
  try {
    result = await thunderJS().LISA.getStorageDetails(
      {
        id: app.id,
        type: DAC_MIMETYPE,
        versionAsParameter: app.version,
      })
  } catch (error) {
    console.log('Error on isInstalledDACApp: ', error)
    return false
  }

  return result == null ? false : result.apps.path !== ''
}

export const getLisaDACConfig = async () => {
  if (lisaDacConfig) {
    return lisaDacConfig
  }

  console.log('getLisaDACConfig')

  let result = null
  try {
    result = await thunderJS().LISA.getMetadata(
      {
        id: 'lisa.dac.config',
        type: 'application/LISA',
        versionAsParameter: '0'
      })
  } catch (error) {
    console.log('Error on getLisaDACConfig: ', error)
    return false
  }

  if (result == null || result.auxMetadata == null) {
    lisaDacConfig = ['unknown', 'unknown']
    return lisaDacConfig
  }

  const auxMetadata = result.auxMetadata
  let dacBundlePlatformNameOverride = 'unknown'
  let dacBundleFirmwareCompatibilityKey = 'unknown'

  // Loop through the auxMetadata array to find the desired values
  for (const metadata of auxMetadata) {
    if (metadata.key === 'dacBundlePlatformNameOverride' && metadata.value !== "") {
      dacBundlePlatformNameOverride = metadata.value
    } else if (metadata.key === 'dacBundleFirmwareCompatibilityKey' && metadata.value !== "") {
      dacBundleFirmwareCompatibilityKey = metadata.value
    }
  }

  lisaDacConfig = [dacBundlePlatformNameOverride, dacBundleFirmwareCompatibilityKey]
  return lisaDacConfig
}

export const getInstalledDACApps = async () => {
  console.log('getInstalledDACApps')

  let result = null
  try {
    result = await thunderJS().LISA.getList()
  } catch (error) {
    console.log('Error on getInstalledDACApps: ', error)
  }

  return result == null ? [] : (result.apps ? result.apps : [])
}

export const getPlatformNameForDAC = async () => {
  if (platform == null) {
    platform = await getDeviceName()
    platform = platform.split('-')[0]
  }

  if (platform === 'raspberrypi') {
    return 'rpi3'
  } else if (platform === 'raspberrypi4') {
    return 'rpi4'
  } else if (platform === 'brcm972180hbc') {
    return '7218c'
  } else if (platform === 'brcm972127ott') {
    return '72127ott'
  } else if (platform === 'vip7802') {
    return '7218c'
  } else if (platform.toLowerCase().includes('hp44h')) {
    return 'ah212'
  } else if (platform.toLowerCase().includes('amlogicfirebolt')) {
    return 'ah212'
  } else if (platform.toLowerCase().includes('mediabox')) {
    return 'rtd1319'
  } else if (platform.toLowerCase().includes('m393')) {
    return 'm393'
  } else {
    // default
    return '7218c'
  }
}

export const getPlatformNiceName = async () => {
  await getPlatformNameForDAC()

  if (platform === 'raspberrypi') {
    return 'Raspberry Pi 3'
  } else if (platform === 'raspberrypi4') {
    return 'Raspberry Pi 4'
  } else if (platform === 'brcm972180hbc') {
    return 'Broadcom 7218'
  } else if (platform === 'brcm972127ott') {
    return 'Broadcom 72127OTT'
  } else if (platform === 'vip7802') {
    return 'Commscope VIP7802'
  } else if (platform.toLowerCase().includes('hp44h')) {
    return 'Amlogic HP44H'
  } else if (platform.toLowerCase().includes('amlogicfirebolt')) {
    return 'Amlogic AH212'
  } else if (platform.toLowerCase().includes('m393')) {
    return 'Sagemcom m393'
  } else if (platform.toLowerCase().includes('mediabox')) {
    return 'Realtek RTD1319'
  } else {
    const [dacBundlePlatformNameOverride, _] = await getLisaDACConfig()
    return dacBundlePlatformNameOverride
  }
}

export const getDeviceName = async () => {
  console.log('getDeviceName')

  let result = null
  try {
    result = await thunderJS().DeviceInfo.systeminfo()
  } catch (error) {
    console.log('Error on systeminfo: ', error)
  }

  return result == null ? "unknown" : result.devicename
}

export const getIpAddress = async () => {
  console.log('getIpAddress')

  let result = null
  try {
    result = await thunderJS().DeviceInfo.addresses()
    if (result == null) {
      return ""
    } else {
      let intf = result.find(el => el.name.startsWith('eth'))
      if (intf == null || !('ip' in intf) || intf.ip.length == 0) {
        intf = result.find(el => el.name.startsWith('wlan'))
      }
      return (intf == null || !('ip' in intf) || intf.ip.length == 0) ? "" : intf.ip[0]
    }
  } catch (error) {
    console.log('Error on addresses: ', error)
    return ""
  }
}

export const getAllRunningApps = async () => {
  console.log('getAllRunningApps')

  let result = null
  try {
    result = await thunderJS()['org.rdk.RDKShell'].getClients()
  } catch (error) {
    console.log('Error on getInstalledDACApps: ', error)
  }

  return result == null ? [] : result.clients
}

export const isAppRunning = async (id) => {
  let clients = await getAllRunningApps()
  let client = clients.find((a) => { return a == id })
  return client != null
}

export const startApp = async (app) => {
  initDACAppsKeyIntercept()

  console.log('startApp ' + app.id)

  let result = null

  try {
    if (app.type === DAC_MIMETYPE) {
      try {
        result = await thunderJS().LISA.lock(
          {
            id: app.id,
            type: DAC_MIMETYPE,
            versionAsParameter: app.version,
            reason: 'Running app',
            owner: 'refapp'
          })
        if (result == null || result.handle == null) {
          console.log('Error on lock: ', error)
          return false
        }
        lock_handle = result.handle
        console.log('App locked with handle ' + lock_handle)
      } catch (error) {
        console.log('Error on lock: ', error)
        return false
      }

      result = await thunderJS()['org.rdk.RDKShell'].launchApplication(
        {
          client: app.id,
          mimeType: DAC_MIMETYPE,
          uri: app.id + ';' + app.version + ';' + DAC_MIMETYPE
        })
    } else if (app.type === 'application/html') {
      result = await thunderJS()['org.rdk.RDKShell'].launch({ callsign: app.id, uri: app.url, type: 'HtmlApp' })
    } else if (app.type === 'application/lightning') {
      result = await thunderJS()['org.rdk.RDKShell'].launch({ callsign: app.id, uri: app.url, type: 'LightningApp' })
    } else {
      console.log('Unsupported app type: ' + app.type)
      return false
    }
  } catch (error) {
    console.log('Error on launchApplication: ', error)
    return false
  }

  if (result == null || !result.success) {
    return false
  }

  // hide refapp2 GUI
  try {
    result = await thunderJS()['org.rdk.RDKShell'].setVisibility({ client: REFAPP2_CLIENT_ID, visible: false})
  } catch (error) {
    console.log('Error on setVisibility: ', error)
  }

  try {
    result = await thunderJS()['org.rdk.RDKShell'].moveToFront({ client: app.id})
  } catch (error) {
    console.log('Error on moveToFront: ', error)
    // ignore error
    // return false
  }

  try {
    result = await thunderJS()['org.rdk.RDKShell'].setFocus({ client: app.id})
  } catch (error) {
    console.log('Error on setFocus: ', error)
    return false
  }

  return result == null ? false : result.success
}

export const stopApp = async (app) => {
  console.log('stopApp ' + app.id)

  let result = null

  try {
    if (app.type === DAC_MIMETYPE) {
      result = await thunderJS()['org.rdk.RDKShell'].kill({ client: app.id })

      try {
        result = await thunderJS().LISA.unlock(
          {
            handle: lock_handle
          })
        console.log(result)
      } catch (error) {
        console.log('Error on unlock: ', error)
      }

    } else if (app.type === 'application/html') {
      result = await thunderJS()['org.rdk.RDKShell'].kill({ client: app.id })
      result = await thunderJS()['org.rdk.RDKShell'].destroy({ callsign: app.id })
    } else if (app.type === 'application/lightning') {
      result = await thunderJS()['org.rdk.RDKShell'].kill({ client: app.id })
      result = await thunderJS()['org.rdk.RDKShell'].destroy({ callsign: app.id })
    } else {
      console.log('Unsupported app type: ' + app.type)
      return false
    }
  } catch (error) {
    console.log('Error on stopDACApp: ', error)
  }

  // unhide refapp2 GUI
  try {
    result = await thunderJS()['org.rdk.RDKShell'].setVisibility({ client: REFAPP2_CLIENT_ID, visible: true})
  } catch (error) {
    console.log('Error on setVisibility: ', error)
  }

  try {
    result = await thunderJS()['org.rdk.RDKShell'].moveToFront({ client: REFAPP2_CLIENT_ID})
  } catch (error) {
    console.log('Error on moveToFront: ', error)
  }

  try {
    result = await thunderJS()['org.rdk.RDKShell'].setFocus({ client: REFAPP2_CLIENT_ID})
  } catch (error) {
    console.log('Error on setFocus: ', error)
  }

  return true
}

//////////////////////////////////////////////////////////////////////////////////////
// FireBoltMediaPlayer usage
//////////////////////////////////////////////////////////////////////////////////////
let playBackStatus
let playBackEventHandlers = []

async function unregisterPlayerEvents() {
  playBackEventHandlers.map(h => { h.dispose() })
  playBackEventHandlers = []
}

async function registerPlayerEvents() {
  await unregisterPlayerEvents()

  let handleMediaEvent = (notification, eventname, plugin) => {
    if (plugin !== 'org.rdk.FireboltMediaPlayer') {
      return
    }
    //console.log('MEDIAEVENT', notification, eventname, plugin)
    if (eventname === 'playbackProgressUpdate') {
      playBackStatus = notification
    }
  }

  //addEventHandler( playBackEventHandlers, 'org.rdk.FireboltMediaPlayer', 'playbackStarted', handleMediaEvent)
  //addEventHandler( playBackEventHandlers, 'org.rdk.FireboltMediaPlayer', 'playbackStateChanged', handleMediaEvent)
  addEventHandler( playBackEventHandlers, 'org.rdk.FireboltMediaPlayer', 'playbackProgressUpdate', handleMediaEvent)
  //addEventHandler( playBackEventHandlers, 'org.rdk.FireboltMediaPlayer', 'bufferingChanged', handleMediaEvent)
  //addEventHandler( playBackEventHandlers, 'org.rdk.FireboltMediaPlayer', 'playbackSpeedChanged', handleMediaEvent)
  //addEventHandler( playBackEventHandlers, 'org.rdk.FireboltMediaPlayer', 'playbackFailed', handleMediaEvent)
}
export const getVideoPlaybackState = async () => {
  return playBackStatus
}

export const startVideo = async (id, url) => {
  console.log('startVideo', id, url)
  let result = null

  await registerPlayerEvents()

  try {
    result = await thunderJS()['org.rdk.FireboltMediaPlayer'].create(
        { id: id })
  } catch (error) {
    console.log('Error on startVideo: ', error)
    return false
  }
  if (result == null || !result.success) {
    return false
  }

  try {
    result = await thunderJS()['org.rdk.FireboltMediaPlayer'].load(
      {
        id: id,
        url: url
      })
  } catch (error) {
    console.log('Error on playVideo: ', error)
    return false
  }

  return result == null ? false : result.success
}

export const stopVideo = async (id) => {
  console.log('stopVideo')
  let result = null
  try {
    result = await thunderJS()['org.rdk.FireboltMediaPlayer'].stop(
      {
        id: id
      })
  } catch (error) {
    console.log('Error on stopVideo: ', error)
    return false
  }

  await unregisterPlayerEvents()

  return result == null ? false : result.success
}

export const pauseVideo = async (id) => {
  console.log('pauseVideo')
  let result = null
  try {
    result = await thunderJS()['org.rdk.FireboltMediaPlayer'].pause(
      {
        id: id
      })
  } catch (error) {
    console.log('Error on pauseVideo: ', error)
    return false
  }

  return result == null ? false : result.success
}

export const playVideo = async (id) => {
  console.log('playVideo')
  let result = null

  try {
    result = await thunderJS()['org.rdk.FireboltMediaPlayer'].play(
      {
        id: id
      })
  } catch (error) {
    console.log('Error on playVideo: ', error)
    return false
  }

  return result == null ? false : result.success
}

export const seekToVideo = async (id, positionSec) => {
  console.log('seekToVideo')
  let result = null

  try {
    result = await thunderJS()['org.rdk.FireboltMediaPlayer'].seekTo(
      {
        id: id,
        positionSec: positionSec
      })
  } catch (error) {
    console.log('Error on seekToVideo: ', error)
    return false
  }

  return result == null ? false : result.success
}
