import * as ActionTypes from '../constants/constants'

const initialState = {
  /*landingPage: {
    _id: '',
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
    error: false,
    isActive: true
  }*/
} 

export function overlayWidgetsInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SHOW_OVERLAY_WIDGETS:
      return Object.assign({}, state, {
        overlayWidgets: action.overlayWidgets,
        widgetsCount: action.count
      })
    case ActionTypes.SAVE_CURRENT_WIDGET:
      return Object.assign({}, state, {
        currentWidget: action.data
      })
    default:
      return state
  }
}
