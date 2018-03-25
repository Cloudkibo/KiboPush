import * as ActionTypes from '../constants/constants'
const initialState = {
  menuitems: null,
  successMessage: null,
  errorMessage: null
}
// const initialState1 = {
//   currentMenuItem: null
// }
export function menuInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.ADD_MENU_ITEM:
      return Object.assign({}, state, {
        menuitems: [...state.menuitems, action.data]
      })
    case ActionTypes.SAVE_MENU_SUCCESS:
      return Object.assign({}, state, {
        successMessage: action.data
      })

    case ActionTypes.SAVE_MENU_FAILURE:
      return Object.assign({}, state, {
        errorMessage: action.data
      })

    case ActionTypes.UPDATE_INDEX_BY_PAGE:
      return Object.assign({}, state, {
        menuitems: action.data
      })

    case ActionTypes.SAVE_CURRENT_MENUITEM:
      return Object.assign({}, state, {
        currentMenuItem: action.data
      })

    default:
      return state
  }
}
