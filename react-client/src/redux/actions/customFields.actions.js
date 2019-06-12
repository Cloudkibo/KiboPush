import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export const getCustomFieldlist = (data) => {
  return {
    type: ActionTypes.LOAD_CUSTOM_FIELDS,
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
        dispatch(loadCustomFields())
        handleResponse(res)
      })
  }
}

export function updateCustomField (payload, msg) {
  console.log('Actions for updating custom field', payload)
  return (dispatch) => {
    callApi('custom_fields/update', 'post', payload)
      .then(res => {
        if (res.status === 'success' && res.payload) {
          msg.success('Custom Field has been updated')
          dispatch(loadCustomFields())
        } else {
          if (res.status === 'failed' && res.description) {
            msg.error(`Unable to edit custom field. ${res.description}`)
          } else {
            msg.error('Unable to edit custom field')
          }
        }
      })
  }
}

export function deleteCustomField (customFieldId, msg) {
  console.log('Action for delete custom field')
  return (dispatch) => {
    callApi('custom_fields/delete/', 'post', {customFieldId: customFieldId})
    .then(res => {
      if (res.status === 'success') {
        msg.success(`${res.description}`)
        dispatch(loadCustomFields())
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
      handleResponse(res)
    })
  }
}

export function getCustomFieldValue (subscriberid, handleResponse) {
  return () => {
    callApi('api/custom_field_subscribers/get_custom_field_subscriber/'+subscriberid, 'get')
    .then(res => {
      handleResponse(res)
    })
  }
}
