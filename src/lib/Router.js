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
import { routings } from './RoutingMap'
import { Lightning } from 'wpe-lightning-sdk'

const screenCache = {}
let application = null
let stage = null
let host = null
let activeScreen = null
let routingHistory = []
let positionInHistory = -1
/**
 * setup parameters
 * @param instance - {application instance}
 */

export const routingEvent = new Lightning.EventEmitter()

export const setupRouter = (instance, hash) => {
  application = instance
  stage = application.stage
  routingHistory = parseHash(hash)
  if (routingHistory.length === 0) {
    routingHistory = parseHash('#home')
  }
  positionInHistory = routingHistory.length - 1
}

/**
 * current opened screen
 * @return activeScreen - {component}
 */
export const getActiveScreen = () => {
  return activeScreen
}
/**
 * navigate to screen
 * @param route - {string}
 */
export const navigate = (route, store = true, force = false) => {
  if (route && store) {
    if (route.indexOf('#') === -1) {
      route = `#${route}`
    }
    routingHistory.length = positionInHistory + 1
    routingHistory = routingHistory.concat(parseHash(route))
    positionInHistory = routingHistory.length - 1
  }

  const routingEndPoint = routingHistory[positionInHistory]
  const routing = routings.find(r => r.url === routingEndPoint.route)
  const params = routingEndPoint.param

  updateWindowHash(routingEndPoint)

  if (!host && application.childList.getByRef('App')) {
    const node = application.childList.getByRef('App')
    host = node.childList
  }
  if (!routing || (activeScreen && routing.settings.ref === activeScreen.ref && !force)) {
    return
  }
  if (activeScreen) {
    activeScreen.hide()
  }
  // eslint-disable-next-line no-prototype-builtins
  if (!screenCache.hasOwnProperty(routing.url)) {
    screenCache[routing.url] = createScreen(routing.settings)
  }

  activeScreen = screenCache[routing.url]
  activeScreen.update(params)
  activeScreen.show()
  activeScreen.animate()
  routingEvent.emit('routed', routingEndPoint.route)
}

export const navigateForward = () => {
  if (positionInHistory < routingHistory.length - 1) {
    positionInHistory++
    navigate(null, false)
    return true
  }
  return false
}

export const navigateBackward = () => {
  if (positionInHistory > 0) {
    positionInHistory--
    navigate(null, false)
    return true
  }
  return false
}

const parseHash = hash => {
  const result = []
  let routing
  let params = hash.split('#')[1]
  params = decodeURI(params)
  if (params) {
    if (params !== '') {
      if (params.indexOf('/') !== -1) {
        const urlParts = params.split('/')
        urlParts.forEach(element => {
          routing = routings.find(r => r.url === element)
          if (routing) {
            result.push({ route: element })
          } else {
            if (result.length > 0) {
              result[result.length - 1].param = element
            }
          }
        })
      } else {
        routing = routings.find(r => r.url === params)
        if (routing) {
          result.push({ route: params })
        }
      }
    }
  }
  return result
}

const updateWindowHash = endpoint => {
  window.location.hash =
    endpoint.param && endpoint.param !== ''
      ? `#${endpoint.route}/${endpoint.param}`
      : `#${endpoint.route}`
}

const createScreen = settings => {
  const component = stage.c(settings)
  host.a(component)
  return component
}

window.addEventListener('hashchange', () => {
  const newRoute = parseHash(document.location.hash)
  const isNewRoute = routingHistory[positionInHistory].route !== newRoute[newRoute.length - 1].route
  const isNewParam = routingHistory[positionInHistory].param !== newRoute[newRoute.length - 1].param
  if (isNewRoute || isNewParam) {
    if (isNewParam && !isNewRoute) {
      routingHistory[positionInHistory].param = newRoute[newRoute.length - 1].param
    }
    if (isNewRoute) {
      routingHistory = newRoute
      positionInHistory = routingHistory.length - 1
    }
    navigate(document.location.hash, !isNewParam, true)
  }
})
