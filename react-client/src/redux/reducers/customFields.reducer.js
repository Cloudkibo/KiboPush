import * as ActionTypes from '../constants/constants'

export function customFieldInfo (state = {}, action) {
  console.log('customField reducer', action)
  switch (action.type) {
    case ActionTypes.ADD_CUSTOM_FIELD: {
     let customFields = state.customFields
     customFields.push(action.data)
     return Object.assign({}, state, {
        customFields: [...customFields]
      })
    }
    case ActionTypes.REMOVE_CUSTOM_FIELD: {
      let customFields = state.customFields
      let customFieldsIndex = customFields.findIndex(cf => cf._id === action.data)
      customFields.splice(customFieldsIndex, 1)
      let customFieldSubscriber = state.customFieldSubscriber
      if (customFieldSubscriber) {
        let customFieldSubscriberIndex = customFieldSubscriber.customFields.findIndex(cf => cf.customFieldId._id === action.data)
        customFieldSubscriber.customFields.splice(customFieldSubscriberIndex, 1)
      }
      return Object.assign({}, state, {
         customFields: [...customFields],
         customFieldSubscriber
       })
    }
    case ActionTypes.UPDATE_CUSTOM_FIELD: {
      let customFields = state.customFields
      let customFieldsIndex = customFields.findIndex(cf => cf._id === action.data.customFieldId)
      customFields[customFieldsIndex] = Object.assign(customFields[customFieldsIndex], action.data.updatedField)
      let customFieldSubscriber = state.customFieldSubscriber
      if (customFieldSubscriber) {
        let customFieldSubscriberIndex = customFieldSubscriber.customFields.findIndex(cf => cf.customFieldId._id === action.data.customFieldId)
        customFieldSubscriber.customFields[customFieldSubscriberIndex].customFieldId = Object.assign(customFieldSubscriber.customFields[customFieldSubscriberIndex], action.data.updatedField)
      }
      return Object.assign({}, state, {
         customFields: [...customFields],
         customFieldSubscriber
       })
    }
    case ActionTypes.LOAD_CUSTOM_FIELDS:
      return Object.assign({}, state, {
        customFields: action.data
      })
    case ActionTypes.GET_CUSTOM_FIELD_SUBSCRIBER:
      return Object.assign({}, state, {
        customFieldSubscriber: action.data
      })
    case ActionTypes.CLEAR_CUSTOM_FIELD_VALUES:
      return Object.assign({}, state, {
        customFieldSubscriber: undefined
      })
    case ActionTypes.UPDATE_CUSTOM_FIELD_VALUE: {
      if (state.customFieldSubscriber && action.data.subscriberId === state.customFieldSubscriber.subscriberId) {
        let customFieldSubscriber = state.customFieldSubscriber
        let index = customFieldSubscriber.customFields.findIndex(cf => cf.customFieldId._id === action.data.customFieldId)
        customFieldSubscriber.customFields[index].value = action.data.value
        return Object.assign({}, state, {
          customFieldSubscriber: {...customFieldSubscriber}
        })
      } else {
        return state
      }
    }
    default:
      return state
  }
}
