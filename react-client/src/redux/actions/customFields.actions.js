import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export const updateSingleCustomField = (data) => {
  return {
    type: ActionTypes.UPDATE_CUSTOM_FIELD,
    data
  }
}

export const addCustomField = (data) => {
  return {
    type: ActionTypes.ADD_CUSTOM_FIELD,
    data
  }
}

export const removeCustomField = (data) => {
  return {
    type: ActionTypes.REMOVE_CUSTOM_FIELD,
    data
  }
}

export const updateCustomFieldValue = (data) => {
  return {
    type: ActionTypes.UPDATE_CUSTOM_FIELD_VALUE,
    data
  }
}

export const clearCustomFieldValues = () => {
  return {
    type: ActionTypes.CLEAR_CUSTOM_FIELD_VALUES
  }
}

export const getCustomFieldlist = (data) => {
  return {
    type: ActionTypes.LOAD_CUSTOM_FIELDS,
    data
  }
}

export const getCustomFieldSubscriber = (data) => {
  return {
    type: ActionTypes.GET_CUSTOM_FIELD_SUBSCRIBER,
    data
  }
}

export function loadCustomFields () {
  console.log('Actions for getting custom fields')
  return (dispatch) => {
    callApi('custom_fields').then(res => {
      if (res.status === 'success' && res.payload) {
        dispatch(getCustomFieldlist(res.payload))
      } else {
        console.log('Error in loading Tags', res)
      }
    })
  }
}

export function createCustomField (customField, handleResponse) {
  console.log('Actions for creating new Custom field', customField)
  return (dispatch) => {
    callApi('custom_fields', 'post', customField)
      .then(res => {
        console.log('new custom field created', res)
        // dispatch(loadCustomFields())
        if (handleResponse) {
          handleResponse(res)
        }
      })
  }
}

export function updateCustomField (payload, handleResponse) {
  console.log('Actions for updating custom field', payload)
  return (dispatch) => {
    callApi('custom_fields/update', 'post', payload)
      .then(res => {
        if (handleResponse) {
          handleResponse(res)
        }
        // if (res.status === 'success' && res.payload) {
        //   dispatch(loadCustomFields())
        // }
      })
  }
}

export function deleteCustomField (customFieldId, msg) {
  console.log('Action for delete custom field')
  return (dispatch) => {
    callApi('custom_fields/delete/', 'post', {customFieldId: customFieldId})
    .then(res => {
      if (res.status === 'success') {
        console.log('custom field removed', res)
        msg.success(`Custom Field removed successfully`)
        // dispatch(loadCustomFields())
      } else {
        if (res.status === 'failed' && res.description) {
          msg.error(`Unable to delete Custom field. ${res.description}`)
        } else {
          msg.error('Unable to delete Custom Field')
        }
      }
    })
  }
}

export function setCustomFieldValue (body, handleResponse) {
  return () => {
    callApi('custom_field_subscribers/set_custom_field_value', 'post', body)
    .then(res => {
      handleResponse(res, body)
    })
  }
}

export function getCustomFieldValue (subscriberid) {
  return (dispatch) => {
    callApi('custom_field_subscribers/get_custom_field_subscriber/'+subscriberid, 'get')
    .then(res => {
      console.log('res.payload', res.payload)
      if (res.status === 'success' && res.payload) {
        dispatch(getCustomFieldSubscriber({
          subscriberId: subscriberid,
          customFields: res.payload
        }))
      }
    })
  }
}

export function getCustomFieldSubscribers () {
  return (dispatch) => {
    callApi('custom_field_subscribers/get_custom_field_subscribers/', 'get')
    .then(res => {
      console.log('res.payload', res.payload)
      if (res.status === 'success' && res.payload) {
        dispatch(getCustomFieldSubscriber(res.payload))
      }
    })
  }
}
