import * as ActionTypes from '../constants/constants'
export function menuInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.ADD_MENU_ITEM:
      return Object.assign({}, state, {
        menuitems: [...state.menuitems, action.data]
      })
    default:
      return state
  }
}
