import * as ActionTypes from '../constants/constants';

export function contactListInfo(state = [], action) {
  switch (action.type) {
    case ActionTypes.LOAD_CONTACTLIST:
      return action.data;
    default:
      return state;
  }
}
