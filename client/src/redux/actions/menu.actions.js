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
    callApi('menu/addWebLinkMenuItem', 'post', data)
      .then(res => dispatch(createMenuItem(res.payload)))
  }
}
