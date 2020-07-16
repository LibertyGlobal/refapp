import axios from 'axios'
import * as logger from '@/shared/logger'

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Connection: 'keep-alive',
}

function requestJson(options, headers) {
  const parsedUrl = options.href

  const config = {}
  config.headers = Object.assign(DEFAULT_HEADERS, headers)
  config.method = options.method || Methods.GET
  options.body = JSON.stringify(options.body)

  // if (options.body !== undefined) {
  //   config.headers = Object.assign(config.headers, {
  //     'Content-Length': Buffer.byteLength(options.body),
  //   })
  // }



  return new Promise((resolve, reject) => {
    axios.put(parsedUrl, options.body, config.headers)
    .then((resp) => {
      resolve(resp.data)
    }).catch((err) => {
      logger.warn(err)
      reject(err)
    });
  })
}

export { requestJson }
