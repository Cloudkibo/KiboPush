import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function showAllOverlayWidgets (data) {
  return {
    type: ActionTypes.SHOW_OVERLAY_WIDGETS,
    data
  }
}

export function saveCurrentWidget (data) {
  return {
    type: ActionTypes.SAVE_CURRENT_WIDGET,
    data
  }
}

export function fetchOverlayWidgets () {
  console.log('in fetchOverlayWidgets')
  return (dispatch) => {
    callApi('overlayWidgets').then(res => {
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
        dispatch(fetchOverlayWidgets())
      } else {
        msg.error('Failed to delete Pverlay Widget')
      }
    })
  }
}

/*export function setInitialState () {
  return (dispatch) => {
    let landingPage = {
      initialState: {
        title: 'Here is your widget headline. Click here to change it!',
        description: 'We also put default text here. Make sure to turn it into a unique and valuable message.',
        pageTemplate: 'text',
        backgroundColor: '#fff',
        titleColor: '#000',
        descriptionColor: '#000',
        buttonText: 'Send To Messenger',
        mediaType: 'image',
        mediaLink: '',
        mediaPlacement: 'aboveHeadline'
      },
      submittedState: {
        title: 'Thank You for Reading Our Thank You Message!',
        description: 'Once a user opt-ins through your form, he sees this. Unless you change it, of course.',
        buttonText: 'View it in Messenger',
        actionType: 'REDIRECT_TO_URL',
        url: '',
        tab: 'NEW_TAB',
        state: {
          backgroundColor: '#fff',
          titleColor: '#000',
          descriptionColor: '#000',
          mediaType: 'image',
          mediaLink: '',
          mediaPlacement: 'aboveHeadline'
        }
      },
      optInMessage: [{
        id: new Date().getTime(),
        text: 'Welcome {{user_first_name}}! Thankyou for subscribing. The next post is coming soon, stay tuned!    P.S. If you ever want to unsubscribe just type "stop"',
        componentType: 'text'
      }],
      currentTab: 'initialState',
      pageId: '',
      error: false
    }
    dispatch(showUpdatedData(landingPage))
  }
}

export function updateLandingPageData (landingPageData, tabValue, updateKey, updateValue, stateKey, editLandingPage) {
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
