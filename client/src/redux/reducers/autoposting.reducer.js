import * as ActionTypes from '../constants/constants'

export function autopostingInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.FETCH_AUTOPOSTING_LIST:
      return Object.assign({}, state, {
        autopostingData: action.autoposting
      })

    default:
      return state
  }
}
