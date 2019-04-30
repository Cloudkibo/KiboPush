import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updateDashboard (data) {
  return {
    type: ActionTypes.UPDATE_DASHBOARD,
    data
  }
}
export function updateSubscriberSummary (data) {
  return {
    type: ActionTypes.UPDATE_SUBSCRIBER_SUMMARY,
    data
  }
}
export function updateAllLocales (data) {
  console.log('Data Fetched From Subscribers', data)
  return {
    type: ActionTypes.LOAD_LOCALES_LIST_DASHBOARD,
    data
  }
}
export function updatePageSubscribersList (data) {
  return {
    type: ActionTypes.VIEW_PAGE_SUBSCRIBERS_LIST_DASHBOARD,
    data: data.subscribers,
    //  locale: getLocales(data.subscribers),
    count: data.count
  }
}

export function updateGraphData (data) {
  return {
    type: ActionTypes.UPDATE_GRAPH_DATA,
    data
  }
}
export function updateTopPages (data) {
  return {
    type: ActionTypes.UPDATE_TOP_PAGES,
    data
  }
}
export function updateSentVsSeen (data) {
  console.log('sentVsSeen Data', data)
  return {
    type: ActionTypes.UPDATE_SENT_VS_SEEN,
    data
  }
}

export function loadDashboardData () {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi('dashboard/stats')
      .then(res => dispatch(updateDashboard(res.payload)))
  }
}

export function updateSubscriptionPermission () {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi('dashboard/updateSubscriptionPermission')
      .then(res => {
      })
  }
}

export function sentVsSeen (pageId) {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi(`dashboard/sentVsSeen/${pageId}`)
      .then(res => {
        console.log('sentVsSeen response', res)
        dispatch(updateSentVsSeen(res.payload))
      })
  }
}
export function loadGraphData (days) {
  console.log('days', days)
  return (dispatch) => {
    callApi(`dashboard/graphData/${days}`)
      .then(res => {
        console.log('res.payload', res.payload)
        dispatch(updateGraphData(res.payload))})
  }
}
export function loadTopPages () {
  return (dispatch) => {
    callApi(`dashboard/topPages/`)
      .then(res => dispatch(updateTopPages(res.payload)))
  }
}

export function loadPageSubscribersList (id, data) {
  console.log('data for loadPageSubscribersList', data)
  return (dispatch) => {
    callApi(`dashboard/getAllSubscribers/${id}`, 'post', data)
      .then(res => {
        console.log('response from loadPageSubscribersList', res)
        dispatch(updatePageSubscribersList(res.payload))
      })
  }
}
export function loadSubscriberSummary (data) {
  console.log('data for loadSubscriberSummary', data)
  return (dispatch) => {
    callApi(`dashboard/subscriberSummary`, 'post', data)
      .then(res => {
        console.log('response from loadSubscriberSummary', res)
        dispatch(updateSubscriberSummary(res.payload))
      })
  }
}
export function allLocales () {
  return (dispatch) => {
    callApi('subscribers/allLocales').then(res => dispatch(updateAllLocales(res.payload)))
  }
}
export function loadSentSeen (data) {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi(`dashboard/sentVsSeenNew`, 'post', data)
      .then(res => {
        console.log('sentVsSeen response', res)
        dispatch(updateSentVsSeen(res.payload.datacounts))
        dispatch(updateGraphData(res.payload.graphDatas))
      })
  }
}
