import * as ActionTypes from '../constants/constants'

const initialState = {
  landingPage: {
    initialState: {
      title: 'Here is your widget headline. Click here to change it!',
      description: 'We also put default text here. Make sure to turn it into a unique and valuable message.',
      pageTemplate: 'text',
      backgroundColor: '#fff',
      titleColor: '#000',
      descriptionColor: '#000',
      buttonText: 'Send To Messenger',
      mediaType: 'image',
      mediaLink: 'https://skiboengage.cloudkibo.com/api/broadcasts/download/f0d88c1e994201812231241.png',
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
        mediaLink: 'https://skiboengage.cloudkibo.com/api/broadcasts/download/f5c1e0e4db42018122392130.png',
        mediaPlacement: 'aboveHeadline'
      }
    },
    currentTab: 'initialState',
    pageId: '',
    error: false
  }
}

export function landingPagesInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SHOW_LANDING_PAGES:
      return Object.assign({}, state, {
        landingPages: action.data
      })
    case ActionTypes.UPDATE_LANDING_PAGE:
      return Object.assign({}, state, {
        landingPage: action.data
      })
    default:
      return state
  }
}
