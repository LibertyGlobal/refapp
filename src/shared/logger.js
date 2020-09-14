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

function getDateString() {
  return new Date().toISOString()
}

function getLogPrefix(method, moduleName, functionName) {
  return [`[${getDateString()}][${method}]`, moduleName, functionName, ''].join(' ::: ')
}

/* eslint-disable no-console*/

function info(moduleName, functionName, ...args) {
  console.info(getLogPrefix('INFO', moduleName, functionName), ...args)
}
function error(moduleName, functionName, ...args) {
  console.error(getLogPrefix('ERROR', moduleName, functionName), ...args)
}
function warn(moduleName, functionName, ...args) {
  console.warn(getLogPrefix('WARN', moduleName, functionName), ...args)
}
function debug(moduleName, functionName, ...args) {
  console.log(getLogPrefix('DEBUG', moduleName, functionName), ...args)
}
function log(moduleName, functionName, ...args) {
  console.log(getLogPrefix('LOG', moduleName, functionName), ...args)
}

export default {}
export { info, error, warn, debug, log }
