import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function showSpreadSheets (data) {
  return {
    type: ActionTypes.SHOW_SPREADSHEETS,
    data
  }
}

export function showIntegrationWarning (data) {
  return {
    type: ActionTypes.SHOW_INTEGRATION_WARNING,
    data
  }
}


export function fetchSpreadSheets () {
  return (dispatch) => {
    callApi(`sheetsIntegrations/listSpreadSheets`)
      .then(res => {
        console.log('response from sheetsIntegrations', res)
        if (res.status === 'success') {
          dispatch(showSpreadSheets(res.payload))
        } else {
          if (res.description)
          dispatch(showIntegrationWarning(res.description))
        }
      })
  }
}
export function showWorkSheets (data) {
  return {
    type: ActionTypes.SHOW_WORKSHEETS,
    data
  }
}

export function fetchWorksheets (data) {
  return (dispatch) => {
    callApi(`sheetsIntegrations/fetchWorksheets`, 'post', data)
      .then(res => {
        if (res.status === 'success') {
          dispatch(showWorkSheets(res.payload))
        }
      })
  }
}
export function showColumns (data) {
  return {
    type: ActionTypes.SHOW_COLUMNS,
    data
  }
}

export function emptyFields () {
  return {
    type: ActionTypes.EMPTY_FIELDS
  }
}

export function fetchColumns (data) {
  console.log('data for fetchColumns', data)
  return (dispatch) => {
    callApi(`sheetsIntegrations/fetchColumns`, 'post', data)
      .then(res => {
        console.log('response from fetchColumns', res)
        if (res.status === 'success') {
          dispatch(showColumns(res.payload))
        }
      })
  }
}
