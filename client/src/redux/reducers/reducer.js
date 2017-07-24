import { combineReducers } from 'redux';

import {basicInfo} from './basicinfo.reducer';
import {pagesInfo} from './pages.reducer';
import {subscribersInfo} from './subscribers.reducer';
const appReducer = combineReducers({
  basicInfo,
  pagesInfo,
  subscribersInfo,
});

export default appReducer;
