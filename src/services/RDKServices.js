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
const REFAPP2_CLIENT_ID = 'refapp2'

function getDacAppInstallUrl(url) {
  if (platform === '7218c') {
    // TODO: temporary hack
    url = url.replace(/rpi3/g, '7218c')
  }
  return url
}

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

async function registerPackagerEvents(id, progress) {
  let eventHandlers = []

  progress.reset()

  let handleFailure = (notification, eventname, plugin, str) => {
    //console.log('handleFailure: ' + plugin + ' ' + eventname)

    if (plugin !== 'Packager') {
      return
    }
    if (id == notification.pkgId) {
      progress.fireAncestors('$fireINSTALLFinished', false, str);
      eventHandlers.map(h => { h.dispose() })
      eventHandlers = []
    }
  }

  let handleFailureDownload = (notification, eventname, plugin) => { handleFailure(notification, eventname, plugin, 'Failure downloading') };
  let handleFailureDecryption = (notification, eventname, plugin) => { handleFailure(notification, eventname, plugin, 'Failure decrypting') };
  let handleFailureExtraction = (notification, eventname, plugin) => { handleFailure(notification, eventname, plugin, 'Failure extracting') };
  let handleFailureVerification = (notification, eventname, plugin) => { handleFailure(notification, eventname, plugin, 'Failure verifying') };
  let handleFailureInstall = (notification, eventname, plugin) => { handleFailure(notification, eventname, plugin, 'Failure installing') };

  let handleProgress = (notification, eventname, plugin) => {
    //console.log('handleProgress: ' + plugin + ' ' + eventname)

    if (plugin !== 'Packager') {
      return
    }
    if (id == notification.pkgId) {
      let pc = notification.status / 8.0;
      progress.setProgress(pc, notification.what);
      if (pc == 1.0) {
        progress.fireAncestors('$fireINSTALLFinished', true);
        eventHandlers.map(h => { h.dispose() })
        eventHandlers = []
      }
    }
  }

  let handleProgressDownload = (notification, eventname, plugin) => {
    notification.what = "Downloading..."
    handleProgress.call(this, notification, eventname, plugin)
  }

  let handleProgressExtract = (notification, eventname, plugin) => {
    notification.what = "Extracting..."
    handleProgress.call(this, notification, eventname, plugin)
  }

  let handleProgressInstall = (notification, eventname, plugin) => {
    notification.what = "Installing..."
    handleProgress.call(this, notification, eventname, plugin)
  }

  addEventHandler( eventHandlers, 'Packager', 'onDownloadCommence', handleProgressDownload);
  addEventHandler( eventHandlers, 'Packager', 'onDownloadComplete', handleProgressDownload);

  addEventHandler( eventHandlers, 'Packager', 'onExtractCommence',  handleProgressExtract);
  addEventHandler( eventHandlers, 'Packager', 'onExtractComplete',  handleProgressExtract);

  addEventHandler( eventHandlers, 'Packager', 'onInstallCommence',  handleProgressInstall);
  addEventHandler( eventHandlers, 'Packager', 'onInstallComplete',  handleProgressInstall);

  addEventHandler( eventHandlers, 'Packager', 'onDownload_FAILED',     handleFailureDownload) ;
  addEventHandler( eventHandlers, 'Packager', 'onDecryption_FAILED',   handleFailureDecryption) ;
  addEventHandler( eventHandlers, 'Packager', 'onExtraction_FAILED',   handleFailureExtraction) ;
  addEventHandler( eventHandlers, 'Packager', 'onVerification_FAILED', handleFailureVerification);
  addEventHandler( eventHandlers, 'Packager', 'onInstall_FAILED',      handleFailureInstall);
}

export const installDACApp = async (app, progress) => {
  await getPlatformName()

  registerPackagerEvents('pkg-' + app.id, progress)
  
  console.log('installDACApp ' + app.id)

  let result = null
  try {
    result = await thunderJS().Packager.install({ pkgId: 'pkg-' + app.id, type: 'DAC', url: getDacAppInstallUrl(app.url) })
  } catch (error) {
    console.log('Error on installDACApp: ', error)
  }

  return result == null ? false : result.success
}

export const uninstallDACApp = async (id) => {
  console.log('uninstallDACApp ' + id)

  let result = null
  try {
    result = await thunderJS().Packager.remove({ pkgId: 'pkg-' + id })
  } catch (error) {
    console.log('Error on uninstallDACApp: ', error)
  }

  return result == null ? false : result.success
}

export const isInstalledDACApp = async (id) => {
  console.log('isInstalled ' + id)

  let result = null
  try {
    result = await thunderJS().Packager.isInstalled({ pkgId: 'pkg-' + id })
  } catch (error) {
    console.log('Error on isInstalledDACApp: ', error)
  }

  return result == null ? false : result.available
}

export const getInstalledDACApps = async () => {
  console.log('getInstalledDACApps')

  let result = null
  try {
    result = await thunderJS().Packager.getInstalled()
  } catch (error) {
    console.log('Error on getInstalledDACApps: ', error)
  }

  return result == null ? [] : result.applications
}

export const getPlatformName = async () => {
  if (platform == null) {
    platform = await getDeviceName()
    platform = platform.split('-')[0]

    if (platform === 'raspberrypi') {
      platform = 'rpi'
    } else if (platform === 'brcm972180hbc') {
      platform = '7218c'
    } else if (platform === 'vip7802') {
      platform = '7218c'
    } else {
      // default
      platform = '7218c'
    }
  }
  return platform
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
    if (app.type === 'application/dac.native') {
      result = await thunderJS()['org.rdk.RDKShell'].launchApplication({ client: app.id, mimeType: 'application/dac.native', uri: 'pkg-' + app.id })
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

  try {
    result = await thunderJS()['org.rdk.RDKShell'].moveToFront({ client: app.id})
  } catch (error) {
    console.log('Error on moveToFront: ', error)
    // ignore error
    //return false
  }

  // ignore error on moveToFront, because it will report error if client is already on top
  //if (result == null || !result.success) {
  //  return false
  //}

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
    if (app.type === 'application/dac.native') {
      result = await thunderJS()['org.rdk.RDKShell'].kill({ client: app.id })
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