import { combineReducers } from 'redux';

import {basicInfo} from './basicinfo.reducer';
import {pagesInfo} from './pages.reducer';
import {subscribersInfo} from './subscribers.reducer';
import {broadcastsInfo} from './broadcast.reducer';
import {surveysInfo} from './surveys.reducer.js';
const appReducer = combineReducers({
  basicInfo,
  pagesInfo,
  subscribersInfo,
  surveysInfo,
  broadcastsInfo,
});

export default appReducer;
