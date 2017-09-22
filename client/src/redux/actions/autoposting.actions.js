import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function showautoposting (data) {
  console.log('showautoposting')
  console.log(data)
  return {
    type: ActionTypes.FETCH_AUTOPOSTING_LIST,
    autoposting: data
  }
}
export function loadAutopostingList () {
  return (dispatch) => {
    callApi('autoposting').then(res => dispatch(showautoposting(res.payload)))
  }
}

export function createautoposting (data) {
  console.log(data)
  return (dispatch) => {
    callApi('autoposting/create', 'post', data)
      .then(res => {
        dispatch(loadAutopostingList())
      })
  }
}

export function deleteautoposting (id) {
  return (dispatch) => {
    callApi(`autoposting/:${id}`, 'delete')
      .then(res => dispatch(loadAutopostingList()))
  }
}

export function editbroadcast (data) {
  console.log(data)
  return (dispatch) => {
    callApi('autoposting/edit', 'post', data)
      .then(res => dispatch(loadAutopostingList()))
  }
}
