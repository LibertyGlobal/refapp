/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Operator reference application
 *
 * Copyright (C) 2018-2019 Liberty Global B.V.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; version 2 of the License.
 */
'use strict'

import http from 'http'
import { log } from './logger'
import url from 'url'

const MODULE_NAME = 'request'

const Methods = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
}

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Connection: 'keep-alive',
}

function isResponseSuccess(httpResponse) {
  return httpResponse && httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299
}

function requestJson(options, headers) {
  const parsedUrl = url.parse(options.href)

  const config = {}
  config.headers = Object.assign(DEFAULT_HEADERS, headers)
  config.method = options.method || Methods.GET
  options.body = JSON.stringify(options.body)

  if (options.body !== undefined) {
    config.headers = Object.assign(config.headers, {
      'Content-Length': Buffer.byteLength(options.body),
    })
  }

  const requestorConfig = Object.assign({}, parsedUrl, config)

  log.info(MODULE_NAME, 'requestJson', `${config.method} request to: ${options.href}`, options.body)

  return new Promise((resolve, reject) => {
    const responseLogPrefix = `requestJson:: request to ${parsedUrl.path}`
    const request = http.request(requestorConfig, response => {
      response.setEncoding('utf8')

      let currentContentLength = 0
      let result = ''

      response.on('data', chunk => {
        result += chunk
        currentContentLength += chunk.length
        log.info(
          'Request:data',
          responseLogPrefix,
          `chunk.length: "${chunk.length}", currentContentLength: "${currentContentLength}"`
        )
      })

      response.on('end', () => {
        log.info(MODULE_NAME, responseLogPrefix, 'Resolved with status:', response.statusCode)
        if (response.headers['content-type'] && response.headers['content-type'].includes('json')) {
          try {
            result = result.length ? JSON.parse(result) : {}
          } catch (error) {
            log.error(
              MODULE_NAME,
              responseLogPrefix,
              `Error parsing response: "${error}" for response "${result}"`
            )
            reject(new Error({ statusCode: response.statusCode, data: result }))
            return
          }
        }

        if (isResponseSuccess(response)) {
          resolve(result)
        } else {
          log.warn(
            MODULE_NAME,
            responseLogPrefix,
            `Warning, response status received: ${response.statusCode}`
          )
          reject(new Error({ statusCode: response.statusCode, data: result }))
        }
      })
    })

    request.on('error', error => {
      log.error(responseLogPrefix, 'requestJson', `Problem with request : "${error.message}"`)
      reject(error)
    })

    if (options.timeout) {
      request.setTimeout(options.timeout, () => {
        log.error(responseLogPrefix, 'requestJson', 'Connection timed out')
        request.abort()
      })
    }

    if (options.body !== undefined) {
      request.write(options.body)
    }

    request.end()
  })
}

export { requestJson }
