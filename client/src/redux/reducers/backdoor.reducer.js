import * as ActionTypes from '../constants/constants'

const initialState = {
  users: [],
  broadcasts: [],
  pages: [],
  polls: [],
  dataobjects: [],
  toppages: [],
  surveyDetails: [],
  currentUser: null,
  currentPage: null,
  currentSurvey: null,
  currentPoll: null
}

export function UsersInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_USERS_LIST:
      return Object.assign({}, state, {
        users: action.data,
        locales: action.locale
      })

    default:
      return state
  }
}
export function dataObjectsInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_DATA_OBJECTS_LIST:
      return Object.assign({}, state, {
        dataobjects: action.data
      })

    default:
      return state
  }
}
export function topPagesInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_TOP_PAGES_LIST:
      return Object.assign({}, state, {
        toppages: action.data
      })

    default:
      return state
  }
}
export function PagesInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_BACKDOOR_PAGES_LIST:
      return Object.assign({}, state, {
        pages: action.data
      })
    default:
      return state
  }
}

export function BroadcastsInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_BROADCASTS_LIST:
      return Object.assign({}, state, {
        broadcasts: action.data
      })

    default:
      return state
  }
}

export function PageSubscribersInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_PAGE_SUBSCRIBERS_LIST:
      return Object.assign({}, state, {
        pageSubscribers: action.data
      })

    default:
      return state
  }
}
export function PollsInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_POLLS_LIST:
      return Object.assign({}, state, {
        polls: action.data
      })

    default:
      return state
  }
}

export function SurveysInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_SURVEYS_LIST:
      return Object.assign({}, state, {
        surveys: action.data
      })

    default:
      return state
  }
}
export function SurveyDetailsInfo (state = {}, action) {
  switch (action.type) {
    case ActionTypes.LOAD_SURVEY_DETAILS:
      return Object.assign({}, state, {
        survey: action.survey,
        questions: action.questions,
        responses: action.responses
      })
    default:
      return state
  }
}
export function getCurrentUser (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SAVE_USER_INFORMATION:
      console.log('getCurrentUser', action.data)
      return Object.assign({}, state, {
        currentUser: action.data
      })

    default:
      return state
  }
}
export function getCurrentPage (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SAVE_PAGE_INFORMATION:
      console.log('getCurrentPage', action.data)
      return Object.assign({}, state, {
        currentPage: action.data
      })

    default:
      return state
  }
}
export function getCurrentSurvey (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SAVE_SURVEY_INFORMATION:
      console.log('getCurrentSurvey', action.data)
      return Object.assign({}, state, {
        currentSurvey: action.data
      })

    default:
      return state
  }
}
export function getCurrentPoll (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SAVE_CURRENT_POLL:
      console.log('getCurrentPoll', action.data)
      return Object.assign({}, state, {
        currentPoll: action.data
      })

    default:
      return state
  }
}
