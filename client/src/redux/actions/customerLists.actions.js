/**
 * Created by sojharo on 21/07/2017.
 */
import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function showCustomerLists (data) {
  return {
    type: ActionTypes.LOAD_CUSTOMER_LISTS,
    data
  }
}

export function showListDetails (data) {
  return {
    type: ActionTypes.LOAD_LIST_DETAILS,
    data
  }
}

export function addList (data, msg) {
  return {
    type: ActionTypes.ADD_NEW_LIST,
    data
  }
}

export function saveCurrentList (list) {
  return {
    type: ActionTypes.CURRENT_CUSTOMER_LIST,
    data: list
  }
}

export function clearCurrentList () {
  return {
    type: ActionTypes.CLEAR_CURRENT_CUSTOMER_LIST,
    data: null
  }
}

export function loadCustomerLists () {
  return (dispatch) => {
    callApi('lists/allLists')
      .then(res => dispatch(showCustomerLists(res.payload)))
  }
}

export function getParentList (id, handleResponse, msg) {
  return (dispatch) => {
    callApi(`lists/viewList/${id}`)
      .then(res => {
        console.log('response from viewList', res)
        if (res.status !== 'success') {
          if (res.status === 'failed' && res.description) {
            msg.error(`Unable to get list. ${res.description}`)
          } else {
            msg.error('Unable to get list')
          }
        }
        handleResponse(res)
      })
  }
}

export function loadListDetails (id) {
  return (dispatch) => {
    callApi(`lists/viewList/${id}`)
      .then(res => {
        console.log('loadListDetails response', res)
        if (res.status === 'success') {
          dispatch(showListDetails(res.payload))
        }
      })
  }
}

export function createSubList (list, msg, handleCreateSubList) {
  return (dispatch) => {
    callApi('lists/createList', 'post', list)
      .then(res => {
        console.log('response from createSubList', res)
        if (res.status === 'success' && res.payload) {
          msg.success('List created successfully')
        } else {
          if (res.status === 'failed' && res.description) {
            msg.error(`Unable to save list. ${res.description}`)
          } else {
            msg.error('Unable to save list')
          }
        }
        handleCreateSubList(res)
      })
  }
}

export function editList (list, msg, handleEditList) {
  return (dispatch) => {
    callApi('lists/editList', 'post', list)
      .then(res => {
        console.log('response from editList', res)
        if (res.status === 'success' && res.payload) {
          msg.success('List saved successfully')
        } else {
          if (res.status === 'failed' && res.description) {
            msg.error(`Unable to save list. ${res.description}`)
          } else {
            msg.error('Unable to save list')
          }
        }
        handleEditList(res)
      })
  }
}

export function deleteList (id, msg) {
  return (dispatch) => {
    callApi(`lists/deleteList/${id}`, 'delete')
      .then(res => {
        if (res.status === 'success') {
          msg.success('List deleted')
          dispatch(loadCustomerLists())
        } else {
          if (res.status === 'failed' && res.description) {
            msg.error(`Failed to delete list. ${res.description}`)
          } else {
            msg.error('Failed to delete list')
          }
        }
      })
  }
}
