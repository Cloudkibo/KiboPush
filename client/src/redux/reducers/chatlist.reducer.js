import * as ActionTypes from '../constants/constants';

export function chatListInfo(state = [], action) {
  switch (action.type) {
    case ActionTypes.LOAD_CHATLIST:
      return action.data;
    case ActionTypes.LOAD_GROUP_CHATLIST:
      return [...state, action.data];
    default:
      return state;
  }
}
