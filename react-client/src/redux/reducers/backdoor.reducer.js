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
  currentPoll: null,
  pollDetails: null,
  broadcastsGraphInfo: [],
  surveysGraphInfo: [],
  pollsGraphInfo: [],
  sessionsGraphInfo: [],
  platformStatsInfo: false,
  autopostingStatsInfo: false,
  weeklyPlatformStats: false,
  monthlyPlatformStats: false,
  kiboTopPages: false
}

export function backdoorInfo (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_COMPANY_INFO:
        //console.log('LOAD_COMPANY_INFO action', action)
        return Object.assign({}, state, {
          companyInfo: action.data.data,
          numOfCompanies: action.data.count
        })
    case ActionTypes.UPDATE_PAGE_ADMINS:
        return Object.assign({}, state, {
          pageAdmins: action.data
        }) 
    case ActionTypes.LOAD_SUBSCRIBERS_WITH_TAGS: 
      return Object.assign({}, state, {
        subscribersWithTags: action.data
      })
    case ActionTypes.LOAD_PAGE_TAGS:
        return Object.assign({}, state, {
          pageTags: action.data
        })
    case ActionTypes.LOAD_UNIQUE_PAGES_DETAILS:
        return Object.assign({}, state, {
          uniquePages: action.data
        })
    case ActionTypes.LOAD_USERS_LIST:
      return Object.assign({}, state, {
        users: [...state.users, ...action.data],
        //  users: action.data,
        //  locales: action.locale,
        count: action.count
      })
    case ActionTypes.LOAD_USERS_LIST_FILTERS:
      return Object.assign({}, state, {
        //  users: [...state.users, action.data],
        users: action.data,
        //  locales: action.locale,
        count: action.count
      })

    case ActionTypes.LOAD_DATA_OBJECTS_LIST:
      return Object.assign({}, state, {
        dataobjects: action.data
      })

    case ActionTypes.LOAD_TOP_PAGES_LIST:
      console.log('loadTopPages', action.data)
      return Object.assign({}, state, {
        toppages: action.data,
        response: ''
      })

    case ActionTypes.LOAD_BACKDOOR_PAGES_LIST:
      return Object.assign({}, state, {
        pages: action.data,
        pagesCount: action.count
      })

    case ActionTypes.LOAD_BROADCASTS_LIST:
      return Object.assign({}, state, {
        broadcasts: action.data,
        broadcastsUserCount: action.count
      })

    case ActionTypes.LOAD_PAGE_SUBSCRIBERS_LIST:
      return Object.assign({}, state, {
        pageSubscribers: action.data,
        //  locales: action.locale,
        subscribersCount: action.count
      })

    case ActionTypes.LOAD_POLLS_LIST:
      return Object.assign({}, state, {
        polls: action.data,
        pollsUserCount: action.count
      })

    case ActionTypes.LOAD_SURVEYS_LIST:
      return Object.assign({}, state, {
        surveys: action.data,
        surveysUserCount: action.count
      })

    case ActionTypes.LOAD_SURVEY_DETAILS:
      return Object.assign({}, state, {
        survey: action.survey,
        questions: action.questions,
        responses: action.responses
      })

    case ActionTypes.LOAD_POLL_DETAILS:
      return Object.assign({}, state, {
        pollDetails: action.data
      })

    case ActionTypes.SAVE_USER_INFORMATION:
      return Object.assign({}, state, {
        currentUser: action.data
      })

    case ActionTypes.SAVE_PAGE_INFORMATION:
      return Object.assign({}, state, {
        currentPage: action.data
      })

    case ActionTypes.SAVE_SURVEY_INFORMATION:
      return Object.assign({}, state, {
        currentSurvey: action.data
      })

    case ActionTypes.SAVE_CURRENT_POLL:
      return Object.assign({}, state, {
        currentPoll: action.data
      })

    case ActionTypes.UPDATE_SURVEYS_GRAPH:
      return Object.assign({}, state, {
        surveysGraphInfo: action.data
      })

    case ActionTypes.UPDATE_POLLS_GRAPH:
      return Object.assign({}, state, {
        pollsGraphInfo: action.data
      })

    case ActionTypes.UPDATE_BROADCASTS_GRAPH:
      return Object.assign({}, state, {
        broadcastsGraphInfo: action.data
      })

    case ActionTypes.UPDATE_SESSIONS_GRAPH:
      return Object.assign({}, state, {
        sessionsGraphInfo: action.data
      })

    case ActionTypes.UPDATE_BROADCASTS_BY_DAYS:
      return Object.assign({}, state, {
        broadcasts: action.broadcasts,
        broadcastsCount: action.count
      })

    case ActionTypes.UPDATE_POLLS_BY_DAYS:
      return Object.assign({}, state, {
        polls: action.polls,
        pollsCount: action.count
      })

    case ActionTypes.UPDATE_SURVEYS_BY_DAYS:
      return Object.assign({}, state, {
        surveys: action.surveys,
        surveysCount: action.count
      })
    case ActionTypes.LOAD_LOCALES_LIST_BACKDOOR:
      return Object.assign({}, state, {
        locales: action.data
      })
    case ActionTypes.DELETE_ACCOUNT_RESPONSE:
      return Object.assign({}, state, {
        response: action.data
      })
    case ActionTypes.UPDATE_PLATFORM_STATS:
      return Object.assign({}, state, {
        platformStatsInfo: action.data
      })
    case ActionTypes.UPDATE_AUTPOSTING_PLATFORM:
      return Object.assign({}, state, {
        autopostingStatsInfo: action.data
      })
    case ActionTypes.UPDATE_WEEKLY_PLATFORM_STATS:
      return Object.assign({}, state, {
        weeklyPlatformStats: action.data
      })
    case ActionTypes.UPDATE_MONTHLY_PLATFORM_STATS:
      return Object.assign({}, state, {
        monthlyPlatformStats: action.data
      })
    case ActionTypes.UPDATE_TOP_PAGES_KIBODASH:
      return Object.assign({}, state, {
        kiboTopPages: action.data
      })
    case ActionTypes.UPDATE_PAGE_USERS:
      return Object.assign({}, state, {
        pageUsers: action.data.pageUsers,
        pageUsersCount: action.data.count
      })
    case ActionTypes.UPDATE_PAGE_PERMISSIONS:
      return Object.assign({}, state, {
        pagePermissions: action.data
      })
    default:
      return state
  }
}
