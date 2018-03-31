import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updateTagsList (data) {
  console.log('Data Fetched From Tags', data)
  return {
    type: ActionTypes.LOAD_TAGS_LIST,
    data
  }
}

export function loadTags () {
  console.log('Actions for loading subscriber Tags')
  return (dispatch) => {
    callApi('tags').then(res => {
      if (res.status === 'success' && res.payload) {
        dispatch(updateTagsList(res.payload))
      } else {
        console.log('Error in loading Tags', res)
      }
    })
  }
}
export function assignTags (data, handleResponse, msg) {
  console.log('Actions for saving subscriber Tags', data)
  return (dispatch) => {
    callApi('tags/assign', 'post', data)
    .then(res => {
      if (res.status === 'success') {
        msg.success(`${res.description}`)
      } else {
        if (res.status === 'failed' && res.description) {
          msg.error(`Unable to assign tags. ${res.description}`)
        } else {
          msg.error('Unable to assign tags')
        }
      }
      handleResponse()
    })
  }
}
export function unassignTags (data, handleResponse, msg) {
  console.log('Actions for saving subscriber Tags', data)
  return (dispatch) => {
    callApi('tags/unassign', 'post', data)
    .then(res => {
      if (res.status === 'success') {
        msg.success(`${res.description}`)
      } else {
        if (res.status === 'failed' && res.description) {
          msg.error(`Unable to unassign tags. ${res.description}`)
        } else {
          msg.error('Unable to unassign tags')
        }
      }
      handleResponse()
    })
  }
}
export function createTag (tag, handleResponse, msg) {
  console.log('Actions for saving new subscriber Tag', tag)
  return (dispatch) => {
    callApi('tags', 'post', {tag: tag})
      .then(res => {
        if (res.status === 'success' && res.payload) {
          dispatch(loadTags(res.payload))
        } else {
          msg.error('Error in Creating Tag')
        }
        handleResponse()
      })
  }
}
