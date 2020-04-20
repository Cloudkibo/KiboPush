import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function showAllSponsoredMessages (data) {
    return {
      type: ActionTypes.SHOW_SPONSORED_MESSAGES,
      sponsoredMessages: data.sponsoredMessages,
      reconnectFbRequired: !data.permissionsGiven,
      count: data.count,
      refreshRequired: false
    }
  }

export function addToSponsoredMessages (data) {
    return {
      type: ActionTypes.ADD_TO_SPONSORED_MESSAGES,
      sponsoredMessages: data.sponsoredMessage,
      message: data.message
    }
  }

export function updateSponsoredMessagesListItemStatus (data) {
  return {
    type: ActionTypes.UPDATE_SPONSORED_MESSAGES_LIST_ITEM,
    sponsoredMessage: data.sponsoredMessage,
    status: data.status
  }
}

export function showAdAccounts (data) {
  return {
    type: ActionTypes.SHOW_AD_ACCOUNTS,
    data
  }
}

export function showCampaigns (data) {
  return {
    type: ActionTypes.SHOW_CAMPAIGNS,
    data
  }
}

export function showAdSets (data) {
  return {
    type: ActionTypes.SHOW_AD_SETS,
    data
  }
}

export function insights (data) {
  return {
      type: ActionTypes.GET_INSIGHTS,
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

export function fetchSponsoredMessages (data) {
    console.log('data for fetchSponsoredMessages', data)
    return (dispatch) => {
        callApi('sponsoredmessaging/fetchSponsoredMessages', 'post', data).then(res => {
            console.log('response from sponsoredmessaging', res)
            if(res.status === 'success' && res.payload){
                dispatch(showAllSponsoredMessages(res.payload))
            }
        })
    }
}

export function saveDraft(id, data, msg, cb) {
  console.log('saveDraft', data)
  return (dispatch) => {
      callApi(`sponsoredmessaging/update/${id}`, 'post', data)
        .then(res => {
          console.log('response from saveDraft', res)
          if (res.status === 'success') {
            msg.success('Saved Successfully')
            if (cb) {
              cb()
            }
          } else {
            msg.error(res.payload)
          }
      })
  }
}

export function updateSponsoredMessage(sponsoredMessage, key, value, edit) {
  console.log('value in updateSponoredmessage',value)
  return (dispatch) => {
    if (edit) {
      let temp = sponsoredMessage
      let fields = Object.keys(edit)
      for (let i = 0; i < fields.length; i++ ) {
        temp[fields[i]] = edit[fields[i]]
      }
      if (edit.targeting) {
        temp.targeting = {
          gender: edit.targeting.gender,
          minAge: edit.targeting.minAge,
          maxAge: edit.targeting.maxAge
        }
      }
      dispatch(showUpdatedData(temp))
    } else if (key) {
      let temp = sponsoredMessage
      if(key === 'payload') {
        value = value.broadcast
      }
      temp[key] = value
      dispatch(showUpdatedData(temp))
    } else {
      dispatch(showUpdatedData(sponsoredMessage))
    }
  }
}

export function createSponsoredMessage(data, cb) {
  console.log('data for createSponsoredMessage', data)
    return (dispatch) => {
        callApi('sponsoredmessaging', 'post', data)
        .then(res => {
          console.log('response from createSponsoredMessage', res)
          if(res.status === 'success'){
              dispatch(createdSponsoredData(res.payload))
              cb()
            }
        })
        .catch(err => {
            console.log(`${JSON.stringify(err)}`)
        })
    }
}

export function deleteSponsoredMessage(id, msg, searchValue, statusValue, pageValue){
  let data = {
    last_id: 'none',
    number_of_records: 10,
    first_page: 'first',
    search_value: searchValue,
    status_value: statusValue,
    page_value: pageValue
  }
    return (dispatch) => {
        callApi(`sponsoredmessaging/${id}`,'delete')
        .then(res => {
            if(res.status === 'success'){
                msg.success('Sponsored Message deleted successfully')
                dispatch(fetchSponsoredMessages(data))
          }   else{
                msg.error('Failed to delete sponsored message')
            }
        })
    }
}

export function send(data, handleResponse) {
  return (dispatch) => {
    callApi(`sponsoredmessaging/send/${data._id}`, 'post', data)
      .then(res => {
        handleResponse(res)
      })
   }
}

export function getInsights (adId) {
  return (dispatch) => {
    callApi(`sponsoredmessaging/insights/${adId}`, 'get')
      .then(res => {
        console.log('response from insights', res)
        if (res.status === 'success') {
          dispatch(insights(res.payload[0]))
        } else {
          console.log(res)
        }
      })
   }
}
export function fetchAdAccounts () {
  return (dispatch) => {
    callApi(`sponsoredmessaging/adAccounts`, 'get')
      .then(res => {
        console.log('response from fetchAdAccounts', res)
        if(res.status === 'success') {
          dispatch(showAdAccounts(res.payload))
        }
      })
   }
}
export function fetchCampaigns (id) {
  console.log('data for fetchCampaigns', id)
  return (dispatch) => {
    callApi(`sponsoredmessaging/campaigns/${id}`, 'get')
      .then(res => {
        console.log('response from fetchCampaigns', res)
        if(res.status === 'success') {
          dispatch(showCampaigns(res.payload))
        }
      })
   }
}
export function fetchAdSets (id) {
  console.log('data for fetchCampaigns', id)
  return (dispatch) => {
    callApi(`sponsoredmessaging/adSets/${id}`, 'get')
      .then(res => {
        console.log('response from fetchAdSets', res)
        if(res.status === 'success') {
          dispatch(showAdSets(res.payload))
        }
      })
   }
}
export function saveCampaign (data, cb) {
  console.log('data for saveCampaign', data)
  return (dispatch) => {
    callApi(`sponsoredmessaging/campaigns`, 'post', data)
      .then(res => {
        console.log('response for saveCampaign', res)
        cb(res)
      })
   }
}
export function saveAdAccount(id, data, cb) {
  console.log('data for saveAdAccount', data)
  return (dispatch) => {
    callApi(`sponsoredmessaging/update/${id}`, 'post', data)
      .then(res => {
        console.log('response from saveAdAccount', res)
        cb (res)
    })
  }
}
export function saveAdSet(data, cb) {
  console.log('data for saveAdSet', data)
  return (dispatch) => {
    callApi(`sponsoredmessaging/adSets`, 'post', data)
      .then(res => {
        console.log('response from saveAdSet', res)
        cb (res)
    })
  }
}
