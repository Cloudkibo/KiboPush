import * as ActionTypes from '../constants/constants';

export function pagesInfo(state = [], action) {
  switch (action.type) {
    case ActionTypes.LOAD_PAGES_LIST:
      return action.data;
    default:
      return state;
  }
}
