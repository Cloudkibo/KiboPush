import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function createMenuItem (data) {
  return {
    type: ActionTypes.ADD_MENU_ITEM,
    data
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

export function updateIndexByPage (data) {
  return {
    type: ActionTypes.UPDATE_INDEX_BY_PAGE,
    data
  }
}

export function saveCurrentMenuItem (data) {
  return {
    type: ActionTypes.SAVE_CURRENT_MENUITEM,
    data: data
  }
}

export function addMenuItem (data) {
  return (dispatch) => {
    callApi('menu/createWebLink', 'post', data)
      .then(res => {
        dispatch(createMenuItem(res.payload))
        console.log('addMenuItemResponse', res)
      })
  }
}

export function fetchMenu (setMenu) {
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

export function getIndexBypage (pageId, handleIndexByPage) {
  return (dispatch) => {
    callApi(`menu/indexByPage`, 'post', {pageId: pageId}).then(res => {
      dispatch(updateIndexByPage(res.payload))
      console.log('updateIndexByPage', res)
      handleIndexByPage(res)
    })
  }
}

export function saveMenu (data, handleSaveMenu, msg) {
  return (dispatch) => {
    callApi('menu/create', 'post', data).then(res => {
      if (res.status === 'success') {
        msg.success('Menu saved successfully')
      } else {
        dispatch(saveMenuFailure(res))
        if (res.description) {
          var description = JSON.parse(res.description)
          if (description.message) {
            msg.error(description.message)
          } else {
            msg.error(res.description)
          }
        } else {
          msg.error('Failed to save Menu')
        }
      }
      handleSaveMenu(res)
    })
  }
}
export function removeMenu (data, handleRemoveMenu, msg) {
  return (dispatch) => {
    callApi('menu/create', 'post', data).then(res => {
      if (res.status === 'success') {
        msg.success('Menu has been reset')
        handleRemoveMenu()
      } else {
        msg.error('Failed to reset menu')
      }
    })
  }
}
