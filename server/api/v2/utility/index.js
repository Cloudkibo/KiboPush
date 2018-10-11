// const fetch = require('isomorphic-fetch')
const requestPromise = require('request-promise')
const config = require('../../../config/environment/index')
const logger = require('../../../components/logger')
const TAG = 'api/v2/utility/index.js'

// exports.callApi = (endpoint, method = 'get', body, headers = {'content-type': 'application/json'}) => {
//   let path = ''
//   if (endpoint === 'auth/verify') {
//     path = config.env === 'production'
//       ? 'https://accounts.cloudkibo.com/'
//       : config.env === 'staging' ? 'https://saccounts.cloudkibo.com/'
//       : 'http://localhost:3000/api/v1/'
//   } else {
//     path = config.API_URL_ACCOUNTS
//   }
//   logger.serverLog(TAG, `calling ${path}/${endpoint}`)
//   return fetch(`${path}/${endpoint}`, {
//     headers,
//     method,
//     body: JSON.stringify(body)
//   }).then(response => response.json().then(json => ({ json, response })))
//     .then(({ json, response }) => {
//       if (!response.ok) {
//         return Promise.reject(json)
//       }
//       return json
//     })
//     .then(
//       response => response,
//       error => error
//     )
// }

exports.callApi = (endpoint, method = 'get', body, headers = {'content-type': 'application/json'}) => {
  let path = ''
  if (endpoint === 'auth/verify') {
    path = config.env === 'production'
      ? 'https://accounts.cloudkibo.com/'
      : config.env === 'staging' ? 'https://saccounts.cloudkibo.com/'
      : 'http://localhost:3000/api/v1/'
  } else {
    path = config.API_URL_ACCOUNTS
  }
  let options = {
    method: method.toUpperCase(),
    uri: path,
    headers,
    json: true
  }
  logger.serverLog(TAG, `requestPromise options ${options}`)
  return requestPromise(options)
}
