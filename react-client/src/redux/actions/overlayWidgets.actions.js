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
      currentTab: widget.currentTab
    }
    if (tab) {
      updatedWidget[tab][updatedKey] = updatedValue
    } else {
      updatedWidget[updatedKey] = updatedValue
    }  
    dispatch(showUpdatedWidget(updatedWidget))
  }
}
export function createOverlayWidget (data) {

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

export function setInitialState () {
  return (dispatch) => {
    let widget = {
      initialState: {
        button_type: "send_to_messenger",
        background_color: '#fff',
        headline_color: '#000',
        button_background: 'blue',
        button_text: 'Send to Messenger',
        headline: 'Here is your widget headline. Click here to change it!'
      },
      submittedState: {
        action_type: "show_new_message",
        message: "Thank You for Reading Our Thank You Message!",
        background_color: "#CE93D8",
        headline_color: "#FFFFFF",
        button_background: "#FFFFFF",
        button_text_color: "#000000",
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
      error: false
    }
    dispatch(showUpdatedWidget(widget))
  }
}
export function updateOverlayWidget (widgetData, tabValue, updateKey, updateValue, stateKey, editLandingPage) {
  console.log('In Update Widget')
}
/*export function updateLandingPageData (landingPageData, tabValue, updateKey, updateValue, stateKey, editLandingPage) {
  return (dispatch) => {
    let landingPage = {
      initialState: landingPageData.initialState,
      submittedState: landingPageData.submittedState,
      pageId: landingPageData.pageId,
      optInMessage: landingPageData.optInMessage ? landingPageData.optInMessage : [],
      currentTab: landingPageData.currentTab
    }
    if (editLandingPage) {
      landingPage = {
        initialState: editLandingPage.initialState,
        submittedState: {
          title: editLandingPage.submittedState.title,
          description: editLandingPage.submittedState.description,
          buttonText: editLandingPage.submittedState.buttonText,
          actionType: editLandingPage.submittedState.actionType,
          url: editLandingPage.submittedState.url ? editLandingPage.submittedState.url : '',
          tab: editLandingPage.submittedState.tab ? editLandingPage.submittedState.tab : 'NEW_TAB',
          state: {
            backgroundColor: '#fff',
            titleColor: '#000',
            descriptionColor: '#000',
            mediaType: 'image',
            mediaLink: '',
            mediaPlacement: 'aboveHeadline'
          }
        },
        pageId: editLandingPage.pageId,
        optInMessage: editLandingPage.optInMessage,
        currentTab: editLandingPage.currentTab
      }
      if (editLandingPage.submittedState.state) {
        landingPage.submittedState.state = {
          _id: editLandingPage.submittedState.state._id,
          backgroundColor: editLandingPage.submittedState.state.backgroundColor,
          titleColor: editLandingPage.submittedState.state.titleColor,
          descriptionColor: editLandingPage.submittedState.state.descriptionColor,
          mediaType: editLandingPage.submittedState.state.mediaType,
          mediaLink: editLandingPage.submittedState.state.mediaLink,
          mediaPlacement: editLandingPage.submittedState.state.mediaPlacement
        }
      }
    } else if (updateKey === 'state') {
      console.log('inside state action', landingPageData)
      landingPage[tabValue][updateKey][stateKey] = updateValue
      console.log('landingPage in action', landingPage)
    } else if (updateKey === 'currentTab' || updateKey === 'pageId' || updateKey === 'optInMessage' || updateKey === 'isActive') {
      landingPage[updateKey] = updateValue
    } else {
      landingPage[tabValue][updateKey] = updateValue
    }
    dispatch(showUpdatedData(landingPage))
  }
}*/
