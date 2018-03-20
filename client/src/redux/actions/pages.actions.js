/**
 * Created by sojharo on 21/07/2017.
 */
import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updatePagesList (data) {
  return {
    type: ActionTypes.LOAD_PAGES_LIST,
    data
  }
}

export function updateOtherPages (data) {
  return {
    type: ActionTypes.FETCH_PAGES_LIST,
    data
  }
}

export function userpageconnect (data) {
  return {
    type: ActionTypes.PAGE_CONNECT_WARNING,
    pages: data.pages,
    page_connected: data.msg
  }
}
export function pageNotPublished (data) {
  return {
    type: ActionTypes.PAGE_NOT_PUBLISHED,
    data
  }
}

export function loadMyPagesList () {
  // var userid = ''// this will be the _id of user object
  return (dispatch) => {
    callApi(`pages/allpages`).then(res => {
      console.log('res.payload', res.payload)
      dispatch(updatePagesList(res.payload))
    })
  }
}

export function enablePage (page) {
  return (dispatch) => {
    callApi(`pages/enable/`, 'post', page)
      .then(res => {
        console.log('res.status', res)
        if (res.status === 'failed' && res.description === 'not published') {
          dispatch(pageNotPublished(res.description))
        } else if (res.payload && res.payload.msg) {
          // the page is already connected by some other user
          dispatch(userpageconnect(res.payload))
        } else {
          dispatch(updateOtherPages(res.payload.pages))
        }
      })
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

export function removePage (page) {
  return (dispatch) => {
    callApi('pages/disable', 'post', page)
      .then(res => dispatch(updatePagesList(res.payload)))
  }
}

export function removePageInAddPage (page) {
  return (dispatch) => {
    callApi('pages/disable', 'post', page)
    .then(res => dispatch(updateOtherPages(res.payload)))
  }
}

export function loadOtherPagesList () {
  return (dispatch) => {
    callApi('pages/otherPages')
      .then(res => dispatch(updateOtherPages(res.payload)))
  }
}
