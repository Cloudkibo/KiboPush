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
      callApi(`hubspotIntegrations/listHubSpotForm`)
        .then(res => {
          console.log('response from showhubSpotForm', res)
          if (res.status === 'success') {
            dispatch(showhubSpotForm(res.payload))
          }
          dispatch(showhubSpotForm([
            {
              name:'hello1',
              id: '1'                    
            },
            {
              name:'hello2',
              id: '2'                    
            }
        ]
        ))
        })
    }
  }

  export function fetchColumns (data) {
    console.log('data for fetchColumns', data)
    return (dispatch) => {
      callApi(`hubspotIntegrations/fetchColumns`, 'post', data)
        .then(res => {
          console.log('response from fetchColumns', res)
          if (res.status === 'success') {
            dispatch(showColumns(res.payload))
          }
         var data = {
            customFieldColumns: [
              {customFieldId: "5d821e0da7701b67a00cc384", title: "city"},
              {customFieldId: "5dcbe92681520826fa652ab3", title: "zameen"}
            ],
            hubSpotFormColumns: ["Milestone Name", "Link", "Design Document", "Remaining Issues", "Customer Feature", "Priority"],
            kiboPushColumns: [
              {fieldName: "firstName", title: "First Name"},
              {fieldName: "lastName", title: "Last Name"},
              {fieldName: "fullName", title: "Full Name"},
              {fieldName: "locale", title: "Locale"},
              {fieldName: "timezone", title: "Timezone"}
            ]
          }
          dispatch(showColumns(data))
        })
    }
  }

  export function fetchHubspotColumns () {
    return (dispatch) => {
      callApi(`hubspotIntegrations/fetchHubspotColumns`)
        .then(res => {
          console.log('response from fetchColumns', res)
          if (res.status === 'success') {
            dispatch(showHubspotColumns(res.payload))
          }
         var data = {
            customFieldColumns: [
              {customFieldId: "5d821e0da7701b67a00cc384", title: "city"},
              {customFieldId: "5dcbe92681520826fa652ab3", title: "zameen"}
            ],
            kiboPushColumns: [
              {fieldName: "firstName", title: "First Name"},
              {fieldName: "lastName", title: "Last Name"},
              {fieldName: "fullName", title: "Full Name"},
              {fieldName: "locale", title: "Locale"},
              {fieldName: "timezone", title: "Timezone"}
            ],
            hubSpotColumns: ["Milestone Name", "Link", "Design Document", "Remaining Issues", "Customer Feature", "Priority"]
          }
          dispatch(showHubspotColumns(data))
        })
    }
  }


