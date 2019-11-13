/**
 * Created by sojharo on 26/07/2017.
 */

import fetch from 'isomorphic-fetch'
import _ from 'lodash'
import auth from './auth.service'
import { getAccountsUrl } from './utils'

export const API_URL = '/api'

export default function callApi (endpoint, method = 'get', body, type = 'kibopush') {
  let headers = {
    'content-type': 'application/json'
  }

  if (auth.loggedIn()) {
    headers = _.merge(headers, {
      Authorization: `Bearer ${auth.getToken()}`
    })
    if (auth.getActingAsUser() !== undefined && auth.getActingAsUser() !== '') {
      console.log('inside actingAsUser')
      headers = _.merge(headers, {
        actingAsUser: auth.getActingAsUser()
      })
    }
  }
  let fetchUrl = ''
  console.log('headers sent from client', headers)
  console.log('JSON.stringify(body)', body)
  if (type === 'kibopush') {
    fetchUrl = `${API_URL}/${endpoint}`
  } else if (type === 'accounts') {
    fetchUrl = `${getAccountsUrl()}/${endpoint}`
  } else fetchUrl = endpoint
  return fetch(fetchUrl, {
    headers,
    method,
    body: JSON.stringify(body)
  }).then(response => {
    if (response.statusText === 'Unauthorized') {
      auth.logout()
      this.props.history.push('/')
      return Promise.reject(response.statusText)
    }
    return response
  }).then(response => response.json().then(json => ({ json, response })))
    .then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json)
      }
      return json
    })
    .then(
      response => response,
      error => error
    )
}
