import * as ActionTypes from '../constants/constants'

const initialState = {
  browserName: '',
  browserVersion: '',
  socketStatus: false,
  getStartedSeen: true,
  fbAppId: '',
  adminPageSubscription: [],
  captchaKey: '',
  stripeKey: '',
  error: ''
}

export function basicInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_BROWSER_NAME:
      return Object.assign({}, state, {
        browserName: action.data
      })

    case ActionTypes.LOAD_BROWSER_VERSION:
      return Object.assign({}, state, {
        browserVersion: action.data
      })

    case ActionTypes.SET_IS_MOBILE:
      return Object.assign({}, state, {
        isMobile: action.data
      })

    case ActionTypes.GET_AUTOMATED_OPTIONS:
      return Object.assign({}, state, {
        automated_options: action.data
      })

    case ActionTypes.UPDATE_TRIAL_PERIOD:
      let user = state.user
      user.trial.status = false
      return Object.assign({}, state, {
        user
      })

    case ActionTypes.LOAD_USER_DETAILS:
      return Object.assign({}, state, {
        user: action.data,
        updatedUser: '',
        error: ''
      })

    case ActionTypes.LOAD_UPDATED_USER_DETAILS:
      let temp = state.user
      temp.uiMode = action.data
      return Object.assign({}, state, {
        user: temp,
        updatedUser: action.data,
        error: ''
      })

    case ActionTypes.SET_SOCKET_STATUS:
      return Object.assign({}, state, {
        socketStatus: action.data
      })
    case ActionTypes.GET_STARTED_COMPLETED:
      return Object.assign({}, state, {
        getStartedSeen: true
      })
    case ActionTypes.STORE_FB_APP_ID:
      return Object.assign({}, state, {
        fbAppId: action.data
      })
    case ActionTypes.STORE_ADMIN_SUB_ID:
      return Object.assign({}, state, {
        adminPageSubscription: action.data
      })
    case ActionTypes.LOAD_KEYS:
      return Object.assign({}, state, {
        captchaKey: action.captchaKey,
        stripeKey: action.stripeKey
      })

    default:
      return state
  }
}
