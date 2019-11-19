import * as ActionTypes from '../constants/constants'

export function googleSheetsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_WORKSHEETS:
      return Object.assign({}, state, {
        worksheets: action.data
      })
    case ActionTypes.SHOW_SPREADSHEETS:
      return Object.assign({}, state, {
        spreadsheets: action.data
      })
    case ActionTypes.SHOW_COLUMNS:
      return Object.assign({}, state, {
        columns: action.data
      })
    default:
      return state
  }
}
