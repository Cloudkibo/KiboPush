import * as ActionTypes from '../constants/constants'

const initialState = {
  uploadedContacts: [],
  invalidContactsCount: 0,
  validContactsCount: 0,
  fileUploaded: false
}

export function contactsInfo (state = initialState, action) {
  const contacts = JSON.parse(JSON.stringify(state.uploadedContacts))
  let index = -1
  console.log('concatcs reducer state', state)
  console.log('concatcs reducer action', action)
  switch (action.type) {
    case ActionTypes.FETCH_CONTACT_LISTS:
      return Object.assign({}, state, {
        contactLists: [{_id: 'master', 'name': 'Master'}].concat(action.data),
      })
    case ActionTypes.UPDATE_CONTACT:
      let currentContacts = state.contacts
      if (currentContacts) {
        index = currentContacts.findIndex((contact) => contact._id === action.id)
        if (index >= 0) {
          let keys = Object.keys(action.data)
          for (let i = 0; i < keys.length; i++) {
            currentContacts[index][keys[i]] = action.data[keys[i]]
          }
        }
      }
      return Object.assign({}, state, {
        contacts: currentContacts ? [...currentContacts] : currentContacts
      })
    case ActionTypes.LOAD_CONTACTS_LIST:
      return Object.assign({}, state, {
        contacts: action.contacts,
        count: action.count
      })

    case ActionTypes.ADD_CONTACT:
      return Object.assign({}, state, {
        uploadedContacts: [...state.uploadedContacts, action.data],
        validContactsCount: state.validContactsCount + 1
      })

    case ActionTypes.DELETE_ALL_INVALID_CONTACTS:
      const records = contacts.filter((item) => item.status === 'Valid')
      return Object.assign({}, state, {
        uploadedContacts: records,
        invalidContactsCount: 0
      })

    case ActionTypes.DELETE_ALL_CONTACTS:
      return Object.assign({}, state, {
        uploadedContacts: [],
        invalidContactsCount: 0,
        validContactsCount: 0
      })

    case ActionTypes.SAVE_CONTACTS:
      return Object.assign({}, state, {
        uploadedContacts: [...state.uploadedContacts, ...action.data],
        validContactsCount: state.validContactsCount + action.data.filter((item) => item.status === 'Valid').length,
        invalidContactsCount: state.invalidContactsCount + action.data.filter((item) => item.status === 'Invalid').length
      })

    case ActionTypes.EDIT_CONTACT:
      index = contacts.findIndex((item) => item.number === action.data.oldNumber)
      contacts[index] = action.data
      return Object.assign({}, state, {
        uploadedContacts: contacts,
        invalidContactsCount: action.data.wasInvalid ? state.invalidContactsCount - 1 : state.invalidContactsCount,
        validContactsCount: action.data.wasInvalid ? state.validContactsCount + 1 : state.validContactsCount
      })

    case ActionTypes.DELETE_CONTACT:
      index = contacts.findIndex((item) => item.number === action.data.number)
      contacts.splice(index, 1)
      return Object.assign({}, state, {
        uploadedContacts: contacts,
        invalidContactsCount: action.data.status === 'Invalid' ? state.invalidContactsCount - 1 : state.invalidContactsCount,
        validContactsCount: action.data.status === 'Valid' ? state.validContactsCount - 1 : state.validContactsCount
      })

    default:
      return state
  }
}
