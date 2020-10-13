import * as ActionTypes from '../constants/constants'

const initialState = {
  store: null
  // store: {
  //   storeType: 'bigcommerce',
  //   name: 'kibo test store'
  // }
}

export function commerceInfo(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.FETCH_STORE:
      return Object.assign({}, state, {
        store: action.data
      })
    default:
      return state
  }
}
