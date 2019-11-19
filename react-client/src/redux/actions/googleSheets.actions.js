import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'

export function showSpreadSheets (data) {
  return {
    type: ActionTypes.SHOW_SPREADSHEETS,
    data
  }
}

export function fetchSpreadSheets () {
  return (dispatch) => {
    // callApi(`googleSheets/getSpreadSheets`)
    //   .then(res => {
    //     if (res.status === 'success') {
    //       dispatch(showSpreadSheets(res.payload))
    //     }
    //   })
    dispatch(showSpreadSheets(['s1', 's2']))
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
    // callApi(`googleSheets/getWorkSheets`, 'post', data)
    //   .then(res => {
    //     if (res.status === 'success') {
    //       dispatch(showWorkSheets(res.payload))
    //     }
    //   })
    dispatch(showWorkSheets(['w1', 'w2']))
  }
}
export function showColumns (data) {
  return {
    type: ActionTypes.SHOW_COLUMNS,
    data
  }
}

export function fetchColumns (data) {
  return (dispatch) => {
    // callApi(`googleSheets/getWorkSheets`, 'post', data)
    //   .then(res => {
    //     if (res.status === 'success') {
    //       dispatch(showWorkSheets(res.payload))
    //     }
    //   })
    let data = {
      kiboPushColumns: ['k1', 'k2', 'k3', 'k4', 'k5'],
      customFieldColumns: ['c1', 'c2', 'c3'],
      googleSheetColumns: ['g1', 'g2', 'g3', 'g4']
    }
    dispatch(showColumns(data))
  }
}
