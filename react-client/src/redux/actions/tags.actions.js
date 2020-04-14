import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function clearSubscriberTags () {
  return {
    type: ActionTypes.CLEAR_SUBSCRIBER_TAGS
  }
}

export function assignTag (data) {
  console.log('assignTag', data)
  return {
    type: ActionTypes.ASSIGN_TAG,
    data
  }
}

export function unassignTag (data) {
  console.log('unassignTag', data)
  return {
    type: ActionTypes.UNASSIGN_TAG,
    data
  }
}

export function addTag (data) {
  console.log('addTag', data)
  return {
    type: ActionTypes.ADD_TAG,
    data
  }
}

export function removeTag (data) {
  console.log('removeTag', data)
  return {
    type: ActionTypes.REMOVE_TAG,
    data
  }
}

export function updateTag (data) {
  console.log('update', data)
  return {
    type: ActionTypes.UPDATE_TAG,
    data
  }
}

export function updateTagsList (data) {
  console.log('Data Fetched From Tags', data)
  return {
    type: ActionTypes.LOAD_TAGS_LIST,
    data
  }
}
export function loadSubscriberTags (subscriberId, tags) {
  console.log('Subscriber Tags', tags)
  return {
    type: ActionTypes.LOAD_SUBSCRIBER_TAGS,
    data: {
      subscriberId,
      tags
    }
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
        // if (res.status === 'success' && res.payload) {
        //   dispatch(loadTags())
        // } else {
        //   dispatch(loadTags())
        // }
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
          dispatch(loadSubscriberTags(id, res.payload))
        } else {
          if (msg) {
            console.log('Error in getting subscriber tags', res)
            dispatch(loadSubscriberTags(id, []))
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
          //dispatch(loadTags())
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
        if (handleEdit) {
          handleEdit(res)
        }
        console.log('renameTag response', res)
        if (res.status === 'success' && res.payload) {
          if (loadsubscriberData) {
            loadsubscriberData({tag_value: true})
          }
          //dispatch(loadTags())
        }
      })
  }
}
