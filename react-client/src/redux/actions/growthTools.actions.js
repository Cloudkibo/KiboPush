import * as ActionTypes from '../constants/constants'
import auth from '../../utility/auth.service'
import callApi from '../../utility/api.caller.service'
import fileDownload from 'js-file-download'
import { loadCustomerListsNew } from '../../redux/actions/customerLists.actions'
export const API_URL = '/api'
var json2csv = require('json2csv')

export function sendresp (data) {
  return {
    type: ActionTypes.SAVE_PHONE_NUMBERS,
    data
  }
}

export function downloadSampleFile () {
  let users = []
  let user1 = {'names': 'Mary Jane', 'phone_numbers': '+923312440000'}
  let user2 = {'names': 'Tom Henry', 'phone_numbers': '+923322223000'}
  let user3 = {'names': 'Ali Ahmed', 'phone_numbers': '+923323800300'}
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
    } else {
      fileDownload(csv, 'sampleFile.csv')
    }
  })
  return {
    type: ActionTypes.SAVE_PHONE_NUMBERS,
    data: ''
  }
}
export function clearAlertMessage () {
  return {
    type: ActionTypes.CLEAR_ALERT_FILERESPONSE
  }
}

export function showPendingSubscriptions (data) {
  return {
    type: ActionTypes.LOAD_NON_SUBSCRIBERS_DATA,
    data
  }
}

export function saveFileForPhoneNumbers (filedata, handleResponse) {
  return (dispatch) => {
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
      handleResponse(res)
      dispatch(sendresp(res))
      dispatch(loadCustomerListsNew({last_id: 'none', number_of_records: 10, first_page: 'first'}))
    })
  }
}

export function sendPhoneNumbers (data) {
  return (dispatch) => {
    callApi('growthTools/sendNumbers', 'post', data)
      .then(res => {
        console.log('Response', res)
        dispatch(sendresp(res))
        dispatch(loadCustomerListsNew({last_id: 'none', number_of_records: 10, first_page: 'first'}))
      }
    )
  }
}

export function getPendingSubscriptions (name) {
  return (dispatch) => {
    callApi(`growthTools/pendingSubscription/${name}`)
      .then(res => dispatch(showPendingSubscriptions(res.payload)))
  }
}
