const fetch = require('isomorphic-fetch')
const config = require('../../../config/environment/index')

exports.callApi = (endpoint, method = 'get', body) => {
  let headers = {
    'content-type': 'application/json'
  }
  return fetch(`${config.API_URL_ACCOUNTS}/${endpoint}`, {
    headers,
    method,
    body: JSON.stringify(body)
  }).then(response => {
    // return promise
  })
}
