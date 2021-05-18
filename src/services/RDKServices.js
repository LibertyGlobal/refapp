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

let thunderJS = null
let platform = null
const REFAPP2_CLIENT_ID = 'refapp2'

function getDacAppInstallUrl(url) {
  if (platform === '7218c') {
    // TODO: temporary hack
    url = url.replace(/rpi3/g, '7218c')
  }
  return url
}

async function initThunderJS() {
  if (thunderJS == null) {
    thunderJS = ThunderJS({
      host: window.location.hostname,
      port: Settings.get('app', 'rdkservicesPort', window.location.port),
      debug: true
    })

    try {
      let result = await thunderJS['org.rdk.RDKShell'].addKeyIntercept({
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
  initThunderJS()

  return await thunderJS.on(plugin, eventname, (notification) => {
    console.log("Received thunderJS event " + plugin + ":" + eventname, notification)
    if (cb != null) {
      cb(notification)
    }
  })
}

async function addEventHandler(eventHandlers, pluginname, eventname, cb) {
  eventHandlers.push(await registerListener(pluginname, eventname, cb))
}

async function registerPackagerEvents(id, progress) {
  let eventHandlers = []

  progress.reset()

  let handleFailure = (notification, str) => {
    if (id == notification.pkgId) {
      progress.fireAncestors('$fireINSTALLFinished', false, str);
      eventHandlers.map(h => { h.dispose() })
      eventHandlers = []
    }
  }

  let handleFailureDownload = (notification) => { handleFailure(notification, 'Failure downloading') };
  let handleFailureDecryption = (notification) => { handleFailure(notification, 'Failure decrypting') };
  let handleFailureExtraction = (notification) => { handleFailure(notification, 'Failure extracting') };
  let handleFailureVerification = (notification) => { handleFailure(notification, 'Failure verifying') };
  let handleFailureInstall = (notification) => { handleFailure(notification, 'Failure installing') };

  let handleProgress = (notification) => {
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

  let handleProgressDownload = (notification) => {
    notification.what = "Downloading..."
    handleProgress.call(this, notification)
  }

  let handleProgressExtract = (notification) => {
    notification.what = "Extracting..."
    handleProgress.call(this, notification)
  }

  let handleProgressInstall = (notification) => {
    notification.what = "Installing..."
    handleProgress.call(this, notification)
  }

  addEventHandler( eventHandlers, 'Packager', 'onDownloadCommence', handleProgressDownload);
  addEventHandler( eventHandlers, 'Packager', 'onDownloadComplete', handleProgressDownload);

  addEventHandler( eventHandlers, 'Packager', 'onExtractCommence',  handleProgressExtract);
  addEventHandler( eventHandlers, 'Packager', 'onExtractComplete',  handleProgressExtract);

  addEventHandler( eventHandlers, 'Packager', 'onInstallCommence',  handleProgressInstall);
  addEventHandler( eventHandlers, 'Packager', 'onInstallComplete',  handleProgressInstall);

  addEventHandler( eventHandlers, 'Packager', 'onDownload_FAILED',     handleFailureDownload,) ;
  addEventHandler( eventHandlers, 'Packager', 'onDecryption_FAILED',   handleFailureDecryption) ;
  addEventHandler( eventHandlers, 'Packager', 'onExtraction_FAILED',   handleFailureExtraction) ;
  addEventHandler( eventHandlers, 'Packager', 'onVerification_FAILED', handleFailureVerification);
  addEventHandler( eventHandlers, 'Packager', 'onInstall_FAILED',      handleFailureInstall);
}

export const installDACApp = async (app, progress) => {
  initThunderJS()
  await getPlatformName()

  registerPackagerEvents('pkg-' + app.id, progress)
  
  console.log('installDACApp ' + app.id)

  let result = null
  try {
    result = await thunderJS.Packager.install({ pkgId: 'pkg-' + app.id, type: 'DAC', url: getDacAppInstallUrl(app.url) })
  } catch (error) {
    console.log('Error on installDACApp: ', error)
  }

  return result == null ? false : result.success
}

export const uninstallDACApp = async (id) => {
  initThunderJS()

  console.log('uninstallDACApp ' + id)

  let result = null
  try {
    result = await thunderJS.Packager.remove({ pkgId: 'pkg-' + id })
  } catch (error) {
    console.log('Error on uninstallDACApp: ', error)
  }

  return result == null ? false : result.success
}

export const isInstalledDACApp = async (id) => {
  initThunderJS()

  console.log('isInstalled ' + id)

  let result = null
  try {
    result = await thunderJS.Packager.isInstalled({ pkgId: 'pkg-' + id })
  } catch (error) {
    console.log('Error on isInstalledDACApp: ', error)
  }

  return result == null ? false : result.available
}

export const getInstalledDACApps = async () => {
  initThunderJS()

  console.log('getInstalledDACApps')

  let result = null
  try {
    result = await thunderJS.Packager.getInstalled()
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
  initThunderJS()

  console.log('getDeviceName')

  let result = null
  try {
    result = await thunderJS.DeviceInfo.systeminfo()
  } catch (error) {
    console.log('Error on systeminfo: ', error)
  }

  return result == null ? "unknown" : result.devicename
}

export const getIpAddress = async () => {
  initThunderJS()

  console.log('getIpAddress')

  let result = null
  try {
    result = await thunderJS.DeviceInfo.addresses()
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
  initThunderJS()

  console.log('getAllRunningApps')

  let result = null
  try {
    result = await thunderJS['org.rdk.RDKShell'].getClients()
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
  initThunderJS()

  console.log('startApp ' + app.id)

  let result = null

  try {
    if (app.type === 'application/dac.native') {
      result = await thunderJS['org.rdk.RDKShell'].launchApplication({ client: app.id, mimeType: 'application/dac.native', uri: 'pkg-' + app.id })
    } else if (app.type === 'application/html') {
      result = await thunderJS['org.rdk.RDKShell'].launch({ callsign: app.id, uri: app.url, type: 'HtmlApp' })
    } else if (app.type === 'application/lightning') {
      result = await thunderJS['org.rdk.RDKShell'].launch({ callsign: app.id, uri: app.url, type: 'LightningApp' })
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
    result = await thunderJS['org.rdk.RDKShell'].moveToFront({ client: app.id})
  } catch (error) {
    console.log('Error on moveToFront: ', error)
    return false
  }

  if (result == null || !result.success) {
    return false
  }

  try {
    result = await thunderJS['org.rdk.RDKShell'].setFocus({ client: app.id})
  } catch (error) {
    console.log('Error on setFocus: ', error)
    return false
  }
 
  return result == null ? false : result.success
}

export const stopApp = async (app) => {
  initThunderJS()

  console.log('stopApp ' + app.id)

  let result = null
  
  try {
    if (app.type === 'application/dac.native') {
      result = await thunderJS['org.rdk.RDKShell'].kill({ client: app.id })
    } else if (app.type === 'application/html') {
      result = await thunderJS['org.rdk.RDKShell'].kill({ client: app.id })
      result = await thunderJS['org.rdk.RDKShell'].destroy({ callsign: app.id })
    } else if (app.type === 'application/lightning') {
      result = await thunderJS['org.rdk.RDKShell'].kill({ client: app.id })
      result = await thunderJS['org.rdk.RDKShell'].destroy({ callsign: app.id })
    } else {
      console.log('Unsupported app type: ' + app.type)
      return false
    }
  } catch (error) {
    console.log('Error on stopDACApp: ', error)
  }

  try {
    result = await thunderJS['org.rdk.RDKShell'].moveToFront({ client: REFAPP2_CLIENT_ID})
  } catch (error) {
    console.log('Error on moveToFront: ', error)
  }

  try {
    result = await thunderJS['org.rdk.RDKShell'].setFocus({ client: REFAPP2_CLIENT_ID})
  } catch (error) {
    console.log('Error on setFocus: ', error)
  }

  return true
}
