const requestPromise = require('request-promise')
const config = require('../../../config/environment/index')
const logger = require('../../../components/logger')
const TAG = 'api/v2/utility/index.js'
const util = require('util')

exports.callApi = (endpoint, method = 'get', body, token, type = 'accounts') => {
  let headers = {
    'content-type': 'application/json',
    'Authorization': token
  }
  let uri = ''
  if (type === 'demoApp') {
    uri = config.API_URL_DEMO_APP
  } else {
    uri = config.API_URL_ACCOUNTS
  }
  let options = {
    method: method.toUpperCase(),
    uri: `${uri}/${endpoint}`,
    headers,
    body,
    json: true
  }
  logger.serverLog(TAG, `requestPromise body ${util.inspect(body)}`)
  return requestPromise(options).then(response => {
    logger.serverLog(TAG, `response from accounts ${util.inspect(response)}`)
    return new Promise((resolve, reject) => {
      if (response.status === 'success') {
        resolve(response.payload)
      } else {
        reject(response.payload)
      }
    })
  })
}
