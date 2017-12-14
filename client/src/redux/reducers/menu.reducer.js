import * as ActionTypes from '../constants/constants'
const initialState = {
  menuitems: null
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
      console.log('Reducer': action.data)
      return Object.assign({}, state, {
        menuitems: action.data
      })
    default:
      return state
  }
}

export function getCurrentMenuItem (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SAVE_CURRENT_MENUITEM:
      console.log('getCurrentMenuItem', action.data)
      return Object.assign({}, state, {
        currentMenuItem: action.data
      })

    default:
      return state
  }
}
