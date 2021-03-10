import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updateDashboard(data) {
  return {
    type: ActionTypes.UPDATE_DASHBOARD,
    data
  }
}
export function updateSubscriberSummary(data) {
  return {
    type: ActionTypes.UPDATE_SUBSCRIBER_SUMMARY,
    data
  }
}
export function updateAutopostingSummary(data) {
  return {
    type: ActionTypes.UPDATE_AUTOPOSTING_SUMMARY,
    data
  }
}
export function updateNewsSummary(data) {
  return {
    type: ActionTypes.UPDATE_NEWS_SUMMARY,
    data
  }
}
export function updateIntegrationsSummary(data) {
  return {
    type: ActionTypes.UPDATE_INTEGRATIONS_SUMMARY,
    data
  }
}
export function updateAllLocales(data) {
  console.log('Data Fetched From Subscribers', data)
  return {
    type: ActionTypes.LOAD_LOCALES_LIST_DASHBOARD,
    data
  }
}
export function updatePageSubscribersList(data) {
  return {
    type: ActionTypes.VIEW_PAGE_SUBSCRIBERS_LIST_DASHBOARD,
    data: data.subscribers,
    //  locale: getLocales(data.subscribers),
    count: data.count
  }
}

export function updateGraphData(data) {
  return {
    type: ActionTypes.UPDATE_GRAPH_DATA,
    data
  }
}
export function updateTopPages(data) {
  return {
    type: ActionTypes.UPDATE_TOP_PAGES,
    data
  }
}
export function updateSentVsSeen(data) {
  console.log('sentVsSeen Data', data)
  return {
    type: ActionTypes.UPDATE_SENT_VS_SEEN,
    data
  }
}

export function updateSLADashboard(data, error) {
  return {
    type: ActionTypes.UPDATE_SLA_DASHBOARD,
    data,
    error
  }
}

export function loadSLADashboardData(data) {
  let dataCopy = {...data}
  return async (dispatch) => {
    console.log('loadSLADashboardData', dataCopy)
    try {
      dispatch({
        type: ActionTypes.FETCHING_SLA_DASHBOARD
      })
      
      const response = await callApi('dashboard/sla', 'post', dataCopy)
      if (!response.payload || response.payload.length === 0) {
        dispatch(updateSLADashboard(null, 'No data currently available'))
      } else {
        const slaData = {
          sessions: {
            new: 0,
            resolved: 0,
            pending: 0,
            open: 0
          },
          messages: {
            received: 0,
            sent: 0
          },
          maxResponseTime: 0,
          avgResponseTime: 0,
          avgResolveTime: 0,
          graphData: []
        }
        let avgRespTime = 0
        let responses = 0
        let avgResolveTime = 0
        for (let i = 0; i < response.payload.length; i++) {
          const item = response.payload[i]
          slaData.sessions.new += item.sessions.new
          slaData.sessions.open += item.sessions.open
          slaData.sessions.pending += item.sessions.pending
          slaData.sessions.resolved += item.sessions.resolved

          slaData.messages.received += item.messages.received
          slaData.messages.sent += item.messages.sent

          if (item.maxRespTime && item.maxRespTime > slaData.maxResponseTime) {
            slaData.maxResponseTime = item.maxRespTime
          }

          avgRespTime += item.avgRespTime ? item.avgRespTime : 0
          responses += item.responses ? item.responses : 0
          avgResolveTime += item.avgResolveTime ? item.avgResolveTime : 0

          slaData.graphData.push({
            avgResponseTime: item.avgRespTime ? item.avgRespTime / (1000 * 60) : 0,
            avgResolveTime: item.avgResolveTime ? item.avgResolveTime / (1000 * 60) : 0,
            maxResponseTime: item.maxRespTime ? item.maxRespTime /(1000 * 60) : 0,
            date: item.createdAt.substring(0, 10)
          })
        }
        slaData.avgResponseTime = responses <= 0 ? 0 : avgRespTime / responses
        slaData.avgResolveTime = slaData.sessions.resolved <= 0 ? 0 : avgResolveTime / slaData.sessions.resolved
        console.log('slaData', slaData)
        dispatch(updateSLADashboard(slaData))
      }
    } catch (err) {
      dispatch(
        updateSLADashboard(null, err && err.message ? err.message : 'Error Fetching Data. Try Refreshing the Page.')
      )
    }
  }
}

export function loadDashboardData() {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi('dashboard/stats').then((res) => dispatch(updateDashboard(res.payload)))
  }
}

export function sentVsSeen(pageId) {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi(`dashboard/sentVsSeen/${pageId}`).then((res) => {
      console.log('sentVsSeen response', res)
      dispatch(updateSentVsSeen(res.payload))
    })
  }
}
export function loadGraphData(days) {
  console.log('days', days)
  return (dispatch) => {
    callApi(`dashboard/graphData/${days}`).then((res) => {
      console.log('res.payload', res.payload)
      dispatch(updateGraphData(res.payload))
    })
  }
}
export function loadTopPages() {
  return (dispatch) => {
    callApi(`dashboard/topPages/`).then((res) => dispatch(updateTopPages(res.payload)))
  }
}

export function loadPageSubscribersList(id, data) {
  console.log('data for loadPageSubscribersList', data)
  return (dispatch) => {
    callApi(`dashboard/getAllSubscribers/${id}`, 'post', data).then((res) => {
      console.log('response from loadPageSubscribersList', res)
      dispatch(updatePageSubscribersList(res.payload))
    })
  }
}
export function loadSubscriberSummary(data) {
  console.log('data for loadSubscriberSummary', data)
  return (dispatch) => {
    callApi(`dashboard/subscriberSummary`, 'post', data).then((res) => {
      console.log('response from loadSubscriberSummary', res)
      dispatch(updateSubscriberSummary(res.payload))
    })
  }
}
export function loadAutopostingSummary(data) {
  console.log('data for loadAutopostingSummary', data)
  return (dispatch) => {
    callApi(`dashboard/fetchAutopostingDetails`, 'post', data).then((res) => {
      console.log('response from loadAutopostingSummary', res)
      dispatch(updateAutopostingSummary(res.payload))
    })
  }
}
export function loadNewsIntegrationsSummary(data) {
  console.log('data for loadNewsIntegrationsSummary', data)
  return (dispatch) => {
    callApi(`dashboard/fetchNewsIntegrations`, 'post', data).then((res) => {
      console.log('response from loadNewsIntegrationsSummary', res)
      dispatch(updateNewsSummary(res.payload))
    })
  }
}
export function loadIntegrationsSummary() {
  return (dispatch) => {
    callApi(`dashboard/integrationsData`).then((res) => {
      console.log('response from loadIntegrationsSummary', res)
      dispatch(updateIntegrationsSummary(res.payload))
    })
  }
}
export function allLocales() {
  return (dispatch) => {
    callApi('subscribers/allLocales').then((res) => dispatch(updateAllLocales(res.payload)))
  }
}
export function loadSentSeen(data) {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi(`dashboard/sentVsSeenNew`, 'post', data).then((res) => {
      console.log('sentVsSeen response', res)
      dispatch(updateSentVsSeen(res.payload.datacounts))
      dispatch(updateGraphData(res.payload.graphDatas))
    })
  }
}
