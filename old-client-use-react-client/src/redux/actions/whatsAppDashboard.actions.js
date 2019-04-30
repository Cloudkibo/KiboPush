import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function showSentSeen (data) {
  return {
    type: ActionTypes.SHOW_SENT_SEEN,
    data
  }
}

export function showSubscriberSummary (data) {
  return {
    type: ActionTypes.SHOW_SUBSCRIBER_SUMMARY,
    data
  }
}

export function showCardBoxesData (data) {
  return {
    type: ActionTypes.SHOW_CARDBOXES_DATA,
    data
  }
}

export function loadSentSeenWhatsApp (data) {
  return (dispatch) => {
    callApi('whatsAppDashboard/sentSeen', 'post', data).then(res => {
      console.log('response from loadSentSeen', res)
      if (res.status === 'success') {
        dispatch(showSentSeen(res.payload))
      }
    })
  }
}

export function loadSubscriberSummaryWhatsApp (data) {
  return (dispatch) => {
    callApi('whatsAppDashboard/subscriberSummary', 'post', data)
      .then(res => {
        console.log('response from loadSubscriberSummary', res)
        if (res.status === 'success') {
          dispatch(showSubscriberSummary(res.payload))
        }
      })
  }
}

export function loadCardBoxesDataWhatsApp () {
  return (dispatch) => {
    callApi('whatsAppDashboard')
      .then(res => {
        console.log('response from loadCardBoxesData', res)
        if (res.status === 'success') {
          dispatch(showCardBoxesData(res.payload))
        }
      })
  }
}
