import { combineReducers } from 'redux';

import {basicInfo} from './basicinfo.reducer';
import {pagesInfo} from './pages.reducer';

const appReducer = combineReducers({
  basicInfo,
  pagesInfo
});

export default appReducer;
