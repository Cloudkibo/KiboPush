import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function createMenuItem (data) {
  return {
    type: ActionTypes.ADD_MENU_ITEM,
    data
  }
}
export function addMenuItem (data) {
  console.log('in addMenuItem', data)
  return (dispatch) => {
    callApi('menu/createWebLink', 'post', data)
      .then(res => {
        dispatch(createMenuItem(res.payload))
        console.log('addMenuItemResponse', res)
      })
  }
}
export function saveMenuSuccess (res) {
  return {
    type: ActionTypes.SAVE_MENU_SUCCESS,
    data: res
  }
}

export function saveMenuFailure (res) {
  return {
    type: ActionTypes.SAVE_MENU_FAILURE,
    data: res
  }
}

export function fetchMenu (setMenu) {
  console.log('Fetching Menu')
  return (dispatch) => {
    callApi('menu').then(res => {
      if (res.status === 'success') {
        // dispatch(sendMessageSuccess())
        console.log('Menu Fetched', res)
      } else {
        // dispatch(sendMessageFailure())
        console.log('Error Fetching Menu', res)
      }
    })
  }
}

export function updateIndexByPage (data) {
  return {
    type: ActionTypes.UPDATE_INDEX_BY_PAGE,
    data
  }
}

export function getIndexBypage (pageId, handleIndexByPage) {
  console.log('Getting Index By Page', pageId)
  return (dispatch) => {
    callApi('menu/indexByPage', 'post', {pageId: pageId}).then(res => {
      dispatch(updateIndexByPage(res.payload))
      console.log('updateIndexByPage', res)
      handleIndexByPage()
    })
  }
}

export function saveMenu (data, handleSaveMenu, msg) {
  console.log('Saving Menu', data)
  return (dispatch) => {
    callApi('menu/create', 'post', data).then(res => {
      if (res.status === 'success') {
        console.log('Menu saved successfully', res)
        msg.success('Menu saved successfully')
        handleSaveMenu()
      } else {
        dispatch(saveMenuFailure(res))
        msg.error('Failed to save Menu')
      }
    })
  }
}
export function saveCurrentMenuItem (data) {
  console.log('in saveCurrentMenuItem', data)
  return {
    type: ActionTypes.SAVE_CURRENT_MENUITEM,
    data: data
  }
}
