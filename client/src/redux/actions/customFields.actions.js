import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export const getCustomFieldlist = (data) => {
  console.log('all custom fields', data)
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

export function createCustomField (customField, msg) {
  console.log('Actions for creating new Custom field', customField)
  return (dispatch) => {
    callApi('custom_fields', 'post', customField)
      .then(res => {
        if (res.status === 'success' && res.payload) {
          dispatch(loadCustomFields())
          msg.success('New Custom Field Created')
        } else {
          dispatch(loadCustomFields())
          msg.error(res.description)
        }
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
          msg.error(`Unable to delete tag. ${res.description}`)
        } else {
          msg.error('Unable to delete tag')
        }
      }
    })
  }
}
