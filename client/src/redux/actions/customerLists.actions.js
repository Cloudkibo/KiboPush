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
export function loadCustomerLists () {
  console.log('loadCustomerLists called')
  return (dispatch) => {
    callApi('lists/allLists')
      .then(res => dispatch(showCustomerLists(res.payload)))
  }
}

export function loadListDetails (id) {
  console.log('loadListDetails called')
  return (dispatch) => {
    callApi(`lists/viewList/${id}`)
      .then(res => dispatch(showListDetails(res.payload)))
  }
}

export function showListDetails (data) {
  console.log('showListDetails', data)
  return {
    type: ActionTypes.LOAD_LIST_DETAILS,
    data
  }
}

export function addList (data, msg) {
  console.log('response from createList', data)
  return {
    type: ActionTypes.ADD_NEW_LIST,
    data
  }
}
export function createSubList (list, msg, handleCreateSubList) {
  console.log('Creating list')
  console.log(list)
  return (dispatch) => {
    callApi('lists/createList', 'post', list)
      .then(res => {
        console.log('response from createSubList', res)
        if (res.status === 'success') {
          dispatch(viewListDetails(res.payload[0]._id, handleCreateSubList, msg))
        } else {
          if (res.status === 'failed' && res.description) {
            msg.error(`Unable to save list. ${res.description}`)
          } else {
            msg.error('Unable to save list')
          }
          handleCreateSubList(res)
        }
      })
  }
}

export function editList (list, msg, handleEditList) {
  console.log('Editing list')
  console.log(list)
  return (dispatch) => {
    callApi('lists/editList', 'post', list)
      .then(res => {
        console.log('response from editList', res)
        if (res.status === 'success') {
          dispatch(viewListDetails(res.payload._id, handleEditList, msg))
        } else {
          if (res.status === 'failed' && res.description) {
            msg.error(`Unable to save list. ${res.description}`)
          } else {
            msg.error('Unable to save list')
          }
          handleEditList(res)
        }
      })
  }
}
export function saveCurrentList (list) {
  console.log('Saving Current List', list)
  return {
    type: ActionTypes.CURRENT_CUSTOMER_LIST,
    data: list
  }
}
export function deleteList (id, msg) {
  return (dispatch) => {
    callApi(`lists/deleteList/${id}`, 'delete')
      .then(res => {
        console.log('Response Delete', res)
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
export function clearCurrentList () {
  console.log('Clear Current List')
  return {
    type: ActionTypes.CLEAR_CURRENT_CUSTOMER_LIST,
    data: null
  }
}

export function viewListDetails (id, handleUpdateList, msg) {
  console.log('viewListDetails called')
  return (dispatch) => {
    callApi(`lists/viewList/${id}`)
    .then(res => {
      console.log('response from viewListDetail', res)
      if (res.status === 'success' && res.payload) {
        msg.success('List updated successfully')
        handleUpdateList(res)
      } else {
        if (res.status === 'failed' && res.description) {
          msg.error(`Unable to save list. Please try with a different condition. ${res.description}`)
        } else {
          msg.error('Unable to save list. Please try with a different condition')
        }
      }
      handleUpdateList(res)
    })
  }
}
