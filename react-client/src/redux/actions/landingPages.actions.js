import * as ActionTypes from '../constants/constants'
import callApi from '../../utility/api.caller.service'
export const API_URL = '/api'

export function showAllLandingPages (data) {
  return {
    type: ActionTypes.SHOW_LANDING_PAGES,
    data
  }
}

export function showUpdatedData (data) {
  return {
    type: ActionTypes.UPDATE_LANDING_PAGE,
    data
  }
}

export function fetchLandingPages () {
  console.log('in fetchLandingPages')
  return (dispatch) => {
    callApi('landingPage').then(res => {
      console.log('response from fetchLandingPages', res)
      if (res.status === 'success' && res.payload) {
        dispatch(showAllLandingPages(res.payload))
      }
    })
  }
}
export function deleteLandingPage (id, msg) {
  return (dispatch) => {
    callApi(`landingPage/${id}`, 'delete').then(res => {
      console.log('response from deleteLandingPage', res)
      if (res.status === 'success') {
        msg.success('Landing Page has been deleted')
        dispatch(fetchLandingPages())
      } else {
        msg.error('Failed to delete Landing Page')
      }
    })
  }
}
export function createLandingPage (data, msg) {
  console.log('date for createLandingPage', data)
  return (dispatch) => {
    callApi('landingPage', 'post', data)
    .then(res => {
      console.log('response from createLandingPage', res)
      if (res.status === 'success') {
        msg.success('Landing Page saved successfully')
      } else {
        msg.error('failed to save landing page')
      }
    })
  }
}

export function editLandingPage (id, data, msg, msgDescription) {
  console.log('data for editLandingPage', data)
  return (dispatch) => {
    callApi(`landingPage/update/${id}`, 'post', data)
    .then(res => {
      console.log('response from editLandingPage', res)
      if (res.status === 'success') {
        if (msgDescription) {
          msg.success(msgDescription)
        }
        else msg.success('Landing Page saved successfully')
        dispatch(fetchLandingPages())
      } else {
        msg.error('Failed to save landing page')
      }
    })
  }
}

export function setInitialState () {
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
}
