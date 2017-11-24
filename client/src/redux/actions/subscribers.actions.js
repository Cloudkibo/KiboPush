import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function updateSubscribersList (data) {
  console.log('Data Fetched From Subscribers', data)
  if (!data[0]) {
    return {
      type: ActionTypes.LOAD_SUBSCRIBERS_LIST,
      data: [],
      locale: []
    }
  }
  var locale = [data[0].locale]
  for (var i = 1; i < data.length; i++) {
    if (locale.indexOf(data[i].locale) === -1) {
      locale.push(data[i].locale)
    }
  }
  // console.log('localeData', locale)
  return {
    type: ActionTypes.LOAD_SUBSCRIBERS_LIST,
    data,
    locale
  }
}

export function loadSubscribersList () {
  // here we will fetch list of subscribers from endpoint
  console.log('loadSubscribersList called')
  return (dispatch) => {
    callApi('subscribers').then(res => dispatch(updateSubscribersList(res)))
  }
}