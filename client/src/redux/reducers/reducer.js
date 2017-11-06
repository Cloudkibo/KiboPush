import { combineReducers } from 'redux'

import {basicInfo} from './basicinfo.reducer'
import {pagesInfo} from './pages.reducer'
import {subscribersInfo} from './subscribers.reducer'
import {dashboardInfo, sentSeenInfo} from './dashboard.reducer'
import {broadcastsInfo} from './broadcast.reducer'
import {pollsInfo} from './poll.reducer'
import {surveysInfo} from './surveys.reducer.js'
import {workflowsInfo} from './workflows.reducer.js'
import {autopostingInfo} from './autoposting.reducer.js'
import {convosInfo} from './convos.reducer.js'
import {getFileUploadResponse} from './growthTools.reducer.js'
import {liveChat} from './livechat.reducer.js'
import {UsersInfo, PagesInfo, BroadcastsInfo, PageSubscribersInfo, PollsInfo, SurveysInfo, getCurrentUser, getCurrentPage, dataObjectsInfo, topPagesInfo, getCurrentSurvey, SurveyDetailsInfo} from './backdoor.reducer'

const appReducer = combineReducers({
  basicInfo,
  pagesInfo,
  subscribersInfo,
  surveysInfo,
  broadcastsInfo,
  workflowsInfo,
  pollsInfo,
  dashboardInfo,
  sentSeenInfo,
  autopostingInfo,
  convosInfo,
  UsersInfo,
  dataObjectsInfo,
  topPagesInfo,
  PagesInfo,
  BroadcastsInfo,
  PageSubscribersInfo,
  PollsInfo,
  SurveysInfo,
  getCurrentUser,
  getCurrentPage,
  getCurrentSurvey,
  SurveyDetailsInfo,
  getFileUploadResponse,
  liveChat
})

export default appReducer
