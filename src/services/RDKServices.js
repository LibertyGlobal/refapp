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

// can't use URL inside ASMS info yet
function mapApp(id) {
  if (id.startsWith('com.libertyglobal.app.flutter')) {
    return 'flutter'
  } else if (id.startsWith('com.libertyglobal.app.waylandegltest')) {
    return 'wayland-egl-test'
  } else if (id.startsWith('com.libertyglobal.app.youi')) {
    return 'you.i'
  } else {
    return ''
  }
}

function isLfs(id) {
  return id === 'com.libertyglobal.app.flutter'
}

function getDacAppInstallUrl(id) {
  let dacRepo = "https://raw.githubusercontent.com/stagingrdkm/lntpub/master/bundle"
  let dacRepoLFS = "https://media.githubusercontent.com/media/stagingrdkm/lntpub/master/bundle"

  if (isLfs(id)) {
    return dacRepoLFS + "/" + platform + "/" + platform + "-" + mapApp(id) + ".tar.gz"
  } else {
    return dacRepo + "/" + platform + "/" + platform + "-" + mapApp(id) + ".tar.gz"
  }
}

function initThunderJS() {
  if (thunderJS == null) {
    thunderJS = ThunderJS({
      host: window.location.hostname,
      port: Settings.get('app', 'rdkservicesPort', window.location.port),
      debug: true
    })
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
      progress.setProgress(1.0, 'Error: '+ str)
      progress.fireAncestors('$fireINSTALLFinished', false);
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
        progress.setProgress(pc, 'Installed!')
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

export const installDACApp = async (id, progress) => {
  initThunderJS()
  await getPlatformName()

  registerPackagerEvents('pkg-' +id, progress)
  
  console.log('installDACApp ' + id)

  let result = null
  try {
    result = await thunderJS.Packager.install({ pkgId: 'pkg-' + id, type: 'DAC', url: getDacAppInstallUrl(id) })
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

    if (platform == 'raspberrypi') {
      platform = 'rpi'
    } else if (platform == 'brcm972180hbc') {
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

export const isDACAppRunning = async (id) => {
  let clients = await getAllRunningApps()
  let client = clients.find((a) => { return a == id })
  return client != null
}

export const startDACApp = async (id) => {
  initThunderJS()

  console.log('startDACApp ' + id)

  let result = null

  try {
    result = await thunderJS['org.rdk.RDKShell'].launchApplication({ client: id, mimeType: 'application/dac.native', uri: 'pkg-' + id })
  } catch (error) {
    console.log('Error on launchApplication: ', error)
    return false
  }

  if (result == null || !result.success) {
    return false
  }

  try {
    result = await thunderJS['org.rdk.RDKShell'].addKeyIntercept({
      keyCode: 77, // HOME key
      modifiers: ['ctrl'],
      client: id
    })
  } catch (error) {
    console.log('Error on addKeyIntercept: ', error)
    return false
  }

  if (result == null || !result.success) {
    return false
  }

  try {
    result = await thunderJS['org.rdk.RDKShell'].setFocus({ client: id})
  } catch (error) {
    console.log('Error on setFocus: ', error)
    return false
  }
 
  return result == null ? false : result.success
}

export const stopDACApp = async (id) => {
  initThunderJS()

  console.log('stopDACApp ' + id)

  let result = null
  
  /*
  try {
    result = await thunderJS['org.rdk.RDKShell'].removeKeyIntercept({ client: id})
  } catch (error) {
    console.log('Error on removeKeyIntercept: ', error)
    return false
  }
  */

  try {
    result = await thunderJS['org.rdk.RDKShell'].kill({ client: id })
  } catch (error) {
    console.log('Error on stopDACApp: ', error)
  }

  return result == null ? false : result.success
}