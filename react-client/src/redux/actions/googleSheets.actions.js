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
    // callApi(`googleSheets/fetchSpreadSheets`)
    //   .then(res => {
    //     if (res.status === 'success') {
    //       dispatch(showSpreadSheets(res.payload))
    //     }
    //   })
    let data = [
      {spreadsheetId: '1', title: 'spreadsheet1'},
      {spreadsheetId: '2', title: 'spreadsheet2'}
    ]
    dispatch(showSpreadSheets(data))
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
    // callApi(`googleSheets/fetchWorksheets`, 'post', data)
    //   .then(res => {
    //     if (res.status === 'success') {
    //       dispatch(showWorkSheets(res.payload))
    //     }
    //   })
    let data = [
      {sheetId: '1', title: 'worksheet1'},
      {sheetId: '2', title: 'worksheet2'},
      {sheetId: '2', title: 'worksheet3'}
    ]
    dispatch(showWorkSheets(data))
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
  return (dispatch) => {
    // callApi(`googleSheets/fetchColumns`, 'post', data)
    //   .then(res => {
    //     if (res.status === 'success') {
    //       dispatch(showWorkSheets(res.payload))
    //     }
    //   })
    let data = {
      kiboPushColumns: [
        {fieldName: 'firstName', title: 'First Name'},
        {fieldName: 'lastName', title: 'Last Name'},
        {fieldName: 'phoneNumber', title: 'Phone Number'}
      ],
      customFieldColumns: [
        {customFieldId: '5c08c6c50464fb0fbc037a62', title: 'c1'},
        {customFieldId: '5c08c6c50464fb0fbc037a63', title: 'c2'},
        {customFieldId: '5c08c6c50464fb0fbc037a64', title: 'c3'},
      ],
      googleSheetColumns: ['g1', 'g2', 'g3', 'g4']
    }
    dispatch(showColumns(data))
  }
}
