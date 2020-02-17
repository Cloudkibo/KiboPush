import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function showAllSponsoredMessages (data) {
    return {
      type: ActionTypes.SHOW_SPONSORED_MESSAGES,
      sponsoredMessages: data.sponsoredMessages,
      count: data.count
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
      let payload = {
        count: 20,
        sponsoredMessages: [
          {_id : '5e4a431c45c40d0b2bb23d06',
            'companyId' : '5aa10cdf46b4591f60e6b50c',
            'userId' : '5aa10cdf46b4591f60e6b50b',
            'status' : 'draft',
            adName : 'New Ad',
            pageId : '5b2899b3c0e3227a031bcc5b'
          },
          {_id : '5e4a431c45c40d0b2bb23d07',
            'companyId' : '5aa10cdf46b4591f60e6b50c',
            'userId' : '5aa10cdf46b4591f60e6b50b',
            'status' : 'draft',
            adName : 'New Ad',
            pageId : '5b2899b3c0e3227a031bcc5b'
          }
        ]
      }
      dispatch(showAllSponsoredMessages(payload))
        // callApi('sponsoredmessaging').then(res => {
        //     console.log('response from sponsoredmessaging', res)
        //     if(res.status === 'success' && res.payload){
        //         dispatch(showAllSponsoredMessages(res.payload))
        //     }
        // })
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
            dispatch(fetchSponsoredMessages())
          } else {
            // msg.error('Failed to save Information')
          }
      })
  }
}

export function updateSponsoredMessage(sponsoredMessage, key, value, edit) {
  console.log('value in updateSponoredmessage',value)
  if (edit) {
    let temp = sponsoredMessage
    let fields = Object.keys(edit)
    for (let i = 0; i < fields.length; i++ ) {
      temp[fields[i]] = edit[fields[i]]
    }
    // temp.campaignType = edit.campaignType ? edit.campaignType : temp.campaignType
    // temp.campaignName = edit.campaignName ? edit.campaignName : temp.campaignName
    // temp.campaignId = edit.campaignId ? edit.campaignId : temp.campaignId
    // temp.adSetType = edit.adSetType ? edit.adSetType : temp.adSetType
    // temp.adSetName = edit.adSetName ? edit.adSetName : temp.adSetName
    // temp.budgetType = edit.budgetType ? edit.budgetType : temp.budgetType
    // temp.budgetAmount = edit.budgetAmount ? edit.budgetAmount : temp.budgetAmount
    // temp.bidAmount = edit.bidAmount ? edit.bidAmount : temp.bidAmount
    // temp.adSetId = edit.adSetId ? edit.adSetId : temp.adSetId
    if (edit.targeting) {
      temp.targeting = {
        gender: edit.targeting.gender,
        minAge: edit.targeting.minAge,
        maxAge: edit.targeting.maxAge
      }
    }
    return (dispatch) => {
      dispatch(showUpdatedData(temp))
    }
  } else if (key) {
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

export function createSponsoredMessage(data, cb) {
  console.log('data for createSponsoredMessage', data)
    return (dispatch) => {
        callApi('sponsoredmessaging', 'post', data)
        .then(res => {
          if(res.status === 'success'){
              cb()
              // dispatch(createdSponsoredData(res.payload))
              let payload = {
                _id: '5e4a431c45c40d0b2bb23d06',
    	           pageId: '5b2899b3c0e3227a031bcc5b',
                 adName: 'New Ad'
              }
              dispatch(createdSponsoredData(payload))
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

export function send(data, msg, handleResponse) {
  return (dispatch) => {
    callApi(`sponsoredmessaging/send/${data._id}`, 'post', data)
      .then(res => {
        if(res.status === 'success') {
          dispatch(fetchSponsoredMessages())
          msg.success('Ad has been sent to Ads Manager')
          handleResponse()
        } else {
          msg.error(res.payload.message)
        }
      })
   }
}

export function getInsights (adId) {
  return (dispatch) => {
    callApi(`sponsoredmessaging/insights/${adId}`, 'get')
      .then(res => {
        if(res.status === 'success') {
          dispatch(insights(res.payload))
        } else {
          console.log(res)
        }
      })
   }
}
export function fetchAdAccounts () {
  return (dispatch) => {
    // let data = [
    //   {id: 1, name: 'acAccount1'},
    //   {id: 2, name: 'adAccount2'},
    //   {id: 3, name: 'adAccount3'}
    // ]
    // dispatch(showAdAccounts(data))
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
    // let data = [
    //   {id: 1, name: 'campaign1'},
    //   {id: 2, name: 'campaign2'},
    //   {id: 3, name: 'campaign3'}
    // ]
    // dispatch(showCampaigns(data))
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
    // let data = [
    //   {id: 1, name: 'adSet1'},
    //   {id: 2, name: 'adSet2'},
    //   {id: 3, name: 'adSet3'}
    // ]
    // dispatch(showAdSets(data))
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
    // callApi(`sponsoredmessaging/campaigns`, 'post', data)
    //   .then(res => {
    //     cb(res)
    //   })
    cb({status: 'success', payload: '6166516933356'})
   }
}
export function saveAdAccount(id, data, cb) {
  return (dispatch) => {
    cb({status: 'success'})
    // callApi(`sponsoredmessaging/update/${id}`, 'post', data)
    //   .then(res => {
    //     // cb (res)
    // })
  }
}
export function saveAdSet(data, cb) {
  console.log('data for saveAdSet', data)
  return (dispatch) => {
    // callApi(`sponsoredmessaging/adSets`, 'post', data)
    //   .then(res => {
    //    cb (res)
    // })
    cb ({status: 'success', payload: '3'})
  }
}
