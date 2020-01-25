import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function showAllOverlayWidgets (data) {
  return {
    type: ActionTypes.SHOW_OVERLAY_WIDGETS,
    overlayWidgets: data.overlayWidgets,
    count: data.count
  }
}

export function showUpdatedWidget (data) {
  return {
    type: ActionTypes.SAVE_CURRENT_WIDGET,
    data
  }
}

export function updateWidget (widget, tab, updatedKey, updatedValue) {
  return (dispatch) => {
    var updatedWidget = {
      initialState: widget.initialState,
      submittedState: widget.submittedState,
      optInMessage:  widget.optInMessage,
      page: widget.page,
      type: widget.type,
      status: widget.status,
      currentTab: widget.currentTab,
      id: widget.id
    }
    if (tab) {
      updatedWidget[tab][updatedKey] = updatedValue
    } else if (updatedKey) {
      updatedWidget[updatedKey] = updatedValue
    }  
    dispatch(showUpdatedWidget(updatedWidget))
  }
}

export function fetchOverlayWidgets (data) {
  console.log('in fetchOverlayWidgets', data)
  return (dispatch) => {
    callApi('overlayWidgets/fetchWidgets', 'post', data).then(res => {
      console.log('response from overlayWidgets', res)
      if (res.status === 'success' && res.payload) {
        dispatch(showAllOverlayWidgets(res.payload))
      } else {
        dispatch(showAllOverlayWidgets([]))
      }
    })
  }
}
export function deleteOverlayWidget (id, msg) {
  return (dispatch) => {
    callApi(`overlayWidgets/delete/${id}`, 'delete').then(res => {
      console.log('response from delete overlay widgets', res)
      if (res.status === 'success') {
        msg.success('Overlay widget has been deleted')
        var data = {
          last_id: 'none', 
          number_of_records: 10, 
          first_page: 'first',
          page_value: '',
          status_value: '',
          type_value: ''
        }
        dispatch(fetchOverlayWidgets(data))
      } else {
        msg.error('Failed to delete Pverlay Widget')
      }
    })
  }
}
export function createOverlayWidget (data, msg) {
  return (dispatch) => {
    callApi(`overlayWidgets/create/`, 'post', data).then(res => {
      console.log('response from create overlay widgets', res)
      if (res.status === 'success') {
        msg.success('Overlay widget has been saved')
      } else {
        msg.error('Failed to save overlay Widget')
      }
    })
  }
}
export function updateOverlayWidget (data, msg) {
  return (dispatch) => {
    callApi(`overlayWidgets/update/${data._id}`, 'post', data).then(res => {
      console.log('response from create overlay widgets', res)
      if (res.status === 'success') {
        msg.success('Overlay widget has been saved')
      } else {
        msg.error('Failed to save overlay Widget')
      }
    })
  }
}
export function setInitialState (wgt) {
  return (dispatch) => {
    let widget = {
      initialState: {
        button_type:  "send_to_messenger",
        background_color: '#fff',
        headline_color: '#000',
        button_background: 'blue',
        button_text: 'Send to Messenger',
        button_text_color: '#fff',
        headline: 'Here is your widget headline. Click here to change it!'
      },
      submittedState: {
        action_type: "show_new_message",
        message: "Thank You for Reading Our Thank You Message!",
        background_color: "#CE93D8",
        headline_color: "#FFFFFF",
        button_background: "#FFFFFF",
        button_text_color: "#000000",
        button_text: 'View it in Messenger',
        url: '',
        tab: 'new_tab' 
      },
      optInMessage: [{
        id: new Date().getTime(),
        text: 'Welcome {{user_first_name}}! Thankyou for subscribing. The next post is coming soon, stay tuned!    P.S. If you ever want to unsubscribe just type "stop"',
        componentType: 'text'
      }],
      currentTab: 'initialState',
      page: '',
      status: true,
      type: 'bar',
      error: false, 
      id: ''
    }
    dispatch(showUpdatedWidget(widget))
  }
}

