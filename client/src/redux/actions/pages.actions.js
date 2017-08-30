/**
 * Created by sojharo on 21/07/2017.
 */
import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updatePagesList (data) {
  console.log('Update my Pages', data)
  return {
    type: ActionTypes.LOAD_PAGES_LIST,
    data
  }
}

export function updateOtherPages (data) {
  console.log('Other Pages', data)
  return {
    type: ActionTypes.FETCH_PAGES_LIST,
    data
  }
}

export function enablePage (page) {
  console.log('enablePage called')
  console.log(page)
  return (dispatch) => {
    callApi(`pages/enable/`, 'post', page)
      .then(res => dispatch(updateOtherPages(res.payload)))
  }
}
export function addPages () {
  return (dispatch) => {
    callApi(`pages/addpages/`).then(res => {
      dispatch(updateOtherPages(res.payload))
      console.log('Response From Add Pages', res.payload)
    })
  }
}

export function loadMyPagesList () {
  console.log('loadPagesList called')

  // var userid = ''// this will be the _id of user object
  return (dispatch) => {
    callApi(`pages`).then(res => dispatch(updatePagesList(res.payload)))
  }
}

export function removePage (page) {
  console.log('loadPagesList called')
  return (dispatch) => {
    callApi('pages/disable', 'post', page)
      .then(res => {
        dispatch(updatePagesList(res.payload))
        dispatch(updateOtherPages(res.payload))
      })
  }
}
export function loadOtherPagesList () {
  console.log('loadOtherPagesList called')
  return (dispatch) => {
    callApi('pages/otherPages')
      .then(res => dispatch(updateOtherPages(res.payload)))
  }
}
