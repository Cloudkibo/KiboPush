/**
 * Created by sojharo on 21/07/2017.
 */
import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updatePagesList(data) {
  return {
    type: ActionTypes.LOAD_PAGES_LIST,
    data
  }
}

export function updatePagesListNew(data) {
  return {
    type: ActionTypes.LOAD_PAGES_LIST_NEW,
    pages: data.pages,
    count: data.count
  }
}

export function updateSubscriberReachEstimation(data) {
  return {
    type: ActionTypes.UPDATE_REACH_ESTIMATION,
    data
  }
}

export function updateOtherPages(data) {
  return {
    type: ActionTypes.FETCH_PAGES_LIST,
    data
  }
}

export function userpageconnect(data) {
  return {
    type: ActionTypes.PAGE_CONNECT_WARNING,
    pages: data.pages,
    page_connected: data.msg
  }
}
export function pageNotPublished(data) {
  return {
    type: ActionTypes.PAGE_NOT_PUBLISHED,
    data
  }
}

export function updateCurrentPage(data) {
  console.log('in updateCurrentPage')
  return {
    type: ActionTypes.UPDATE_CURRENT_PAGE,
    data
  }
}

export function loadMyPagesList() {
  console.log('load my page List')
  // var userid = ''// this will be the _id of user object
  return (dispatch) => {
    callApi(`pages/allpages`).then(res => {
      console.log('res.payload', res)
      dispatch(updatePagesList(res.payload))
    })
  }
}

export function loadMyPagesListNew (data, cb) {
  // var userid = ''// this will be the _id of user object
  return (dispatch) => {
    callApi(`pages/allConnectedPages`, 'post', data).then(res => {
      console.log('res.payload', res)
      if (res.status === 'success') {
        if (cb) {
          cb(res.payload)
        }
      }
      dispatch(updatePagesListNew(res.payload))
      if (cb && res.payload) {
        cb(res.payload.count)
      }
    })
  }
}

export function enablePage (page, showErrorDialog, alertMsg) {
  return (dispatch) => {
    callApi(`pages/enable/`, 'post', page)
      .then(res => {
        console.log('response from connect page', res)
        if (res.type === 'invalid_permissions' && showErrorDialog) {
          showErrorDialog()
        } else if (res.status === 'failed') {
          if (alertMsg) {
            alertMsg.error(res.description)
          }
          dispatch(pageNotPublished(res.description))
        } else if (res.payload && res.payload.msg) {
          console.log('else if condition')
          // the page is already connected by some other user
          // console.log('res.payload.msg', res.payload.msg)
          dispatch(userpageconnect(res.payload))
          // dispatch(addPages())
        } else {
          if (res.payload.adminError) {
            alertMsg.info(res.payload.adminError)
          } else {
            alertMsg.success(res.payload)
          }
          dispatch(addPages())
          dispatch(loadMyPagesListNew({ last_id: 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: { search_value: '' } }))
        }
      })
  }
}

export function addPages(handleLoader) {
  return (dispatch) => {
    callApi(`pages/addpages/`).then(res => {
      if (handleLoader) {
        handleLoader()
      }
      dispatch(updateOtherPages(res.payload))
      console.log('Response From Add Pages', res.payload)
    })
  }
}

export function removePage(page, msg) {
  console.log('page data: ', page)
  return (dispatch) => {
    callApi('pages/disable', 'post', page)
      .then(res => {
        if (res.status !== 'success') {
          msg.error(res.description || 'Failed to remove page')
        }
        console.log('res.payload', res.payload)
        dispatch(loadMyPagesListNew({ last_id: 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: { search_value: '' } }))
      })
  }
}

export function removePageInAddPage(page, msg) {
  return (dispatch) => {
    callApi('pages/disable', 'post', page)
      .then(res => {
        if (res.status !== 'success') {
          msg.error(res.description || 'Failed to remove page')
        }
        console.log('res.payload', res.payload)
        dispatch(addPages())
        dispatch(loadMyPagesListNew({ last_id: 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: { search_value: '' } }))
      })
  }
}

export function getSubscriberReachEstimation(page, subscribers) {
  return (dispatch) => {
    console.log('in getSubscriberReachEstimation')
    if (!page.subscriberLimitForBatchAPI || subscribers.length < page.subscriberLimitForBatchAPI) {
      console.log('page subscribers less than subscriberLimitForBatchAPI')
      dispatch(updateSubscriberReachEstimation(subscribers.length))
    } else {
      dispatch(updateSubscriberReachEstimation(null))
      callApi(`broadcasts/retrieveReachEstimation/${page._id}`)
        .then(res => {
          console.log('retrieveReachEstimation res.payload', res.payload)
          if (res.status === 'success') {
            dispatch(updateSubscriberReachEstimation(res.payload.reach_estimation))
          }
        })
    }
  }
}

export function loadOtherPagesList() {
  return (dispatch) => {
    callApi('pages/otherPages')
      .then(res => dispatch(updateOtherPages(res.payload)))
  }
}

export function saveDomains() {
  return (dispatch) => {
    callApi('pages/whitelistDomain')
      .then(res => dispatch(updateOtherPages(res.payload)))
  }
}

export function refreshPages(handleLoader, msg) {
  return (dispatch) => {
    callApi('pages/refreshPages', 'post')
      .then(res => {
        if (res.status === 'success') {
          dispatch(addPages(handleLoader))
        } else {
          if (handleLoader) {
            handleLoader()
            msg.error(res.description || 'Unable to refresh pages')
          }
        }
      })
  }
}
