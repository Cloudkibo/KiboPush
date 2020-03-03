import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updateTagsList (data) {
  console.log('Data Fetched From Tags', data)
  return {
    type: ActionTypes.LOAD_TAGS_LIST,
    data
  }
}
export function loadSubscriberTags (data) {
  console.log('Subscriber Tags', data)
  return {
    type: ActionTypes.LOAD_SUBSCRIBER_TAGS,
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
        console.log('tag assigned successfully', res)
        msg.success(`${res.description}`)
      } else {
        if (res.status === 'failed' && res.description) {
          msg.error(`Unable to assign tags. ${res.description}`)
        } else {
          msg.error('Unable to assign tags')
        }
      }
      if (handleResponse) {
        handleResponse() 
      }
    })
  }
}
export function unassignTags (data, handleResponse, msg) {
  console.log('Actions for unassignTags', data)
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
      if (handleResponse) {
        handleResponse()
      }
    })
  }
}
export function createTag (tag, handleResponse) {
  console.log('Actions for saving new subscriber Tag', tag)
  return (dispatch) => {
    callApi('tags', 'post', {tag: tag})
      .then(res => {
        console.log('createTag res', res)
        if (handleResponse) {
          handleResponse(res)
        }
        if (res.status === 'success' && res.payload) {
          dispatch(loadTags())
        } else {
          dispatch(loadTags())
        }
      })
  }
}
export function getSubscriberTags (id, msg) {
  console.log('Actions for getting subscriber Tag', id)
  return (dispatch) => {
    callApi('tags/subscribertags/', 'post', {subscriberId: id})
      .then(res => {
        if (res.status === 'success' && res.payload) {
          console.log('getSubscribersTag success', res.payload)
          dispatch(loadSubscriberTags(res.payload))
        } else {
          if (msg) {
            console.log('Error in getting subscriber tags', res)
            dispatch(loadSubscriberTags([]))
            // msg.error('Error in getting subscriber tags')
          }
        }
      })
  }
}
export function deleteTag (tag, msg,loadsubscriberData) {
  console.log('Actions for deleteing Tag', tag)
  return (dispatch) => {
    callApi('tags/delete/', 'post', {tag})
      .then(res => {
        if (res.status === 'success') {
          msg.success(`${res.payload}`)
          if (loadsubscriberData) {
            loadsubscriberData({tag_value: false})
          }
          dispatch(loadTags())
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
export function renameTag (payload, handleEdit,loadsubscriberData) {
  console.log('Actions for renaming Tag', payload)
  return (dispatch) => {
    callApi('tags/rename/', 'post', payload)
      .then(res => {
        handleEdit(res)
        console.log('renameTag response', res)
        if (res.status === 'success' && res.payload) {
          if (loadsubscriberData) {
            loadsubscriberData({tag_value: true})
          }
          dispatch(loadTags())
        }
      })
  }
}
