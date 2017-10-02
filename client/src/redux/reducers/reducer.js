import { combineReducers } from 'redux'

import {basicInfo} from './basicinfo.reducer'
import {pagesInfo} from './pages.reducer'
import {subscribersInfo} from './subscribers.reducer'
import {dashboardInfo} from './dashboard.reducer'
import {broadcastsInfo} from './broadcast.reducer'
import {pollsInfo} from './poll.reducer'
import {surveysInfo} from './surveys.reducer.js'
import {workflowsInfo} from './workflows.reducer.js'
import {autopostingInfo} from './autoposting.reducer.js'
import {convosInfo} from './convos.reducer.js'
import {UsersInfo, PagesInfo, BroadcastsInfo, PageSubscribersInfo, PollsInfo, SurveysInfo} from './backdoor.reducer'

const appReducer = combineReducers({
  basicInfo,
  pagesInfo,
  subscribersInfo,
  surveysInfo,
  broadcastsInfo,
  workflowsInfo,
  pollsInfo,
  dashboardInfo,
  autopostingInfo,
  convosInfo,
  UsersInfo,
  PagesInfo,
  BroadcastsInfo,
  PageSubscribersInfo,
  PollsInfo,
  SurveysInfo
})

export default appReducer
