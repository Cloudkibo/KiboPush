import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export function showhubSpotForm (data) {
    return {
      type: ActionTypes.SHOW_hubSpotForm,
      data
    }
  }

  export function showColumns (data) {
    return {
      type: ActionTypes.SHOW_hubspot_form_COLUMNS,
      data
    }
  }

  export function showHubspotColumns (data) {
    return {
      type: ActionTypes.SHOW_showHubspotColumns,
      data
    }
  }

  export function emptyFields () {
    return {
      type: ActionTypes.EMPTY_hubspotForm_FIELDS
    }
  }
  
  export function fetchhubSpotForms () {
    return (dispatch) => {
      callApi(`hubspotIntegrations/listForms`)
        .then(res => {
          console.log('response from showhubSpotForm', res)
          if (res.status === 'success') {
            dispatch(showhubSpotForm(res.payload))
          }
        })
    }
  }

  export function fetchColumns (data) {
    console.log('data for fetchColumns', data)
    return (dispatch) => {
      callApi(`hubspotIntegrations/fetchFields`, 'post', data)
        .then(res => {
          console.log('response from fetchColumns', res)
          if (res.status === 'success') {
            dispatch(showColumns(res.payload))
          }
        })
    }
  }

  export function fetchHubspotColumns () {
    return (dispatch) => {
      callApi(`hubspotIntegrations/fetchHubspotDefaultColumns`)
        .then(res => {
          console.log('response from fetchColumns', res)
          if (res.status === 'success') {
            dispatch(showHubspotColumns(res.payload))
          }
        })
    }
  }


