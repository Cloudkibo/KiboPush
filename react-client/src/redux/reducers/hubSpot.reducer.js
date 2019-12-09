import * as ActionTypes from '../constants/constants'


export function hubSpotInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_hubSpotForm:
      return Object.assign({}, state, {
        hubSpotForms: action.data
      })
      case ActionTypes.SHOW_hubspot_form_COLUMNS:
      return Object.assign({}, state, {
        columns: action.data
      })
      case ActionTypes.SHOW_showHubspotColumns:
      return Object.assign({}, state, {
        Hubspotcolumns: action.data
      })
      case ActionTypes.EMPTY_hubspotForm_FIELDS:
      return Object.assign({}, state, {
        columns: undefined
      })

    default:
      return state
  }
}