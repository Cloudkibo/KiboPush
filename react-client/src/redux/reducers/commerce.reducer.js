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
    case ActionTypes.UNINSTALL_SHOPIFY:
      return Object.assign({}, state, {
        store: null
      })
    case ActionTypes.CHECK_SHOP_PERMISSIONS:
      return Object.assign({}, state, {
        shopPermissions: action.data
      })
    case ActionTypes.FETCH_BUSINESS_ACCOUNTS:
      return Object.assign({}, state, {
        businessAccounts: action.data
      })
    default:
      return state
  }
}
