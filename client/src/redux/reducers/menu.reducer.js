import * as ActionTypes from '../constants/constants'
const initialState = {
  menuitems: []
}
export function menuInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.ADD_MENU_ITEM:
      return Object.assign({}, state, {
        menuitems: [...state.menuitems, action.data]
      })
    default:
      return state
  }
}

export function indexByPage (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_INDEX_BY_PAGE:
      return Object.assign({}, state, {
        menuitems: [...state.menuitems, action.data]
      })
    default:
      return state
  }
}
