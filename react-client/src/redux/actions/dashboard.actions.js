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
  return async (dispatch) => {
    try {
      // const response = await callApi('dashboard/sla', 'post', data)
      // dispatch(updateSLADashboard(response.payload))
      setTimeout(() => {
        dispatch(
          updateSLADashboard({
            sessions: {
              total: 999,
              resolved: 99,
              pending: 99,
              open: 99
            },
            messages: {
              received: 999,
              sent: 999
            },
            responseTime: 120,
            resolveTime: 1000,
            graphData: [
              {
                responseTime: 30,
                resolveTime: 100,
                date: '2020-12-08'
              },
              {
                responseTime: 40,
                resolveTime: 120,
                date: '2020-12-09'
              },
              {
                responseTime: 50,
                resolveTime: 150,
                date: '2020-12-10'
              },
              {
                responseTime: 60,
                resolveTime: 190,
                date: '2020-12-11'
              },
              {
                responseTime: 20,
                resolveTime: 110,
                date: '2020-12-12'
              },
              {
                responseTime: 80,
                resolveTime: 200,
                date: '2020-12-13'
              },
              {
                responseTime: 90,
                resolveTime: 250,
                date: '2020-12-14'
              },
              {
                responseTime: 30,
                resolveTime: 100,
                date: '2020-12-15'
              }
            ]
          })
        )
      }, 2000)
    } catch (err) {
      dispatch(
        updateSLADashboard(
          null,
          err && err.message
            ? err.message
            : 'Error Fetching Data. Try Refreshing the Page.'
        )
      )
    }
  }
}

export function loadDashboardData() {
  // here we will fetch list of subscribers from endpoint
  return (dispatch) => {
    callApi('dashboard/stats').then((res) =>
      dispatch(updateDashboard(res.payload))
    )
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
    callApi(`dashboard/topPages/`).then((res) =>
      dispatch(updateTopPages(res.payload))
    )
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
    callApi('subscribers/allLocales').then((res) =>
      dispatch(updateAllLocales(res.payload))
    )
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
