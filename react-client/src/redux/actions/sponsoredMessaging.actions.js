import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
import { createBrotliCompress } from 'zlib';

export function showAllSponsoredMessages (data) {
    return {
      type: ActionTypes.SHOW_SPONSORED_MESSAGES,
      data
    }
  }

export function showUpdatedData (data) {
    return {
        type: ActionTypes.UPDATE_SPONSORED_MESSAGE,
        data
    }
}

export function createdSponsoredData (data) {
    return {
        type: ActionTypes.CREATE_SPONSORED_MESSAGE,
        data
    }
}

export function fetchSponsoredMessages (){
    console.log('in fetch sponsored messages')
    return (dispatch) => {
        callApi('sponsoredmessaging').then(res => {
            console.log('response from sponsoredmessaging', res)
            if(res.status === 'success' && res.payload){
                dispatch(showAllSponsoredMessages(res.payload))
            }
        })
    }
}

export function saveDraft(id, data, msg) {
  console.log('saveDraft', data)
  return (dispatch) => {
      callApi(`sponsoredmessaging/update/${id}`, 'post', data)
        .then(res => {
          console.log('response from saveDraft', res)
          if(res.status === 'success'){
            msg.success('Information saved successfully')
            dispatch(fetchSponsoredMessages())
          } else {
            msg.error('Failed to save Information')
          }
      })
  }
}

export function updateSponsoredMessage(sponsoredMessage, key, value){
  console.log('value in updateSponoredmessage',value)
  if(key) {
    let temp = sponsoredMessage
    if(key === 'payload') {
      value = value.broadcast
    }
    return (dispatch) => {
      temp[key] = value
        dispatch(showUpdatedData(temp))
    }
  } else {
    return (dispatch) => {
      dispatch(showUpdatedData(sponsoredMessage))
    }
  }

}
export function createSponsoredMessage(cb, data){
    return (dispatch) => {
        callApi('sponsoredmessaging','post', data)
        .then(res => {
          if(res.status === 'success'){
                cb()
                dispatch(createdSponsoredData(res.payload))
            }
        })
        .catch(err => {
            console.log(`${JSON.stringify(err)}`)
        })
    }
}

export function deleteSponsoredMessage(id, msg){
    return (dispatch) => {
        callApi(`sponsoredmessaging/${id}`,'delete')
        .then(res => {
            if(res.status === 'success'){
                msg.success('Sponsored Message deleted successfully')
                dispatch(fetchSponsoredMessages())
            }else{
                msg.error('Failed to delete sponsored message')
            }
        })
    }
}
