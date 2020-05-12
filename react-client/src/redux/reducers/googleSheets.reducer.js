import * as ActionTypes from '../constants/constants'

export function googleSheetsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_WORKSHEETS:
      return Object.assign({}, state, {
        worksheets: action.data,
      })
    case ActionTypes.SHOW_SPREADSHEETS:
      return Object.assign({}, state, {
        spreadsheets: action.data,
        reconnectWarning: ''
      })
    case ActionTypes.SHOW_COLUMNS:
      return Object.assign({}, state, {
        columns: action.data
      })
    case ActionTypes.EMPTY_FIELDS:
      return Object.assign({}, state, {
        worksheets: undefined,
        columns: undefined
      })
    case ActionTypes.SHOW_INTEGRATION_WARNING:
      return Object.assign({}, state, {
        reconnectWarning: action.data,
      })
    default:
      return state
  }
}
