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

// can't use URL inside ASMS info yet
function mapApp(id) {
  if (id === 'com.libertyglobal.app.flutter') {
    return 'flutter'
  } else if (id === 'com.libertyglobal.app.waylandegltest') {
    return 'wayland-egl-test'
  } else if (id === 'com.libertyglobal.app.youi') {
    return 'you.i'
  } else {
    return ''
  }
}

function isLfs(id) {
  return id === 'com.libertyglobal.app.flutter'
}

function getDacAppInstallUrl(id) {
  var platform = "rpi"
  var dacRepo = "https://raw.githubusercontent.com/stagingrdkm/lntpub/master/bundle"
  var dacRepoLFS = "https://media.githubusercontent.com/media/stagingrdkm/lntpub/master/bundle"

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

export const installDACApp = async (id) => {
  initThunderJS()

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

export const startDACApp = async (id) => {
  initThunderJS()

  console.log('startDACApp ' + id)

  let result = null
  try {
    result = await thunderJS['org.rdk.RDKShell'].launchApplication({ client: id, mimeType: 'application/dac.native', uri: 'pkg-' + id })
  } catch (error) {
    console.log('Error on startDACApp: ', error)
  }

  return result == null ? false : result.success
}

export const stopDACApp = async (id) => {
  initThunderJS()

  console.log('stopDACApp ' + id)

  let result = null
  try {
    result = await thunderJS['org.rdk.RDKShell'].kill({ client: id })
  } catch (error) {
    console.log('Error on stopDACApp: ', error)
  }

  return result == null ? false : result.success
}