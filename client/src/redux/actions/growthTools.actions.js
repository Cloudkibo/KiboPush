import * as ActionTypes from '../constants/constants'
import auth from '../../utility/auth.service'
import callApi from '../../utility/api.caller.service'
import fileDownload from 'js-file-download'
export const API_URL = '/api'
var json2csv = require('json2csv')

export function sendresp (data) {
  console.log('sendresp', data)
  return {
    type: ActionTypes.SAVE_PHONE_NUMBERS,
    data
  }
}

export function saveFileForPhoneNumbers (filedata, handleResponse) {
  return (dispatch) => {
    console.log('In dispatch', filedata.get('file'))
    // eslint-disable-next-line no-undef
    fetch(`${API_URL}/growthtools/upload`, {
      method: 'post',
      body: filedata,
      // eslint-disable-next-line no-undef
      headers: new Headers({
        'Authorization': `Bearer ${auth.getToken()}`
      })
    }).then((res) => res.json()).then((res) => res).then(res => {
      console.log('respone', res)
      var data = {status: res.status, description: res.description}
      console.log(data)
      handleResponse()
      dispatch(sendresp(data))
    })
  }
}

export function sendPhoneNumbers (data) {
  return (dispatch) => {
    callApi('growthTools/sendNumbers', 'post', data)
      .then(res => {
        console.log('Response', res)
        dispatch(sendresp(res))
      }
    )
  }
}

export function downloadSampleFile () {
  console.log('download Sample File called')
  let users = []
  let user1 = {'names': 'Sania Siddiqui', 'phone_numbers': '+923312443100'}
  let user2 = {'names': 'Anisha Chatwani', 'phone_numbers': '+923322846897'}
  let user3 = {'names': 'Sojharo Mangi', 'phone_numbers': '+923323800399'}
  users.push(user1)
  users.push(user2)
  users.push(user3)
  var info = users
  var keys = []
  var val = info[0]

  for (var j in val) {
    var subKey = j
    keys.push(subKey)
  }
  json2csv({ data: info, fields: keys }, function (err, csv) {
    if (err) {
      console.log(err)
    } else {
      fileDownload(csv, 'sampleFile.csv')
    }
  })
}
export function clearAlertMessage () {
  return {
    type: ActionTypes.CLEAR_ALERT_FILERESPONSE
  }
}

export function getPendingSubscriptions () {
  console.log('Get Pending Subscriptions called')
  return (dispatch) => {
    callApi(`growthTools/pendingSubscription`)
      .then(res => dispatch(showPendingSubscriptions(res.payload)))
  }
}

export function showPendingSubscriptions (data) {
  console.log('showPendingSubscriptions', data)
  return {
    type: ActionTypes.LOAD_NON_SUBSCRIBERS_DATA,
    data
  }
}
