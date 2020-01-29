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
      pageId: widget.pageId,
      type: widget.type,
      status: widget.status,
      currentTab: widget.currentTab,
      id: widget.id,
      title: widget.title
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
        dispatch(showAllOverlayWidgets({overlayWidgets: [], count: 0}))
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
          type_value: '',
          search_value: ''
        }
        dispatch(fetchOverlayWidgets(data))
      } else {
        msg.error('Failed to delete Pverlay Widget')
      }
    })
  }
}
export function createOverlayWidget (data, msg, handleCreate) {
  return (dispatch) => {
    callApi(`overlayWidgets/create/`, 'post', data).then(res => {
      console.log('response from create overlay widgets', res)
      if (res.status === 'success') {
        msg.success('Overlay widget has been saved')
        if (handleCreate) {
          handleCreate(res.payload)
        }
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
export function setWidgetProperties (wgt, defaultPageId) {
  return (dispatch) => {
    let widget = {
      initialState: {
        button_type:  wgt && wgt.initialState ? wgt.initialState.button_type : "send_to_messenger",
        background_color: wgt && wgt.initialState ? wgt.initialState.background_color : '#fff',
        headline_color:  wgt && wgt.initialState ? wgt.initialState.headline_color: '#000',
        button_background:  wgt && wgt.initialState ? wgt.initialState.button_background: 'blue',
        button_text:  wgt && wgt.initialState ? wgt.initialState.button_text: 'Send to Messenger',
        button_text_color:  wgt && wgt.initialState ? wgt.initialState.button_text_color: '#fff',
        headline:  wgt && wgt.initialState ? wgt.initialState.headline: 'Here is your widget headline. Click here to change it!'
      },
      submittedState: {
        action_type:  wgt && wgt.submittedState ? wgt.submittedState.action_type : "show_new_message",
        message: wgt && wgt.submittedState ? wgt.submittedState.message: "Thank You for Reading Our Thank You Message!",
        background_color: wgt && wgt.submittedState ? wgt.submittedState.background_color: "#CE93D8",
        headline_color: wgt && wgt.submittedState ? wgt.submittedState.headline_color: "#FFFFFF",
        button_background: wgt && wgt.submittedState ? wgt.submittedState.button_background: "#FFFFFF",
        button_text_color: wgt && wgt.submittedState ? wgt.submittedState.button_text_color: "#000000",
        button_text: wgt && wgt.submittedState ? wgt.submittedState.button_text: 'View it in Messenger',
        url: wgt && wgt.submittedState ? wgt.submittedState.url: '',
        tab: wgt && wgt.submittedState ? wgt.submittedState.tab: 'new_tab' 
      },
      optInMessage: wgt && wgt.optInMessage ? wgt.optInMessage: [{
        id: new Date().getTime(),
        text: 'Welcome {{user_first_name}}! Thankyou for subscribing. The next post is coming soon, stay tuned!    P.S. If you ever want to unsubscribe just type "stop"',
        componentType: 'text'
      }],
      currentTab: 'initialState',
      pageId:  wgt && wgt.pageId ? wgt.pageId: defaultPageId,
      status: wgt && wgt.isActive ? wgt.isActive: true,
      type:  wgt && wgt.widgetType ? wgt.widgetType: 'bar',
      error: false, 
      title: wgt && wgt.title ? wgt.title : '',
      id: wgt && wgt._id ? wgt._id :  ''
    }
    dispatch(showUpdatedWidget(widget))
  }
}

