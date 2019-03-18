import * as ActionTypes from '../constants/constants'

// const initialState = {
//   pages: [],
//   otherPages: []
// }

export function contactsInfo (state = [], action) {
  switch (action.type) {
    case ActionTypes.LOAD_CONTACTS_LIST:
      return Object.assign({}, state, {
        contacts: action.contacts,
        count: action.count
      })
    default:
      return state
  }
}
