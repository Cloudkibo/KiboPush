import * as ActionTypes from '../constants/constants';

export function conversationListInfo(state = [], action) {
  switch (action.type) {
    case ActionTypes.LOAD_CONVERSATION:
      return action.data;
    default:
      return state;
  }
}
